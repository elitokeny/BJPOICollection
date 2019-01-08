import json
from django.http import HttpResponse, Http404
from django.forms.models import model_to_dict
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from bjSub.KwdPoiHandle import KwdPoiHandle
from bjSub.PoiHandle import PoiHandle
from bjSub.StationHandle import StationHandle
from bjSub.bjsubResponse import ResponseJson, ResponseBad
from bjSub.boundPoiHandle import boundPoiHandle
from bjSub.globalCountHandle import globalCountHandle
from bjSub.stationDataHandle import stationDataHandle
from bjSub.POIDetailHandle import POIDetailHandle
from bjSub.GatewayHandle import GatewayHandle
from bjSub.AJKHandle import AJKHandle
from bjSub.CountHandle import CountHandle
from bjSub.poihandle2 import PoiHandle2
from bjSub.SaveBus import SaveBus
from subInfo.models import *
import datetime
import math


def hello(request):
    context = {}
    context['hello'] = '调用百度地图API抓取地铁站周围POI信息'
    return render(request, 'hello.html', context)


def index(request):
    return render(request, 'home.html')


def homepage(request):
    return render(request, 'homepage.html')


def baiduhandle(request):
    return render(request, 'baiduhandle.html')


def gaodehandle(request):
    return render(request, 'gaodehandle.html')


def keywordSearch(request):
    return render(request, 'keywordSearch.html')


def searchNearby(request):
    return render(request, 'searchNearby.html')


def globalsearch(request):
    return render(request, 'globalsearch.html')


def allPoiSearch(request):
    return render(request, 'allpoisearch.html')


def boundSearch(request):
    return render(request, 'boundSearch.html')


def ridinginfo(request):
    return render(request, 'ridinginfo.html')


def cdbushandle(request):
    return render(request, 'cdbushandle.html')


def lnglatsearch(request):
    return render(request, 'lnglatsearch.html')


def current_datetime(request):
    now = datetime.datetime.now()
    rawhtml = "<html><body>It is now %s.</body></html>" % now
    return HttpResponse(rawhtml)


def hours_ahead(request, offset):
    try:
        offset = int(offset)
    except ValueError:
        raise Http404()
    dt = datetime.datetime.now() + datetime.timedelta(hours=offset)
    html = "<html><body>In %s hour(s),it will be %s.</body></html>" % (offset, dt)
    return HttpResponse(html)


def init(request):
    tags = Tag.objects.all()
    for cur in tags:
        TAGS[cur.name] = cur
    station = Station(name='西二旗')
    station.save()
    st = StationTag(station=station, tag=tags[0])
    st.save()
    return HttpResponse(TAGS)


@csrf_exempt
def stationData(request):
    if request.method == 'POST':
        received_json_data = json.loads(request.body)
        stationDataHandle(received_json_data)
        return ResponseJson('ok')
    else:
        return ResponseBad('error')


def getroute(request):
    if request.method == 'GET':
        rsp = []
        all_route = RidingData.objects.values('id', 'orilng', 'orilat', 'detlng', 'detlat')
        for cur in all_route:
            rsp.append([cur['id'], cur['orilng'], cur['orilat'], cur['detlng'], cur['detlat']])
        return ResponseJson(rsp)
    else:
        return ResponseBad('error')


def allStation(request):
    if request.method == 'GET':
        rsp = []
        all_station = Station.objects.values("id", "name")
        for cur in all_station:
            rsp.append(cur)
        return ResponseJson(rsp)
    else:
        return ResponseBad('error')


def lostStation(request):
    if request.method == 'GET':
        rsp = []
        lost_station = Station.objects.all().filter(state=0).values("id", "name")
        for cur in lost_station:
            rsp.append(cur)
        return ResponseJson(rsp)
    else:
        return ResponseBad('error')


