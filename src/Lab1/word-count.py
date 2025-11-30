# src/Lab1/word-count.py
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, lower, regexp_replace, split, explode


# 1. Tạo Spark Session
spark = SparkSession.builder \
    .appName("HarryPotterWordCount") \
    .getOrCreate()

# 2. Đọc file từ HDFS
input_path = "hdfs://namenode:8020/input/harrypotter.txt"
df = spark.read.text(input_path)

# 3. Làm sạch text
# - chuyển thành lowercase
# - bỏ ký tự đặc biệt
clean_df = df.select(
    lower(
        regexp_replace(col("value"), r"[^a-zA-Z]", " ")
    ).alias("line")
)
# split từng từ
words = clean_df.select(explode(split(col("line"), r"\s+")).alias("word"))
# loại bỏ từ rỗng
words = words.filter(col("word") != "")
# 4. Đếm tần suất từ
word_count = words.groupBy("word").count().orderBy(col("count").desc())
# in ra top 20
print("\n===== TOP 20 MOST FREQUENT WORDS =====")
for row in word_count.take(20):
    print(f"{row['word']:15s} {row['count']}")

# 5. Đếm số lần xuất hiện của 6 nhân vật
characters = ["harry", "ron", "hermione", "malfoy", "snape", "dumbledore"]
print("\n===== CHARACTER COUNTS =====")
for name in characters:
    cnt = words.filter(col("word") == name).count()
    print(f"{name:10s}: {cnt}")

output_path = "/data/output/lab1"
word_count.limit(1000).write.mode("overwrite").json(output_path)

# Kết thúc
spark.stop()
