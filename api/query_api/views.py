from django.conf import settings
from django.views.decorators.csrf import csrf_exempt

from tempfile import TemporaryFile

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser, JSONParser

import boto3
from botocore.client import Config
import requests

import os

# Create your views here.
class UploadTableView(APIView):
    parser_class = (MultiPartParser, FormParser)

    def post(self, request):
        table_name = request.data['table_name']
        data_path = request.data['data_path']
        schema_path = request.data['schema_path']
        access_token = request.data['access_token']

        data = {
            'table_name': table_name,
            'data_path': data_path,
            'schema_path': schema_path
        }

        response = requests.post(url='http://cdrive/create-table/', data=data, headers={'Authorization':'Bearer ' + access_token})

        return Response(status=status.HTTP_201_CREATED)

class RunQueryView(APIView):
    parser_class = (MultiPartParser, FormParser)

    def post(self, request):
        query = request.data['query']
        access_token = request.data['access_token']

        data = {
            'query': query
        }

        response = requests.post(url='http://cdrive/run-query/', data=data, headers={'Authorization':'Bearer ' + access_token})

        return Response(response.json(), status=status.HTTP_201_CREATED)

class QueryStatusView(APIView):
    parser_class = (JSONParser,)

    def get(self, request):
        query_id = request.query_params['query_id']
        access_token = request.query_params['access_token']

        data = {
            'query_id': query_id
        }

        response = requests.get(url='http://cdrive/query-status/?query_id=' + query_id, headers={'Authorization':'Bearer ' + access_token})
        return Response(response.json(), status=status.HTTP_200_OK)

class ClientIdView(APIView):
    parser_class = (JSONParser,)

    def get(self, request):
        client_id = os.environ['COLUMBUS_CLIENT_ID']
        return Response({"client_id": client_id})

class AuthenticationTokenView(APIView):
    parser_class = (JSONParser,)

    @csrf_exempt
    def post(self, request, format=None):
        code = request.data['code']
        redirect_uri = request.data['redirect_uri']
        data = {
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': redirect_uri,
            'client_id': os.environ['COLUMBUS_CLIENT_ID'],
            'client_secret': os.environ['COLUMBUS_CLIENT_SECRET']
        }
        response = requests.post(url='http://authentication.columbusecosystem.com/o/token/', data=data)

        return Response(response.json(), status=response.status_code)

class SaveToCDriveView(APIView):
    parser_class = (JSONParser,)

    @csrf_exempt
    def post(self, request, format=None):
        access_token = request.data['access_token']
        download_url = request.data['download_url']
        path = request.data['path']

        start_index = path.rfind('/')
        parent_path = path[0 : start_index]
        file_name = path[start_index + 1 : len(path)]
        r = requests.get(url=download_url)
        with open('result.csv', 'wb+') as f:
            f.write(r.content)
            f.seek(0)
            file_arg = {'file': (file_name, f), 'path': (None, parent_path)}
            response = requests.post('https://api.cdrive.columbusecosystem.com/upload/', files=file_arg, headers={'Authorization':'Bearer ' + access_token})

        return Response(status=200)