def stationDetail(request):
    if request.method == 'GET':
        rsp = []
        station_info = Station.objects.filter(state=0).values('id', 'name', 'lng', 'lat')
        for cur in station_info:
            cur['point'] = {}
            cur['point']['lng'] = float(cur['lng'])
            cur['point']['lat'] = float(cur['lat'])
            cur.pop('lng')
            cur.pop('lat')
            rsp.append(cur)
        return ResponseJson(rsp)
    else:
        return ResponseBad('error')


def getRestPage(request):
    if request.method == "GET":
        SendInfo = []
        restpageinfo = CountCheck.objects.all().values("bound", "poitype", "count")
        for cur in restpageinfo:
            if cur['count'] == 0:
                continue
            cur["count"] = math.ceil(cur["count"] / 50)
            if cur["count"] == 1:
                maxpage = [1]
            else:
                maxpage = list(range(1, cur["count"] + 1))
            maxpage = set(maxpage)
            # 拿出curpage,是一个list
            curpage = BoundsPoi.objects.filter(bound_id=cur["bound"], poitype_id=cur["poitype"]).values("currentpage")
            if len(curpage) == 0:
                currentpage = set([])
            else:
                currentpage = []
                # 根据count和curpage的列表生成剩余的页码的列表
                for each in curpage:
                    currentpage.append(each["currentpage"])
                currentpage = set(currentpage)
            restpage = list(maxpage - currentpage)
            # 将bound,poitype和每一个restpage组合装入一个list中
            for i in restpage:
                restpagesend = []
                restpagesend.append(cur["bound"])
                restpagesend.append(cur["poitype"])
                restpagesend.append(i)
                restpagesend.append(cur["count"])
                SendInfo.append(restpagesend)
        return ResponseJson(SendInfo)
    else:
        return ResponseBad("error")


def getbounds(request):
    if request.method == "GET":
        bounds = Bounds.objects.all().values('id', 'lng1', 'lat1', 'lng2', 'lat2', 'lng3', 'lat3', 'lng4', 'lat4')
        rsp = []
        for cur in bounds:
            cur['p1'] = {}
            cur['p1']['lng'] = float(cur['lng1'])
            cur['p1']['lat'] = float(cur['lat1'])
            cur.pop('lng1')
            cur.pop('lat1')
            cur['p2'] = {}
            cur['p2']['lng'] = float(cur['lng2'])
            cur['p2']['lat'] = float(cur['lat2'])
            cur.pop('lng2')
            cur.pop('lat2')
            cur['p3'] = {}
            cur['p3']['lng'] = float(cur['lng3'])
            cur['p3']['lat'] = float(cur['lat3'])
            cur.pop('lng3')
            cur.pop('lat3')
            cur['p4'] = {}
            cur['p4']['lng'] = float(cur['lng4'])
            cur['p4']['lat'] = float(cur['lat4'])
            cur.pop('lng4')
            cur.pop('lat4')
            rsp.append(cur)
        return ResponseJson(rsp)
    else:
        return ResponseBad("error")


# def getbounds(request):
#     if request.method == "GET":
#         bounds = serializers.serialize("json", Bounds.objects.all())
#         return HttpResponse(bounds)
#     else:
#         return ResponseBad("error")


def stationName(request):
    if request.method == 'GET':
        rsp = []
        stationname = Station.objects.filter(state=1).values('id', 'name')
        for cur in stationname:
            rsp.append(cur['name'])
        return ResponseJson(rsp)
    else:
        return ResponseBad('error')


def AJK(request):
    if request.method == 'GET':
        rsp = []
        AJKdata = AnjukeData.objects.filter(origin_name='0').values('id', 'name')
        for cur in AJKdata:
            rsp.append([cur['id'], cur['name']])
        return ResponseJson(rsp)
    else:
        return ResponseBad('error')


def pageNum(request):
    if request.method == 'GET':
        rsp = []
        staid = request.GET['station_id']
        tagid = request.GET['tag_id']
        try:
            page_data = DataCheck.objects.get(station_id=staid, tag_id=tagid)
        except:
            page_data = DataCheck.objects.get(id=476)
        page_dict = model_to_dict(page_data)
        return ResponseJson(page_dict)
    else:
        return ResponseBad('error')


