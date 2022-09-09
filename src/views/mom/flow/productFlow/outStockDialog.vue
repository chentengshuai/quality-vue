<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="出库单号">
              <el-input v-model="query.stockMoveCode" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单据编号">
              <el-input v-model="query.billNo" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="出库时间">
              <el-date-picker v-model="query.stockMoveDate" type="daterange"
                              value-format="timestamp" format="yyyy-MM-dd" start-placeholder="开始日期"
                              end-placeholder="结束日期">
              </el-date-picker>
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
        <JNPF-table v-loading="listLoading" :data="list" @sort-change='sortChange' @expand-change="expandChange" hasC>
          <el-table-column type="expand" width="40">
            <template slot-scope="props">
              <el-tabs v-model="props.row.activeName">
                <!--                <el-tab-pane label="出库明细">-->
                <el-table :data="props.row.childTable" stripe size='mini'
                          :element-loading-text="$t('common.loadingText')"  @row-click="rowClick">
                  <el-table-column type="index" width="50" label="序号" align="center"/>
                  <el-table-column prop="lotNumber" label="批号/箱号"/>
                  <el-table-column prop="productCode" label="物料编码"/>
                  <el-table-column prop="productName" label="物料名称"/>
                  <el-table-column prop="productSpc" label="规格型号"/>
<!--                  <el-table-column prop="productLvl" label="产品等级"/>-->
                  <el-table-column prop="uomName" label="单位"/>
                  <el-table-column prop="qty" label="出库数量"/>
                  <el-table-column prop="useQty" label="使用数量"/>
                  <el-table-column prop="usableQty" label="可用数量"/>
<!--                  <el-table-column prop="grossWeight" label="毛重"/>-->
<!--                  <el-table-column prop="customerName" label="客户"/>-->
                  <el-table-column prop="warehouseName" label="仓库"/>
                  <el-table-column prop="locationName" label="仓位"/>
<!--                  <el-table-column prop="workShopName" label="生产车间"/>-->
                </el-table>
                <!--                </el-tab-pane>-->
              </el-tabs>
            </template>
          </el-table-column>
          <el-table-column prop="stockMoveCode" label="出库单号" width="0" align="left"/>
          <el-table-column prop="stockMoveDate" label="出库日期" width="0" align="left"/>
          <el-table-column prop="totalQty" label="出库数量" width="0" align="left"/>
          <el-table-column prop="stockPersonName" label="仓管员" width="0" align="left"/>
          <el-table-column prop="billNo" label="单据编号" width="0" align="left"/>
          <el-table-column prop="remark" label="备注" width="0" align="left"/>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
                    @pagination="initData"/>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import JNPFForm from './Form'
import ExportBox from './ExportBox'
import {getDictionaryDataByTypeCode} from '@/api/systemData/dictionary'

export default {
  components: {JNPFForm, ExportBox},
  data() {
    return {
      query: {
        stockMoveCode: undefined,
        stockMoveType: undefined,
        stockMoveDate: undefined,
        status: undefined,
        billNo: undefined
      },
      treeProps: {
        children: 'children',
        label: 'fullName',
        value: 'id'
      },
      idCodes:{},
      materialCode: "",
      list: [],
      listLoading: true,
      total: 0,
      listQuery: {
        currentPage: 1,
        pageSize: 20,
        sort: "desc",
        sidx: "",
      }
    }
  },
  computed: {},
  created() {
    this.getStockMoveTypeList();//获取出库类型的数据字典
    this.initData()
  },
  methods: {
    sortChange({column, prop, order}) {
      this.listQuery.sort = order == 'ascending' ? 'asc' : 'desc'
      this.listQuery.sidx = !order ? '' : prop
      this.initData()
    },
    expandChange(rows) {
      rows.isExpanded = !rows.isExpanded
      if (!rows.isExpanded) return
      if (rows.childTable.length) return
      let _data = {}
      _data.stockMoveId = rows.id
      _data.productCode = this.materialCode
      request({
        url: `/api/project/outStock/findStockMoveLineByModel`,
        method: 'post',
        data: _data
      }).then(res => {
        console.log(res)
        rows.childTable = res.data
        if(res.data && res.data.length >0){
          res.data.forEach(rd => {
            debugger
            this.idCodes[rd.id] = rows.stockMoveCode
          })
        }
        console.log(rows.childTable)
      })
    },
    initData() {
      this.listLoading = true;
      let _query = {
        ...this.listQuery,
        ...this.query,
        productCode: this.materialCode ,
      };
      request({
        url: `/api/project/outStock/getFlowDataList`,
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
    init(materialCode){
      this.materialCode = materialCode
      this.initData()
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
      if (isrRefresh)
        this.reset()
    },
    rowClick(row, preRow){
      row.stockMoveCode = this.idCodes[row.id]
      debugger
      this.$emit("onChange", row);
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
    getStockMoveTypeList() {
      getDictionaryDataByTypeCode('outSockMoveType').then(res => {
        this.stockMoveTypeOptions = res.data
      }).catch(() => {
      })
    }
  }
}
</script>
