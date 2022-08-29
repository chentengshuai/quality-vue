<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="工艺卡名称">
              <el-input
                v-model="query.techDefineName"
                placeholder="请输入"
                clearable
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="生产工序">
              <el-select
                v-model="query.productionProcessId"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="(item, index) in productionProcessIdOptions"
                  :key="index"
                  :label="item.productionProcessName"
                  :value="item.id"
                  :disabled="item.disabled"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单据状态 ">
              <el-select
                v-model="query.status"
                placeholder="请选择"
                clearable=""
              >
                <el-option
                  v-for="(item, index) in statusOptions"
                  :key="index"
                  :label="item.fullName"
                  :value="item.id"
                  :disabled="item.disabled"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()"
                >查询</el-button
              >
              <el-button icon="el-icon-refresh-right" @click="reset()"
                >重置</el-button
              >
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <h3 class="card-title"></h3>
          </el-col>
        </el-form>
      </el-row>

      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <div></div>
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
        <div class="card-list" v-loading="listLoading">
          <el-row :gutter="16">
            <el-col :span="6">
              <div class="card-box card-add-box" @click="addOrUpdateHandle()">
                <el-button type="text" icon="el-icon-plus">
                  新增工艺卡片</el-button
                >
              </div>
            </el-col>
            <el-col :span="6" v-for="(item, index) in list" :key="index">
              <div class="card-box">
                <dl class="card-item">
                  <dt><img src="@/assets/images/cardIcon.png" alt="" /></dt>
                  <dd>
                    <p>
                      {{ item.techDefineName }}
                      <el-tag type="warning" v-if="item.status == 0"
                        >草稿</el-tag
                      >
                      <el-tag type="success" v-else-if="item.status == 1"
                        >已生效</el-tag
                      >
                      <el-tag type="danger" v-else-if="item.status == 2"
                        >失效</el-tag
                      >
                      <el-tag v-else>{{
                        item.status | dynamicText(statusOptions)
                      }}</el-tag>
                    </p>
                    <span class="desc"
                      >{{ item.title }}@@{{ item.equipmentName }}</span
                    >
                    <p v-if="item.status === '1'">
                    <span class="desc"
                      >生效时间：{{ item.effectTime }}</span
                    >
                    </p>
                    <p v-else-if="item.status === '2'">
                    <span class="desc"
                      >失效时间：{{ item.invalidTime }}</span
                    >
                    </p>
                  </dd>
                </dl>
                <ul
                  class="btn"
                  v-if="item.status === '0' || item.status === null"
                >
                  <li>
                    <el-button type="text" @click="submitBizTechHandle(item.id)"
                      >提交
                    </el-button>
                  </li>
                  <li class="line">|</li>
                  <li>
                    <el-button type="text" @click="addOrUpdateHandle(item.id)"
                      >编辑
                    </el-button>
                  </li>
                  <li class="line">|</li>
                  <li>
                    <el-button
                      type="text"
                      class="JNPF-table-delBtn"
                      @click="handleDel(item.id)"
                      >删除
                    </el-button>
                  </li>
                </ul>
                <ul
                  class="btn"
                  v-else-if="item.status === '100' && shRoleFlag === 1"
                >
                  <li>
                    <el-button
                      type="text"
                      @click="approveHandle(item.id, '200')"
                      >审核</el-button
                    >
                  </li>
                  <li class="line">|</li>
                  <li>
                    <el-button type="text" @click="recallBizTechHandle(item.id)"
                      >退回</el-button
                    >
                  </li>
                  <li class="line">|</li>
                  <li>
                    <el-button type="text" @click="viewHandle(item.id, 'look')"
                      >查看
                    </el-button>
                  </li>
                </ul>
                <ul
                  class="btn"
                  v-else-if="item.status === '200' && pzRoleFlag === 1"
                >
                  <li>
                    <el-button type="text" @click="approveHandle(item.id, '1')"
                      >批准</el-button
                    >
                  </li>
                  <li class="line">|</li>
                  <li>
                    <el-button type="text" @click="recallBizTechHandle(item.id)"
                      >退回</el-button
                    >
                  </li>
                  <li class="line">|</li>
                  <li>
                    <el-button type="text" @click="viewHandle(item.id, 'look')"
                      >查看
                    </el-button>
                  </li>
                </ul>
                <ul class="btn" v-else-if="item.status === '1'">
                  <li>
                    <el-button type="text" @click="viewHandle(item.id, 'look')"
                      >查看
                    </el-button>
                  </li>
                  <li class="line">|</li>
                  <li>
                    <el-button type="text" @click="addOrUpdateHandle(item.id)"
                      >编辑
                    </el-button>
                  </li>
                  <li class="line">|</li>
                  <li>
                    <el-button type="text" @click="historyListView(item.techDefineName)"
                      >历史版本
                    </el-button>
                  </li>
                  <li class="line">|</li>
                  <li>
                    <el-button type="text" @click="approveHandle(item.id, '2')"
                      >失效
                    </el-button>
                  </li>
                </ul>
                <ul class="btn" v-else>
                  <li>
                    <el-button type="text" @click="viewHandle(item.id, 'look')"
                      >查看
                    </el-button>
                  </li>
                  <li class="line">|</li>
                  <li>
                    <el-button type="text" @click="historyListView(item.techDefineName)"
                      >历史版本
                    </el-button>
                  </li>
                  <li class="line">|</li>
                  <li>
                    <el-button type="text" @click="deleteHandle(item.id)"
                      >删除
                    </el-button>
                  </li>
                </ul>
              </div>
            </el-col>
            <div class="card-page">
              <el-col :span="24">
                <pagination
                  :total="total"
                  :page.sync="listQuery.currentPage"
                  :limit.sync="listQuery.pageSize"
                  @pagination="initData"
                />
              </el-col>
            </div>
          </el-row>
          <div class="clearfix"></div>
        </div>
      </div>
    </div>
    <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh" />
    <ExportBox v-if="exportBoxVisible" ref="ExportBox" @download="download" />
    <ViewTeachForm v-if="viewVisible" ref="ViewTeachForm"> </ViewTeachForm>
    <HistoryList v-if="historyListShow" ref="HistoryList"> </HistoryList>
  </div>
