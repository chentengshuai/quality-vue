<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="客户名称">
              <el-input v-model="query.customerName" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户编码">
              <el-input v-model="query.customerNumber" placeholder="请输入" clearable></el-input>
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
            <el-form-item label="客户编号">
              <el-input v-model="customerNoInput" placeholder="请输入" clearable></el-input>
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
          <el-table-column prop="customerId" label="客户ERP ID" width="0" align="left"
          />
          <el-table-column prop="customerName" label="客户名称" width="0" align="left"
          />
          <el-table-column prop="customerNumber" label="客户编码" width="0" align="left"
          />
          <el-table-column prop="createOrg" label="创建组织" width="0" align="left"
          />
          <el-table-column prop="useOrg" label="使用组织" width="0" align="left"
          />
          <el-table-column prop="countryName" label="国家" width="0" align="left"
          />
          <el-table-column prop="provincialName" label="地区" width="0" align="left"
          />
          <el-table-column prop="address" label="地址" width="0" align="left"
          />
          <el-table-column prop="invoiceTitle" label="发票抬头" width="0" align="left"
          />
          <el-table-column prop="taxRegisterCode" label="纳税登记号" width="0" align="left"
          />
          <el-table-column prop="custType" label="客户类别" width="0" align="left"
          />
          <el-table-column prop="groupName" label="客户分组" width="0" align="left"
          />
          <el-table-column prop="tradingCurr" label="结算币别" width="0" align="left"
          />
          <el-table-column prop="recCondition" label="收款条件" width="0" align="left"
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
  import JNPFForm from './Form'
  import ExportBox from './ExportBox'
  import ImportForm from './ImportForm'

  export default {
    components: {JNPFForm, ExportBox, ImportForm},
    data() {
      return {
        query: {
          customerName: undefined,
          customerNumber: undefined,
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
        customerNoInput: null,
        importFormVisible: false,
        columnList: [
          {prop: 'customerId', label: '客户ERP ID'},
          {prop: 'customerName', label: '客户名称'},
          {prop: 'customerNumber', label: '客户编码'},
          {prop: 'createOrg', label: '创建组织'},
          {prop: 'useOrg', label: '使用组织'},
          {prop: 'countryName', label: '国家'},
          {prop: 'provincialName', label: '地区'},
          {prop: 'address', label: '地址'},
          {prop: 'invoiceTitle', label: '发票抬头'},
          {prop: 'taxRegisterCode', label: '纳税登记号'},
          {prop: 'custType', label: '客户类别'},
          {prop: 'groupName', label: '客户分组'},
          {prop: 'tradingCurr', label: '结算币别'},
          {prop: 'recCondition', label: '收款条件'},
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
          url: `/api/project/Mom_customer/getList`,
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
          url: `/api/project/Mom_customer/importFromERP`,
          method: 'post',
          params: {
            custNo: this.customerNoInput
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
            url: `/api/project/Mom_customer/${id}`,
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
          url: `/api/project/Mom_customer/Actions/Export`,
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
