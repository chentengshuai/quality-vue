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
  name: 'leftChart',
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
      //5*12 = 60条数据
      const _now = new Date()
      let year = _now.getFullYear()
      let month = _now.getMonth() + 1

      var _monthlist = [];
      for(let k=0;k<12;k++){
        let _month = month < 10 ? '0'+month : month
        let _date = year + "-" + _month;
        _monthlist.push(_date);
        month = month == 1 ? 12 : month-1
        year = month == 12 ? year-1 : year
      }
      _monthlist.push('product');
      _monthlist = _monthlist.reverse();

      var _list = res.list
      var _data1 = ['原料检验']
      var _data2 = ['成品检验']
      var _data3 = ['半成品检验']
      var _data4 = ['库存检验']
      var _data5 = ['出货检验']
      var _count1 = 0
      var _count2 = 0
      var _count3 = 0
      var _count4 = 0
      var _count5 = 0


      for(let y=1;y<_monthlist.length;y++){
        let _time = _monthlist[y];
        for(let i=0;i<_list.length;i++){
          let _data = _list[i];
          if(_data.inspectMonth == _time && _data.inspectionType == 1){
            _data1.push(_data.passRate);
            _count1++
          }else if(_data.inspectMonth == _time && _data.inspectionType == 2){
            _data2.push(_data.passRate);
            _count2++
          }else if(_data.inspectMonth == _time && _data.inspectionType == 3){
            _data3.push(_data.passRate);
            _count3++
          }else if(_data.inspectMonth == _time && _data.inspectionType == 4){
            _data4.push(_data.passRate);
            _count4++
          }else if(_data.inspectMonth == _time && _data.inspectionType == 5){
            _data5.push(_data.passRate);
            _count5++
          }
        }

        if(_count1 != y){
            _data1.push(0);
            _count1++
        }
        if(_count2 != y){
            _data2.push(0);
            _count2++
        }
        if(_count3 != y){
            _data3.push(0);
            _count3++
        }
        if(_count4 != y){
            _data4.push(0);
            _count4++
        }
        if(_count5 != y){
            _data5.push(0);
            _count5++
        }
      }

      let option= {
          legend: {},
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },

          dataset: {
            // source: [
            //   ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
            //   ['Milk Tea', 56.5, 82.1, 88.7, 70.1, 53.4, 85.1],
            //   ['Matcha Latte', 51.1, 51.4, 55.1, 53.3, 73.8, 68.7],
            //   ['Cheese Cocoa', 40.1, 62.2, 69.5, 36.4, 45.2, 32.5],
            //   ['Walnut Brownie', 25.2, 37.1, 41.2, 18, 33.9, 49.1],
            //   ['Walnut Brownie1', 15.2, 17.1, 21.2, 12, 23.9, 39.1]
            // ]
            source: [
              _monthlist,
              _data1,
              _data2,
              _data3,
              _data4,
              _data5
            ]
          },
          xAxis: { type: 'category' },
          yAxis: { gridIndex: 0 },
          grid: { top: '15%' },
          series: [
            {
              type: 'line',
              smooth: true,
              seriesLayoutBy: 'row',
              emphasis: { focus: 'series' }
            },
            {
              type: 'line',
              smooth: true,
              seriesLayoutBy: 'row',
              emphasis: { focus: 'series' }
            },
            {
              type: 'line',
              smooth: true,
              seriesLayoutBy: 'row',
              emphasis: { focus: 'series' }
            },
            {
              type: 'line',
              smooth: true,
              seriesLayoutBy: 'row',
              emphasis: { focus: 'series' }
            },
            {
              type: 'line',
              smooth: true,
              seriesLayoutBy: 'row',
              emphasis: { focus: 'series' }
            }
          ]
        };
      this.chart.setOption(option)
    }
  }
}
</script>
