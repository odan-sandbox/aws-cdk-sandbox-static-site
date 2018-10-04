#!/bin/bash

echo "deploy static files"
aws s3 sync frontend/dist s3://aws-cdk-sandbox-static-site