from subInfo.models import POIDetail, Station, POIDetailTag, Tag


def POIDetailHandle(stationDetail):
    tag1 = Tag.objects.get(name=stationDetail['tag'])
    sta = Station.objects.get(id=stationDetail['id'])
    detils = stationDetail['details']
    distances = stationDetail['distance']
    print(stationDetail['tag'])
    print(len(detils))


    for i in range(len(detils)):
        curDetil = detils[i]
        curDistance = distances[i]

        if ("tags" in curDetil.keys()):
            curData = POIDetail(station=sta, poiname=curDetil['title'],
                                url=curDetil['url'], address=curDetil['address'],
                                lng=curDetil['point']['lng'],
                                lat=curDetil['point']['lat'],
                                tags=str(curDetil['tags']),
                                distance=curDistance)
        else:
            curData = POIDetail(station=sta, poiname=curDetil['title'],
                                url=curDetil['url'], address=curDetil['address'],
                                lng=curDetil['point']['lng'],
                                lat=curDetil['point']['lat'],
                                tags=str([]),
                                distance=curDistance)
        curData.save()
        detailTag = POIDetailTag(detail=curData, tag=tag1)
        detailTag.save()


    pass
