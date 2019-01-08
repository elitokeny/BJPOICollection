from subInfo.models import Gateway

def GatewayHandle(received_data):
    detail = received_data['data']['pois']
    distans = received_data['distance']
    for i in range(len(detail)):
        detl = detail[i]
        Gateway.objects.create(name=detl['name'], line=detl['address'],
                               district=detl['adname'],
                               lng=detl['location']['lng'],
                               lat=detl['location']['lat'],
                               center_distance=distans[i], state=1)
    print('车站数据已发送到后台')

    pass