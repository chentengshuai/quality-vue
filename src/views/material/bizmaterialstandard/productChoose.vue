<template>
  <div class="JNPF-common-layout" style="height:450px;">
    <div class="JNPF-common-layout-center">
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <JNPF-table
          v-loading="listLoading"
          :data="list"
          @sort-change="sortChange"
          @row-click="handleSelectionChange"
        >
          <el-table-column
            prop="materialName"
            label="基准书名称"
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
            prop="versionNum"
            label="版   本"
            width="0"
            align="left"
          />
          <el-table-column
            label="是否启用"
            width="0"
            prop="enableFlag"
            algin="left"
          >
            <template slot-scope="scope">
              {{ scope.row.enableFlag | dynamicText(enableFlagOptions) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="revisedContent"
            label="修订内容"
            width="0"
            align="left"
          />
          <el-table-column
            prop="makeTime"
            label="制作日期"
            width="0"
            align="left"
          />
          <el-table-column
            prop="makeUserName"
            label="制作人员"
            width="0"
            align="left"
          />
          <el-table-column
            prop="examineTime"
            label="审核日期"
            width="0"
            align="left"
          />
          <el-table-column
            prop="examineUserName"
            label="审查人员"
            width="0"
            align="left"
          />
          <el-table-column
            prop="approvalTime"
            label="核准日期"
            width="0"
            align="left"
          />
          <el-table-column
            prop="approvalUserName"
            label="核准人员"
            width="0"
            align="left"
          />
          <el-table-column
            label="审核状态"
            width="0"
            prop="approvalState"
            algin="left"
          >
            <template slot-scope="scope">
              {{ scope.row.approvalState | dynamicText(stateOptions) }}
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
    <ExportBox v-if="exportBoxVisible" ref="ExportBox" @download="download" />
  </div>
</template>

<script>
import request from "@/utils/request";
import { getDictionaryDataSelector } from "@/api/systemData/dictionary";
import ExportBox from "./ExportBox";
import { previewDataInterface } from "@/api/systemData/dataInterface";

export default {
  components: { ExportBox },
  data() {
    return {
      showAll: false,
      query: {
        rollNum: undefined,
        spec: undefined,
        size: undefined,
        status: undefined,
        materialName: undefined,
        materialCode: undefined,
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
        { prop: "materialName", label: "基准书名称" },
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
    };
  },
  computed: {},
  created() {},
/*  mounted() {
    this.initData();
  },*/
  methods: {
    sortChange({ column, prop, order }) {
      this.listQuery.sort = order == "ascending" ? "asc" : "desc";
      this.listQuery.sidx = !order ? "" : prop;
      this.initData();
    },
    initData(standardType) {
      this.listLoading = true;
      let _query = {
        ...this.listQuery,
        ...this.query,
        standardType:standardType
      };
      request({
        url: `/api/project/BizMaterialStandard/materialStandardList`,
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
    search() {
      this.listQuery = {
        currentPage: 1,
        pageSize: 20,
        sort: "desc",
        sidx: "",
      };
      this.initData();
    },
    handleSelectionChange(selection, preRow) {
      this.$emit("onChange", selection);
    },
  },
};
</script>
