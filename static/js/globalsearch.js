/*
author:ZhangXu
date:2018.12.25
全域POI检索程序
 */

window.onload = function () { // 加载完成DOM立即执行

    var map = new AMap.Map("container", {
        resizeEnable: true
    });

    var bounds = getbounds();
    var tags = getTagInfo();

    // $('#getPOICount').click(function () {
    //     var bounds = getbounds();
    //     var tags = getTagInfo();
    //     bounds.forEach(function (curBound) {
    //         tags.forEach(function (curTag) {
    //             searchCount(curBound, curTag);
    //         })
    //     });
    // });


    $('#field1').click(function () {
        bounds.forEach(function (curBound) {
            searchCount(curBound, tags[document.getElementById('field1').value])
        })

    });


    $('#field2').click(function () {
        bounds.forEach(function (curBound) {
            searchCount(curBound, tags[document.getElementById('field2').value])
        })

    });


    $('#field3').click(function () {
        bounds.forEach(function (curBound) {
            searchCount(curBound, tags[document.getElementById('field3').value])
        })

    });


    $('#field4').click(function () {
        bounds.forEach(function (curBound) {
            searchCount(curBound, tags[document.getElementById('field4').value])
        })

    });


    $('#field5').click(function () {
        bounds.forEach(function (curBound) {
            searchCount(curBound, tags[document.getElementById('field5').value])
        })

    });

    $('#field6').click(function () {
        bounds.forEach(function (curBound) {
            searchCount(curBound, tags[document.getElementById('field6').value])
        })

    });


    $('#field7').click(function () {
        bounds.forEach(function (curBound) {
            searchCount(curBound, tags[document.getElementById('field7').value])
        })

    });


    $('#field8').click(function () {
        bounds.forEach(function (curBound) {
            searchCount(curBound, tags[document.getElementById('field8').value])
        })

    });


    $('#field9').click(function () {
        bounds.forEach(function (curBound) {
            searchCount(curBound, tags[document.getElementById('field9').value])
        })

    });


    $('#field10').click(function () {
        bounds.forEach(function (curBound) {
            searchCount(curBound, tags[document.getElementById('field10').value])
        })

    });


    $('#field11').click(function () {
        bounds.forEach(function (curBound) {
            searchCount(curBound, tags[document.getElementById('field11').value])
        })

    });


    $('#field12').click(function () {
        bounds.forEach(function (curBound) {
            searchCount(curBound, tags[document.getElementById('field12').value])
        })

    });


    $('#field13').click(function () {
        bounds.forEach(function (curBound) {
            searchCount(curBound, tags[document.getElementById('field13').value])
        })

    });


    $('#field14').click(function () {
        bounds.forEach(function (curBound) {
            searchCount(curBound, tags[document.getElementById('field14').value])
        })

    });


    $('#field15').click(function () {
        bounds.forEach(function (curBound) {
            searchCount(curBound, tags[document.getElementById('field15').value])
        })

    });


    $('#field16').click(function () {
        bounds.forEach(function (curBound) {
            searchCount(curBound, tags[document.getElementById('field16').value])
        })

    });

    function searchCount(curbound, curtype) {
        AMap.service(["AMap.PlaceSearch"], function () {
            var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
                pageSize: 1,
                pageIndex: 1,
                city: "010",//城市
                citylimit: true,
                map: map,
                autoFitView: false
            });
            var polygon = new AMap.Polygon({
                path: [[curbound.p1.lng, curbound.p1.lat], [curbound.p2.lng, curbound.p2.lat], [curbound.p3.lng, curbound.p3.lat], [curbound.p4.lng, curbound.p4.lat]],//设置多边形边界路径
                strokeColor: "#FF33FF", //线颜色
                strokeOpacity: 1, //线透明度
                strokeWeight: 5,    //线宽
                fillColor: "#FF0099", //填充色
                fillOpacity: 0//填充透明度
            });

            placeSearch.searchInBounds(curtype.name, polygon, function (status, result) {
                if (status === "complete") {
                    sendCountData(curbound.id, curtype.id, result.poiList.count);
                }
            });
        });
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

    function sendCountData(curBoundId, curType, number) {
        $.ajax({
            type: "POST",
            url: "/globalCount",
            async: false,
            data: JSON.stringify({'boundId': curBoundId, 'type': curType, 'count': number}),
            contentType: "application/json",
            dataType: "json"
        })
    }


    function sleep(numberMillis) {
        var now = new Date();
        var exitTime = now.getTime() + numberMillis;
        while (true) {
            now = new Date();
            if (now.getTime() > exitTime)
                break;
        }
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

};