from subInfo.models import DataCheck,Station,Tag

def CountHandle(received_data):
    station1 = Station.objects.get(id=received_data['staId'])
    tag1 = Tag.objects.get(id=received_data['tagId'])
    data_num = received_data['count']
    DataCheck.objects.create(station=station1, tag=tag1, count=data_num)