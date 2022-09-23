<template>
  <div class="chart-container app-container nohead">
    <div id="chart" :style="{height:height,width:width}"></div>
  </div>
</template>

<script>
import request from '@/utils/request'
import echarts from 'echarts'
import resize from '@/views/extend/graphDemo/mixins/resize'
export default {
  name: 'rightChar',
  mixins: [resize],
  props: {
    width: {
      type: String,
      default: '50%'
    },
    height: {
      type: String,
      default: '300px'
    },
    chartData: {
      type: Object,
      required: true
    },
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  data() {
    return {
      chart: null,

    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
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
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    }, setOptions(res){
      let equipmentNameList=res.equipmentNameList; //设备名称集合
      let faultRateList=res.faultRateList;  //设备故障率集合
      let option= {
          color:['rgba(0,191,183,1)'],
          // title: {
          //   text: '设备故障率'
          // },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {},
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category',
            data: equipmentNameList
          },
          series: [
            {
              type: 'bar',
              data: faultRateList
            }
          ]
        };
      this.chart.setOption(option)
    }
  }
}
</script>
