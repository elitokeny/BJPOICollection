$(function () { // 加载完成DOM立即执行
    // 百度地图API功能
    var map = new BMap.Map("allmap");
    map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
    // 用于存放所有车站信息
    var stations = [];
    var loststations = [];
    var stationdetail = [];

    $('#start').click(function () {
        stations = getAllStation();
        // 遍历每一个车站的信息
        stations.forEach(function (cur) {
            searchStationPoint(cur);
        })
    });

    $('#restart').click(function () {
        loststations = getLostStation();
        loststations.forEach(function (cur) {
            searchStationPoint(cur);
        })
    });


    $('#searchpoi').click(function () {
        var stationdetail = getStationDetail();
        var tags = getstationPOITag();
        stationdetail.forEach(function (cur) {
            arroundStationInfo(cur, tags);
        })
    });


    function searchStationPoint(curSta) {
        // map.clearOverlays();
        var local = new BMap.LocalSearch(map, {
            renderOptions: {},
            pageCapacity: 20,
            onSearchComplete: function (res) {
                for (var i = 0; i < res['Br'].length; i++) {
                    if (IsInArray(res['Br'][i]['tags'], '地铁/轻轨')) {
                        curSta.point = res['Br'][i]['point'];
                        break;
                    }
                }
                sendStationData(curSta.id, res.Br);
                arroundStationInfo(curSta);
            }
        });
        local.search(curSta['name']);
    }

    function searchStationPOI(curSta, tag) {
        // map.clearOverlays();
        //sleep(1000);
        var mPoint = new BMap.Point(curSta.point.lng, curSta.point.lat);
        var raidus = 2000;
        var local = new BMap.LocalSearch(map, {
            renderOptions: {},
            pageCapacity: 100,
            onSearchComplete: function (res) {
                var distances = new Array();
                res.Br.forEach(function (cur) {
                    distances.push(map.getDistance(mPoint, cur.point).toFixed(2));
                });
                sendPOIDetail({'id': curSta['id'], 'tag': tag, 'details': res.Br, 'distance': distances});
                console.log(tag);
                console.log(res.Br.length);

            }
        });
        local.searchNearby(tag, mPoint, raidus);
    }

    function sendStationData(curstaId, data) {
        $.ajax({
            type: "POST",
            url: "/stationData",
            async: false,
            data: JSON.stringify({'staId': curstaId, 'data': data}),
            contentType: "application/json",
            dataType: "json",
            complete: function (msg) {
                if (msg.status === 404) {
                }
            }
        });
    }

    function getAllStation() {            //从数据库调出所有车站名字
        var rsp;
        $.ajax({
            type: "GET",
            url: "/allStation",
            async: false,
            success: function (result) {
                if (result.status !== 200) return;
                rsp = result.data;
            }
        });
        return rsp;
    }

    function arroundStationInfo(curSta, tags) {
        tags.forEach(function (curtag) {
            searchStationPOI(curSta, curtag.name);
        });
    }

    function sendPOIDetail(data) {              //通过车站名字得到周围POI详细信息
        $.ajax({
            type: "POST",
            url: "/POIDetail",
            async: false,
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            complete: function (msg) {
                if (msg.status === 404) {
                }
            }
        });
    }

    function getstationPOITag() {
        var rsp;
        $.ajax({
            type: "GET",
            url: "/stationPOITag",
            async: false,
            success: function (result) {
                if (result.status !== 200) return;
                rsp = result.data;
            }
        });
        return rsp;
    }


    function getLostStation() {
        var rsp;
        $.ajax({
            type: "GET",
            url: "/lostStation",
            async: false,
            success: function (result) {
                if (result.status !== 200) return;
                rsp = result.data;
            }
        });
        return rsp;
    }

    function getStationDetail() {
        var rsp;
        $.ajax({
            type: "GET",
            url: "/stationDetail",
            async: false,
            success: function (result) {
                if (result.status !== 200) return;
                rsp = result.data;
            }
        });
        return rsp;
    }

    function sleep(d) {
        for (var t = Date.now(); Date.now() - t <= d;) ;
    }

    function IsInArray(arr, val) {

        var testStr = ',' + arr.join(",") + ",";

        return testStr.indexOf("," + val + ",") != -1;

    }
});