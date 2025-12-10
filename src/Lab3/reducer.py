#!/usr/bin/env python3
import sys

current = None
arr_sum = 0
dep_sum = 0
count = 0

for line in sys.stdin:
    month, vals = line.strip().split("\t")
    arr, dep = map(float, vals.split(","))

    if current and month != current:
        print(f"{current}\t{arr_sum/count},{dep_sum/count}")
        arr_sum = dep_sum = count = 0

    current = month
    arr_sum += arr
    dep_sum += dep
    count += 1

if current:
    print(f"{current}\t{arr_sum/count},{dep_sum/count}")
