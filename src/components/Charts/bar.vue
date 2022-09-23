<template>
  <div :id="id" :style="{ height: height, width: width }" />
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons')
import resize from './mixins/resize'
export default {
  mixins: [resize],
  props: {
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '500px'
    },
    height: {
      type: String,
      default: '300px'
    },
    chartData: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      default: null
    },
    isStack: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val, this.isStack)
      }
    },
    options: {
      deep: true,
      handler(val) {
        this.chart.setOption(this.options)
      }
    }
  },
  mounted() {
    this.init()
    this.chart.setOption(this.options)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    init() {
      const defaultOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        grid: {
          top: '10%',
          left: '10',
          right: '10',
          bottom: '20',
          containLabel: true
        },
        legend: {},
        toolbox: {
          show: true,
          feature: {
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis: {
          type: 'value',
          axisTick: {
            show: true
          }
        }
      }
      this.chart = echarts.init(document.getElementById(this.id), 'macarons')
      this.chart.setOption(defaultOption)
    },
    setOptions(chartData, isStack) {
      var Newoption = {}
      if (isStack === false) {
        Newoption = {
          xAxis: {
            data:
              this.chartData.data && this.chartData.data.map((r) => r.label)
          },
          series:
            this.chartData.type &&
            this.chartData.type.map((r) => {
              return {
                name: r.label,
                type: 'bar',
                data: this.chartData.data.map((rr) => rr[r.value]),
                markPoint: {
                  data: [
                    { type: 'max', name: 'Max' },
                    { type: 'min', name: 'Min' }
                  ]
                },
                markLine: {
                  data: [{ type: 'average', name: 'Avg' }]
                }
              }
            })
        }
      } else {
        Newoption = {
          xAxis: {
            data:
              this.chartData.data && this.chartData.data.map((r) => r.label)
          },
          series:
            this.chartData.type &&
            this.chartData.type.map((r) => {
              return {
                name: r.label,
                type: 'bar',
                data: this.chartData.data.map((rr) => rr[r.value]),
                stack: 'Ad',
                markPoint: {
                  data: [
                    { type: 'max', name: 'Max' },
                    { type: 'min', name: 'Min' }
                  ]
                },
                markLine: {
                  data: [{ type: 'average', name: 'Avg' }]
                }
              }
            })
        }
      }
      if (!this.options) {
        this.chart.setOption(this.options)
      }
      this.chart.setOption(Newoption)
    }
  }
}
</script>

<style>
</style>