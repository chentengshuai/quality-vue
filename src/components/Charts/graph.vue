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
        tooltip: {},
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {},
          },
        },
        legend: [{}],
        animationDurationUpdate: 1500,
        animationEasingUpdate: "quinticInOut",
      };
      this.chart = echarts.init(document.getElementById(this.id), "macarons");
      this.chart.setOption(defaultOption);
    },
    setOptions(chartData) {
      const Newoption = {
        series: {
          name: chartData.head,
          type: "graph",
          layout: "circular",
          circular: {
            rotateLabel: true,
          },
          data: this.chartData.nodes,
          links: this.chartData.links,
          categories: this.chartData.categories,
          roam: true,
          label: {
            position: "right",
            formatter: "{b}",
          },
          lineStyle: {
            color: "source",
            curveness: 0.3,
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