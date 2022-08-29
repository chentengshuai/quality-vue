<template>
            <el-dialog title="选择数据"
                       :close-on-click-modal="false" append-to-body
                       :visible.sync="inventoryChooseShow" class="JNPF-dialog JNPF-dialog_center" lock-scroll
                       width="1300px">
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="8">
            <el-form-item label="箱号/批号">
              <el-input v-model="query.lotNumber" placeholder="请输入箱号/批号查询" clearable
                        @keyup.enter.native="search()"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物料名称">
              <el-input v-model="query.productName" placeholder="请输入员工名称查询" clearable
                        @keyup.enter.native="search()"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物料编码">
              <el-input v-model="query.productCode" placeholder="请输入员工编码查询" clearable
                        @keyup.enter.native="search()"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓库名称">
              <el-input v-model="query.warehouseName" placeholder="请输入员工名称查询" clearable
                        @keyup.enter.native="search()"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓库编码">
              <el-input v-model="query.warehouseCode" placeholder="请输入员工编码查询" clearable
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
          <el-table-column prop="productCode" label="物料编码" width="0" align="left"/>
          <el-table-column prop="productName" label="物料名称" width="0" align="left"/>
          <el-table-column prop="productSpc" label="规格型号" width="0" align="left"/>
          <el-table-column prop="qty" label="库存量" width="0" align="left"/>
          <el-table-column prop="warehouseCode" label="仓库编码" width="0" align="left"/>
          <el-table-column prop="warehouseName" label="仓库名称" width="0" align="left"/>
          <el-table-column prop="lotNumber" label="批号" width="0" align="left"/>
          <el-table-column prop="uomName" label="单位" width="0" align="left"/>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize"
                    @pagination="initData"/>
      </div>
      <span slot="footer" class="dialog-footer" style="background:#ffffff">
          <el-button style="float: right;"  @click="closeDialog">{{$t('common.cancelButton')}}</el-button>
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
        inventoryChooseShow:false,
        query: {
          lotNumber: undefined,
          productCode: undefined,
          productName: undefined,
          warehouseCode: undefined,
          warehouseName: undefined,
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
    created() {},
    mounted() {},
    methods: {
      initData() {

        this.listLoading = true;
        this.inventoryChooseShow = true;
        let _query = {
          ...this.listQuery,
          ...this.query

        };
        request({
          url: `/api/project/stockApi/getStkInventoryDetailList`,
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
        this.$emit('bdQuanListDisplay')
        this.resetNoInit();
      },
      confirm() {
        this.$emit('bdQuanListDataForm', this.checked)
        this.resetNoInit();
        this.$emit('bdQuanListDisplay')
      },
      handleSelectionChange(val) {
        this.checked = val;
      },
      resetNoInit(){
        this.checked = '';
        this.query.lotNumber = ''
        this.query.productCode = ''
        this.query.productName = ''
        this.query.warehouseCode = ''
        this.query.warehouseName = ''
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
