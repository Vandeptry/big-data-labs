# src/Lab1/ex4_antiwork.py
# src/Lab1/ex4_antiwork.py
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, month, from_unixtime, udf, desc, substring
from pyspark.sql.types import FloatType
from textblob import TextBlob

spark = SparkSession.builder.appName("EX4 Antiwork Fixed").getOrCreate()

data_path = "hdfs://namenode:8020/input/antiwork_submissions.csv"
out_base = "/data/output/lab1"

# === LOAD (THỰC CHẤT LÀ COMMENTS) ===
df = spark.read.csv(data_path, header=True, multiLine=True)

# === SCHEMA ĐÚNG CHO DỮ LIỆU CỦA BẠN ===
comments = df.select(
    col("id"),
    col("body"),
    col("score").cast("int"),
    col("`subreddit.name`").alias("subreddit_name"),
    col("created_utc")
)

# === SENTIMENT ===
def sentiment_score(text):
    if not text:
        return 0.0
    try:
        return float(TextBlob(text).sentiment.polarity)
    except:
        return 0.0

sent_udf = udf(sentiment_score, FloatType())
comments = comments.withColumn("sentiment", sent_udf(col("body")))

# === MONTH ===
comments = comments.withColumn(
    "month",
    month(from_unixtime(col("created_utc").cast("long")))
)

# === TOP POSTS (title = short body) ===
top_posts = comments.select(
    col("id"),
    substring("body", 1, 120).alias("title"),
    col("body").alias("text"),
    col("score"),
    col("subreddit_name"),
    col("month")
).orderBy(desc("score")).limit(50)

top_posts.write.mode("overwrite").json(f"{out_base}/ex4_top_posts")

# === TOP COMMENTS POSITIVE / NEGATIVE ===
top_comments_high = comments.orderBy(desc("sentiment")).limit(50)
top_comments_low  = comments.orderBy(col("sentiment").asc()).limit(50)

top_comments_high.write.mode("overwrite").json(f"{out_base}/ex4_top_comments_high")
top_comments_low.write.mode("overwrite").json(f"{out_base}/ex4_top_comments_low")

# === MONTHLY STATS ===
monthly_stats = comments.groupBy("month").count() \
    .withColumnRenamed("count", "total_comments") \
    .orderBy("month")

monthly_stats.write.mode("overwrite").json(f"{out_base}/ex4_monthly_stats")

# === MONTHLY SENTIMENT ===
monthly_sentiment = comments.groupBy("month").avg("sentiment") \
    .withColumnRenamed("avg(sentiment)", "avg_sentiment")

monthly_sentiment.write.mode("overwrite").json(f"{out_base}/ex4_monthly_sentiment")

print("EX4 Completed Successfully!")
spark.stop()
