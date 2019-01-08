/*
author:ZhangXu
date:2018.12.25
周边检索程序：拿到前端表单提交的关键字进行周边检索
 */

window.onload = function () {   // 加载完成DOM立即执行

    var map = new AMap.Map("container", {
        resizeEnable: true
    });

    var allPois = new Array();

    layui.use(['form', 'layedit', 'laydate'], function () {
        var form = layui.form
            , layer = layui.layer
            , layedit = layui.layedit
            , laydate = layui.laydate;

        //监听提交
        // 中心点+半径+POI类型
        //表单验证通过后将输入内容转成json发给周边检索的js程序
        form.on('submit(searchnearby)', function (data) {
            console.log(data.field);  //当前容器的全部表单字段，名值对形式：{name: value}
            layer.alert(JSON.stringify(data.field));
            var circle = new AMap.Circle({
                center: [data.field.lng, data.field.lat],
                radius: data.field.radius, //半径
                borderWeight: 3,
                strokeColor: "#FF33FF",
                strokeOpacity: 1,
                strokeWeight: 6,
                strokeOpacity: 0.2,
                fillOpacity: 0.4,
                strokeStyle: 'dashed',
                strokeDasharray: [10, 10],
                // 线样式还支持 'dashed'
                fillColor: '#1791fc',
                zIndex: 50,
            })

            map.add(circle);
            for (var i = 0; i < 18; i++) {
                searchPoi(data.field.lng, data.field.lat, data.field.radius, data.field.poiType, i + 1);
            }
            return false;  //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });
    });

    function searchPoi(curPointLng, curPointLat, curRadius, curTag, pageIndex) {   //对车站按tag进行搜索
        AMap.service(["AMap.PlaceSearch"], function () {
            var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
                pageSize: 50,
                type: curTag,
                pageIndex: pageIndex,
                city: "010",//城市
                citylimit: true, //是否强制限制在设置的城市内搜索
                map: map,// 展现结果的地图实例
                showCover: false,
                autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
            });
            var cpoint = new AMap.LngLat(curPointLng, curPointLat);
            placeSearch.searchNearBy('', cpoint, curRadius, function (status, result) {
                if (status === "complete") {
                    result.poiList.pois.forEach(function (cur) {
                        var temparray = {};
                        temparray["id"] = cur["id"];
                        temparray["poiname"] = cur["name"];
                        temparray["lng"] = cur["location"]["lng"];
                        temparray["lat"] = cur["location"]["lat"];
                        temparray["address"] = cur["address"];
                        temparray["origintag"] = cur["type"];
                        allPois.push(temparray);
                    })
                }
            });
        })
    }

    $('#getresult').click(function () {
        alert("检索到" + allPois.length + "条数据");
        layui.use('table', function () {
            var table = layui.table;
            //第一个实例
            table.render({
                elem: '#searchresult'
                , data: allPois   //数据接口
                , toolbar: true
                , width: 500
                , height: 'full-320'
                , limit: 900
                , defaultToolbar: ['filter', 'print', 'exports']
                , title: '检索结果'
                , cols: [[ //表头
                    {field: 'id', title: 'ID', width: 80, sort: true, fixed: 'left'}
                    , {field: 'poiname', title: 'POI名称', width: 180, sort: true}
                    , {field: 'lng', title: '经度', width: 120}
                    , {field: 'lat', title: '纬度', width: 120}
                    , {field: 'address', title: '地址', width: 297}
                    , {field: 'origintag', title: '高德标签', width: 250, sort: true}
                ]], page: false
            });
        });
    })

};