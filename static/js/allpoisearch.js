/*
author:ZhangXu
date:2018.12.26
在得到POI总量信息后进行正式抓取
 */

window.onload = function () {

    var map = new AMap.Map("container", {
        resizeEnable: true
    });

    //1.拿到bounds信息
    //2.拿到预抓取得到的页数信息
    //3.对每一个bounds的进行for循环，循环内进行多边形检索

    $('#getPOI').click(function () {
        var restTask = getRestPage();
        var bounds = getbounds();
        var tags = getTagInfo();
        console.log(restTask.length);
        restTask.forEach(function (curTask) {
            searchPoi(bounds[curTask[0]-1], tags[curTask[1]-1], curTask[2], curTask[3]);
        })
    });

    function searchPoi(curBound, curTag, pageIndex, maxpage) {   //对车站按tag进行搜索
        AMap.service(["AMap.PlaceSearch"], function () {
            var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
                pageSize: 50,
                pageIndex: pageIndex,
                city: "010",//城市
                citylimit: true,
                autoFitView: false
            });
            var polygon = new AMap.Polygon({
                path: [[curBound.p1.lng, curBound.p1.lat], [curBound.p2.lng, curBound.p2.lat], [curBound.p3.lng, curBound.p3.lat], [curBound.p4.lng, curBound.p4.lat]],//设置多边形边界路径
                strokeColor: "#FF33FF", //线颜色
                strokeOpacity: 1, //线透明度
                strokeWeight: 5,    //线宽
                fillColor: "#FF0099", //填充色
                fillOpacity: 0//填充透明度
            });
            //将每个车站影响范围的polygon传进来
            placeSearch.searchInBounds(curTag.name, polygon, function (status, result) {
                if (status === "complete") {
                    console.log("have data")
                    sendBoundPoi(result.poiList.pois, curBound.id, curTag.id, pageIndex, maxpage);
                }else if (status === "no_data"){
                    console.log("no data");
                } else {console.log("无回调");}
            });
        })
    }

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


    function getbounds() {
        var rsp;
        $.ajax({
            type: "GET",
            url: "/getBounds",
            async: false,
            success: function (result) {
                if (result.status !== 200) return;
                rsp = result.data;
            }
        });
        return rsp;
    }

    function getRestPage() {
        var rsp;
        $.ajax({
            type: "GET",
            url: "/getRestPage",
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
            url: "/boundPoiTag",
            async: false,
            success: function (result) {
                if (result.status !== 200) return;
                rsp = result.data;
            }
        });
        return rsp;
    }

    function sendBoundPoi(data, curBoundId, curTagId, currentPage, maxPage) {    //将搜索的Poi信息发到后台保存
        $.ajax({
            type: "POST",
            url: "/saveBoundPoi",
            async: false,
            data: JSON.stringify({
                'PoiData': data,
                'BoundId': curBoundId,
                'TagId': curTagId,
                'CurrentPage': currentPage,
                "MaxPage": maxPage
            }),
            contentType: "application/json",
            dataType: "json",
            complete: function (msg) {
                if (msg.status === 404) {
                }
            }
        });
    }

};