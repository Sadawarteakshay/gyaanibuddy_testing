import os
from django.conf import settings
import boto3

if settings.DEBUG:
    AWS_S3_CREDS = {
        "aws_access_key_id": "",
        "aws_secret_access_key": ""
    }
else:
    AWS_S3_CREDS = {
        "aws_access_key_id": settings.AWS_ACCESS_KEY_ID,
        "aws_secret_access_key": settings.AWS_SECRET_ACCESS_KEY
    }

s3_client = boto3.client('s3',**AWS_S3_CREDS)

def removeKey(key):
    if settings.DEBUG:
        if os.path.isfile(key.path):
            os.remove(key.path)
    elif not settings.DEBUG:
        if key and key != "":
            response = s3_client.delete_object(
                Bucket=settings.AWS_STORAGE_BUCKET_NAME,
                Key=f'media/{key}',
            )