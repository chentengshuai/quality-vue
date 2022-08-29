<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
          <el-row class="JNPF-common-search-box" :gutter="16">
            <el-form @submit.native.prevent>
              <el-col :span="8">
                <el-form-item label="箱号">
                  <el-input v-model="query.boxNum" placeholder="请输入箱号查询" clearable
                    @keyup.enter.native="search()" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="客户">
                  <el-input v-model="query.clientName" placeholder="请输入名称" clearable
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
          <el-table-column prop="boxNum" label="箱号" width="0" align="left" />
          <el-table-column prop="packingTime" label="装箱日期" width="0" align="left" />
          <el-table-column prop="clientName" label="客户" width="0" align="left" />
          <el-table-column prop="productCode" label="物料编码" width="0" align="left" />
          <el-table-column prop="contractNo" label="合同号" width="0" align="left" />
          <el-table-column prop="size" label="规格型号" width="0" align="left" />
          <el-table-column prop="productGradeName" label="产品等级" width="0" align="left" />
          <el-table-column prop="paperTubeWeight" label="纸管重量" width="0" align="left" />
          <el-table-column prop="boxWeight" label="箱重" width="0" align="left" />
          <el-table-column prop="weighTotal" label="称重合计" width="0" align="left" />
          <el-table-column prop="totalNetWeight" label="净重合计" width="0" align="left" />
          <el-table-column prop="totalGrossWeight" label="毛重合计" width="0" align="left" />
          <el-table-column prop="producerName" label="装箱人员" width="0" align="left" />
          <el-table-column prop="frp" label="FRP管重量" width="0" align="left" />
          <el-table-column prop="workShopCode" label="生产车间编码" width="0" align="left" />
          <el-table-column prop="workShopName" label="生产车间名称" width="0" align="left" />
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
  import ExportBox from './ExportBox'

  export default {
    components: {ExportBox},
    data() {
      return {
        showAll: false,
        query: {
          noticeNum: undefined,
          inspectorId: undefined,
          boxNum: "",
          clientName: "",
        },
        treeProps: {
          children: 'children',
          label: 'fullName',
          value: 'id'
        },
        list: [],
        listLoading: true,
        total: 0,
        checked: [],
        checkedTxt: '',
        checkedRow: {},
        listQuery: {
          currentPage: 1,
          pageSize: 20,
          sort: "desc",
          sidx: "",
        },
        formVisible: false,
        exportBoxVisible: false,
        columnList: [
          {prop: 'boxNum', label: '箱号'},
          {prop: 'packingTime', label: '装箱日期'},
          {prop: 'clientName', label: '客户'},
          {prop: 'productCode', label: '物料编码'},
          {prop: 'contractNo', label: '合同号'},
          {prop: 'size', label: '规格型号'},
          {prop: 'paperTubeWeight', label: '纸管重量'},
          {prop: 'boxWeight', label: '箱重'},
          {prop: 'weighTotal', label: '称重合计'},
          {prop: 'totalNetWeight', label: '净重合计'},
          {prop: 'totalGrossWeight', label: '毛重合计'},
          {prop: 'producerName', label: '装箱人员'},
          {prop: 'workShopCode', label: '生产车间编码'},
          {prop: 'workShopName', label: '生产车间名称'},
          {prop: 'frp', label: 'FRP管'},
          {prop: 'productGradeName', label: '产品等级'},
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
          ...this.query
        };
        request({
          url: `/api/InStock/BizStockMove/selectBdBoxList`,
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
        this.listQuery.boxNum = ''
        this.listQuery.clientName = ''
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
        this.$emit('bdBoxListDataForm', this.checked)
      },
      closeDialog() {
        this.$emit('bdBoxListDisplay', false)
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
