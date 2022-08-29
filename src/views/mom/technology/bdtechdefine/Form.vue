<template>
  <el-dialog
    :title="!dataForm.id ? '新建' : isDetail ? '详情' : '编辑'"
    :close-on-click-modal="false"
    append-to-body
    :visible.sync="visible"
    class="JNPF-dialog JNPF-dialog_center"
    lock-scroll
    width="1000px"
  >
    <el-row :gutter="15" class="">
      <el-form
        ref="elForm"
        :model="dataForm"
        :rules="rules"
        size="medium"
        label-width="150px"
        label-position="right"
      >
        <template v-if="!loading">
          <el-col :span="12">
            <el-form-item label="工艺卡定义名称" prop="techDefineName">
              <el-input
                v-model="dataForm.techDefineName"
                placeholder="请输入"
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工艺卡定义编码" prop="techDefineCode">
              <el-input
                v-model="dataForm.techDefineCode"
                placeholder="请输入"
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产工序" prop="productionProcessId">
              <el-select
                v-model="dataForm.productionProcessId"
                placeholder="请选择"
                clearable
                :style="{ width: '100%' }"
                :multiple="false"
              >
                <el-option
                  v-for="(item, index) in productionProcessIdOptions"
                  :key="index"
                  :label="item.productionProcessName"
                  :value="item.id"
                  :disabled="item.disabled"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="启用状态" prop="enableFlag">
              <el-switch
                v-model="dataForm.enableFlag"
                :active-value="1"
                :inactive-value="0"
              >
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="description">
              <el-input
                v-model="dataForm.description"
                placeholder="请输入"
                :maxlength="300"
                :style="{ width: '100%' }"
                true
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 4 }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label-width="0">
              <div class="JNPF-common-title">
                <h2>明细</h2>
              </div>
              <el-table :data="dataForm.bdtechdefineattributeList" size="mini">
                <el-table-column
                  type="index"
                  width="50"
                  label="序号"
                  align="center"
                />
                <el-table-column prop="attributeName" label="属性名称">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.attributeName"
                      placeholder="请输入"
                      clearable
                      :style="{ width: '100%' }"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="attributeType" label="属性类型">
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.attributeType"
                      placeholder="请选择"
                      clearable
                      :style="{ width: '100%' }"
                      :multiple="false"
                    >
                      <el-option
                        v-for="(item, index) in attributeTypeOptions"
                        :key="index"
                        :label="item.fullName"
                        :value="item.enCode"
                        :disabled="item.disabled"
                      ></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="uomName" label="计量单位">
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.uomName"
                      placeholder="请选择"
                      clearable
                      :style="{ width: '100%' }"
                      :multiple="false"
                    >
                      <el-option
                        v-for="(item, index) in uomNameOptions"
                        :key="index"
                        :label="item.uomName"
                        :value="item.uomName"
                        :disabled="item.disabled"
                      ></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="description" label="属性说明">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.description"
                      placeholder="请输入"
                      clearable
                      :style="{ width: '100%' }"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="seq" label="序号">
                  <template slot-scope="scope">
                    <el-input-number
                      v-model="scope.row.seq"
                      placeholder="数字文本"
                      :step="1"
                      :style="{ width: '100%' }"
                    >
                    </el-input-number>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="50">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="text"
                      class="JNPF-table-delBtn"
                      @click="delbdtechdefineattributeList(scope.$index)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
              <div
                class="table-actions"
                @click="addbdtechdefineattributeList()"
              >
                <el-button type="text" icon="el-icon-plus">添加</el-button>
              </div>
            </el-form-item>
          </el-col>
        </template>
      </el-form>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false"> 取 消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" v-if="!isDetail">
        确 定</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
import request from "@/utils/request";
import { previewDataInterface } from "@/api/systemData/dataInterface";
import {
  getDictionaryDataSelector,
  getDictionaryDataByTypeCode,
} from "@/api/systemData/dictionary";
import {
  getDataUomSelector,
  getDataProcessSelector,
} from "@/api/systemData/dataTeam";

