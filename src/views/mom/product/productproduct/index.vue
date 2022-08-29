<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="产品模板ID">
              <el-input v-model="query.productTemplateId" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="产品名称">
              <el-input v-model="query.productName" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="产品编码">
              <el-input v-model="query.productCode" placeholder="请输入" clearable></el-input>
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
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="物料编号">
              <el-input v-model="productCodeInput" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="importFromERP()">ERP导入</el-button>
              <el-button icon="el-icon-refresh-right" @click="uploadForm()">ERP EXCEL导入</el-button>
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
        <JNPF-table v-loading="listLoading" :data="list" @sort-change='sortChange'>
          <el-table-column prop="productTemplateId" label="产品模板ID" width="0" align="left"
          />
          <el-table-column prop="productName" label="产品名称" width="0" align="left"
          />
          <el-table-column prop="productCode" label="产品编码" width="0" align="left"
          />
          <el-table-column prop="purchasePrice" label="销售价格" width="0" align="left"
          />
          <el-table-column prop="specification" label="规格" width="0" align="left"
          />
          <el-table-column prop="model" label="型号" width="0" align="left"
          />
          <el-table-column prop="volume" label="体积" width="0" align="left"
          />
          <el-table-column prop="weight" label="重量" width="0" align="left"
          />
<!--          <el-table-column prop="status" label="是否启用" width="0" align="left"-->
<!--          />-->
          <el-table-column prop="status" label="是否启用" width="0" align="left">
            <template slot-scope="scope">
              <el-switch
                disabled
                v-model="scope.row.status"
                :active-value=1
                :inactive-value=0>
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
    <ImportForm v-if="importFormVisible" ref="importForm" @refresh="reset()"/>
  </div>
</template>

<script>
  import request from '@/utils/request'
  import {getDictionaryDataSelector} from '@/api/systemData/dictionary'
  import JNPFForm from './Form'
  import ExportBox from './ExportBox'
  import {previewDataInterface} from '@/api/systemData/dataInterface'
  import ImportForm from './ImportForm'

  export default {
    components: {JNPFForm, ExportBox, ImportForm},
    data() {
      return {
        query: {
          productTemplateId: undefined,
          productName: undefined,
          productCode: undefined,
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
        importFormVisible: false,
        productCodeInput: null,
        columnList: [
          {prop: 'productTemplateId', label: '产品模板ID'},
          {prop: 'productName', label: '产品名称'},
          {prop: 'productCode', label: '产品编码'},
          {prop: 'purchasePrice', label: '销售价格'},
          {prop: 'specification', label: '规格'},
          {prop: 'model', label: '型号'},
          {prop: 'volume', label: '体积'},
          {prop: 'weight', label: '重量'},
          {prop: 'status', label: '是否启用'},
        ],
      }
    },
    computed: {},
    created() {
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
          url: `/api/project/ProductProduct/getList`,
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
            url: `/api/project/ProductProduct/${id}`,
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
      importFromERP() {
        request({
          url: `/api/project/ProductProduct/importFromERP`,
          method: 'post',
          params: {
            productCode: this.productCodeInput
          }
        }).then(res => {
          this.$message.success("导入成功");
          this.initData();
        })
      },
      download(data) {
        let query = {...data, ...this.listQuery, ...this.query}
        request({
          url: `/api/project/ProductProduct/Actions/Export`,
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
      uploadForm() {
        this.importFormVisible = true
        this.$nextTick(() => {
          this.$refs.importForm.init()
        })
      }
    }
  }
</script>
