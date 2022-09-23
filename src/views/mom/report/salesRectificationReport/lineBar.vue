<template>
  <div class="chart-container app-container nohead">
    <div id="chart" style="height:380px;margin-top:10px;"></div>
  </div>
</template>

<script>

import echarts from 'echarts'
import request from '@/utils/request'

require("echarts/theme/macarons");
import resize from '@/components/Charts/mixins/resize'

export default {
  mixins: [resize],
  props: {
    id: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "500px",
    },
    height: {
      type: String,
      default: "300px",
    },
  },
  data() {
    return {
      chart: null,
      option: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        toolbox: {
          feature: {
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar']},
            restore: {show: true},
          }
        },
        legend: {
          data: ['整改量', '整改完成量', '平均完成率']
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '数量',
            min: 0,
            interval: 50,
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            type: 'value',
            name: '比例',
            min: 0,
            interval: 5,
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name: '整改量',
            type: 'bar',
            data: []
          },
          {
            name: '整改完成量',
            type: 'bar',
            data: []
          },
          {
            name: '平均完成率',
            type: 'line',
            yAxisIndex: 1,
            data: []
          }
        ]
      }
    }
  },
  created() {
    this.initData()
  },
  mounted() {
    this.initChart()
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
      // this.chart.setOption(this.option)
    },
    initData() {
      request({
        url: `/api/project/Sale_marketing_abarbeitung/getMoneCount`,
        method: 'post'
      }).then(res => {
        debugger
        this.option.xAxis[0].data = res.data.latestMonths
        this.option.series[0].data = res.data.abars
        this.option.series[1].data = res.data.abarDeatils
        this.option.series[2].data = res.data.ratios
        this.chart.setOption(this.option)
      })
    }
  }
}
</script>