export default {
  components: {},
  props: [],
  data() {
    return {
      visible: false,
      loading: false,
      isDetail: false,
      dataForm: {
        techDefineName: "",
        techDefineCode: "",
        productionProcessId: "",
        enableFlag: 1,
        description: "",
        bdtechdefineattributeList: [],
      },
      rules: {
        techDefineName: [
          {
            required: true,
            message: "请输入",
            trigger: "blur",
          },
        ],
        techDefineCode: [
          {
            required: true,
            message: "请输入",
            trigger: "blur",
          },
        ],
        productionProcessId: [
          {
            required: true,
            message: "请选择",
            trigger: "blur",
          },
        ],
      },
      productionProcessIdOptions: [],
      attributeTypeOptions: [],
      uomNameOptions: [],
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    init(id, isDetail) {
      this.dataForm.id = id || 0;
      this.visible = true;
      this.isDetail = isDetail || false;
      this.$nextTick(() => {
        //this.$refs['elForm'].resetFields();
        if (this.dataForm.id) {
          this.loading = true;
          request({
            url: "/api/project/BdTechDefine/" + this.dataForm.id,
            method: "get",
          }).then((res) => {
            this.dataInfo(res.data);
            this.loading = false;
          });
        } else {
          this.dataForm = this.$options.data().dataForm;
        }
      });
      getDictionaryDataByTypeCode("techAttribute")
        .then((res) => {
          this.attributeTypeOptions = res.data;
        })
        .catch(() => {});

      getDataUomSelector()
        .then((res) => {
          this.uomNameOptions = res.data;
        })
        .catch(() => {});

      getDataProcessSelector()
        .then((res) => {
          this.productionProcessIdOptions = res.data;
        })
        .catch(() => {});
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["elForm"].validate((valid) => {
        if (valid) {
          this.request();
        }
      });
    },
    request() {
      debugger;
      var msg = "";
      for (let i = 0; i < this.dataForm.bdtechdefineattributeList.length; i++) {
        if (
          this.dataForm.bdtechdefineattributeList[i].attributeName ==
            undefined ||
          this.dataForm.bdtechdefineattributeList[i].attributeName == "" ||
          this.dataForm.bdtechdefineattributeList[i].attributeType ==
            undefined ||
          this.dataForm.bdtechdefineattributeList[i].description == undefined ||
          this.dataForm.bdtechdefineattributeList[i].description == ""
        ) {
          msg = "请填写明细行属性名称、属性类型及属性说明！";
        }
      }
      if (msg.length > 0) {
        this.$message({
          message: msg,
          type: "warning",
          duration: 2000,
        });
        return;
      }

      var _data = this.dataList();
      if (!this.dataForm.id) {
        request({
          url: "/api/project/BdTechDefine",
          method: "post",
          data: _data,
        }).then((res) => {
          this.$message({
            message: res.msg,
            type: "success",
            duration: 1000,
            onClose: () => {
              this.visible = false;
              this.$emit("refresh", true);
            },
          });
        });
      } else {
        request({
          url: "/api/project/BdTechDefine/" + this.dataForm.id,
          method: "PUT",
          data: _data,
        }).then((res) => {
          this.$message({
            message: res.msg,
            type: "success",
            duration: 1000,
            onClose: () => {
              this.visible = false;
              this.$emit("refresh", true);
            },
          });
        });
      }
    },
    addbdtechdefineattributeList() {
      let index = this.dataForm.bdtechdefineattributeList.length + 1;
      let item = {
        attributeName: undefined,
        attributeType: undefined,
        uomName: undefined,
        seq: index,
      };
      this.dataForm.bdtechdefineattributeList.push(item);
    },
    delbdtechdefineattributeList(index) {
      this.dataForm.bdtechdefineattributeList.splice(index, 1);
    },
    dataList() {
      var _data = JSON.parse(JSON.stringify(this.dataForm));
      for (let i = 0; i < _data.bdtechdefineattributeList.length; i++) {
        var _list = _data.bdtechdefineattributeList[i];
      }
      return _data;
    },
    dataInfo(dataAll) {
      let _dataAll = dataAll;
      for (let i = 0; i < _dataAll.bdtechdefineattributeList.length; i++) {
        var _list = _dataAll.bdtechdefineattributeList[i];
      }
      this.dataForm = _dataAll;
    },
  },
};
</script>
