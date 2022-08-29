<template>
  <el-dialog title="选择发货通知单"
             :close-on-click-modal="false" append-to-body
             :visible.sync="salDeliveryNoticeChooseShow" class="JNPF-dialog JNPF-dialog_center" lock-scroll
             width="1300px">
    <div class="JNPF-common-layout">

      <div class="JNPF-common-layout-center">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="8">
              <el-form-item label="合同号">
                <el-input v-model="query.contractNo" placeholder="请输入合同号查询" clearable
                          @keyup.enter.native="search()"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="规格型号">
                <el-input v-model="query.specification" placeholder="请输入规格型号查询" clearable
                          @keyup.enter.native="search()"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="单据编码">
                <el-input v-model="query.billNo" placeholder="请输入单据编码查询" clearable
                          @keyup.enter.native="search()"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="物料编码">
                <el-input v-model="query.productCode" placeholder="请输入物料编码查询" clearable
                          @keyup.enter.native="search()"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <el-button icon="el-icon-refresh-right" @click="reset()">{{$t('common.reset')}}
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <JNPF-table v-loading="listLoading" :data="list" hasC @selection-change="handleSelectionChange">
            <el-table-column prop="contractNo" label="合同号" width="0" align="left"/>
            <el-table-column prop="billNo" label="单据编码" width="0" align="left"/>
            <el-table-column prop="productCode" label="物料编码" width="0" align="left"/>
            <el-table-column prop="specification" label="规格型号" width="0" align="left"/>
            <el-table-column prop="productLvlName" label="产品等级" width="0" align="left"/>
            <el-table-column prop="productName" label="物料名称" width="0" align="left"/>
            <el-table-column prop="unitName" label="销售单位" width="0" align="left"/>
            <el-table-column prop="qty" label="销售数量" width="0" align="left"/>
            <el-table-column prop="stockName" label="出货仓库" width="0" align="left"/>
            <el-table-column prop="customerName" label="客户" width="0" align="left"/>
            <el-table-column prop="saleDeptName" label="销售部门" width="0" align="left"/>
            <el-table-column prop="saleGroupName" label="销售组" width="0" align="left"/>
            <el-table-column prop="saleManName" label="销售员" width="0" align="left"/>
          </JNPF-table>
          <pagination :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize"
                      @pagination="initData"/>
        </div>
        <span slot="footer" class="dialog-footer" style="background:#ffffff">
          <el-button style="float: right;" @click="closeDialog">{{$t('common.cancelButton')}}</el-button>
          <el-button style="float: right;margin-right: 15px;" type="primary" @click="confirm()">{{$t('common.confirmButton')}}</el-button>
        </span>
      </div>

    </div>
  </el-dialog>
</template>

<script>
  import request from '@/utils/request'
  import ExportBox from './ExportBox'

  export default {
    components: {ExportBox},
    data() {
      return {
        showAll: false,
        salDeliveryNoticeChooseShow: false,
        query: {
          contractNo: undefined,
          billNo: undefined,
          productCode: undefined,
          specification: undefined
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
          pageNo: 1,
          pageSize: 20,
        },
        formVisible: false,
        exportBoxVisible: false,
        checked: '',
      }
    },
    computed: {},
    created() {
    },
    mounted() {
    },
    methods: {
      initData() {

        this.listLoading = true;
        this.salDeliveryNoticeChooseShow = true;
        let _query = {
          ...this.listQuery,
          ...this.query

        };
        request({
          url: `/api/project/stockApi/getSalDeliveryNoticeList`,
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
        this.initData()
        this.listQuery.pageNo = 1
        this.listQuery.pageSize = this.hasPage ? this.pageSize : 20
      },
      reset() {
        this.resetNoInit()
        this.initData()
      },
      closeDialog() {
        this.$emit('closeSalDeliveryNotice')
        this.resetNoInit();
      },
      confirm() {
        this.$emit('selectSalDeliveryNotice', this.checked)
        this.resetNoInit();
        this.$emit('closeSalDeliveryNotice')
      },
      handleSelectionChange(val) {
        this.checked = val;
      },
      resetNoInit() {
        this.checked = '';
        this.query.contractNo = ''
        this.query.billNo = ''
        this.query.productCode = ''
        this.query.specification = ''
        this.listQuery.pageNo = 1
        this.listQuery.pageSize = this.hasPage ? this.pageSize : 20
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

      > > > input {
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

  > > > .el-dialog__body {
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
