<template>
  <div :id="id" :style="{ height: height, width: width }" />
</template>

<script>
import * as echarts from "echarts";
require("echarts/theme/macarons");
import resize from "./mixins/resize";
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
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    init() {
      const defaultOption = {
        tooltip: {
          trigger: "item",
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {},
          },
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
      };
      this.chart = echarts.init(document.getElementById(this.id), "macarons");
      this.chart.setOption(defaultOption);
    },
    setOptions(chartData) {
      const Newoption = {
        series: {
          name: chartData.head,
          type: "pie",
          radius: "50%",
          data: this.chartData.data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      };
      if (!this.options) {
        this.chart.setOption(this.options);
      }
      this.chart.setOption(Newoption);
    },
  },
};
</script>

<style>
</style>