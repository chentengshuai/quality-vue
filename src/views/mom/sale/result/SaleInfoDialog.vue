<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="销售订单号">
              <el-input v-model="query.salesOrderCode" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="售后类型">
              <el-select v-model="query.afterSaleType" placeholder="请选择"
                         clearable>
                <el-option v-for="(item, index) in afterSaleTypeOptions" :key="index"
                           :label="item.fullName" :value="item.id"
                           :disabled="item.disabled"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="售后原因">
              <el-input v-model="query.afterSaleCause" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="售后产品编码">
              <el-input v-model="query.materialCode" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="售后产品名称">
              <el-input v-model="query.materialName" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户编码">
              <el-input v-model="query.clientCode" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <template v-if="showAll">
            <el-col :span="6">
              <el-form-item label="客户名称">
                <el-input v-model="query.clientName" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
              <el-button icon="el-icon-refresh-right" @click="reset()">重置</el-button>
              <el-button type="text" icon="el-icon-arrow-down" @click="showAll=true" v-if="!showAll">
                展开
              </el-button>
              <el-button type="text" icon="el-icon-arrow-up" @click="showAll=false" v-else>
                收起
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <JNPF-table v-loading="listLoading" :data="list" @sort-change='sortChange' @row-click="rowClick">
          <el-table-column prop="salesOrderCode" label="销售订单号" width="0" align="left"/>
          <el-table-column prop="afterSaleTypeName" label="售后类型" width="0" align="left"/>
          <el-table-column prop="afterSaleCause" label="售后原因" width="0" align="left"/>
          <el-table-column prop="materialCode" label="售后产品编码" width="0" align="left"/>
          <el-table-column prop="materialName" label="售后产品名称" width="0" align="left"/>
          <el-table-column prop="clientCode" label="客户编码" width="0" align="left"/>
          <el-table-column prop="clientName" label="客户名称" width="0" align="left"/>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
                    @pagination="initData"/>
      </div>
    </div>
    <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh"/>
    <ExportBox v-if="exportBoxVisible" ref="ExportBox" @download="download"/>
  </div>
</template>

<script>
import request from '@/utils/request'
import {getDictionaryDataByTypeCode, getDictionaryDataSelector} from '@/api/systemData/dictionary'
import JNPFForm from './Form'
import ExportBox from './ExportBox'
import {previewDataInterface} from '@/api/systemData/dataInterface'

export default {
  components: {JNPFForm, ExportBox},
  data() {
    return {
      showAll: false,
      query: {
        afterSaleCause: undefined,
        afterSaleType: undefined,
        clientCode: undefined,
        clientName: undefined,
        materialCode: undefined,
        materialName: undefined,
        salesOrderCode: undefined,
      },
      treeProps: {
        children: 'children',
        label: 'fullName',
        value: 'id'
      },
      list: [],
      listLoading: true,
      total: 0,
      listQuery: {
        currentPage: 1,
        pageSize: 20,
        sort: "desc",
        sidx: "",
      },
      formVisible: false,
      exportBoxVisible: false,
      columnList: [
        {prop: 'afterSaleCause', label: '售后原因'},
        {prop: 'afterSaleType', label: '售后类型'},
        {prop: 'clientCode', label: '客户编码'},
        {prop: 'clientName', label: '客户名称'},
        {prop: 'materialCode', label: '售后产品编码'},
        {prop: 'materialName', label: '售后产品名称'},
        {prop: 'salesOrderCode', label: '销售订单号'},
      ],
      afterSaleTypeOptions: [],
      afterSaleTypeProps: {"label": "fullName", "value": "id"},
    }
  },
  computed: {},
  created() {
    this.initData()
    this.getafterSaleTypeOptions();
  },
  methods: {
    getafterSaleTypeOptions() {
      getDictionaryDataByTypeCode('saleType').then(res => {
        this.afterSaleTypeOptions = res.data
      })
    },
    sortChange({column, prop, order}) {
      this.listQuery.sort = order == 'ascending' ? 'asc' : 'desc'
      this.listQuery.sidx = !order ? '' : prop
      this.initData()
    },
    initData() {
      this.listLoading = true;
      let _query = {
        ...this.listQuery,
        ...this.query
      };
      request({
        url: `/api/project/Sale_marketing_service_info/getList`,
        method: 'post',
        data: _query
      }).then(res => {
        var _list = [];
        for (let i = 0; i < res.data.list.length; i++) {
          let _data = res.data.list[i];
          _list.push(_data)
        }
        this.list = _list
        this.total = res.data.pagination.total

        this.listLoading = false
      })
    },
    search() {
      this.listQuery = {
        currentPage: 1,
        pageSize: 20,
        sort: "desc",
        sidx: "",
      }
      this.initData()
    },
    refresh(isrRefresh) {
      this.formVisible = false
      if (isrRefresh) this.reset()
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
      this.initData()
    },
    rowClick(row, preRow) {
      this.$emit("onChange", row);
    },
  }
}
</script>
