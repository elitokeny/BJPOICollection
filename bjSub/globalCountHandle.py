from subInfo.models import CountCheck, Bounds,BoundTag
import time

def globalCountHandle(received_data):
    bound1 = Bounds.objects.get(id=received_data['boundId'])
    tag = BoundTag.objects.get(id=received_data['type'])
    data_num = received_data['count']
    # CountCheck.objects.create(bound=bound1, poitype=tag, count=data_num)
    updated_data = CountCheck.objects.get(bound=bound1, poitype=tag)
    updated_data.count = data_num
    updated_data.time = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
    updated_data.save()
