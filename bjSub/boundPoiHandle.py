from subInfo.models import BoundsPoi, BoundTag, Bounds
import time


def boundPoiHandle(received_data):
    boundid = Bounds.objects.get(id=received_data['BoundId'])
    tagid = BoundTag.objects.get(id=received_data['TagId'])
    current_page = received_data['CurrentPage']
    max_page = received_data['MaxPage']
    detail = received_data['PoiData']
    for i in range(len(detail)):
        detl = detail[i]
        BoundsPoi.objects.create(poiname=detl['name'],
                                 lng=detl['location']['lng'],
                                 lat=detl['location']['lat'], origintag=detl['type'],
                                 address=detl['address'], currentpage=current_page, maxpage=max_page, bound=boundid,
                                 poitype=tagid,
                                 time=time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())))
