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
  name: 'extend-graphDemo-echartsPie',
  mixins: [resize],
  props: {
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '300px'
  }, chartData: {
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
      this.setOptions(this.chartData);
    },setOptions(res){
      let resultData=res.patrolPlanFinishRateList;
      console.log(resultData)
      let option={
          // title: {
          //   text: 'Referer of a Website',
          //   subtext: 'Fake Data',
          //   left: 'center'
          // },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            left: 'left'
          },
          series: [
            {
              name: 'Access From',
              type: 'pie',
              radius: '50%',
              data:resultData,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };
      this.chart.setOption(option)
    }
  }
}
</script>
