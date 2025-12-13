import os
from pyspark.sql import SparkSession
from pyspark.ml.classification import LogisticRegression
from pyspark.ml.feature import HashingTF, StopWordsRemover, RegexTokenizer, StringIndexer
from pyspark.ml import Pipeline
from pyspark.ml.evaluation import MulticlassClassificationEvaluator

os.environ['HADOOP_USER_NAME'] = 'root'

HADOOP_NAMENODE = "hdfs://namenode:8020"
HDFS_INPUT_PATH = "/user/root/input_data/"
HDFS_OUTPUT_PATH = "/user/root/output/mail_classification"

spark = SparkSession.builder \
    .appName("PythonMailClassification") \
    .config("spark.hadoop.fs.defaultFS", HADOOP_NAMENODE) \
    .getOrCreate()

spark.sparkContext.setLogLevel("WARN")

train_file = HADOOP_NAMENODE + HDFS_INPUT_PATH + "spam_messages_train.csv"
test_file = HADOOP_NAMENODE + HDFS_INPUT_PATH + "spam_messages_test.csv"

try:
    training_data = spark.read.csv(train_file, header=True, inferSchema=True)
    testing_data = spark.read.csv(test_file, header=True, inferSchema=True)
    
    training_data = training_data.dropna(subset=["text", "label"])
    testing_data = testing_data.dropna(subset=["text", "label"])

    training_data.printSchema()
    training_data.show(5, truncate=False)

    label_indexer = StringIndexer(inputCol="label", outputCol="label_numeric").fit(training_data)
    tokenizer = RegexTokenizer(inputCol="text", outputCol="words", pattern="\\W")
    remover = StopWordsRemover(inputCol=tokenizer.getOutputCol(), outputCol="filtered_words")
    hashingTF = HashingTF(inputCol=remover.getOutputCol(), outputCol="features", numFeatures=50000)
    lr = LogisticRegression(maxIter=20, regParam=0.1, labelCol="label_numeric", featuresCol="features")
    
    pipeline = Pipeline(stages=[label_indexer, tokenizer, remover, hashingTF, lr])
    
    model = pipeline.fit(training_data)
    
    predictions = model.transform(testing_data)
    
    predictions.select("text", "label", "label_numeric", "prediction").show(10, truncate=False)

    evaluator = MulticlassClassificationEvaluator(labelCol="label_numeric", predictionCol="prediction", metricName="accuracy")
    accuracy = evaluator.evaluate(predictions)
    print(f"Accuracy: {accuracy}")
    
    full_output_path = HADOOP_NAMENODE + HDFS_OUTPUT_PATH
    
    predictions.select("text", "label", "prediction") \
        .write \
        .mode("overwrite") \
        .csv(full_output_path)
        
except Exception as e:
    import traceback
    traceback.print_exc()

finally:
    spark.stop()