<template>
  <div class="chart-container app-container  nohead">
    <div id="chart" style="height:530px;margin-top:30px;"></div>
  </div>
</template>

<script>

import echarts from 'echarts'
import resize from '@/components/Charts/mixins/resize'
import request from "@/utils/request";
export default {
  name: 'extend-graphDemo-echartsLineArea',
  mixins: [resize],
  data() {
    return {
      chart: null,
      option: {
        title: {
          text: '检验单趋势图'
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
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        legend: {
          data: ['不合格趋势']
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
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          }
        ],
        yAxis: [
          {

            type: 'value',
            name: '',
          }
        ],
        series: [
          {
            name: '不合格趋势',
            type: 'line',
            stack: '趋势',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            areaStyle: { normal: {} },
            data: [122, 99, 232, 112, 321, 232, 98]
          }
        ]
      }
    }
  },
  mounted() {
    // this.initChart()
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
    initChart() {
      this.chart = echarts.init(document.getElementById('chart'))
      this.chart.setOption(this.option)
    },
    initData() {
      this.chart = echarts.init(document.getElementById('chart'))
      request({
        url: `/api/project/InspectionReport/selectSingleTrend`,
        method: 'post'
      }).then(res => {
        debugger
        this.option.xAxis[0].data = res.data.months
        this.option.series[0].data = res.data.disNum
        this.chart.setOption(this.option)
      })
    }
  }
}
</script>
