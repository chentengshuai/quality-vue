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
            <el-form-item label="类型">
              <el-select
                v-model="query.type"
                placeholder="请选择"
                clearable
                :style="{ width: '100%' }"
                :multiple="false"
              >
                <el-option
                  v-for="(item, index) in typeOptions"
                  :key="index"
                  :label="item.fullname"
                  :value="item.value"
                  :disabled="item.disabled"
                ></el-option>
              </el-select>
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
        <JNPF-table v-loading="listLoading" :data="list" @sort-change='sortChange' @row-click="rowClick">
          <el-table-column prop="materialName" label="产品名称" width="0" align="left"
          />
          <el-table-column prop="materialCode" label="产品编码" width="0" align="left"
          />
          <el-table-column prop="typeName" label="类型" width="0" align="left"
          />
          <el-table-column prop="materialSpec" label="规格" width="0" align="left"
          />
          <el-table-column prop="materialModel" label="型号" width="0" align="left"
          />
          <el-table-column prop="materialType" label="物料类型" width="0" align="left"
          />
          <el-table-column prop="materialUnit" label="单位" width="0" align="left"
          />
          <el-table-column prop="description" label="描述" width="0" align="left"
          />
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="initData"/>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  data() {
    return {
      query: {
        materialName:undefined,
        materialCode:undefined,
        type:undefined,
      },
      treeProps: {
        children: 'children',
        label: 'fullName',
        value: 'id'
      },
      checked: "",
      list: [],
      listLoading: true,
      total: 0,
      listQuery: {
        currentPage: 1,
        pageSize: 20,
        sort: "desc",
        sidx: "",
      },
      typeOptions: [{fullname:"原料",value:1},{fullname:"半成品",value:2}],
    }
  },
  computed: {},
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
        var _list =[];
        for(let i=0;i<res.data.list.length;i++){
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
