import * as echarts from 'echarts';
import Vue from "vue";
import elementResizeDetectorMaker from "element-resize-detector";
let HANDLER = "_vue_echarts_resize_handler";

function bind(el) {
    unbind(el);
    el[HANDLER] = function() {
        let chart = echarts.getInstanceByDom(el);
        if (!chart) {
            return;
        }
        chart.resize();
    };
    elementResizeDetectorMaker().listenTo(el, el[HANDLER]);
}
function unbind(el) {
    elementResizeDetectorMaker().removeListener(el, el[HANDLER]);
    delete el[HANDLER];
}
var directive = {
    bind: bind,
    unbind: unbind
};
Vue.directive("on-echart-resize", directive);
