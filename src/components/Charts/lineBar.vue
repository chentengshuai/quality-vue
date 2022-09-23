<template>
  <div class="chart-container app-container nohead">
    <div id="chart" style="height:530px;margin-top:30px;"></div>
  </div>
</template>

<script>

import echarts from 'echarts'

require("echarts/theme/macarons");
import resize from './mixins/resize'

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
    chartData: {
      type: Object,
      required: true,
    },
    options: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val);
      },
    },
    options: {
      deep: true,
      handler(val) {
        this.chart.setOption(this.options);
      },
    },
  },
  mounted() {
    this.init();
    this.chart.setOption(this.options);
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
      };
      this.chart = echarts.init(document.getElementById(this.id), "chart");
      this.chart.setOption(defaultOption);
    },
    setOptions(chartData) {
      const Newoption = {
        series: this.chartData.data,
      };
      if (!this.options) {
        this.chart.setOption(this.options);
      }
      this.chart.setOption(Newoption);
    },
  }
}
</script>
