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
              <el-input v-model="query.materialCode" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="检验结果">
              <el-select
                v-model="query.result"
                placeholder="请选择"
                clearable
                :style="{ width: '100%' }"
                :multiple="false"
              >
                <el-option
                  v-for="(item, index) in resultOptions"
                  :key="index"
                  :label="item.fullName"
                  :value="item.id"
                  :disabled="item.disabled"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <template v-if="showAll">
            <el-col :span="6">
              <el-form-item label="检验时间">
                <el-date-picker v-model="query.inspectTime" type="daterange"
                                value-format="timestamp" format="yyyy-MM-dd" start-placeholder="开始日期"
                                end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="检验员">
                <el-input v-model="query.inspectorId" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="送检人">
                <el-input v-model="query.submitterId" placeholder="请输入" clearable></el-input>
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
        <JNPF-table v-loading="listLoading" :data="list" @sort-change='sortChange'>
          <el-table-column prop="materialName" label="物料名称" width="0" align="left"/>
          <el-table-column prop="materialCode" label="物料编码" width="0" align="left"/>
          <el-table-column prop="relationName" label="采购订单号" width="0" align="left"/>
          <el-table-column prop="materialNumber" label="货品数量" width="0" align="left"/>
          <el-table-column prop="sampleNumber" label="抽样数" width="0" align="left"/>
          <el-table-column prop="badNumber" label="不良数" width="0" align="left"/>
          <el-table-column prop="badPercent" label="不良率" width="0" align="left"/>
          <el-table-column prop="result" label="检验结果" width="0" align="left"/>
          <el-table-column prop="submitterName" label="送检人" width="0" align="left"/>
          <el-table-column prop="inspectorName" label="检验员" width="0" align="left"/>
          <el-table-column prop="inspectTime" label="检验时间" width="0" align="left"/>
          <el-table-column prop="remark" label="备注" width="0" align="left"/>
          <el-table-column label="操作" fixed="right"
                           width="120">
            <template slot-scope="scope">
              <el-button type="text"
                         @click="examineHandle(scope.row.id)">查看
              </el-button>
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
    <ShowForm v-if="showFormVisible" ref="ShowForm"/>
    <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh"/>
    <ExportBox v-if="exportBoxVisible" ref="ExportBox" @download="download"/>
  </div>
</template>

<script>
import request from '@/utils/request'
import {getDictionaryDataSelector} from '@/api/systemData/dictionary'
import JNPFForm from './Form'
import ShowForm from './ShowForm'
import ExportBox from './ExportBox'
import {previewDataInterface} from '@/api/systemData/dataInterface'

export default {
  components: {JNPFForm, ExportBox, ShowForm},
  data() {
    return {
      showAll: false,
      query: {
        materialName: undefined,
        result: undefined,
        inspectTime: undefined,
        inspectorId: undefined,
        submitterId: undefined,
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
      showFormVisible: false,
      formVisible: false,
      exportBoxVisible: false,
      columnList: [
        {prop: 'materialName', label: '物料名称'},
        {prop: 'materialNumber', label: '货品数量'},
        {prop: 'sampleNumber', label: '抽样数'},
        {prop: 'badNumber', label: '不良数'},
        {prop: 'badPercent', label: '不良率'},
        {prop: 'result', label: '检验结果'},
        {prop: 'submitterId', label: '送检人'},
        {prop: 'inspectorId', label: '检验员'},
        {prop: 'inspectTime', label: '检验时间'},
        {prop: 'remark', label: '备注'},
      ],
      resultOptions: [{"fullName": "合格", "id": 1}, {"fullName": "不合格", "id": 2}],
      resultProps: {"label": "fullName", "value": "id"},
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
        ...this.query,
        inspectionType: 1,
      };
      request({
        url: `/api/project/BizQualityInspection/getList`,
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
          url: `/api/project/BizQualityInspection/${id}`,
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
        url: `/api/project/BizQualityInspection/Actions/Export`,
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
    examineHandle(id) {
      this.showFormVisible = true
      this.$nextTick(() => {
        this.$refs.ShowForm.init(id)
      })
    },
  }
}
</script>
