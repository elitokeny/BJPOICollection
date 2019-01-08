from subInfo.models import Tag, Station, POIDetail, POIDetailTag


def PoiHandle2(received_data):
    tag1 = Tag.objects.get(id=received_data['tagId'])
    sta = Station.objects.get(id=received_data['staId'])
    details = received_data['data']
    distances = received_data['distance']
    for i in range(len(details)):
        detl = details[i]
        curData = POIDetail(station=sta, poiname=detl['name'], origintag=detl['type'], lng=detl['location']['lng'],
                            lat=detl['location']['lat'], tags=tag1, distance=distances[i], address=detl['address'])
        # for row in details:
        #     curData = POIDetail(station=sta, poiname=row['name'], origintag=row['type'], lng=row['location']['lng'],
        #                         lat=row['location']['lat'], tags=tag1, distance=row['distance'], address=row['address'])
        curData.save()
        detailTag = POIDetailTag(detail=curData, tag=tag1)
        detailTag.save()

    pass
