from subInfo.models import Kwdpoi
import time


def KwdPoiHandle(received_data):
    detail = received_data['data']
    keyword = received_data['keyword']
    pageindex = received_data['pageindex']
    for i in range(len(detail)):
        detl = detail[i]
        Kwdpoi.objects.create(name=detl['name'],
                              lng=detl['location']['lng'],
                              lat=detl['location']['lat'], origintag=detl['type'],
                              address=detl['address'], keyword=keyword, pageindex=pageindex, time=time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())))
    print('车站数据已发送到后台')
