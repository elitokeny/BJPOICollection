from subInfo.models import Tag, Station

# TAGSTATION = TagParent.objects.get(name='地铁/轻轨')
pass

def stationDataHandle(stationData):
    curSta = Station.objects.get(id=stationData['staId'])
    for cur in stationData['data']:
        if ('tags' not in cur): continue
        if (TAGSTATION.name in cur['tags']):
            curSta.lng = cur['point']['lng']
            curSta.lat = cur['point']['lat']
            curSta.state = 1
            curSta.save()
    pass
