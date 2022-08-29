<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="业务伙伴编码">
              <el-input v-model="query.partnerCode" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="业务伙伴类型">
              <el-input v-model="query.partnerType" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="业务伙伴名称">
              <el-input v-model="query.partnerName" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <template v-if="showAll">
            <el-col :span="6">
              <el-form-item label="业务伙伴简称">
                <el-input v-model="query.partnerShortName" placeholder="请输入" clearable></el-input>
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
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="供应商编号">
              <el-input v-model="supplierNoInput" placeholder="请输入" clearable></el-input>
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
          <el-table-column prop="partnerCode" label="业务伙伴编码" width="0" align="left"
          />
          <el-table-column prop="partnerType" label="业务伙伴类型" width="0" align="left"
          />
          <el-table-column prop="partnerName" label="业务伙伴名称" width="0" align="left"
          />
          <el-table-column prop="partnerShortName" label="业务伙伴简称" width="0" align="left"
          />
          <el-table-column prop="tel" label="联系电话" width="0" align="left"
          />
          <el-table-column prop="fax" label="传真" width="0" align="left"
          />
          <el-table-column prop="country" label="国家/地区" width="0" align="left"
          />
          <el-table-column prop="province" label="省/州" width="0" align="left"
          />
          <el-table-column prop="city" label="城市" width="0" align="left"
          />
          <el-table-column prop="regional" label="区" width="0" align="left"
          />
          <el-table-column prop="addr" label="地址" width="0" align="left"
          />
          <el-table-column prop="taxCode" label="统一社会信用代码" width="0" align="left"
          />
          <el-table-column prop="invoiceTitle" label="发票抬头" width="0" align="left"
          />
          <el-table-column prop="bankName" label="开户银行" width="0" align="left"
          />
          <el-table-column prop="bankAccountName" label="银行户名" width="0" align="left"
          />
          <el-table-column prop="bankAccountNumber" label="银行账号" width="0" align="left"
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
  import {previewDataInterface} from '@/api/systemData/dataInterface'
  import ImportForm from './ImportForm'

  export default {
    components: {JNPFForm, ExportBox, ImportForm},
    data() {
      return {
        showAll: false,
        query: {
          partnerCode: undefined,
          partnerType: undefined,
          partnerName: undefined,
          partnerShortName: undefined,
          isSupplier: true
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
        supplierNoInput: null,
        formVisible: false,
        exportBoxVisible: false,
        importFormVisible: false,
        columnList: [
          {prop: 'partnerCode', label: '业务伙伴编码'},
          {prop: 'partnerType', label: '业务伙伴类型'},
          {prop: 'partnerName', label: '业务伙伴名称'},
          {prop: 'partnerShortName', label: '业务伙伴简称'},
          {prop: 'isSupplier', label: '是否供应商'},
          {prop: 'isCustomer', label: '是否客户'},
          {prop: 'isPersonal', label: '是否个人'},
          {prop: 'tel', label: '联系电话'},
          {prop: 'fax', label: '传真'},
          {prop: 'country', label: '国家/地区'},
          {prop: 'province', label: '省/州'},
          {prop: 'city', label: '城市'},
          {prop: 'regional', label: '区'},
          {prop: 'addr', label: '地址'},
          {prop: 'taxCode', label: '统一社会信用代码'},
          {prop: 'invoiceTitle', label: '发票抬头'},
          {prop: 'bankName', label: '开户银行'},
          {prop: 'bankAccountName', label: '银行户名'},
          {prop: 'bankAccountNumber', label: '银行账号'},
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
          url: `/api/project/Partner/getList`,
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
            url: `/api/project/Partner/${id}`,
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
      importFromERP() {
        request({
          url: `/api/project/Partner/importSupplierFromERP`,
          method: 'post',
          params: {
            supplierNo: this.supplierNoInput
          }
        }).then(res => {
          this.$message.success("导入成功");
          this.initData();
        })
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
          url: `/api/project/Partner/Actions/Export`,
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
