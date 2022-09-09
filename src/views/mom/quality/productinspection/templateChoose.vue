<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="8">
            <el-form-item label="产品模板名称">
              <el-input v-model="query.productTemplateName" placeholder="请输入" clearable
                        @keyup.enter.native="search()"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品模板编码">
              <el-input v-model="query.productTemplateCode" placeholder="请输入" clearable
                        @keyup.enter.native="search()"/>
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
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <JNPF-table v-loading="listLoading" :data="list" @sort-change='sortChange'
                    @row-click="rowClick">
          <el-table-column width="35">
            <template slot-scope="scope">
              <el-radio :label="scope.row.id" v-model="checked">&nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="productTemplateName" label="产品模板名称" width="0" align="left"/>
          <el-table-column prop="productTemplateCode" label="产品模板编码" width="0" align="left"/>
          <el-table-column prop="productCategory" label="产品分类" width="0" align="left">
            <template slot-scope="scope">
              {{ scope.row.productCategory | dynamicText(productCategoryOptions) }}
            </template>
          </el-table-column>
          <el-table-column prop="productType" label="产品类型" width="0" align="left"/>
          <el-table-column prop="materialUnit" label="单位" width="0" align="left"/>
          <el-table-column prop="purchasePrice" label="销售价格" width="0" align="left"/>
          <el-table-column prop="specification" label="规格" width="0" align="left"/>
          <el-table-column prop="uomId" label="计量单位" width="0" align="left"/>
          <el-table-column prop="uomPoId" label="采购计量单位" width="0" align="left"/>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
                    @pagination="initData"/>
      </div>
      <span slot="footer" class="dialog-footer" style="background:#ffffff">
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
          productTemplateName: undefined,
          productTemplateCode: undefined,
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
          currentPage: 1,
          pageSize: 20,
          sort: "desc",
          sidx: "",
        },
        productCategoryOptions: [{"fullName": "半成品", "id": "2"}, {
          "fullName": "成品",
          "id": "3"
        }],
        productCategoryProps: {"label": "fullName", "value": "id"},
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
          ...this.query,
          ...this.listQuery,
          productCategory:3,
        };
        request({
          url: `/api/project/BizQualityInspection/getProductTemplateList`,
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
        for (let key in this.query)
          this.query[key] = undefined
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
      select() {
        //console.warn("this:"+this);
        //this.innerValue = this.checkedTxt
        this.$emit('onChange', this.checked)
        //this.$emit('change', this.checked, this.checkedRow)
        //this.visible = false
      },
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
