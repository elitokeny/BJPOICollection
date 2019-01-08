/*
author:ZhangXu
date:2018.1.3
给定多边形范围进行检索
 */
window.onload = function () {

    var map = new AMap.Map("container", {
        resizeEnable: true
    });

    var allPois = new Array();

    layui.use('form', function () {
        var form = layui.form,
            layer = layui.layer;

        //监听提交
        //表单验证通过后将输入内容转成json发给多边形搜索的js程序
        form.on('submit(boundsearch)', function (data) {
            var routext = data.field.route;
            var type = data.field.poitype;
            var couptext = routext.split("|");
            console.log(couptext);
            var duoArr = new Array();
            couptext.forEach(function (curCoup) {
                var tempCoup = curCoup.split(",")
                duoArr.push(tempCoup);
            });
            console.log(duoArr);
            for (var i = 0; i < 18; i++) {
                searchBound(duoArr, type, i + 1);
            }
            return false;
        });
    });

    function searchBound(curBound, curType, page) {
        AMap.service(["AMap.PlaceSearch"], function () {
            var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
                pageSize: 50,
                pageIndex: page,
                city: "010",//城市
                citylimit: true,
                map: map,
                showCover: false,
                autoFitView: true
            });

            var polygon = new AMap.Polygon({
                path: curBound,//设置多边形边界路径
                strokeColor: "#FF33FF", //线颜色
                strokeOpacity: 0.2, //线透明度
                strokeWeight: 5,    //线宽
                fillColor: "#1791fc", //填充色
                fillOpacity: 0.4//填充透明度
            });

              if (page === 1){
                map.add(polygon);
            }

            //将每个车站影响范围的polygon传进来
            placeSearch.searchInBounds(curType, polygon, function (status, result) {
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