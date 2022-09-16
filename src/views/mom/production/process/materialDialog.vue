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
        <el-table v-loading="listLoading" :data="list" ref="table" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="materialName" label="产品名称" width="0" align="left"/>
          <el-table-column prop="materialCode" label="产品编码" width="0" align="left"/>
          <el-table-column prop="typeName" label="类型" width="0" align="left"/>
          <el-table-column prop="materialSpec" label="规格" width="0" align="left"/>
          <el-table-column prop="materialModel" label="型号" width="0" align="left"/>
          <el-table-column prop="materialType" label="物料类型" width="0" align="left"/>
          <el-table-column prop="materialUnit" label="单位" width="0" align="left"/>
          <el-table-column prop="description" label="描述" width="0" align="left"/>
        </el-table>
        <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="initData"/>
      </div>
      <div class="JNPF-common-layout-main JNPF-flex-main" style = "float: right;">
         <span slot="footer" class="dialog-footer" style="text-align: right">
            <el-button type="primary" @click="dataFormSubmit">
              {{ $t('common.confirmButton') }}</el-button>
        </span>
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
      isCheckedList: [],
      checkedList:[],
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
    handleSelectionChange(val) {
      this.checkedList = val
    },
    initData(list) {
      let that = this
      that.listLoading = true;
      that.isCheckedList = list
      let _query = {
        ...that.listQuery,
        ...that.query,
        typeStatus: "2"
      };
      debugger
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
        that.list = _list
        _list.forEach((item) => {
          if(that.isCheckedList != undefined && that.isCheckedList.length > 0){
            that.isCheckedList.forEach((i) => {
              if (item.materialCode == i.materialCode) {
                that.$nextTick(() => {
                  that.$refs.table.toggleRowSelection(item)
                })
              }
            })
          }
        })
        that.total = res.data.pagination.total
        that.listLoading = false
      })
      if (list == undefined) {
        this.$nextTick(() => {
          this.$refs.table.clearSelection()
        })
      }
    },
    dataFormSubmit() {
      let dataList = this.checkedList
      dataList.forEach(data =>{
        data.materialId = data.id
      })
      this.$emit('onChange', dataList)
      this.visible = false
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
