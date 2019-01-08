$(function () { // 加载完成DOM立即执行

    var map = new AMap.Map("container", {
        resizeEnable: true
    });
    var cpoint = new AMap.LngLat(116.39739, 39.90886);
    $('#getStationLngLat').click(function () {       //北京所有地铁站（包括在建）信息抓取
        searchLngLat();
    });

    $('#getgateway').click(function () {      //地铁站出入口信息抓取
        var stations = getStationName();
        stations.forEach(function (cur) {
            searchGateway(cur);
        })
    });


    $('#getPOICount').click(function () {      //poi数量信息抓取
        var stationdetail = getStationDetail();
        var tags = getTagInfo();
        stationdetail.forEach(function (cur) {
            trans(cur, tags)
        })
    });

    $('#getPoi').click(function () {       //周边poi检索
        var stationdetail = getStationDetail();
        if (stationdetail) {
            console.log('车站数据读取成功')
        }
        var tags = getTagInfo();
        if (tags) {
            console.log("标签信息读入成功")
        }

        stationdetail.forEach(function (cur) {
           transition(cur, tags);
            // var flag= transition(cur, tags);
           // if(flag){
           //     //  jiang  che zhan zhuangtai zhi wei 2
           // } else {
           //     // jiang .....1
           //     return
           // }
        })
    });

    $("#getAjk").click(function () {     //地产数据poi名称放在高德里匹配
        var AJKData = getAJK();
        AJKData.forEach(function (cur) {
            searchAJK(cur);
        });
    });


    $("#getBusinfo").click(function () {     //公交站与公交线路信息抓取
        var stations = getStationDetail();
        stations.forEach(function (curSta) {
            for (var i = 0; i < 20; i++) {
                searchBusinfo(curSta, i + 1);
            }
        })
    });

    function searchBusinfo(curSta, pageindex) {
        AMap.service(["AMap.PlaceSearch"], function () {
            var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
                pageSize: 50,
                type: '公交车站',
                pageIndex: pageindex,
                city: "010",//城市
                map: map,
                panel: "panel",
                autoFitView: false
            });
            var cpoint = new AMap.LngLat(curSta.point.lng, curSta.point.lat);
            placeSearch.searchNearBy('', cpoint, 5000, function (status, result) {
                if (result.info === 'OK') {
                    sendBusDetail(curSta.id, result.poiList.pois);
                }
            });
        })
    }

    function sendBusDetail(id, data) {
        $.ajax({
            type: "POST",
            url: "/savePoi",
            async: false,
            data: JSON.stringify({'staId': id, 'tagId': 1, 'data': data}),
            contentType: "application/json",
            dataType: "json",
            complete: function (msg) {
                if (msg.status === 404) {
                }
            }
        });
    }

    function trans(cur, tags) {
        tags.forEach(function (curTag) {
            searchCount(cur, curTag, 1);
        });
    }

    function searchCount(curSta, curTag, pageindex) {
        AMap.service(["AMap.PlaceSearch"], function () {
            var placeSearch = new AMap.PlaceSearch({
                pageSize: 1,
                type: curTag.name,
                pageIndex: pageindex,
                city: "010",
                map: map,
                panel: "panel",
                autoFitView: false
            });
            var mpoint = new AMap.LngLat(curSta.point.lng, curSta.point.lat);
            placeSearch.searchNearBy('', mpoint, 5000, function (status, result) {
                if (result.info === 'OK') {
                    sendCountData(curSta.id, curTag.id, result.poiList.count);
                }
            })
        })
    }

    function sendCountData(curStaId, curTagId, data) {
        $.ajax({
            type: "POST",
            url: "/saveCount",
            async: false,
            data: JSON.stringify({'staId': curStaId, 'tagId': curTagId, 'count': data}),
            contentType: "application/json",
            dataType: "json"
        })
    }

    function getAJK() {
        var rsp;
        $.ajax({
            type: "GET",
            url: "/AJK",
            async: false,
            success: function (result) {
                if (result.status !== 200) return;
                rsp = result.data;
            }
        });
        return rsp;
    };

    function searchLngLat() {
        AMap.service(["AMap.PlaceSearch"], function () {
            for (var i = 0; i < 9; i++) {
                var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
                    pageSize: 50,
                    pageIndex: i + 1,
                    city: "010", //城市
                    map: map,
                    panel: "panel"
                });
                //关键字查询
                placeSearch.search('地铁站', function (status, result) {
                    console.log(result.poiList.count);
                    var distances = new Array();
                    result.poiList.pois.forEach(function (curPoi) {
                        distances.push(cpoint.distance(curPoi.location));
                    })
                    sendStationData(result.poiList.pois, distances);
                });
            }
        });
    }

    function searchGateway(curSta) {
        AMap.service(["AMap.PlaceSearch"], function () {
            var placeSearch = new AMap.PlaceSearch({
                pageSize: 20,
                pageIndex: 1,
                city: "010",
                map: map,
                type: 150501,
                panel: "panel"
            });

            placeSearch.search(curSta, function (status, result) {
                console.log(result);
                var distances = new Array();
                result.poiList.pois.forEach(function (curPoi) {
                    distances.push(cpoint.distance(curPoi.location));
                });
                sendGateway(result.poiList, distances)
            })
        })
    }

    function searchPoi(curSta, curTag, pageIndex) {   //对车站按tag进行搜索
        AMap.service(["AMap.PlaceSearch"], function () {
            var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
                pageSize: 50,
                type: curTag.name,
                pageIndex: pageIndex,
                city: "010",//城市
                map: map,
                panel: "panel",
                autoFitView: false
            });

            var cpoint = new AMap.LngLat(curSta.point.lng, curSta.point.lat);
            placeSearch.searchNearBy('', cpoint, 5000, function (status, result) {
                if (result.info === 'OK') {
                    sendPoiDetail(curSta.id, curTag.id, result.poiList.pois);
                    console.log('对%s的所有%s标签搜索完成!', curSta.name, curTag.name);
                    if (curTag.name === '虚拟门') {
                        console.log('对%s的所有标签搜索完成!!!', curSta.name);
                    }
                }
            });


                    //设置暂停函数


        })
    }

    function sendStationData(data, distances) {
        $.ajax({
            type: "POST",
            url: "/saveStation",
            async: false,
            data: JSON.stringify({'data': data, 'distance': distances}),
            contentType: "application/json",
            dataType: "json",
            complete: function (msg) {
                if (msg.status === 404) {
                }
            }
        })
    }

    function sendPoiDetail(curStaId, curTagId, data) {    //将搜索的Poi信息发到后台保存
        $.ajax({
            type: "POST",
            url: "/savePoi",
            async: false,
            data: JSON.stringify({'staId': curStaId, 'tagId': curTagId, 'data': data}),
            contentType: "application/json",
            dataType: "json",
            complete: function (msg) {
                if (msg.status === 404) {
                }
            }
        });
    }

    function searchAJK(curPoi) {
        AMap.service(["AMap.PlaceSearch"], function () {
            var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
                pageSize: 1,
                pageIndex: 1,
                city: "010", //城市
                map: map,
                type: "商务住宅",
                panel: "panel"
            });
            //关键字查询
            placeSearch.search(curPoi[1], function (status, result) {
                sendAJKData(curPoi[0], result.poiList.pois[0]);
            });
        });
    }


    function sendAJKData(id, result) {
        $.ajax({
            type: "POST",
            url: "/saveAJK",
            async: false,
            data: JSON.stringify({'id': id, 'data': result}),
            contentType: "application/json",
            dataType: "json"
        })
    }


    function sendGateway(data, distances) {
        $.ajax({
            type: "POST",
            url: "/saveGateway",
            async: false,
            data: JSON.stringify({'data': data, 'distance': distances}),
            contentType: "application/json",
            dataType: "json",
            complete: function (msg) {
                if (msg.status === 404) {
                }
            }
        })
    }


    function transition(cur, tags) {     //过渡函数
        tags.forEach(function (curtag) {
            for (var i = 0; i < 31; i++) {
                searchPoi(cur, curtag, i + 1);
            }
        });
    }

    // function transition(cur, tags) {     //过渡函数
    //     tags.forEach(function (curtag) {
    //         var poi_num = getPage(cur.id, curtag.id);
    //         var page_num = Math.ceil(poi_num.count / 50);
    //         for (var i = 0; i < page_num; i++) {
    //             searchPoi(cur, curtag, i + 1);
    //         }
    //     });
    // }

    function getPage(staid, tagid) {
        var pages;
        $.ajax({
            type: "GET",
            url: "/pageNum",
            data: {"station_id": staid, "tag_id": tagid},
            async: false,
            success: function (result) {
                if (result.status !== 200) return;
                pages = result.data;
            }
        });
        return pages;
    }

    function getStationDetail() {      //从后台读取车站及其经纬度信息
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

    function getStationName() {
        var rsp;
        $.ajax({
            type: "GET",
            url: "/stationName",
            async: false,
            success: function (result) {
                if (result.status !== 200) return;
                rsp = result.data;
            }
        });
        return rsp;
    }

    function getTagInfo() {            //从后台读取tag信息
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


})
