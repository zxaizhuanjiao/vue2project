<template>
    <div style="width: 100%">
        <div id="myChart" ref="myChart" :style="{width: '100%', height: '300px'}" v-on-echart-resize></div>

        <div id="myChart2" ref="myChart2" :style="{width: '100%', height: '300px'}" v-on-echart-resize></div>

        <el-table :data="tableData" style="width: 100%">
            <el-table-column
                    prop="username"
                    label="用户名">
            </el-table-column>
            <el-table-column
                    prop="mobile"
                    label="手机号">
            </el-table-column>
            <el-table-column
                    prop="enable"
                    label="状态">
            </el-table-column>
            <el-table-column
                    prop="updatedTime"
                    label="最近更新时间">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button @click="openEdit(scope.row)">编辑</el-button>
                    <el-button @click="openDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import "../../utils/chart.resize";
    import api from '../../utils/api'

    export default {
        name: "TestComponent",
        data() {
            return {
                tableData: [],
            };
        },
        mounted() {
            this.drawLine();
            const elementResizeDetectorMaker = require("element-resize-detector");

            let erd = elementResizeDetectorMaker();
            erd.listenTo(this.$refs.myChart, () => {
                this.$nextTick(function () {
                    const lineChart = this.$echarts.init(this.$refs.myChart);
                    lineChart.resize();
                });
            });
            erd.listenTo(this.$refs.myChart2, () => {
                this.$nextTick(function () {
                    const lineChart = this.$echarts.init(this.$refs.myChart2);
                    lineChart.resize();
                });
            });
        },
        created() {
            this.findDataList();
        },
        methods: {
            findDataList() {
                this.timestamp = new Date().valueOf();
                this.$axios.get(api.FIND_DATA_LIST.url).then(res => {
                    if (res.data.code === '000000') {
                        this.tableData = res.data.data;
                        console.log(this.tableData);
                    }
                });
            },
            drawLine(){
                let myChart = this.$echarts.init(document.getElementById('myChart'));
                myChart.setOption({
                    title: { text: 'echartsDemo1' },
                    tooltip: {},
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        data: ['x1','x2','x3','x4','x5','x6']
                    },
                    yAxis: {},
                    series: [{
                        name: 'y',
                        type: 'bar',
                        data: [5, 20, 36, 10, 10, 20],
                        itemStyle: {
                            normal: {
                                color: new this.$echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [
                                        {offset: 0, color: '#06B5D7'},
                                        {offset: 0.5, color: '#44C0C1'},
                                        {offset: 1, color: '#71C8B1'},
                                    ]
                                ),
                                barBorderRadius:[10, 10, 0, 0],
                            },
                            emphasis: {
                                color: new this.$echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [
                                        {offset: 0, color: '#71C8B1'},
                                        {offset: 0.7, color: '#44C0C1'},
                                        {offset: 1, color: '#06B5D7'}
                                    ]
                                )
                            }
                        },
                        barWidth: 10
                    }]
                });

                let myChart2 = this.$echarts.init(document.getElementById('myChart2'));
                myChart2.setOption({
                    title: {
                        text: 'echartsDemo2'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    legend: {
                        data: ['name']
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: ['x1', 'x2', 'x3', 'x4', 'x5', 'x6', 'x7']
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    color: ['#5ea7fb'],
                    series: [
                        {
                            name: 'y1',
                            type: 'line',
                            stack: '总量',
                            areaStyle: {
                                color: new this.$echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [
                                        {offset: 0, color: '#5ea7fb'},
                                        {offset: 1, color: 'rgba(1,191,239,0)'},
                                    ]
                                ),
                            },
                            data: [120, 132, 101, 134, 90, 230, 210]
                        },
                    ]
                });
                window.addEventListener("resize",function(){
                    myChart.resize();
                    myChart2.resize();
                });
            }
        },
    }
</script>

<style>
    #myChart {
        width: 100%;
    }

</style>
