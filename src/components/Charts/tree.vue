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
          triggerOn: "mousemove",
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {},
          },
        },
      };
      this.chart = echarts.init(document.getElementById(this.id), "macarons");
      this.chart.setOption(defaultOption);
    },
    setOptions(chartData) {
      const Newoption = {
        series: [
          {
            type: "tree",
            id: 0,
            name: "tree1",
            data: [chartData],

            top: "10%",
            left: "8%",
            bottom: "22%",
            right: "20%",

            symbolSize: 7,

            edgeShape: "polyline",
            edgeForkPosition: "63%",
            initialTreeDepth: 5,

            lineStyle: {
              color: "rgb(190,217,239)",
              width: 2,
            },

            itemStyle: {
              borderColor: "rgb(46,199,201)",
            },

            label: {
              backgroundColor: "#fff",
              position: "left",
              verticalAlign: "middle",
              align: "right",
            },

            leaves: {
              label: {
                position: "right",
                verticalAlign: "middle",
                align: "left",
              },
            },

            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750,
          },
        ],
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
