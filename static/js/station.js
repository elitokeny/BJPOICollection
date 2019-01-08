$(function () { // 加载完成DOM立即执行

    var map = new AMap.Map("container", {
        resizeEnable: true
    });
    var p0 = [116.450378, 39.947585];
    var p1 = [116.434027, 39.941037];
    var p2 = [116.461665, 39.941564];
    var p3 = [116.466171, 39.937977];
    // 判断 p0 是否在 p1-p2-p3 围成的封闭区域内
    var inRing = AMap.GeometryUtil.isPointInRing(p0, [p1, p2, p3]);
    console.log(inRing);

})