<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="物料名称">
              <el-input
                v-model="query.materialName"
                placeholder="请输入"
                clearable
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="物料编码">
              <el-input
                v-model="query.materialCode"
                placeholder="请输入"
                clearable
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="规格型号">
              <el-input
                v-model="query.specification"
                placeholder="请输入"
                clearable
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="批次号">
              <el-input
                v-model="query.batchNumber"
                placeholder="请输入"
                clearable
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="检验员">
              <user-select
                v-model="query.inspectorId"
                placeholder="请选择
                                        "
                clearable
              />
            </el-form-item>
          </el-col>
          <template v-if="showAll">
            <el-col :span="6">
              <el-form-item label="综合判定结果">
                <el-select
                  v-model="query.comprehensiveJudge"
                  placeholder="请选择"
                  clearable
                >
                  <el-option
                    v-for="(item, index) in comprehensiveJudgeOptions"
                    :key="index"
                    :label="item.fullName"
                    :value="item.id"
                    :disabled="item.disabled"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="审核状态">
                <el-select v-model="query.state" placeholder="请选择" clearable>
                  <el-option label="审核中" value="0"></el-option>
                  <el-option label="已完成" value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="检测时间">
                <el-input
                  v-model="query.inspectorTime"
                  placeholder="请输入"
                  clearable
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="进料日期">
                <el-date-picker
                  v-model="query.receivingTime"
                  type="daterange"
                  value-format="timestamp"
                  format="yyyy-MM-dd"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()"
                >查询</el-button
              >
              <el-button icon="el-icon-refresh-right" @click="reset()"
                >重置</el-button
              >
              <el-button
                type="text"
                icon="el-icon-arrow-down"
                @click="showAll = true"
                v-if="!showAll"
              >
                展开
              </el-button>
              <el-button
                type="text"
                icon="el-icon-arrow-up"
                @click="showAll = false"
                v-else
              >
                收起
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <div>
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="addOrUpdateHandle()"
              >新增
            </el-button>
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" content="刷新" placement="top">
              <el-link
                icon="icon-ym icon-ym-Refresh JNPF-common-head-icon"
                :underline="false"
                @click="reset()"
              />
            </el-tooltip>
            <screenfull isContainer />
          </div>
        </div>
        <JNPF-table
          v-loading="listLoading"
          :data="list"
          @sort-change="sortChange"
        >
          <el-table-column
            prop="materialName"
            label="物料名称"
            width="0"
            align="left"
          />
          <el-table-column
            prop="materialCode"
            label="物料编码"
            width="0"
            align="left"
          />
          <el-table-column
            prop="specification"
            label="规格型号"
            width="0"
            align="left"
          />
          <el-table-column
            prop="vendorName"
            label="制造单位"
            width="200"
            align="left"
          />
          <el-table-column
            prop="batchNumber"
            label="批次号"
            width="120"
            align="left"
          />
          <el-table-column
            prop="materialNumber"
            label="进料数"
            width="0"
            align="left"
          />
          <el-table-column
            prop="inspectionQty"
            label="检验数量"
            width="0"
            align="left"
          />
          <el-table-column
            prop="qualifiedQty"
            label="合格数量"
            width="0"
            align="left"
          />
          <el-table-column
            prop="receivingTime"
            label="进料日期"
            width="90"
            align="left"
          />
          <el-table-column
            label="检验规格"
            width="0"
            prop="inspectionSpecs"
            algin="left"
          >
            <template slot-scope="scope">
              {{
                scope.row.inspectionSpecs | dynamicText(inspectionSpecsOptions)
              }}
            </template>
          </el-table-column>
          <el-table-column
            label="综合判定结果"
            width="95"
            prop="comprehensiveJudge"
            algin="left"
          >
            <template slot-scope="scope">
              {{
                scope.row.comprehensiveJudge
                  | dynamicText(comprehensiveJudgeOptions)
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="inspectorTime"
            label="检测时间"
            width="90"
            align="left"
          />
          <el-table-column
            prop="inspectorName"
            label="检验员"
            width="0"
            align="left"
          />
          <el-table-column label="班 组" width="0" prop="teamName" algin="left">
            <template slot-scope="scope">
              {{ scope.row.teamName | dynamicText(teamNameOptions) }}
            </template>
          </el-table-column>
          <el-table-column
            label="班 次"
            width="0"
            prop="shiftName"
            algin="left"
          >
            <template slot-scope="scope">
              {{ scope.row.shiftName | dynamicText(shiftNameOptions) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="approvalTime"
            label="核准时间"
            width="90"
            align="left"
          />
          <el-table-column
            prop="approvalUserName"
            label="核准人"
            width="0"
            align="left"
          />
          <el-table-column label="审核状态" width="0" prop="state" algin="left">
            <template slot-scope="scope">
              {{ scope.row.state | dynamicText(stateOptions) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="150">
            <template slot-scope="scope">
              <el-button
                type="text"
                v-if="scope.row.state === '0'"
                @click="addOrUpdateHandle(scope.row.id)"
                >编辑
              </el-button>
              <el-button
                type="text"
                v-if="scope.row.state === '0'"
                @click="approval(scope.row.id)"
              >审核
              </el-button>
              <el-button
                type="text"
                v-if="scope.row.state === '0'"
                class="JNPF-table-delBtn"
                @click="handleDel(scope.row.id)"
                >删除
              </el-button>
              <el-button
                type="text"
                v-if="scope.row.state === '1'"
                @click="addOrUpdateHandle(scope.row.id, 'look')"
              >详情
              </el-button>
              <el-button
                type="text"
                v-if="scope.row.state === '1'"
                @click="revoke(scope.row.id)"
              >撤销
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
import { getDictionaryDataSelector } from "@/api/systemData/dictionary";
import JNPFForm from "./Form";
import ExportBox from "./ExportBox";
import { previewDataInterface } from "@/api/systemData/dataInterface";

export default {
  components: { JNPFForm, ExportBox },
  data() {
    return {
      showAll: false,
      query: {
        materialName: undefined,
        materialCode: undefined,
        specification: undefined,
        batchNumber: undefined,
        inspectorId: undefined,
        comprehensiveJudge: undefined,
        state: undefined,
        inspectorTime: undefined,
        receivingTime: undefined,
      },
      treeProps: {
        children: "children",
        label: "fullName",
        value: "id",
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
      columnList: [
        { prop: "materialName", label: "物料名称" },
        { prop: "vendorName", label: "制造单位" },
        { prop: "batchNumber", label: "批次号" },
        { prop: "materialNumber", label: "进料数" },
        { prop: "receivingTime", label: "进料日期" },
        { prop: "inspectionSpecs", label: "检验规格" },
        { prop: "comprehensiveJudge", label: "综合判定结果" },
        { prop: "inspectorTime", label: "检测时间" },
        { prop: "inspectorName", label: "检验员" },
        { prop: "teamName", label: "班 组" },
        { prop: "shiftName", label: "班 次" },
        { prop: "approvalTime", label: "核准时间" },
        { prop: "approvalUserName", label: "核准人" },
        { prop: "state", label: "状 态" },
      ],
      teamNameOptions: [
        { fullName: "选项一", id: "1" },
        { fullName: "选项二", id: "2" },
      ],
      teamNameProps: { label: "fullName", value: "id" },
      shiftNameOptions: [
        { fullName: "选项一", id: "1" },
        { fullName: "选项二", id: "2" },
      ],
      shiftNameProps: { label: "fullName", value: "id" },
      inspectionSpecsOptions: [
        { fullName: "正常", id: "正常" },
        { fullName: "减量", id: "减量" },
        { fullName: "加严", id: "加严" },
      ],
      inspectionSpecsProps: { label: "fullName", value: "id" },
      comprehensiveJudgeOptions: [
        { fullName: "合格", id: "合格" },
        { fullName: "不合格", id: "不合格" },
        { fullName: "批退", id: "批退" },
        { fullName: "全检", id: "全检" },
      ],
      comprehensiveJudgeProps: { label: "fullName", value: "id" },
      stateOptions: [
        { fullName: "审核中", id: "0" },
        { fullName: "已完成", id: "1" },
      ],
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
        url: `/api/project/BizMaterialInspectionRecord/getList`,
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
    handleDel(id) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        type: "warning",
      })
        .then(() => {
          request({
            url: `/api/project/BizMaterialInspectionRecord/${id}`,
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
        url: `/api/project/BizMaterialInspectionRecord/Actions/Export`,
        method: "GET",
        data: query,
      }).then((res) => {
        if (!res.data.url) return;
        window.location.href = this.define.comUrl + res.data.url;
        this.$refs.ExportBox.visible = false;
        this.exportBoxVisible = false;
      });
    },
    approval(id) {
      request({
        url: `/api/project/BizMaterialInspectionRecord/approval/${id}`,
        method: "post",
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
