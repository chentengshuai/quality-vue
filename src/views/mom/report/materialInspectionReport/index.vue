<template>
<div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="物料名称">
              <el-input v-model="query.materialName" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="物料编码">
              <el-input v-model="query.materialCode" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="检验时间">
                <el-date-picker v-model="query.inspectTime" type="daterange"
                                value-format="timestamp" format="yyyy-MM-dd" start-placeholder="开始日期"
                                end-placeholder="结束日期">
                </el-date-picker>
             </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="initChart">查询</el-button>
              <el-button icon="el-icon-refresh-right" @click="reset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <div class="chart-container JNPF-common-search-box nohead">
        <div id="chart" style="height:300px;margin-top:30px;"></div>
      </div>

      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          
        </div>
        <JNPF-table v-loading="listLoading" :data="list" >
          <el-table-column prop="materialName" label="物料名称" width="0" align="left"/>
          <el-table-column prop="materialCode" label="物料编码" width="0" align="left"/>
          <el-table-column prop="materialNumber" label="货品数量" width="0" align="left"/>
          <el-table-column prop="sampleNumber" label="抽样数" width="0" align="left"/>
          <el-table-column prop="goodNumber" label="抽样合格品数" width="0" align="left"/>
          <el-table-column prop="badNumber" label="抽样不合格品数" width="0" align="left"/>
          <el-table-column prop="passRate" label="合格率" width="0" align="left">
            <template slot-scope="scope">
                {{ scope.row.passRate }} %
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" :page-sizes="pageSizes"
                    @pagination="initChart"/>
      </div>
    </div>
  </div>
</template>

<script>

import request from '@/utils/request'
import echarts from 'echarts'
import resize from '@/views/extend/graphDemo/mixins/resize'
export default {
  name: 'materialInspectionReport',
  mixins: [resize],
  data() {
    return {
      showAll: false,
      query: {
        materialCode: undefined,
        materialName: undefined,
        inspectTime: undefined,
      },
      treeProps: {
        children: 'children',
        label: 'fullName',
        value: 'id'
      },
      list: [],
      listLoading: false,
      total: 0,
      listQuery: {
        currentPage: 1,
        pageSize: 5,
        sort: "desc",
        sidx: "",
      },
      pageSizes:[5,10,20],
      chart: null,
      option: {
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
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar', 'stack', 'pie'] },
            restore: { show: true },
          }
        },
        grid:[
          {x:'7%',y:'15%',width:'50%',height:'70%'}
        ],
        legend: {
          // data: ['原料总数', '抽样合格数', '抽样不合格数', '抽样合格率'],
          // orient: 'vertical',
          // x: 'left',
          // top: '10%',
          // data: ['直达', '营销广告', '搜索引擎']
          data: [
              {
                name: '原料总数',
                icon: 'rect',//图形样式 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
                // textStyle: {
                //   color: '#5470C6'
                // },
              },
              {
                name: '抽样合格数',
                icon: 'rect',
              },
              {
                name: '抽样不合格数',
                icon: 'rect',//图形样式 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
              },
              {
                name: '抽样合格率',
                icon: 'diamond',//图形样式 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
              },
              {
                name: '总合格数',
                icon: 'circle',//图形样式 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
                // textStyle: {
                //   color: '#5470C6'
                // },
              },
              {
                name: '总不合格数',
                icon: 'circle',//图形样式 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
              },
          ]
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '数量',
            min: 0,
            axisLabel: {
              formatter: '{value} '
            }
          },
          {
            type: 'value',
            name: '合格率',
            min: 0,
            max: 100,
            interval: 20,
            axisLabel: {
              formatter: '{value} %'
            }
          }
        ],
        series: [
          {
            name: '原料总数',
            type: 'bar',
            data: []
          },
          {
            name: '抽样合格数',
            type: 'bar',
            stack: '抽样数',
            data: []
          },
          {
            name: '抽样不合格数',
            type: 'bar',
            stack: '抽样数',
            data: []
          },
          {
            name: '抽样合格率',
            type: 'line',
            yAxisIndex: 1,
            data: []
          },
          {
            name: '总抽样数',
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '70%'],
            center: ['80%','50%'],
            label: {
              formatter: '{b}: {@2012} ({d}%)'
            },
            emphasis: {
              focus: 'self'
            },
            encode: {
              itemName: 'product',
              value: '2012',
              tooltip: '2012'
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
            ]
          }
        ]
      }
    }
  },
  mounted() {
    this.initChart()
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
      //this.listLoading = true;
      let _query = {
          ...this.query,
          ...this.listQuery
      };
      request({
          url: `/api/project/InspectionReport/findMaterialInspectionReport`,
          method: 'post',
          data: _query
      }).then(res => {
          var _xAxis_data =[];
          var _series_data0 =[];
          var _series_data1 =[];
          var _series_data2 =[];
          var _series_data3 =[];
          var _list = [];
          var _piedata1 = 0;
          var _piedata2 = 0;
          for(let i=0;i<res.data.length;i++){
              let _data = res.data[i];
              _xAxis_data.push(_data.materialName)
              _series_data0.push(_data.materialNumber)
              _series_data1.push(_data.goodNumber)
              _series_data2.push(_data.badNumber)
              _series_data3.push(_data.passRate)
              _list.push(_data);
              _piedata1 += _data.badNumber;
              _piedata2 += _data.goodNumber;
          }
          let _piedata = [
              { value: _piedata1, name: '总不合格数', selected: true, itemStyle: {color:'#61a0a8'} },
              { value: _piedata2, name: '总合格数', itemStyle: {color:'#2f4554'} }
              //'#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'
          ]
          this.list = _list;
          this.option.xAxis[0].data = _xAxis_data;
          this.option.series[0].data = _series_data0;
          this.option.series[1].data = _series_data1;
          this.option.series[2].data = _series_data2;
          this.option.series[3].data = _series_data3;
          this.option.series[4].data = _piedata;
          this.chart = echarts.init(document.getElementById('chart'))
          this.chart.setOption(this.option)
          this.chart.on('click', params => {
            console.log(params)
          })
          //this.listLoading = false
      })
      //this.chart = echarts.init(document.getElementById('chart'))
      //this.chart.setOption(this.option)
    },
    reset() {
      for (let key in this.query) {
        this.query[key] = undefined
      }
      this.listQuery = {
        currentPage: 1,
        pageSize: 20,
        sort: "desc",
        sidx: "",
      }
      this.initChart()
    },
  }
}
</script>
