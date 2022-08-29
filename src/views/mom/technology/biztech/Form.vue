<template>
  <el-dialog
    :title="!dataForm.id ? '新建' : isDetail ? '详情' : '编辑'"
    :close-on-click-modal="false"
    append-to-body
    :visible.sync="visible"
    class="JNPF-dialog JNPF-dialog_center"
    lock-scroll
    width="1300px"
  >
    <el-row :gutter="15" class="">
      <el-form
        ref="elForm"
        :model="dataForm"
        :rules="rules"
        size="small"
        label-width="100px"
        label-position="right"
      >
        <template v-if="!loading">
          <el-col :span="24">
            <el-collapse
              :accordion="false"
              v-model="activelemmaf"
              class="mb-20"
            >
              <el-collapse-item title="基本信息" name="1">
                <el-col :span="8">
                  <el-form-item label="编制人员" prop="organizationPersonId">
                    <user-search
                      v-model="dataForm.organizationPersonId"
                      :defaultLogin="true"
                      :name="dataForm.organizationPersonName"
                      @name="
                        (value) => {
                          dataForm.organizationPersonName = value;
                        }
                      "
                      @input="
                        (value) => {
                          dataForm.organizationPersonId = value;
                        }
                      "
                    >
                    </user-search>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="批准人员" prop="approvePersonId">
                    <user-search
                      v-model="dataForm.approvePersonId"
                      :defaultLogin="true"
                      :name="dataForm.approvePersonName"
                      @name="
                        (value) => {
                          dataForm.approvePersonName = value;
                        }
                      "
                      @input="
                        (value) => {
                          dataForm.approvePersonId = value;
                        }
                      "
                    >
                    </user-search>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="审核人员" prop="examinePersonId">
                    <user-search
                      v-model="dataForm.examinePersonId"
                      :defaultLogin="true"
                      :name="dataForm.examinePersonName"
                      @name="
                        (value) => {
                          dataForm.examinePersonName = value;
                        }
                      "
                      @input="
                        (value) => {
                          dataForm.examinePersonId = value;
                        }
                      "
                    >
                    </user-search>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="工艺卡名称" prop="techDefineName">
                    <div class="userSelect-input" @click="chooseBdTechDefine">
                      <el-input
                        v-model="dataForm.techDefineName"
                        placeholder="请选择"
                        readonly
                        :style="{ width: '100%' }"
                      >
                      </el-input>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="生产工序名称"
                    prop="productionProcessName"
                  >
                    <el-input
                      v-model="dataForm.productionProcessName"
                      placeholder="自动代入"
                      readonly
                      :style="{ width: '100%' }"
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="版本号" prop="title">
                    <el-input
                      ref="clickTitle"
                      v-model="dataForm.title"
                      placeholder="请输入"
                      clearable
                      :style="{ width: '100%' }"
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="设备名称" prop="equipmentId">
                    <el-select
                      v-model="dataForm.equipmentId"
                      placeholder="请选择"
                      clearable
                      :style="{ width: '100%' }"
                      :multiple="false"
                      @change="equipmentChange"
                    >
                      <el-option
                        v-for="(item, index) in equipmentNameOptions"
                        :key="index"
                        :label="item.equipmentName"
                        :value="item.id"
                        :disabled="item.disabled"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="标准/重要事项" prop="description">
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
              </el-collapse-item>
              <el-collapse-item title="明细" name="2">
                <el-col :span="24">
                  <el-form-item label-width="0">
                    <div class="JNPF-common-title">
                      <h2></h2>
                    </div>
                    <el-table
                      :data="dataForm.biztechattributeList.attributeValue"
                      size="large"
                      v-if="tableShowHid"
                    >
                      <el-table-column
                        type="index"
                        width="50"
                        label="序号"
                        align="center"
                      />
                      <el-table-column
                        v-for="(item, index) in dataForm.biztechattributeList
                          .tableAttributeListOptions"
                        :key="index"
                        :label="item.description"
                      >
                        <template slot-scope="scope">
                          <div v-if="item.attributeType == 5">
                            <el-date-picker
                              v-model="scope.row[index]"
                              placeholder="请选择"
                              clearable
                              :style="{ width: '250' }"
                              type="date"
                              format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd"
                            >
                            </el-date-picker>
                          </div>
                          <div v-else-if="item.attributeType == 7">
                            <el-input-number
                              v-model="scope.row[index]"
                              placeholder="数字"
                              :step="0.01"
                              controls-position="right"
                              :style="{ width: '250' }"
                            >
                            </el-input-number>
                          </div>
                          <div v-else>
                            <el-input
                              v-model="scope.row[index]"
                              placeholder="请输入"
                              clearable
                              :style="{ width: '250' }"
                            >
                            </el-input>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" width="50">
                        <template slot-scope="scope">
                          <el-button
                            size="mini"
                            type="text"
                            class="JNPF-table-delBtn"
                            @click="delbiztechattributeList(scope.$index)"
                            >删除</el-button
                          >
                        </template>
                      </el-table-column>
                    </el-table>
                    <div
                      class="table-actions"
                      @click="addbiztechattributeList()"
                      v-if="tableShowHid"
                    >
                      <el-button type="text" icon="el-icon-plus"
                        >添加</el-button
                      >
                    </div>
                  </el-form-item>
                </el-col>
              </el-collapse-item>
            </el-collapse>
          </el-col>

          <el-dialog
            title="工艺卡定义列表"
            :close-on-click-modal="false"
            append-to-body
            :visible.sync="bdTechDefineChooseShow"
            class="JNPF-dialog JNPF-dialog_center"
            lock-scroll
            width="800px"
          >
            <bd-tech-define-choose
              ref="BdTechDefineChoose"
              @onChange="dialogBdTechDefineChange"
            ></bd-tech-define-choose>
          </el-dialog>
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
import { getDictionaryDataSelector } from "@/api/systemData/dictionary";
import { getDataEquipmentSelector } from "@/api/systemData/dataTeam";
import BdTechDefineChoose from "./bdTechDefineChoose";
export default {
  components: { BdTechDefineChoose },
  props: [],
  data() {
    return {
      visible: false,
      loading: false,
      isDetail: false,
      bdTechDefineChooseShow: false,
      tableShowHid: false, //table的隐藏或显示
      dataForm: {
        techDefineId: "",
        techDefineCode: "",
        techDefineName: "",
        title: "",
        oldTitle: "",
        productionProcessId: "",
        productionProcessName: "",
        equipmentId: "",
        equipmentName: "",
        seq: "",
        status: "",
        description: "",
        organizationPersonId: "",
        organizationPersonName: "",
        approvePersonId: "",
        approvePersonName: "",
        examinePersonId: "",
        examinePersonName: "",
        biztechattributeList: {
          tableAttributeListOptions: [], //列名对象
          attributeValue: [], //行值集合
        },
      },
      activelemmaf: ["1", "2"],
      equipmentNameOptions: [],
      rules: {
        organizationPersonId: [
          {
            required: true,
            message: "请输入关键词",
            trigger: "blur",
          },
        ],
        approvePersonId: [
          {
            required: true,
            message: "请输入关键词",
            trigger: "blur",
          },
        ],
        examinePersonId: [
          {
            required: true,
            message: "请输入关键词",
            trigger: "blur",
          },
        ],
        techDefineName: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
        title: [
          {
            required: true,
            message: "请输入",
            trigger: "blur",
          },
        ],
      },
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
            //编辑页面初始化
            url: "/api/project/BizTech/getInfo/" + this.dataForm.id,
            method: "get",
          }).then((res) => {
            this.tableShowHid = true; //明细table显示
            this.dataInfo(res.data);
            if (res.data.productionProcessId) {
              getDataEquipmentSelector(res.data.productionProcessId)
                .then((res) => {
                  this.equipmentNameOptions = res.data;
                })
                .catch(() => {});
            }
            this.loading = false;
          });
        } else {
          this.dataForm = this.$options.data().dataForm;
        }
      });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["elForm"].validate((valid) => {
        if (valid) {
          let valueList = this.dataForm.biztechattributeList.attributeValue;
          if (valueList.length == 0) {
            //行明细至少要填写一行
            this.$message({
              message: "至少要填写一行明细信息!",
              type: "error",
              duration: 1000,
              onClose: () => {},
            });
            return;
          }
          if (this.dataForm.title == this.dataForm.oldTitle) {
            debugger;
            this.$message({
              message: "版本号："+this.dataForm.title+"将成为历史版本，请输入新的版本号！",
              type: "error",
              duration: 2000,
              onClose: () => {
                this.$refs.clickTitle.focus();
              },
            });
            return;
          }
          this.request();
        }
      });
    },
    request() {
      var _data = this.dataList();
      if (!this.dataForm.id) {
        //新增保存
        request({
          url: "/api/project/BizTech/createBizTechAttribute",
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
          //编辑保存
          url: "/api/project/BizTech/infoUpdate/" + this.dataForm.id,
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
    addbiztechattributeList() {
      //新增行
      let item = [];
      this.dataForm.biztechattributeList.attributeValue.push(item);
    },
    delbiztechattributeList(index) {
      this.dataForm.biztechattributeList.attributeValue.splice(index, 1);
    },
    dataList() {
      var _data = JSON.parse(JSON.stringify(this.dataForm));
      for (let i = 0; i < _data.biztechattributeList.length; i++) {
        var _list = _data.biztechattributeList[i];
      }
      return _data;
    },
    dataInfo(dataAll) {
      //编辑页面数据渲染
      let _dataAll = dataAll;
      for (let i = 0; i < _dataAll.biztechattributeList.length; i++) {
        var _list = _dataAll.biztechattributeList[i];
      }
      this.dataForm = _dataAll;
    },
    chooseBdTechDefine() {
      this.bdTechDefineChooseShow = true; //弹框显示
      this.$nextTick(() => {
        this.$refs.BdTechDefineChoose.initData();
      });
    },
    dialogBdTechDefineChange(bdTechDefine) {
      //弹框数据回写
      this.tableShowHid = true; //明细table显示
      //工艺卡定义基本信息
      this.dataForm.techDefineId = bdTechDefine.id;
      this.dataForm.techDefineCode = bdTechDefine.techDefineCode;
      this.dataForm.techDefineName = bdTechDefine.techDefineName;
      this.dataForm.productionProcessId = bdTechDefine.productionProcessId;
      this.dataForm.productionProcessName = bdTechDefine.productionProcessName;
      //工艺卡定义属性明细信息
      this.dataForm.biztechattributeList.tableAttributeListOptions = []; //明细列都要重新置空重新渲染
      this.dataForm.biztechattributeList.attributeValue = []; //明细行都要重新置空重新渲染
      let attributeList = bdTechDefine.bdtechdefineattributeList;
      if (attributeList != null && attributeList.length > 0) {
        let checkList = [];
        for (let i = 0; i < attributeList.length; i++) {
          const e = attributeList[i];
          let item = {
            techDefineAttributeId: e.id,
            attributeId: e.attributeId,
            attributeName: e.attributeName,
            attributeType: e.attributeType,
            uomId: e.uomId,
            uomName: e.uomName,
            attributeValue: e.attributeValue,
            description: e.description,
            seq: e.seq,
          };
          checkList.push(item);
        }
        this.dataForm.biztechattributeList.tableAttributeListOptions =
          checkList; //列对象
      }

      getDataEquipmentSelector(this.dataForm.productionProcessId)
        .then((res) => {
          this.equipmentNameOptions = res.data;
        })
        .catch(() => {});
      this.bdTechDefineChooseShow = false; //弹框关闭
    },
    equipmentChange(value) {
      var obj = {};
      obj = this.equipmentNameOptions.find(function (item) {
        return item.id === value;
      });
      this.dataForm.equipmentId = obj.id;
      this.dataForm.equipmentName = obj.equipmentName;
      console.log(
        "this.dataForm.equipmentId:" +
          this.dataForm.equipmentId +
          "###this.dataForm.equipmentName:" +
          this.dataForm.equipmentName
      );
    },
  },
};
</script>
