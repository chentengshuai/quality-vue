<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
              <el-form-item label="产品名称">
                  <el-input v-model="query.materialName" placeholder="请输入" clearable>  </el-input>
              </el-form-item>
          </el-col>
          <el-col :span="6">
              <el-form-item label="产品编码">
                      <el-input v-model="query.materialCode" placeholder="请输入" clearable>  </el-input>
              </el-form-item>
          </el-col>
          <el-col :span="6">
              <el-form-item label="追溯时间区间">
                      <el-date-picker v-model="query.inspectTime" type="daterange"
                                      value-format="timestamp" format="yyyy-MM-dd" start-placeholder="开始日期"
                                      end-placeholder="结束日期" >
                      </el-date-picker>
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
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" content="刷新" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                       @click="reset()"/>
            </el-tooltip>
            <screenfull isContainer/>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="list" @sort-change='sortChange'>
          <el-table-column prop="materialName" label="产品名称" width="0" align="left"/>
          <el-table-column prop="materialCode" label="产品编码" width="0" align="left"/>
          <el-table-column prop="typeName" label="类型" width="0" align="left"/>
          <el-table-column prop="materialSpec" label="规格" width="0" align="left"/>
          <el-table-column prop="materialModel" label="型号" width="0" align="left"/>
          <el-table-column prop="materialType" label="物料类型" width="0" align="left"/>
          <el-table-column prop="materialUnit" label="单位" width="0" align="left"/>
          <el-table-column prop="status" label="是否启用" width="0" align="left"/>
          <el-table-column prop="description" label="描述" width="0" align="left"/>
          <el-table-column label="操作" fixed="right"
                           width="100">
            <template slot-scope="scope">
              <el-button type="text"
                         @click="addOrUpdateHandle(query.inspectTime,scope.row.materialName,scope.row.materialCode)">产品追溯
              </el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
                    @pagination="initData"/>
      </div>
    </div>
    <FlowFormDialog v-if="flowFormVisible" ref="FlowFormDialog" @refresh="refresh"/>
  </div>
</template>

<script>
import request from '@/utils/request'
import {getDictionaryDataSelector} from '@/api/systemData/dictionary'
import FlowFormDialog from './FlowFormDialog'
import {previewDataInterface} from '@/api/systemData/dataInterface'

export default {
  components: { FlowFormDialog },
  data() {
    return {
      showAll: false,
      query: {
          materialName:undefined,
          materialCode:undefined,
          inspectTime:undefined,
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
      flowFormVisible: false,
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
        url: `/api/project/Material/getList`,
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
    addOrUpdateHandle(inspectTime,materialName,materialCode) {
      this.flowFormVisible = true
      this.$nextTick(() => {
        this.$refs.FlowFormDialog.init(inspectTime,materialName,materialCode)
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
    }
  }
}
</script>
