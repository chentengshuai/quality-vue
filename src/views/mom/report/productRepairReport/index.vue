<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="产品名称">
              <el-input v-model="query.materialName" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="产品编码">
              <el-input v-model="query.materialCode" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="售后时间">
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
                  <h4>产品返修TOP10</h4>
                  <div class="box-chart" style="height:94%">
                      <LeftChar  :chartData="leftData" :style="{'height':'100%'}"></LeftChar>
                  </div>
              </div>
          </el-col>
          <el-col :span="12">
              <div class="border-box" style="height:39.5vh;">
                  <h4>产品返修统计</h4>
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
          <el-table-column prop="salesOrderCode" label="销售订单号" width="0" align="left"/>
          <el-table-column prop="creationTime" label="售后时间" width="0" align="left"/>
          <el-table-column prop="afterSaleSourceName" label="售后信息来源" width="0" align="left"/>
          <el-table-column prop="afterSaleTypeName" label="售后类型" width="0" align="left"/>
          <el-table-column prop="customerCalls" label="客户联系电话" width="0" align="left"/>
          <el-table-column prop="afterSaleCause" label="售后原因" width="0" align="left"/>
          <el-table-column prop="materialCode" label="售后产品编码" width="0" align="left"/>
          <el-table-column prop="materialName" label="售后产品名称" width="0" align="left"/>
          <el-table-column prop="clientCode" label="客户编码" width="0" align="left"/>
          <el-table-column prop="clientName" label="客户名称" width="0" align="left"/>
          <el-table-column prop="status" label="状态" width="0" align="left">
            <template slot-scope="scope">
              <el-tag type="danger" v-if="scope.row.status == 0">未处理</el-tag>
              <el-tag type="success" v-if="scope.row.status == 1">已处理</el-tag>
              <el-tag type="warning" v-if="scope.row.status == 2">处理中</el-tag>
              <el-tag type="warning" v-if="scope.row.status == 3">整改中</el-tag>
              <el-tag type="success" v-if="scope.row.status == 4">整改完成</el-tag>
              <el-tag type="danger" v-if="scope.row.status == 5">取消整改</el-tag>
              <el-tag type="info" v-if="scope.row.status == 6">关闭</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="saleTypeName" label="售后处理状态" width="0" align="left"/>
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
          url: `/api/project/InspectionReport/findProductSaleRepairReport`,
          method: 'post',
          data: _query
      }).then(res => {
          var _list = [];
          for(let i=0;i<res.data.list.length;i++){
              let _data = res.data.list[i];
              _list.push(_data);
          }
          this.list = _list;
          this.total = res.data.pagination.total
          this.listLoading = false;
      })
      //this.chart = echarts.init(document.getElementById('chart'))
      //this.chart.setOption(this.option)
    },
    initChartData(){
      let _query = {
          ...this.query
      };
      request({
          url: `/api/project/InspectionReport/findProductSaleRepairCharts`,
          method: 'post',
          data: _query
      }).then(res => {
          this.leftData={
              list:res.data
          };
          this.rightData={
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
