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
  name: 'rightChart',
  mixins: [resize],
  props: {
    width: {
      type: String,
      default: '100%'
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
    }, 
    setOptions(res){
      if(!res.list){
        return
      }
      var _list = res.list;
      var goodNumber1 = 0
      var sampleNumber1 = 0
      var goodNumber2 = 0
      var sampleNumber2 = 0
      var goodNumber3 = 0
      var sampleNumber3 = 0
      var goodNumber4 = 0
      var sampleNumber4 = 0
      var goodNumber5 = 0
      var sampleNumber5 = 0

      for(let i=0;i<_list.length;i++){
          let _data = _list[i];
          if(_data.inspectionType == 1){
            goodNumber1 += _data.goodNumber
            sampleNumber1 += _data.sampleNumber
          }else if(_data.inspectionType == 2){
            goodNumber2 += _data.goodNumber
            sampleNumber2 += _data.sampleNumber
          }else if(_data.inspectionType == 3){
            goodNumber3 += _data.goodNumber
            sampleNumber3 += _data.sampleNumber
          }else if(_data.inspectionType == 4){
            goodNumber4 += _data.goodNumber
            sampleNumber4 += _data.sampleNumber
          }else if(_data.inspectionType == 5){
            goodNumber5 += _data.goodNumber
            sampleNumber5 += _data.sampleNumber
          }
      }

      var _seriesdata = [];
      _seriesdata.push(sampleNumber1 == 0?0 : parseFloat(goodNumber1/sampleNumber1*100).toFixed(2))
      _seriesdata.push(sampleNumber2 == 0?0 : parseFloat(goodNumber2/sampleNumber2*100).toFixed(2))
      _seriesdata.push(sampleNumber3 == 0?0 : parseFloat(goodNumber3/sampleNumber3*100).toFixed(2))
      _seriesdata.push(sampleNumber4 == 0?0 : parseFloat(goodNumber4/sampleNumber4*100).toFixed(2))
      _seriesdata.push(sampleNumber5 == 0?0 : parseFloat(goodNumber5/sampleNumber5*100).toFixed(2))


      let option= {
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
            boundaryGap: [0, 0.1]
          },
          yAxis: {
            type: 'category',
            data: ['原料检验', '成品检验', '半成品检验', '库存检验', '发货检验']
          },
          series: [
            {
              name: '合格率',
              type: 'bar',
              data: _seriesdata
            }
          ]
        };
      this.chart.setOption(option)
    }
  }
}
</script>
