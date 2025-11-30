# src/Lab1/character.py
from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from pyspark.sql import types as T
import re


# 1. Tạo SparkSession
spark = SparkSession.builder.appName("HP_Lab1_Characters").getOrCreate()
INPUT_PATH = "hdfs://namenode:8020/input/harrypotter.txt"


# 2. Đọc file từ HDFS
lines_df = spark.read.text(INPUT_PATH)
lines = [row["value"] for row in lines_df.collect()]
full_text = "\n".join(lines)
chapters = re.split(r"(?i)chapter\s+\d+[^a-zA-Z0-9]+", full_text)

records = []

if len(chapters) <= 1:
    chapters_to_use = [full_text]
    start_index = 1
else:
    chapters_to_use = chapters[1:]
    start_index = 1

for idx, chapter_text in enumerate(chapters_to_use, start=start_index):
    chapter_text = chapter_text.strip()
    if not chapter_text:
        continue
    sentences = re.split(r"(?<=[\.\?\!])\s+", chapter_text)
    sent_num = 0

    for sent in sentences:
        s = sent.strip()
        if not s:
            continue
        sent_num += 1
        records.append((idx, sent_num, s))

# Tạo DataFrame
sentences_df = spark.createDataFrame(
    records,
    schema=["chapter_number", "sentence_number", "sentence_text"],
)

# Ghi ra output cho phần ETL
SENTENCE_OUTPUT = "/data/output/lab1/ex2_sentences"
sentences_df.write.mode("overwrite").json(SENTENCE_OUTPUT)

print(f"===> Wrote structured sentences to {SENTENCE_OUTPUT}")

# 4. Mạng lưới tương tác 6 nhân vật chính

CHARACTERS = ["harry", "ron", "hermione", "malfoy", "snape", "dumbledore"]

def extract_pairs(sentence: str):
    """
    Trả về list các cặp 'name1|name2' xuất hiện cùng trong 1 câu.
    Ví dụ: ["harry|ron", "harry|hermione", "ron|hermione"]
    """
    if not sentence:
        return []

    text = sentence.lower()
    present = sorted([c for c in CHARACTERS if c in text])

    pairs = []
    for i in range(len(present)):
        for j in range(i + 1, len(present)):
            pairs.append(f"{present[i]}|{present[j]}")

    return pairs

extract_pairs_udf = F.udf(extract_pairs, T.ArrayType(T.StringType()))

pairs_df = (
    sentences_df
    .withColumn("pairs", extract_pairs_udf("sentence_text"))
    .select(F.explode("pairs").alias("pair"))
    .groupBy("pair")
    .count()
    .orderBy(F.desc("count"))
)
# Tách pair thành 2 cột character1, character2
result_df = pairs_df.select(
    F.split("pair", "\\|")[0].alias("character1"),
    F.split("pair", "\\|")[1].alias("character2"),
    "count",
)
# Ghi output cho phần co-occurrence
PAIR_OUTPUT = "/data/output/lab1/ex2_pairs"
result_df.write.mode("overwrite").json(PAIR_OUTPUT)
print(f"===> Wrote character pair stats to {PAIR_OUTPUT}")
# In thử top 20 cặp để debug
print("===== TOP 20 CHARACTER PAIRS =====")
for row in result_df.orderBy(F.desc("count")).take(20):
    print(f"({row['character1']}, {row['character2']}): {row['count']}")

spark.stop()
