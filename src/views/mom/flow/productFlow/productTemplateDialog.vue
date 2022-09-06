<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="产品模板编码">
              <el-input v-model="query.productTemplateCode" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="产品模板名称">
              <el-input v-model="query.productTemplateName" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="产品分类">
              <el-select v-model="query.productCategory" placeholder="请选择"
                         clearable>
                <el-option v-for="(item, index) in productCategoryOptions" :key="index"
                           :label="item.fullName" :value="item.id"
                           :disabled="item.disabled"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <template v-if="showAll">
            <el-col :span="6">
              <el-form-item label="产品类型">
                <el-select v-model="query.productType" placeholder="请选择"
                           clearable>
                  <el-option v-for="(item, index) in productTypeOptions" :key="index"
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
        <JNPF-table v-loading="listLoading" :data="list" @sort-change='sortChange' @row-click="rowClick">
          <el-table-column prop="productTemplateName" label="产品模板名称" width="0" align="left"/>
          <el-table-column prop="productTemplateCode" label="产品模板编码" width="0" align="left"/>
          <el-table-column prop="productCategory" label="产品分类" width="0" align="left">
            <template slot-scope="scope">
              {{ scope.row.productCategory | dynamicText(productCategoryOptions) }}
            </template>
          </el-table-column>
          <el-table-column prop="productType" label="产品类型" width="0" align="left"/>
          <el-table-column prop="purchasePrice" label="销售价格" width="0" align="left"/>
          <el-table-column prop="specification" label="规格" width="0" align="left"/>
          <el-table-column prop="uomId" label="计量单位" width="0" align="left"/>
          <el-table-column prop="uomPoId" label="采购计量单位" width="0" align="left"/>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
                    @pagination="initData"/>
      </div>
    </div>
  </div>
</template>

<script>
  import request from '@/utils/request'
  import {getDictionaryDataSelector} from '@/api/systemData/dictionary'
  import {previewDataInterface} from '@/api/systemData/dataInterface'

  export default {
    components: { },
    data() {
      return {
        showAll: false,
        query: {
          productTemplateName: undefined,
          productTemplateCode: undefined,
          productCategory: undefined,
          serviceType: undefined,
          trackingType: undefined,
          productType: undefined,
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
        columnList: [
          {prop: 'productTemplateName', label: '产品模板名称'},
          {prop: 'productTemplateCode', label: '产品模板编码'},
          {prop: 'productCategory', label: '产品分类'},
          {prop: 'productType', label: '产品类型'},
          {prop: 'serviceType', label: '服务类型'},
          {prop: 'trackingType', label: '追溯类型'},
          {prop: 'purchasable', label: '可采购'},
          {prop: 'salable', label: '可销售'},
          {prop: 'descriptionPurchase', label: '采购说明'},
          {prop: 'descriptionSale', label: '销售说明'},
          {prop: 'purchasePrice', label: '销售价格'},
          {prop: 'specification', label: '规格'},
          {prop: 'uomId', label: '计量单位'},
          {prop: 'uomPoId', label: '采购计量单位'},
        ],
        productCategoryOptions: [{"fullName": "半成品", "id": "1"}, {
          "fullName": "成品",
          "id": "2"
        }],
        productCategoryProps: {"label": "fullName", "value": "id"},
        productTypeOptions: [],
        productTypeProps: {"label": "fullName", "value": "id"},
        serviceTypeOptions: [{"fullName": "采购", "id": "0"}, {"fullName": "生产", "id": "1"}],
        serviceTypeProps: {"label": "fullName", "value": "id"},
        trackingTypeOptions: [{"fullName": "按唯一序列号", "id": "0"}, {"fullName": "按批次", "id": "1"}, {
          "fullName": "不追溯",
          "id": "2"
        }],
        trackingTypeProps: {"label": "fullName", "value": "id"},
      }
    },
    computed: {},
    created() {
      this.initData()
      this.getproductTypeOptions();
    },
    methods: {
      getproductTypeOptions() {
        getDictionaryDataSelector('261038218101654789').then(res => {
          this.productTypeOptions = res.data.list
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
          url: `/api/project/ProductTemplate/getList`,
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
      rowClick(row, preRow) {
        this.$emit("onChange", row);
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
      }
    }
  }
</script>
