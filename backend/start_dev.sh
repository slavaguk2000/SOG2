#!/bin/bash

source venv/bin/activate
python3 -m uvicorn main:app --host 0.0.0.0 --reload --log-level debug