def stationPOITag(request):
    if request.method == 'GET':
        rsp = []
        Tagdata = Tag.objects.values('id', 'name')
        for cur in Tagdata:
            rsp.append(cur)
        return ResponseJson(rsp)
    else:
        return ResponseBad('error')


def boundPoiTag(request):
    if request.method == 'GET':
        rsp = []
        Tagdata = BoundTag.objects.values('id', 'name')
        for cur in Tagdata:
            rsp.append(cur)
        return ResponseJson(rsp)
    else:
        return ResponseBad('error')


@csrf_exempt
def upload(request):
    if request.method == 'POST':
        received_json_data = json.loads(request.body)
        return ResponseJson('ok')
    else:
        return ResponseBad('error')


@csrf_exempt
def POIDetail(request):
    if request.method == 'POST':
        received_json_data = json.loads(request.body)
        POIDetailHandle(received_json_data)
        return ResponseJson('ok')
    else:
        return ResponseBad('error')


@csrf_exempt
def busHandle(request):
    if request.method == 'POST':
        received_json_data = json.loads(request.body)
        SaveBus(received_json_data)
        return ResponseJson('ok')
    else:
        ResponseBad('error')


@csrf_exempt
def saveStation(request):
    if request.method == 'POST':
        received_json_data = json.loads(request.body)
        StationHandle(received_json_data)
        return ResponseJson('ok')
    else:
        ResponseBad('error')


@csrf_exempt
def saveKwdPoi(request):
    if request.method == 'POST':
        received_json_data = json.loads(request.body)
        KwdPoiHandle(received_json_data)
        return ResponseJson('ok')
    else:
        ResponseBad('error')


@csrf_exempt
def saveGateway(request):
    if request.method == 'POST':
        received_json_data = json.loads(request.body)
        GatewayHandle(received_json_data)
        return ResponseJson('ok')
    else:
        ResponseBad('error')


@csrf_exempt
def savePoi(request):
    if request.method == 'POST':
        received_json_data = json.loads(request.body)
        PoiHandle(received_json_data)
        return ResponseJson('ok')
    else:
        return ResponseBad('error')


@csrf_exempt
def saveBoundPoi(request):
    if request.method == 'POST':
        received_json_data = json.loads(request.body)
        boundPoiHandle(received_json_data)
        return ResponseJson('ok')
    else:
        return ResponseBad('error')


@csrf_exempt
def savePoi2(request):
    if request.method == 'POST':
        received_json_data = json.loads(request.body)
        PoiHandle2(received_json_data)
        return ResponseJson('ok')
    else:
        return ResponseBad('error')


def stations(request):
    stationList = Station.objects.all()
    return render(request, 'hello.html', {"stations": stationList})


@csrf_exempt
def saveCount(request):
    if request.method == 'POST':
        received_json_data = json.loads(request.body)
        CountHandle(received_json_data)
        return ResponseJson('ok')
    else:
        return ResponseBad('error')


@csrf_exempt
def globalCount(request):
    if request.method == 'POST':
        received_json_data = json.loads(request.body)
        globalCountHandle(received_json_data)
        return ResponseJson('ok')
    else:
        return ResponseBad('error')


@csrf_exempt
def saveAJK(request):
    if request.method == 'POST':
        received_json_data = json.loads(request.body)
        AJKHandle(received_json_data)
        return ResponseJson('ok')
    else:
        return ResponseBad('error')


def ResponseJson(data):
    rsp = {
        'status': 200,
        'data': data
    }
    return HttpResponse(json.dumps(rsp), content_type="application/json")


def ResponseBad(data):
    rsp = {
        'status': 404,
        'data': data
    }
    return HttpResponse(json.dumps(rsp), content_type="application/json")
