<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="描述">
              <el-input v-model="query.description"
                placeholder="请输入" clearable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="生产工序名称">
              <el-input v-model="query.productionProcessName"
                placeholder="请输入" clearable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="生产工序编码">
              <el-input v-model="query.productionProcessCode"
                placeholder="请输入" clearable>
              </el-input>
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
        <el-table v-loading="listLoading" :data="list" @sort-change="sortChange" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="productionProcessName" label="生产工序名称" width="0" align="left" />
          <el-table-column prop="productionProcessCode" label="生产工序编码" width="0" align="left" />
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
import request from "@/utils/request";
import {getDictionaryDataSelector} from "@/api/systemData/dictionary";
import JNPFForm from "./Form";
import ExportBox from "./ExportBox";
import {previewDataInterface} from "@/api/systemData/dataInterface";

export default {
  components: {JNPFForm, ExportBox},
  data() {
    return {
      query: {
        description: undefined,
        productionProcessName: undefined,
        productionProcessCode: undefined,
      },
      treeProps: {
        children: "children",
        label: "fullName",
        value: "id",
      },
      list: [],
      checkedList:[],
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
        {prop: "productionProcessName", label: "生产工序名称"},
        {prop: "productionProcessCode", label: "生产工序编码"},
        {prop: "description", label: "描述"},
      ],
    };
  },
  computed: {},
  created() {
    this.initData();
  },
  methods: {
    sortChange({column, prop, order}) {
      this.listQuery.sort = order == "ascending" ? "asc" : "desc";
      this.listQuery.sidx = !order ? "" : prop;
      this.initData();
    },
    handleSelectionChange(val) {
      this.checkedList = val
    },
    initData() {
      this.listLoading = true;
      let _query = {
        ...this.listQuery,
        ...this.query,
      };
      request({
        url: `/api/project/BdProductionProcess/getList`,
        method: "post",
        data: _query,
      }).then((res) => {
        var _list = [];
        for (let i = 0; i < res.data.list.length; i++) {
          let _data = res.data.list[i];
          _list.push(_data);
        }
        this.list = _list;
        this.total = res.data.pagination.total;

        this.listLoading = false;
      });
    },
    dataFormSubmit() {
      let dataList = this.checkedList
      let index = 1
      dataList.forEach(data =>{
        data.productionProcessId = data.id
        data.remark = data.description
        data.seq = index
        index++
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
      };
      this.initData();
    },
    reset() {
      for (let key in this.query) {
        this.query[key] = undefined;
      }
      this.listQuery = {
        currentPage: 1,
        pageSize: 20,
        sort: "desc",
        sidx: "",
      };
      this.initData();
    },
  },
};
</script>