</template>

<script>
import request from "@/utils/request";
import { getDictionaryDataSelector } from "@/api/systemData/dictionary";
import JNPFForm from "./Form";
import ExportBox from "./ExportBox";
import { previewDataInterface } from "@/api/systemData/dataInterface";
import ViewTeachForm from "./bdViewTech";
import { UserSettingInfo } from "@/api/permission/userSetting";
import { getDataProcessSelector } from "@/api/systemData/dataTeam";
import HistoryList from "./historyList";

export default {
  components: { JNPFForm, ExportBox, ViewTeachForm, HistoryList },
  data() {
    return {
      query: {
        techDefineName: undefined,
        productionProcessId: undefined,
      },
      treeProps: {
        children: "children",
        label: "fullName",
        value: "id",
      },
      list: [],
      listLoading: true,
      historyListShow: false,
      total: 0,
      listQuery: {
        currentPage: 1,
        pageSize: 20,
        sort: "desc",
        sidx: "",
      },
      formVisible: false,
      viewVisible: false,
      exportBoxVisible: false,
      columnList: [
        { prop: "techDefineName", label: "工艺卡名称" },
        { prop: "title", label: "工艺卡小标题" },
        { prop: "productionProcessName", label: "生产工序名称" },
        { prop: "equipmentName", label: "设备名称" },
        { prop: "status", label: "状态" },
      ],
      statusOptions: [
        { fullName: "草稿", id: "0" },
        { fullName: "待审核", id: "100" },
        { fullName: "待批准", id: "200" },
        { fullName: "已生效", id: "1" },
        { fullName: "失效", id: "2" },
      ],
      productionProcessIdOptions: [],
      currentUser: {},
      shRoleFlag: 0,
      pzRoleFlag: 0,
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
      this.currentUser = this.$store.getters.userInfo; //获取当前登录人信息
      this.listLoading = true;
      let _query = {
        ...this.listQuery,
        ...this.query,
      };
      request({
        url: `/api/project/BizTech/getList`,
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
      UserSettingInfo()
        .then((res) => {
          console.log(res.data.roleId);
          let role = res.data.roleId.split(",");
          for (let i = 0; i < role.length; i++) {
            if (role[i] == "工艺审核") {
              this.shRoleFlag = 1;
            }
            if (role[i] == "工艺批准") {
              this.pzRoleFlag = 1;
            }
          }
          console.log(
            "shRoleFlag:" + this.shRoleFlag + "##pzRoleFlag:" + this.pzRoleFlag
          );
        })
        .catch(() => {});
        getDataProcessSelector()
        .then((res) => {
          this.productionProcessIdOptions = res.data;
        })
        .catch(() => {});
    },
    handleDel(id) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        type: "warning",
      })
        .then(() => {
          request({
            url: `/api/project/BizTech/${id}`,
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
      //新增或编辑页面
      this.formVisible = true;
      this.$nextTick(() => {
        this.$refs.JNPFForm.init(id, isDetail);
      });
    },
    submitBizTechHandle(id, isDetail) {
      //提交
      this.$confirm("是否提交数据?", "提示", {
        type: "warning",
      })
        .then(() => {
          request({
            url: `/api/project/BizTech/submitBizTechHandle/${id}`,
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
    },
    approveHandle(id, status) {
      //审核/批准/失效
      var msg = "是否审批通过?";
      if (status == 2) {
        msg = "是否确认将此工艺卡设置为失效？";
      }

      this.$confirm(msg, "提示", {
        type: "warning",
      })
        .then(() => {
          request({
            url: `/api/project/BizTech/approveHandle/${id}/${status}`,
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
    },
    deleteHandle(id) {
      //删除失效
      var msg = "是否确认删除?";
      this.$confirm(msg, "提示", {
        type: "warning",
      })
        .then(() => {
          request({
            url: `/api/project/BizTech/deleteHandle/${id}`,
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
    },
    recallBizTechHandle(id, isDetail) {
      //退回
      this.$confirm("是否退回数据?", "提示", {
        type: "warning",
      })
        .then(() => {
          request({
            url: `/api/project/BizTech/recallBizTechHandle/${id}`,
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
    },
    viewHandle(id, isDetail) {
      //查看页面
      this.viewVisible = true;
      this.$nextTick(() => {
        this.$refs.ViewTeachForm.init(id, isDetail);
      });
    },
    historyListView(techDefineName) {
      this.historyListShow = true; //弹框显示
      this.$nextTick(() => {
        this.$refs.HistoryList.init(techDefineName);
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
        url: `/api/project/BizTech/Actions/Export`,
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
