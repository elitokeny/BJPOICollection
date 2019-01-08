from subInfo.models import AnjukeData

def AJKHandle(received_data):
    try:
        AnjukeData.objects.filter(id=received_data['id']).update(lng=received_data['data']['location']['lng'],
                                                                 lat=received_data['data']['location']['lat'],
                                                                 origin_name=received_data['data']['name'])
    except TypeError:
        AnjukeData.objects.filter(id=received_data['id']).update(lng=received_data['data']['entr_location']['lng'],
                                                                 lat=received_data['data']['entr_location']['lat'],
                                                                 origin_name=received_data['data']['name'])

    pass
