#!/usr/bin/env python3
import sys

for line in sys.stdin:
    if line.startswith("Year"):  # skip header
        continue
    parts = line.strip().split(",")
    try:
        month = parts[1]
        arr = float(parts[14])
        dep = float(parts[15])
        print(f"{month}\t{arr},{dep}")
    except:
        continue
