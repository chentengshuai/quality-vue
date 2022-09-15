<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
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
              <el-input v-model="query.wareHouseName" placeholder="请输入仓库名称查询" clearable
                        @keyup.enter.native="search()"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓库编码">
              <el-input v-model="query.wareHouseCode" placeholder="请输入仓库编码查询" clearable
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
        <JNPF-table v-loading="listLoading" :data="list"
                    @row-click="rowClick">
          <el-table-column prop="productCode" label="物料编码" width="0" align="left"/>
          <el-table-column prop="productName" label="物料名称" width="0" align="left"/>
          <el-table-column prop="specification" label="规格型号" width="0" align="left"/>
          <el-table-column prop="wareHouseCode" label="仓库编码" width="0" align="left"/>
          <el-table-column prop="wareHouseName" label="仓库名称" width="0" align="left"/>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize"
                    @pagination="initData"/>
      </div>
      <span slot="footer" class="dialog-footer" style="background:#ffffff">
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
          productCode: undefined,
          productName: undefined,
          wareHouseCode: undefined,
          wareHouseName: undefined,
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
        exportBoxVisible: false
      }
    },
    computed: {},
    created() {},
    mounted() {},
    methods: {
      initData() {
        this.listLoading = true;
        let _query = {
          ...this.listQuery,
          ...this.query
        };
        request({
          url: `/api/project/stockApi/getMaterialList`,
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
        this.resetNoInit();
        this.initData()
      },
      rowClick(row, preRow) {
        this.$emit("returnMaterialInfo", row);
        this.resetNoInit();
      },
      resetNoInit(){
        this.query.productCode = ''
        this.query.productName = ''
        this.query.wareHouseCode = ''
        this.query.wareHouseName = ''
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
