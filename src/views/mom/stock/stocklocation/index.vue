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
        <div class="JNPF-common-head">
          <div>
            <el-button type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()">新增
            </el-button>
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" content="刷新" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                       @click="reset()"/>
            </el-tooltip>
            <screenfull isContainer/>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="list" @sort-change='sortChange' lazy
                    row-key="id"
                    :load="treeLoad" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">

          <el-table-column prop="locationName" label="位置名称" width="200" align="left"
          />
          <el-table-column prop="locationCode" label="位置编码" width="0" align="left"
          />
          <el-table-column prop="locationType" label="位置类型" width="0" align="left"
          />
          <el-table-column prop="locationParentId" label="上级位置ID" width="0" align="left"
          />
          <el-table-column prop="warehouseName" label="仓库名称" width="0" align="left"
          />
          <el-table-column prop="warehouseLocation" label="仓库位置" width="0" align="left"
          />
          <el-table-column prop="isStockLocation" label="存放位置" width="0" align="left">
            <template slot-scope="scope">
              <el-switch
                disabled
                v-model="scope.row.isStockLocation"
                :active-value="1"
                :inactive-value="0">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="isConsumeLocation" label="消耗位置" width="0" align="left">
            <template slot-scope="scope">
              <el-switch
                disabled
                v-model="scope.row.isConsumeLocation"
                :active-value="1"
                :inactive-value="0">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="isScrapLocation" label="报废位置" width="0" align="left">
            <template slot-scope="scope">
              <el-switch
                disabled
                v-model="scope.row.isScrapLocation"
                :active-value="1"
                :inactive-value="0">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="locationRow" label="排" width="0" align="left"
          />
          <el-table-column prop="locationColumn" label="列" width="0" align="left"
          />
          <el-table-column prop="locationLayer" label="层" width="0" align="left"
          />
          <el-table-column prop="statusMom" label="是否启用" width="0" align="left">
            <template slot-scope="scope">
              <el-switch
                disabled
                v-model="scope.row.statusMom"
                :active-value="1"
                :inactive-value="0">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right"
                           width="100">
            <template slot-scope="scope">
              <el-button type="text"
                         @click="addOrUpdateHandle(scope.row.id)">编辑
              </el-button>
              <el-button type="text" class="JNPF-table-delBtn" @click="handleDel(scope.row.id)">删除
              </el-button>
            </template>
          </el-table-column>
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
      this.initData()
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
      initData() {
        this.listLoading = true;
        let _query = {
          ...this.listQuery,
          ...this.query
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
      handleDel(id) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          request({
            url: `/api/project/StockLocation/${id}`,
            method: 'DELETE'
          }).then(res => {
            this.$message({
              type: 'success',
              message: res.msg,
              onClose: () => {
                this.initData()
              }
            });
          })
        }).catch(() => {
        });
      },
      addOrUpdateHandle(id, isDetail) {
        this.formVisible = true
        this.$nextTick(() => {
          this.$refs.JNPFForm.init(id, isDetail)
        })
      },
      exportData() {
        this.exportBoxVisible = true
        this.$nextTick(() => {
          this.$refs.ExportBox.init(this.columnList)
        })
      },
      download(data) {
        let query = {...data, ...this.listQuery, ...this.query}
        request({
          url: `/api/project/StockLocation/Actions/Export`,
          method: 'GET',
          data: query
        }).then(res => {
          if (!res.data.url) return
          window.location.href = this.define.comUrl + res.data.url
          this.$refs.ExportBox.visible = false
          this.exportBoxVisible = false
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
