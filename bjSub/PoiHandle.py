from subInfo.models import Tag, Station, POIDetail, POIDetailTag


def PoiHandle(received_data):
    tag1 = Tag.objects.get(id=received_data['tagId'])
    sta = Station.objects.get(id=received_data['staId'])
    details = received_data['data']
    for row in details:
        curData = POIDetail(station=sta, poiname=row['name'], origintag=row['type'], lng=row['location']['lng'],
                            lat=row['location']['lat'], tags=tag1, distance=row['distance'])
        curData.save()
        detailTag = POIDetailTag(detail=curData, tag=tag1)
        detailTag.save()
    pass