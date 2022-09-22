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
      let resultData=res.data;
      let option={
        tooltip: {
          trigger: 'item',
          show:true
       },
        color:['#5470c6','#91cc75','#fac858','#ee6666','#73c0de','#3ba272','#fc8452','#9a60b4','#ea7ccc'],
        // title: {
        //   text: '设备不合格占比',
        // },
        legend: {
          top: 'bottom'
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            name: 'Nightingale Chart',
            type: 'pie',
            radius: [15, 95],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8
            },    
            data: resultData
          }
        ]
      }
      this.chart.setOption(option)
    }
  }
}
</script>
