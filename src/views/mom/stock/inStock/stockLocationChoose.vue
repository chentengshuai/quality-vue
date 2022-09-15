<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="位置名称">
              <el-input v-model="query.locationName" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="位置编码">
              <el-input v-model="query.locationCode" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="位置类型">
              <el-select v-model="query.locationType" placeholder="请选择"
                         clearable>
                <el-option v-for="(item, index) in locationTypeOptions" :key="index"
                           :label="item.fullName" :value="item.id"
                           :disabled="item.disabled"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <template v-if="showAll">
            <el-col :span="6">
              <el-form-item label="上级位置ID">
                <el-input v-model="query.locationParentId" placeholder="请输入" clearable></el-input>
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
        <JNPF-table v-loading="listLoading" :data="list" @sort-change='sortChange' lazy
                    row-key="id" @row-click="rowClick"
                    :load="treeLoad" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column prop="locationName" label="位置名称" width="200" align="left"/>
          <el-table-column prop="locationCode" label="位置编码" width="0" align="left"/>
          <el-table-column prop="locationType" label="位置类型" width="0" align="left"/>
          <el-table-column prop="locationParentId" label="上级位置ID" width="0" align="left"/>
          <el-table-column prop="warehouseName" label="仓库名称" width="0" align="left"/>
          <el-table-column prop="warehouseLocation" label="仓库位置" width="0" align="left"/>
          <el-table-column prop="locationRow" label="排" width="0" align="left"/>
          <el-table-column prop="locationColumn" label="列" width="0" align="left"/>
          <el-table-column prop="locationLayer" label="层" width="0" align="left"/>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
                    @pagination="initData"/>
      </div>
    </div>
    <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh"/>
    <ExportBox v-if="exportBoxVisible" ref="ExportBox" @download="download"/>
  </div>
</template>

<script>
  import request from '@/utils/request'
  import {getDictionaryDataSelector} from '@/api/systemData/dictionary'
  import JNPFForm from './Form'
  import ExportBox from './ExportBox'
  import {previewDataInterface} from '@/api/systemData/dataInterface'

  export default {
    components: {JNPFForm, ExportBox},
    data() {
      return {
        showAll: false,
        query: {
          locationName: undefined,
          locationCode: undefined,
          locationType: undefined,
          locationParentId: undefined,
          warehouseId: undefined,
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
        columnList: [
          {prop: 'locationName', label: '位置名称'},
          {prop: 'locationCode', label: '位置编码'},
          {prop: 'locationType', label: '位置类型'},
          {prop: 'locationParentId', label: '上级位置ID'},
          {prop: 'isStockLocation', label: '存放位置'},
          {prop: 'isConsumeLocation', label: '消耗位置'},
          {prop: 'isCcrapLocation', label: '报废位置'},
          {prop: 'locationRow', label: '排'},
          {prop: 'locationColumn', label: '列'},
          {prop: 'locationLayer', label: '层'},
          {prop: 'statusMom', label: '是否启用'},
        ],
        locationTypeOptions: [],
        locationTypeProps: {"label": "fullName", "value": "id"},
      }
    },
    computed: {},
    created() {
      this.getlocationTypeOptions();
    },
    methods: {
      getlocationTypeOptions() {
        getDictionaryDataSelector('261038518426404101').then(res => {
          this.locationTypeOptions = res.data.list
        })
      },
      sortChange({column, prop, order}) {
        this.listQuery.sort = order == 'ascending' ? 'asc' : 'desc'
        this.listQuery.sidx = !order ? '' : prop
        this.initData()
      },
      init(warehouseId){
        this.query.warehouseId = warehouseId
        this.initData()
      },
      initData() {
        this.listLoading = true;
        let _query = {
          ...this.listQuery,
          ...this.query,
        };
        request({
          url: `/api/project/StockLocation/getList`,
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
        this.listQuery = {
          currentPage: 1,
          pageSize: 20,
          sort: "desc",
          sidx: "",
        }
        this.initData()
      },
      rowClick(row, preRow) {
        this.$emit("onChange", row);
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
      treeLoad(tree, treeNode, resolve) {
        request({
          url: `/api/project/StockLocation/getLazyChildren/${tree.id}`,
          method: "get"
        }).then((res) => {
          resolve(res.data)
        });
      }
    }
  }
</script>
