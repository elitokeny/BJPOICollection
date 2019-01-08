from django.db import models


# Create your models here.

class Stationname(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, default='')


class Kwdpoi(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, default='')
    lng = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)
    lat = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)
    origintag = models.CharField(max_length=500, default='')
    address = models.CharField(max_length=500, default='')
    keyword = models.CharField(max_length=500, default='')
    pageindex = models.IntegerField()
    time = models.DateTimeField()


class Station(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, default='')
    lng = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)
    lat = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)
    line = models.CharField(max_length=500, default='')
    district = models.CharField(max_length=500, default='')
    center_distance = models.DecimalField(max_digits=10, decimal_places=1, null=True, blank=True)
    state = models.IntegerField()


class Bounds(models.Model):
    id = models.AutoField(primary_key=True)
    lng1 = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)
    lat1 = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)
    lng2 = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)
    lat2 = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)
    lng3 = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)
    lat3 = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)
    lng4 = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)
    lat4 = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)


class BoundTag(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, default='')


class CountCheck(models.Model):
    bound = models.ForeignKey(Bounds, on_delete=models.CASCADE)
    poitype = models.ForeignKey(BoundTag, on_delete=models.CASCADE)
    count = models.IntegerField()
    time = models.DateTimeField()


class BoundsPoi(models.Model):  # 利用CountCheck表中的count数确定poi检索的页数
    id = models.AutoField(primary_key=True)
    poiname = models.CharField(max_length=500, default='')
    lng = models.DecimalField(max_digits=10, decimal_places=6)
    lat = models.DecimalField(max_digits=10, decimal_places=6)
    origintag = models.CharField(max_length=500, default='')
    address = models.CharField(max_length=1000, default='')
    currentpage = models.IntegerField()
    maxpage = models.IntegerField()
    bound = models.ForeignKey(Bounds, on_delete=models.CASCADE)
    poitype = models.ForeignKey(BoundTag, on_delete=models.CASCADE)
    time = models.DateTimeField()


class Gateway(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=500, default='')
    lng = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)
    lat = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)
    line = models.CharField(max_length=500, default='')
    district = models.CharField(max_length=500, default='')
    center_distance = models.DecimalField(max_digits=10, decimal_places=1, null=True, blank=True)
    state = models.IntegerField()


class Tag(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, default='')
    # parentid = models.ForeignKey(TagParent, on_delete=models.CASCADE)
    # state = models.IntegerField()


class POIDetail(models.Model):
    station = models.ForeignKey(Station, on_delete=models.CASCADE)
    poiname = models.CharField(max_length=500, default='')
    origintag = models.CharField(max_length=500, default='')
    address = models.CharField(max_length=1000, default='')
    lng = models.DecimalField(max_digits=10, decimal_places=6)
    lat = models.DecimalField(max_digits=10, decimal_places=6)
    tags = models.CharField(max_length=500, default='')
    distance = models.DecimalField(max_digits=65, decimal_places=4)


class POIDetailTag(models.Model):
    detail = models.ForeignKey(POIDetail, on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)


class DataCheck(models.Model):
    station = models.ForeignKey(Station, on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)
    count = models.IntegerField()


class AnjukeData(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=500, default='')
    origin_name = models.CharField(max_length=500, default='')
    lng = models.DecimalField(max_digits=10, decimal_places=4, default='')
    lat = models.DecimalField(max_digits=10, decimal_places=4, default='')


class RidingData(models.Model):
    id = models.AutoField(primary_key=True)
    orilng = models.DecimalField(max_digits=10, decimal_places=4, default='')
    orilat = models.DecimalField(max_digits=10, decimal_places=4, default='')
    detlng = models.DecimalField(max_digits=10, decimal_places=4, default='')
    detlat = models.DecimalField(max_digits=10, decimal_places=4, default='')
    distance = models.DecimalField(max_digits=65, decimal_places=4, default='')
    time = models.DecimalField(max_digits=65, decimal_places=4, default='')
