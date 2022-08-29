<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="收料单据编码">
              <el-input
                v-model="query.billNo"
                placeholder="请输入"
                clearable
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单据号">
              <el-input
                v-model="query.noticeNum"
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
          <el-col :span="6">
            <el-form-item label="仓管员">
              <user-select
                v-model="query.warehouseId"
                placeholder="请选择
                                        "
                clearable
              />
            </el-form-item>
          </el-col>
          <template v-if="showAll">
            <el-col :span="7">
              <el-form-item label="检验时间">
                <el-date-picker
                  v-model="query.detectionTime"
                  type="daterange"
                  value-format="timestamp"
                  format="yyyy-MM-dd"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="收货日期">
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
              >查询
              </el-button
              >
              <el-button icon="el-icon-refresh-right" @click="reset()"
              >重置
              </el-button
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
            <screenfull isContainer/>
          </div>
        </div>
        <JNPF-table
          v-loading="listLoading"
          :data="list"
          @sort-change="sortChange"
        >
          <el-table-column
            prop="noticeNum"
            label="单据号"
            width="0"
            align="left"
          />
          <el-table-column
            prop="billNo"
            label="收料通知单编码"
            width="0"
            align="left"
          />
          <el-table-column label="检测结果" width="0" prop="status" algin="left">
            <template slot-scope="scope">
              {{ scope.row.status | dynamicText(statusOptions) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="inspectorName"
            label="检验员"
            width="0"
            align="left"
          />
          <el-table-column
            prop="detectionTime"
            label="检验时间"
            width="0"
            align="left"
          />
          <el-table-column
            prop="teamName"
            label="班组"
            width="0"
            align="left"
          />
          <el-table-column
            prop="shiftName"
            label="班次"
            width="0"
            align="left"
          />
          <el-table-column
            prop="warehouseName"
            label="仓管员"
            width="0"
            align="left"
          />
          <el-table-column
            prop="receivingTime"
            label="收货日期"
            width="0"
            align="left"
          />
          <el-table-column label="操作" fixed="right" width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.status==='0'">
                <el-button type="text" @click="addOrUpdateHandle(scope.row.id)"
                >编辑
                </el-button>
                <el-button
                  type="text"
                  class="JNPF-table-delBtn"
                  @click="handleDel(scope.row.id)">删除
                </el-button>
              </div>
              <div v-if="scope.row.status==='1'">
                <el-button type="text" @click="addOrUpdateHandle(scope.row.id)">编辑
                </el-button>
              </div>
              <div v-if="scope.row.status==='2'">
                <el-button type="text" @click="addOrUpdateHandle(scope.row.id,'look')">详情
                </el-button>
              </div>
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
    <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh"/>
    <ExportBox v-if="exportBoxVisible" ref="ExportBox" @download="download"/>
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
        showAll: false,
        query: {
          billNo: undefined,
          noticeNum: undefined,
          inspectorName: undefined,
          inspectorId: undefined,
          warehouseName: undefined,
          warehouseId: undefined,
          detectionTime: undefined,
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
          sidx: "noticeNum",
        },
        formVisible: false,
        exportBoxVisible: false,
        columnList: [
          {prop: "noticeNum", label: "单据号"},
          {prop: "inspectorName", label: "检验员"},
          {prop: "detectionTime", label: "检验时间"},
          {prop: "teamName", label: "班组"},
          {prop: "shiftName", label: "班次"},
          {prop: "warehouseName", label: "仓管人"},
          {prop: "receivingTime", label: "收货日期"},
        ],
        teamNameOptions: [],
        teamNameProps: {label: "fullName", value: "id"},
        shiftNameOptions: [],
        shiftNameProps: {label: "fullName", value: "id"},
        statusOptions: [
          {fullName: "未检测", id: "0"},
          {fullName: "正在检测", id: "1"},
          {fullName: "已完成检测", id: "2"},
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
      initData() {
        this.listLoading = true;
        let _query = {
          ...this.listQuery,
          ...this.query,
        };
        request({
          url: `/api/project/BizMaterialInspectNotice/getList`,
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
              url: `/api/project/BizMaterialInspectNotice/${id}`,
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
          .catch(() => {
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
        let query = {...data, ...this.listQuery, ...this.query};
        request({
          url: `/api/project/BizMaterialInspectNotice/Actions/Export`,
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
          sidx: "noticeNum",
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
          sidx: "noticeNum",
        };
        this.initData();
      },
    },
  };
</script>
