<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center">
          <el-row class="JNPF-common-search-box" :gutter="16">
            <el-form @submit.native.prevent>
              <el-col :span="8">
                <el-form-item label="客 户">
                  <el-input v-model="listQuery.customerName" placeholder="请输入客户查询" clearable
                    @keyup.enter.native="search()" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="合 同">
                  <el-input v-model="listQuery.contractNo" placeholder="请输入合同查询" clearable
                    @keyup.enter.native="search()" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item>
                  <el-button type="primary" icon="el-icon-search" @click="search()">
                    {{$t('common.search')}}
                  </el-button>
                  <el-button icon="el-icon-refresh-right" @click="reset()">{{$t('common.reset')}}
                  </el-button>
                </el-form-item>
              </el-col>
            </el-form>
            <div class="JNPF-common-search-box-right">
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                  @click="reset()" />
              </el-tooltip>
            </div>
          </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <JNPF-table v-loading="listLoading" :data="list" hasC @selection-change="handleSelectionChange"
                    @row-click="rowClick">
          <el-table-column prop="contractNo" label="合同号" width="0" align="left" />
          <el-table-column prop="lotNumber" label="箱号/批号" width="0" align="left" />
          <el-table-column prop="productCode" label="物料编码" width="0" align="left" />
          <el-table-column prop="productName" label="物料名称" width="0" align="left" />
          <el-table-column prop="productSpc" label="规格型号" width="0" align="left" />
          <el-table-column prop="uomName" label="单位" width="0" align="left" />
          <el-table-column v-if="false" prop="uomId" label="单位" width="0" align="left" />
          <el-table-column prop="qty" label="出库数量" width="0" align="left" />
          <el-table-column prop="grossQty" label="毛重" width="0" align="left" />
          <el-table-column prop="customerCode" label="客户编码" width="0" align="left" />
          <el-table-column prop="customerName" label="客户" width="0" align="left" />
          <el-table-column prop="warehouseCode" label="仓库编码" width="0" align="left" />
          <el-table-column prop="warehouseName" label="仓库" width="0" align="left" />
          <el-table-column prop="locationCode" label="仓位编码" width="0" align="left" />
          <el-table-column prop="locationName" label="仓位名称" width="0" align="left" />
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
                    @pagination="initData"/>
      </div>
      <span slot="footer" class="dialog-footer" style="background:#ffffff">
          <el-button style="float: right;"  @click="closeDialog">{{$t('common.cancelButton')}}</el-button>
          <el-button style="float: right;margin-right: 15px;" type="primary" @click="select()">{{$t('common.confirmButton')}}</el-button>
        </span>
    </div>

  </div>
</template>

<script>
  import request from '@/utils/request'
  import {getDictionaryDataSelector} from '@/api/systemData/dictionary'
  import ExportBox from './ExportBox'
  import {previewDataInterface} from '@/api/systemData/dataInterface'

  export default {
    components: {ExportBox},
    data() {
      return {
        showAll: false,
        query: {
          customerName: undefined,
          contractNo: undefined,
        },
        treeProps: {
          children: 'children',
          label: 'fullName',
          value: 'id'
        },
        list: [],
        listLoading: true,
        total: 0,
        checked: '',
        checkedTxt: '',
        checkedRow: {},
        listQuery: {
          customerName: "",
          contractNo: "",
          currentPage: 1,
          pageSize: 20,
          sort: "desc",
          sidx: "",
        },
        formVisible: false,
        exportBoxVisible: false,
        columnList: [
          {prop: 'contractNo', label: '合同号'},
          {prop: 'lotNumber', label: '箱号/批号'},
          {prop: 'productCode', label: '物料编码'},
          {prop: 'productName', label: '物料名称'},
          {prop: 'productSpc', label: '规格型号'},
          {prop: 'uomId', label: '单位Id'},
          {prop: 'uomName', label: '单位'},
          {prop: 'qty', label: '出库数量'},
          {prop: 'grossQty', label: '毛重'},
          {prop: 'customerId', label: '客户Id'},
          {prop: 'customerCode', label: '客户编码'},
          {prop: 'customerName', label: '客户'},
          {prop: 'warehouseId', label: '仓库Id'},
          {prop: 'warehouseCode', label: '仓库Code'},
          {prop: 'warehouseName', label: '仓库'},
          {prop: 'locationId', label: '仓位'},
          {prop: 'locationCode', label: '仓位编码'},
          {prop: 'locationName', label: '仓位名称'},
        ],
      }
    },
    computed: {},
    created() {
      this.checked = this.value
      this.visible = true
    },
    mounted() {
      this.initData()
    },
    methods: {
      sortChange({column, prop, order}) {
        this.listQuery.sort = order == 'ascending' ? 'asc' : 'desc'
        this.listQuery.sidx = !order ? '' : prop
        this.initData()
      },
      initData() {

        this.listLoading = true;
        let _query = {
          ...this.listQuery,

        };
        request({
          url: `/api/project/outStock/getStockQuanList`,
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
          //this.setDefault()
          this.listLoading = false
        })

      },
      search() {
        this.initData()
        this.listQuery.currentPage = 1
        this.listQuery.pageSize = this.hasPage ? this.pageSize : 20
      },
      reset() {
        this.listQuery.customerName = ''
        this.listQuery.contractNo = ''
        this.listQuery.currentPage = 1
        this.listQuery.pageSize = this.hasPage ? this.pageSize : 20
        this.initData()
      },
      clear() {
            this.checked = ''
            this.innerValue = ''
            this.checkedRow = {}
            this.$emit('input', this.checked)
            this.$emit('change', this.checked, this.checkedRow)
      },
      rowClick(row, preRow) {
            this.$emit("onChange", row);
      },
      handleSelectionChange(val) {
        this.checked = val;
      },
      select() {
            this.$emit('bdQuanListDataForm', this.checked)
      },
      closeDialog() {
        this.$emit('bdQuanListDisplay', false)
      }
    }
  }
</script>
<style lang="scss" scoped>
.popupSelect-container {
  width: 100%;
  .popupSelect-input {
    width: 100%;
    cursor: pointer;
    >>> input {
      cursor: pointer;
    }
    .el-icon-circle-close {
      display: none;
    }
    &:hover {
      .el-icon-circle-close {
        display: block;
      }
      .el-icon-arrow-down.clearable {
        display: none;
      }
    }
  }
}
>>> .el-dialog__body {
  height: 70vh;
  padding: 0 0 10px !important;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .JNPF-common-search-box {
    margin-bottom: 0;
    .JNPF-common-search-box-right {
      padding: 10px 10px 0 0;
    }
  }
}
</style>
