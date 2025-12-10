flights = LOAD 'file:///data/*.csv'
USING PigStorage(',')
AS (
    Year:int,
    Month:int,
    DayofMonth:int,
    DayOfWeek:int,
    DepTime:int,
    CRSDepTime:int,
    ArrTime:int,
    CRSArrTime:int,
    UniqueCarrier:chararray,
    FlightNum:chararray,
    TailNum:chararray,
    ActualElapsedTime:int,
    CRSElapsedTime:int,
    AirTime:int,
    ArrDelay:int,
    DepDelay:int,
    Origin:chararray,
    Dest:chararray,
    Distance:int,
    TaxiIn:int,
    TaxiOut:int,
    Cancelled:int,
    CancellationCode:chararray,
    Diverted:int,
    CarrierDelay:int,
    WeatherDelay:int,
    NASDelay:int,
    SecurityDelay:int,
    LateAircraftDelay:int
);

clean = FILTER flights BY (ArrDelay IS NOT NULL) AND (DepDelay IS NOT NULL);

grp = GROUP clean BY Month;

result = FOREACH grp GENERATE
    group AS Month,
    AVG(clean.ArrDelay) AS AvgArrDelay,
    AVG(clean.DepDelay) AS AvgDepDelay;

ordered = ORDER result BY AvgArrDelay ASC;

STORE ordered INTO '/data/lab3_results' USING PigStorage(',');
