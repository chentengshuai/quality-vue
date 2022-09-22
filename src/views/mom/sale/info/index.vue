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
            <el-col :span="6">
              <el-form-item label="状态">
                <el-select v-model="query.status" placeholder="请选择"
                           clearable>
                  <el-option v-for="(item, index) in statusOptions" :key="index"
                             :label="item.fullName" :value="item.id"
                             :disabled="item.disabled"></el-option>
                </el-select>
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
        <div class="JNPF-common-head">
          <div>
            <el-button type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()">新增
            </el-button>
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" content="刷新" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                       @click="reset()"/>
            </el-tooltip>
            <screenfull isContainer/>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="list" @sort-change='sortChange'>
          <el-table-column prop="salesOrderCode" label="销售订单号" width="0" align="left"/>
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
          <el-table-column label="操作" fixed="right"
                           width="160">
            <template slot-scope="scope">
              <el-button type="text" v-if="scope.row.status == 0 || scope.row.status == 1 || scope.row.status == 2"
                         @click="abarbeitungHandle(scope.row.id)">整改
              </el-button>
              <el-button type="text" v-if="scope.row.status == 0"
                         @click="addOrUpdateHandle(scope.row.id)">编辑
              </el-button>
              <el-button v-if="scope.row.status == 0" type="text"
                         class="JNPF-table-delBtn" @click="handleDel(scope.row.id)">删除
              </el-button>
              <el-button type="text" v-if="scope.row.status == 5"
                         @click="abarbeitungAnewHandle(scope.row.id)">重新整改
              </el-button>
              <el-button type="text" v-if="scope.row.status == 0 || scope.row.status == 1 || scope.row.status == 4 || scope.row.status == 5"
                         @click="closeHandle(scope.row.id)">关闭
              </el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
                    @pagination="initData"/>
      </div>
    </div>
    <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh"/>
    <ExportBox v-if="exportBoxVisible" ref="ExportBox" @download="download"/>
    <el-dialog title="整改" :close-on-click-modal="false" append-to-body :visible.sync="abarbeitungVisible"
      class="JNPF-dialog JNPF-dialog_center" lock-scroll width="600px">
      <AbarbeitungForm ref="abarbeitungForm" @refresh="abarbeitungChange"></AbarbeitungForm>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request'
import {getDictionaryDataByTypeCode, getDictionaryDataSelector} from '@/api/systemData/dictionary'
import JNPFForm from './Form'
import ExportBox from './ExportBox'
import AbarbeitungForm from './AbarbeitungForm'
import {previewDataInterface} from '@/api/systemData/dataInterface'

export default {
  components: {JNPFForm, ExportBox,AbarbeitungForm},
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
      abarbeitungVisible: false,
      columnList: [
        {prop: 'afterSaleCause', label: '售后原因'},
        {prop: 'afterSaleType', label: '售后类型'},
        {prop: 'clientCode', label: '客户编码'},
        {prop: 'clientName', label: '客户名称'},
        {prop: 'materialCode', label: '售后产品编码'},
        {prop: 'materialName', label: '售后产品名称'},
        {prop: 'salesOrderCode', label: '销售订单号'},
      ],
      statusOptions: [
        {fullName: "已处理", id: 1},
        {fullName: "未处理", id: 0},
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
    handleDel(id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        request({
          url: `/api/project/Sale_marketing_service_info/${id}`,
          method: 'DELETE'
        }).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            onClose: () => {
              this.initData()
            }
          });
        })
      }).catch(() => {
      });
    },

    addOrUpdateHandle(id, isDetail) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.JNPFForm.init(id, isDetail)
      })
    },
    exportData() {
      this.exportBoxVisible = true
      this.$nextTick(() => {
        this.$refs.ExportBox.init(this.columnList)
      })
    },
    download(data) {
      let query = {...data, ...this.listQuery, ...this.query}
      request({
        url: `/api/project/Sale_marketing_service_info/Actions/Export`,
        method: 'GET',
        data: query
      }).then(res => {
        if (!res.data.url) return
        window.location.href = this.define.comUrl + res.data.url
        this.$refs.ExportBox.visible = false
        this.exportBoxVisible = false
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
    abarbeitungHandle(id){
      this.abarbeitungVisible = true
      this.$nextTick(() => {
        this.$refs.abarbeitungForm.init(id)
      })
    },
    abarbeitungChange(){
      this.abarbeitungVisible = false
      this.reset()
    },
    abarbeitungAnewHandle(id){ // 重新整改
      this.abarbeitungVisible = true
      this.$nextTick(() => {
        this.$refs.abarbeitungForm.init(id,'anew')
      })
    },
    closeHandle(id){ // 关闭
      this.$confirm('此操作将关闭此售后单, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        request({
          url: `/api/project/Sale_marketing_service_info/closeSaleInfo/${id}`,
          method: 'PUT'
        }).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            onClose: () => {
              this.initData()
            }
          });
        })
      }).catch(() => {
      });
    },
  }
}
</script>
