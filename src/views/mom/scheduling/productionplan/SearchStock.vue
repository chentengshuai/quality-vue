<template>

  <el-dialog
    :title="'查看库存'"
    width="80%"
    @close="closeDialog"
    :close-on-click-modal="false"
    :visible="stockShow"
    append-to-body
  >
    <div class="JNPF-common-layout">
      <div class="JNPF-common-layout-center">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="6">
              <el-form-item label="规格型号">
                <el-input v-model="query.productSpc" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="箱号">
                <el-input v-model="query.lotNumber" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="卷号">
                <el-input v-model="query.rollNum" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
<!--            <el-col :span="6">-->
<!--              <el-form-item label="库存状态">-->
<!--                <el-select v-model="query.status" placeholder="请选择" clearable :style='{"width":"100%"}'-->
<!--                           :multiple="false">-->
<!--                  <el-option v-for="(item, index) in statusOptions" :key="index" :label="item.fullName" :value="item.id"-->
<!--                             :disabled="item.disabled"></el-option>-->
<!--                </el-select>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
            <el-col :span="6">
              <el-form-item label="合同号">
                <el-input v-model="query.contractNo" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="客户">
                <el-input v-model="query.customerName" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                <el-button icon="el-icon-refresh-right" @click="reset()">重置</el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="JNPF-common-head">
            <div class="JNPF-common-head-right">
              <el-tooltip effect="dark" content="刷新" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                         @click="reset()"/>
              </el-tooltip>
              <screenfull isContainer/>
            </div>
          </div>
          <JNPF-table v-loading="listLoading" :data="list" @expand-change="expandChange">
            <el-table-column type="expand" width="40">
              <template slot-scope="props">
                <el-tabs v-model="props.row.activeName">
                  <el-tab-pane label="库存明细">
                    <el-table :data="props.row.childTable" stripe size='mini'
                              :element-loading-text="$t('common.loadingText')">
                      <el-table-column type="index" width="50" label="序号" align="center"/>
                      <el-table-column prop="lotNumber" label="批号/箱号" width="0" align="left"/>
                      <el-table-column prop="customerName" label="客户" width="0" align="left"/>
                      <el-table-column prop="contractNo" label="合同号" width="0" align="left"/>
                      <el-table-column prop="productSpc" label="规格型号" width="0" align="left"/>
                      <el-table-column prop="uomName" label="单位" width="0" align="left"/>
                      <el-table-column prop="qty" label="库存数量" width="0" align="left"/>
                    </el-table>
                  </el-tab-pane>
                </el-tabs>
              </template>
            </el-table-column>
            <el-table-column prop="productCode" label="物料编码" width="0" align="left"/>
            <el-table-column prop="productName" label="产品名称" width="0" align="left"/>
            <el-table-column prop="productSpc" label="规格型号" width="0" align="left"/>
            <el-table-column prop="uomName" label="单位" width="0" align="left"/>
            <el-table-column prop="qty" label="库存数量" width="0" align="left"/>
          </JNPF-table>
          <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
                      @pagination="initData"/>
        </div>
      </div>
      <el-dialog title="装箱包装明细列表"
                 :close-on-click-modal="false" append-to-body
                 :visible.sync="formVisible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
                 width="1000px">
        <box-detail ref="BoxDetail"></box-detail>
      </el-dialog>
    </div>
  </el-dialog>

</template>

<script>
  import request from '@/utils/request'
  import BoxDetail from '../../stock/stockReport/boxDetail'

  export default {
    props: {
      stockVisible: {
        type: Boolean,
        default: false,
      },
    },
    components: {BoxDetail},
    watch: {
        stockVisible(newVal, oldVal){
          this.stockShow = newVal
        },
        immediate : true
    },
    data() {
      return {
        showAll: false,
        stockShow:true,
        query: {
          productSpc: undefined,
          status: undefined,
          lotNumber: undefined,
          contractNo: undefined,
          customerName: undefined,
          rollNum: undefined,
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
        selectData:[],
        formVisible: false,
        columnList: [
          {prop: 'productCode', label: '物料编码'},
          {prop: 'productName', label: '产品名称'},
          {prop: 'productSpc', label: '规格型号'},
          {prop: 'uomName', label: '单位'},
          {prop: 'qty', label: '库存数量'},
        ],
        statusOptions: [{"fullName": "已撤回", "id": "0"}, {"fullName": "已入库", "id": "1"}, {"fullName": "已出库", "id": "2"}],
      }
    },
    computed: {},
    created() {
      this.initData()
    },
    methods: {
      sortChange({column, prop, order}) {
        this.listQuery.sort = order == 'ascending' ? 'asc' : 'desc'
        this.listQuery.sidx = !order ? '' : prop
        this.initData()
      },
      closeDialog(){
          this.$emit("closeDialog");
      },
      initData() {
        this.listLoading = true;
        let _query = {
          ...this.listQuery,
          ...this.query
        };
        request({
          url: `/api/project/stockReport/getList`,
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
          for (let i = 0; i < this.list.length; i++) {
            this.$set(this.list[i], 'isExpanded', false)
            this.$set(this.list[i], 'activeName', '0')
            this.$set(this.list[i], 'childTable', [])
          }
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
      selectionChange(list) {
        this.ids = list.map((x) => x.id).join(',')
        console.log('ids' + this.ids)
      },
      expandChange(rows) {
        rows.isExpanded = !rows.isExpanded
        if (!rows.isExpanded) return
        if (rows.childTable.length) return
        let _query = {
          ...this.query,
          productCode: rows.productCode,
          productSpc: rows.productSpc,
          uomName: rows.uomName
        }
        request({
          url: `/api/project/stockReport/Items`,
          method: 'POST',
          data: _query
        }).then(res => {
          console.log(res)
          rows.childTable = res.data
          console.log(rows.childTable)
        })
      },
    }
  }
</script>
