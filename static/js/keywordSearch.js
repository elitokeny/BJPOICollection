/*
author:ZhangXu
date:2018.12.24
关键字检索程序：拿到前端表单提交的关键字进行关键字检索
 */

window.onload = function () { // 加载完成DOM立即执行


    var map = new AMap.Map("container", {
        resizeEnable: true
    });

    var allPois = new Array();

    layui.use(['form', 'layedit', 'laydate'], function () {
        var form = layui.form
            , layer = layui.layer;

        //监听提交
        //表单验证通过后将输入内容转成json发给关键字搜索的js程序
        form.on('submit(formDemo)', function (data) {
            layer.alert(JSON.stringify(data.field));
            for (var i = 0; i < 18; i++) {
                searchLngLat(data.field.keyword, data.field.poiType, i + 1);
            }
            return false;  //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });
    });


//通过表单提交的信息进行关键字检索
    function searchLngLat(keyword, poitype, pageindex) {
        AMap.service(["AMap.PlaceSearch"], function () {
            var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
                pageSize: 50,
                pageIndex: pageindex,
                type: poitype,
                city: "010", //城市
                citylimit: true,  //是否强制限制在设置的城市内搜索
                map: map
            });
            //关键字查询
            //保留POI名称、经纬度、高德标签、地址、使用的关键字、检索时间

            placeSearch.search(keyword, function (status, result) {
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
            })
        });
    }

    // function sendStationData(data, keyword, pageindex) {
    //     $.ajax({
    //         type: "POST",
    //         url: "/saveKwdPoi",
    //         async: false,
    //         data: JSON.stringify({'data': data, 'keyword': keyword, 'pageindex': pageindex}),
    //         contentType: "application/json",
    //         dataType: "json",
    //         complete: function (msg) {
    //             if (msg.status === 200) {
    //
    //             }
    //         }
    //     })
    // }

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