<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="物料名称">
              <el-input v-model="query.materialName" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="物料编码">
              <el-input v-model="query.materialNumber" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="数据状态">
              <el-input v-model="query.documentStatus" placeholder="请输入" clearable></el-input>
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
              <el-input v-model="materialNumberInput" placeholder="请输入" clearable></el-input>
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
            <el-button type="text" icon="el-icon-download" @click="exportData()">导出
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
          <el-table-column prop="materialName" label="物料名称" width="0" align="left"
          />
          <el-table-column prop="materialNumber" label="物料编码" width="0" align="left"
          />
          <el-table-column prop="baseUnit" label="基本单位" width="0" align="left"
          />
          <el-table-column prop="documentStatus" label="数据状态" width="0" align="left"
          />
          <el-table-column prop="erpClsId" label="物料属性" width="0" align="left"
          />
          <el-table-column prop="materialDesc" label="物料描述" width="0" align="left"
          />
          <el-table-column prop="materialSrc" label="物料来源" width="0" align="left"
          />
          <el-table-column prop="specification" label="规格型号" width="0" align="left"
          />
          <el-table-column prop="stockName" label="仓库名称" width="0" align="left"
          />
          <el-table-column prop="taxRateName" label="税率名称" width="0" align="left"
          />
          <el-table-column prop="taxTypeName" label="税率分类名称" width="0" align="left"
          />
          <el-table-column prop="categoryName" label="存货类型名称" width="0" align="left"
          />
          <el-table-column prop="createDate" label="创建日期" width="0" align="left"
          />
          <el-table-column prop="createOrg" label="创建组织" width="0" align="left"
          />
          <el-table-column prop="createUser" label="创建用户" width="0" align="left"
          />
          <el-table-column prop="materialGroup" label="物料分组" width="0" align="left"
          />
          <el-table-column prop="materialId" label="ERP ID" width="0" align="left"
          />
          <el-table-column prop="modifyDate" label="修改日期" width="0" align="left"
          />
          <el-table-column prop="modifyUser" label="修改用户" width="0" align="left"
          />
          <el-table-column prop="oldNumber" label="旧编码" width="0" align="left"
          />
          <el-table-column prop="useOrg" label="使用组织" width="0" align="left"
          />
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
  import ImportForm from './ImportForm'
  import {previewDataInterface} from '@/api/systemData/dataInterface'

  export default {
    components: {JNPFForm, ExportBox, ImportForm},
    data() {
      return {
        query: {
          materialName: undefined,
          materialNumber: undefined,
          documentStatus: undefined,
        },
        treeProps: {
          children: 'children',
          label: 'fullName',
          value: 'id'
        },
        list: [],
        listLoading: true,
        total: 0,
        materialNumberInput: null,
        listQuery: {
          currentPage: 1,
          pageSize: 20,
          sort: "desc",
          sidx: "",
        },
        formVisible: false,
        exportBoxVisible: false,
        importFormVisible: false,
        columnList: [
          {prop: 'materialName', label: '物料名称'},
          {prop: 'materialNumber', label: '物料编码'},
          {prop: 'baseUnit', label: '基本单位'},
          {prop: 'documentStatus', label: '数据状态'},
          {prop: 'erpClsId', label: '物料属性'},
          {prop: 'materialDesc', label: '物料描述'},
          {prop: 'materialSrc', label: '物料来源'},
          {prop: 'specification', label: '规格型号'},
          {prop: 'stockName', label: '仓库名称'},
          {prop: 'taxRateName', label: '税率名称'},
          {prop: 'taxTypeName', label: '税率分类名称'},
          {prop: 'categoryName', label: '存货类型名称'},
          {prop: 'createDate', label: '创建日期'},
          {prop: 'createOrg', label: '创建组织'},
          {prop: 'createUser', label: '创建用户'},
          {prop: 'materialGroup', label: '物料分组'},
          {prop: 'materialId', label: 'ERP ID'},
          {prop: 'modifyDate', label: '修改日期'},
          {prop: 'modifyUser', label: '修改用户'},
          {prop: 'oldNumber', label: '旧编码'},
          {prop: 'useOrg', label: '使用组织'},
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
          url: `/api/project/Mom_material/getList`,
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
      importFromERP() {
        request({
          url: `/api/project/Mom_material/importFromERP`,
          method: 'post',
          params: {
            materialNum: this.materialNumberInput
          }
        }).then(res => {
          this.$message.success("导入成功");
          this.initData();
        })
      },
      handleDel(id) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          request({
            url: `/api/project/Mom_material/${id}`,
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
          url: `/api/project/Mom_material/Actions/Export`,
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
