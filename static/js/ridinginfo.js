$(function () { // 加载完成DOM立即执行
    var map = new AMap.Map("container", {
        center: [116.397559, 39.89621],
        zoom: 14
    });

    var ridingOption = {
        map: map,
        panel: "panel",
        policy: 1,
        hideMarkers: false,
        isOutline: true,
        outlineColor: '#ffeeee',
        autoFitView: false
    };

    var riding = new AMap.Riding(ridingOption);

    function getRoute() {  //从ridingdata表中读取所有记录
        var res;
        $.ajax({
            type: 'GET',
            url: '/getroute',
            async: false,
            success: function (result) {
                if (result.status !== 200) return;
                rsp = result.data;
            }
        });
        return res;
    }

    $('#getRidingInfo').click(function () {
        var routes = getRoute();  //读取起点终点的经纬度
    });

    //根据起终点坐标规划骑行路线
    riding.search([116.397933, 39.844818], [116.440655, 39.878694], function (status, result) {
        // result即是对应的公交路线数据信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_RidingResult
        if (status === 'complete') {
            console.log(result.routes[0].distance, result.routes[0].time);
        } else {
            log.error('骑行路线数据查询失败' + result)
        }
    });

})