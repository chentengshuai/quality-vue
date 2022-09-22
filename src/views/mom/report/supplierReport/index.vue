<template>
  <div class="chart-container app-container nohead">
    <div id="chart" style="height:530px;margin-top:30px;"></div>
  </div>
</template>

<script>
import request from '@/utils/request'
import echarts from 'echarts'
import resize from '@/views/extend/graphDemo/mixins/resize'
export default {
  name: 'extend-graphDemo-echartsBar',
  mixins: [resize],
  data() {
    return {
      chart: null,

    }
  },
  mounted() {
    this.initData()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initData(){
      let _query = {
      };
      request({
        url: `/api/project/Partner/getSupplierMaterialReport`,
        method: 'post',
        data: _query
      }).then(res => {
        this.initChart(res.data)
      })
    },
    initChart(data) {
      this.chart = echarts.init(document.getElementById('chart'))
      let suppliserNameList=data.suppliserNameList; //供应商名称集合
      let badNumberList=data.badNumberList;  //不良总数集合
      let badRateNumberList=data.badRateNumberList; // 不良率集合
      let qualifiedRateNumberList=data.qualifiedRateNumberList;// 合格率集合
      let option={
        color:['rgba(255,144,128,1)', 'rgba(252,230,48,1)','rgba(0,191,183,1)'],
        title: {
          text: '供应商报表分类',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: ['不良总数', '不良率', '合格率']
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
            data: suppliserNameList,
       
            axisLabel: {
                interval: 0,
                rotate: -20,
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '不良总数',
            type: 'bar',
            data: badNumberList
          },
          {
            name: '不良率',
            type: 'bar',
            data:badRateNumberList
          },
          {
            name: '合格率',
            type: 'bar',
            data:qualifiedRateNumberList
          },
          
        ]
      };
      this.chart.setOption(option)
    }
  }
}
</script>
