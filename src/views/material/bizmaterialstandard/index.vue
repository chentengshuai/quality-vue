<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="检验名称">
              <el-input v-model="query.standardName" placeholder="请输入" clearable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="基准名称">
              <el-input v-model="query.materialName" placeholder="请输入" clearable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="基准编码">
              <el-input v-model="query.materialCode" placeholder="请输入" clearable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="检验类型">
              <el-select v-model="query.standardType" placeholder="请选择检验类型" clearable>
                <el-option v-for="(item, index) in standardTypeDataList" :key="index" :label="item.fullName"
                           :value="item.enCode" :disabled="item.disabled"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="制作人">
              <el-input v-model="query.makeUserName" placeholder="请输入" clearable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="启用状态">
              <el-select v-model="query.enableFlag" placeholder="请选择" clearable>
                <el-option label="启用" value="1"></el-option>
                <el-option label="停用" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="审核状态">
              <el-select v-model="query.approvalState" placeholder="请选择" clearable>
                <el-option label="审核中" value="1"></el-option>
                <el-option label="核准中" value="2"></el-option>
                <el-option label="已完成" value="3"></el-option>
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
        <div class="JNPF-common-head">
          <div>
            <el-button type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()">新增
            </el-button>
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" content="刷新" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="reset()"/>
            </el-tooltip>
            <screenfull isContainer />
          </div>
        </div>
        <JNPF-table
          v-loading="listLoading"
          :data="list"
          @sort-change="sortChange">
          <el-table-column prop="standardCode" label="检验编码" width="0" align="left" />
          <el-table-column prop="standardName" label="检验名称" width="0" align="left" />
          <el-table-column prop="standardTypeName" label="基准类型"  width="0" align="left" />
          <el-table-column prop="materialName" label="基准名称" width="0" align="left" />
          <el-table-column prop="materialCode" label="基准编码" width="0" align="left" />
          <el-table-column prop="specification" label="规格型号" width="0" align="left" />
          <el-table-column prop="enableFlag" label="是否启用" width="0" algin="left">
            <template slot-scope="scope">
              {{ scope.row.enableFlag | dynamicText(enableFlagOptions) }}
            </template>
          </el-table-column>
          <el-table-column prop="makeTime" label="制作日期" width="0" align="left" />
          <el-table-column prop="makeUserName" label="制作人员" width="0" align="left"/>
          <el-table-column prop="examineTime" label="审核日期" width="0" align="left"/>
          <el-table-column prop="examineUserName" label="审查人员" width="0" align="left"/>
          <el-table-column prop="approvalTime" label="核准日期" width="0" align="left" />
          <el-table-column prop="approvalUserName" label="核准人员" width="0" align="left" />
          <el-table-column prop="approvalState" label="审核状态" width="0" algin="left">
            <template slot-scope="scope">
              {{ scope.row.approvalState | dynamicText(stateOptions) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="150">
            <template slot-scope="scope">
              <el-button type="text" v-if="scope.row.currentApproval == 1" @click="approval(scope.row.id, 'examine')">审核
              </el-button>
              <el-button type="text" v-if="scope.row.currentApproval == 2" @click="approval(scope.row.id, 'approval')">核准
              </el-button>
              <el-button type="text" v-if="scope.row.approvalState != 3" @click="addOrUpdateHandle(scope.row.id)">编辑
              </el-button>
              <el-button type="text" v-if="scope.row.approvalState > 0" @click="addOrUpdateHandle(scope.row.id, 'looke')">详情
              </el-button>
              <el-button type="text" class="JNPF-table-delBtn" v-if="scope.row.approvalState != 3" @click="handleDel(scope.row.id)">删除
              </el-button>
              <el-button type="text" v-if="scope.row.approvalState == 3 && scope.row.enableFlag==0" @click="setEnableFlag(scope.row.id, 1)">启用
              </el-button>
              <el-button type="text" v-if="scope.row.approvalState == 3 && scope.row.enableFlag==1" @click="setEnableFlag(scope.row.id, 0)">停用
              </el-button>
              <el-button type="text" v-if="scope.row.approvalState == 3" @click="approval(scope.row.id, 'revoke')">撤回
              </el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination
          :total="total"
          :page.sync="listQuery.currentPage"
          :limit.sync="listQuery.pageSize"
          @pagination="initData"
        />
      </div>
    </div>
    <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh" />
    <ExportBox v-if="exportBoxVisible" ref="ExportBox" @download="download" />
  </div>
</template>

<script>
import request from "@/utils/request";
import {getDictionaryDataByTypeCode, getDictionaryDataSelector} from "@/api/systemData/dictionary";
import JNPFForm from "./Form";
import ExportBox from "./ExportBox";
import { previewDataInterface } from "@/api/systemData/dataInterface";

export default {
  components: { JNPFForm, ExportBox },
  data() {
    return {
      query: {
        materialName: undefined,
        materialCode: undefined,
        specification: undefined,
        makeUserName: undefined,
        approvalState: undefined,
        enableFlag: undefined,
      },
      treeProps: {
        children: "children",
        label: "fullName",
        value: "id",
      },
      standardTypeDataList: [],
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
        { prop: "materialName", label: "基准名称" },
        { prop: "materialName", label: "基准编码" },
        { prop: "specification", label: "规格型号" },
        { prop: "versionNum", label: "版   本" },
        { prop: "enableFlag", label: "是否启用" },
        { prop: "revisedContent", label: "修订内容" },
        { prop: "makeTime", label: "制作日期" },
        { prop: "makeUserName", label: "制作人员" },
        { prop: "examineUserName", label: "审查人员" },
        { prop: "approvalUserName", label: "核准人员" },
      ],
      enableFlagOptions: [
        { fullName: "启用", id: "1" },
        { fullName: "停用", id: "0" },
      ],
      stateOptions: [
        { fullName: "审核中", id: "1" },
        { fullName: "核准中", id: "2" },
        { fullName: "已完成", id: "3" },
      ],
      enableFlagProps: { label: "fullName", value: "id" },
      makeUserIdOptions: [],
      makeUserIdProps: { label: "fullName", value: "id" },
      examineUserIdOptions: [],
      examineUserIdProps: { label: "fullName", value: "id" },
      approvalUserIdOptions: [],
      approvalUserIdProps: { label: "fullName", value: "id" },
    };
  },
  computed: {},
  created() {
    this.initData();
  },
  methods: {
    sortChange({ column, prop, order }) {
      this.listQuery.sort = order == "ascending" ? "asc" : "desc";
      this.listQuery.sidx = !order ? "" : prop;
      this.initData();
    },
    initData() {
      this.listLoading = true;
      let _query = {
        ...this.listQuery,
        ...this.query,
      };
      request({
        url: `/api/project/BizMaterialStandard/getList`,
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
      this.getStandardTypeDataList()
    },
    getStandardTypeDataList() {
      getDictionaryDataByTypeCode("standardType").then((res) => {
        this.standardTypeDataList = res.data
      })
    },
    handleDel(id) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        type: "warning",
      })
        .then(() => {
          request({
            url: `/api/project/BizMaterialStandard/${id}`,
            method: "DELETE",
          }).then((res) => {
            this.$message({
              type: "success",
              message: res.msg,
              onClose: () => {
                this.initData();
              },
            });
          });
        })
        .catch(() => {});
    },
    approval(id, type) {
         if(type == 'revoke'){
            this.$confirm("撤回后将变成待审核状态，是否继续?", "提示", {
              type: "warning",
            })
              .then(() => {
                  request({
                    url: `/api/project/BizMaterialStandard/${id}/${type}`,
                    method: "get",
                  }).then((res) => {
                    this.$message({
                      type: "success",
                      message: res.msg,
                      onClose: () => {
                        this.initData();
                      },
                    });
                  });
              })
              .catch(() => {});

         }else{
            request({
              url: `/api/project/BizMaterialStandard/${id}/${type}`,
              method: "get",
            }).then((res) => {
              this.$message({
                type: "success",
                message: res.msg,
                onClose: () => {
                  this.initData();
                },
              });
            });
         }
    },
    setEnableFlag(id,enableFlag){
            request({
              url: `/api/project/BizMaterialStandard/setEnableFlag/${id}/${enableFlag}`,
              method: "get",
            }).then((res) => {
              this.$message({
                type: "success",
                message: res.msg,
                onClose: () => {
                  this.initData();
                },
              });
            });
    },
    addOrUpdateHandle(id, isDetail) {
      this.formVisible = true;
      this.$nextTick(() => {
        this.$refs.JNPFForm.init(id, isDetail);
      });
    },
    exportData() {
      this.exportBoxVisible = true;
      this.$nextTick(() => {
        this.$refs.ExportBox.init(this.columnList);
      });
    },
    download(data) {
      let query = { ...data, ...this.listQuery, ...this.query };
      request({
        url: `/api/project/BizMaterialStandard/Actions/Export`,
        method: "GET",
        data: query,
      }).then((res) => {
        if (!res.data.url) return;
        window.location.href = this.define.comUrl + res.data.url;
        this.$refs.ExportBox.visible = false;
        this.exportBoxVisible = false;
      });
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
    refresh(isrRefresh) {
      this.formVisible = false;
      if (isrRefresh) this.reset();
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
