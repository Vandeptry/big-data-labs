from pyspark.sql import SparkSession
from pyspark.sql import functions as F, types as T
from textblob import TextBlob

# ====================================================
# 1. Spark session
# ====================================================
spark = SparkSession.builder.appName("HP_Lab1_EX3_Sentiment").getOrCreate()

INPUT_SENTENCES = "hdfs://namenode:8020/input/harrypotter.txt"

# ====================================================
# 2. Đọc toàn bộ file & tạo câu (dùng lại logic EX2)
# ====================================================
lines = spark.read.text(INPUT_SENTENCES).collect()
full_text = "\n".join(row["value"] for row in lines)

import re

chapters = re.split(r"(?i)chapter\s+\d+[^a-zA-Z0-9]+", full_text)
if len(chapters) <= 1:
    chapters_to_use = [full_text]
else:
    chapters_to_use = chapters[1:]

records = []
for chapter_idx, chapter in enumerate(chapters_to_use, start=1):
    sentences = re.split(r"(?<=[.!?])\s+", chapter)
    for i, sent in enumerate(sentences, start=1):
        if sent.strip():
            records.append((chapter_idx, i, sent.strip()))

sentences_df = spark.createDataFrame(
    records,
    schema=["chapter_number", "sentence_number", "sentence_text"]
)

# ====================================================
# 3. Sentiment UDF
# ====================================================
def sentiment_score(text: str):
    try:
        return float(TextBlob(text).sentiment.polarity)
    except:
        return 0.0

sentiment_udf = F.udf(sentiment_score, T.FloatType())

sentences_df = sentences_df.withColumn(
    "sentiment",
    sentiment_udf("sentence_text")
)

# ====================================================
# 4. Sentiment theo từng nhân vật
# ====================================================
CHARACTERS = ["harry", "ron", "hermione", "malfoy", "snape", "dumbledore"]

def detect_characters(text: str):
    text = text.lower()
    return [c for c in CHARACTERS if c in text]

detect_udf = F.udf(detect_characters, T.ArrayType(T.StringType()))

char_sent_df = (
    sentences_df
    .withColumn("characters", detect_udf("sentence_text"))
    .withColumn("character", F.explode("characters"))
    .groupBy("character")
    .agg(F.avg("sentiment").alias("avg_sentiment"))
)

# ====================================================
# 5. Sentiment theo từng chapter
# ====================================================
chapter_sent_df = (
    sentences_df
    .groupBy("chapter_number")
    .agg(F.avg("sentiment").alias("chapter_sentiment"))
)

# ====================================================
# 6. Write output ra local shared volume
# ====================================================
OUTPUT_CHAR_SENT = "/data/output/lab1/ex3_character_sentiment"
OUTPUT_CHAP_SENT = "/data/output/lab1/ex3_chapter_sentiment"

char_sent_df.write.mode("overwrite").json(OUTPUT_CHAR_SENT)
chapter_sent_df.write.mode("overwrite").json(OUTPUT_CHAP_SENT)

print(f"=> Character Sentiment written to {OUTPUT_CHAR_SENT}")
print(f"=> Chapter Sentiment written to {OUTPUT_CHAP_SENT}")

spark.stop()
