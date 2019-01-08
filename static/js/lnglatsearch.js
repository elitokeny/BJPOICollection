/*
author:ZhangXu
date:2019.1.3
地产小区名称与高德地图名称匹配
 */

window.onload = function () {

    var map = new AMap.Map("container", {
        resizeEnable: true
    });

    $("#getAjk").click(function () {     //地产数据poi名称放在高德里匹配
        var AJKData = getAJK();
        AJKData.forEach(function (cur) {
            searchAJK(cur);
        });
    });


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
    }

    function searchAJK(curPoi) {
        AMap.service(["AMap.PlaceSearch"], function () {
            var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
                pageSize: 1,
                pageIndex: 1,
                city: "010", //城市
                citylimit: true,
                map: map,
                type: "商务住宅"
            });
            //关键字查询
            placeSearch.search(curPoi[1], function (status, result) {
                if (status === "complete") {
                    sendAJKData(curPoi[0], result.poiList.pois[0]);
                } else {
                    console.log("没搜到");
                }
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

};