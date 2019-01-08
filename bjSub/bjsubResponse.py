import json

from django.http import HttpResponse


class ResponseJson():
    def __init__(self, data):
        rsp = {
            'status': 200,
            'data': data
        }
        return HttpResponse(json.dumps(rsp), content_type="application/json")


class ResponseBad():
    def __init__(self, data):
        rsp = {
            'status': 404,
            'data': data
        }
        return HttpResponse(json.dumps(rsp), content_type="application/json")
