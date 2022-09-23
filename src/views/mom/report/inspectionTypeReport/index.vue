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
              <el-button type="primary" icon="el-icon-search" @click="initChart()">查询</el-button>
              <el-button icon="el-icon-refresh-right" @click="reset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-row class="JNPF-common-search-box" :gutter="16">
          <el-col :span="12">
              <div class="border-box" style="height:39.5vh;">
                  <h4>检验合格率变化趋势</h4>
                  <div class="box-chart" style="height:94%">
                      <LeftChar  :chartData="leftData" :style="{'height':'100%'}"></LeftChar>
                  </div>
              </div>
          </el-col>
          <el-col :span="12">
              <div class="border-box" style="height:39.5vh;">
                  <h4>检验类型合格率</h4>
                  <div class="box-chart" style="height:94%">
                      <RightChar :chartData="rightData" :style="{'height':'100%'}"></RightChar>
                  </div>
              </div>
          </el-col>
      </el-row>

      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
        </div>
        <JNPF-table v-loading="listLoading" :data="list" >
          <el-table-column prop="materialName" label="物料名称" width="0" align="left"/>
          <el-table-column prop="materialCode" label="物料编码" width="0" align="left"/>
          <el-table-column prop="inspectionType" label="检验单类型" width="0" align="left">
            <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.inspectionType == 1">原料检验</el-tag>
                <el-tag type="success" v-else-if="scope.row.inspectionType == 2">成品检验</el-tag>
                <el-tag type="success" v-else-if="scope.row.inspectionType == 3">半成品检验</el-tag>
                <el-tag type="success" v-else-if="scope.row.inspectionType == 4">库存检验</el-tag>
                <el-tag type="success" v-else-if="scope.row.inspectionType == 5">发货检验</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="materialNumber" label="货品数量" width="0" align="left"/>
          <el-table-column prop="sampleNumber" label="抽样数" width="0" align="left"/>
          <el-table-column prop="badNumber" label="不良数" width="0" align="left"/>
          <el-table-column prop="failureRate" label="不良率" width="0" align="left">
            <template slot-scope="scope">
                {{ scope.row.failureRate }} %
            </template>
          </el-table-column>
          <el-table-column prop="passRate" label="合格率" width="0" align="left">
            <template slot-scope="scope">
                {{ scope.row.passRate }} %
            </template>
          </el-table-column>
          <el-table-column prop="result" label="检验结果" width="0" align="left">
            <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.result == 1">合格</el-tag>
                <el-tag type="warning" v-else-if="scope.row.result == 2">不合格</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="inspectTime" label="检验时间" width="0" align="left"/>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" :page-sizes="pageSizes"
                    @pagination="initChart"/>
      </div> 
    </div>
  </div>
</template>

<script>

import request from '@/utils/request'
import RightChar from './rightChar.vue'
import LeftChar from './leftChar.vue'
export default {
  components: {RightChar,LeftChar},
  data() {
    return {
      showAll: false,
      query: {
        materialCode: undefined,
        materialName: undefined,
        inspectTime: undefined,
      },
      list: [],
      listLoading: false,
      total: 0,
      listQuery: {
        currentPage: 1,
        pageSize: 10,
        sort: "desc",
        sidx: "",
      },
      pageSizes:[10,20,50],
      leftData:{},
      rightData:{},
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      this.initChartData()
      this.initTableData()
    },
    initTableData(){
      this.listLoading = true;
      let _query = {
          ...this.query,
          ...this.listQuery
      };
      request({
          url: `/api/project/InspectionReport/findInspectionTypeReport`,
          method: 'post',
          data: _query
      }).then(res => {
          var _list = [];
          for(let i=0;i<res.data.list.length;i++){
              let _data = res.data.list[i];
              _list.push(_data);
          }
          this.rightData={
              list:_list
          };
          this.list = _list;
          this.total = res.data.pagination.total
          this.listLoading = false;
      })
      //this.chart = echarts.init(document.getElementById('chart'))
      //this.chart.setOption(this.option)
    },
    initChartData(){
      request({
          url: `/api/project/InspectionReport/findYearsInspectionTypeReport`,
          method: 'post',
      }).then(res => {
          this.leftData={
              list:res.data
          };
      })
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
