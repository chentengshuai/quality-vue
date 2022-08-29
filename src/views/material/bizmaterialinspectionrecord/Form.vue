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
    <el-row :gutter="15">
      <el-form
        ref="elForm"
        :model="dataForm"
        :rules="rules"
        size="medium"
        label-width="110px"
        label-position="right"
      >
        <template v-if="!loading">
          <el-col :span="8">
            <el-form-item label="物料名称" prop="materialName">
              <el-input
                v-model="dataForm.materialName"
                placeholder="物料名称"
                readonly
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物料编码" prop="materialCode">
              <el-input
                v-model="dataForm.materialCode"
                placeholder="物料编码"
                readonly
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="规格型号" prop="specification">
              <el-input
                v-model="dataForm.specification"
                placeholder="规格型号"
                readonly
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="false">
            <el-form-item label="通知行ID" prop="noticeListId">
              <el-input
                v-model="dataForm.noticeListId"
                readonly
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="制造单位" prop="vendorName">
              <el-input
                v-model="dataForm.vendorName"
                placeholder="供应商"
                readonly
                clearable
                :style="{ width: '280px','margin-right':'20px' }"
              >
              </el-input>
              <el-button type="primary" @click="chooseTask"
              >选择检测任务
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="批次号" prop="batchNumber">
              <el-input
                v-model="dataForm.batchNumber"
                placeholder="请输入"
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="进料数" prop="materialNumber">
              <el-input
                v-model="dataForm.materialNumber"
                placeholder="进料数量"
                readonly
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="进料日期" prop="receivingTime">
              <el-date-picker
                v-model="dataForm.receivingTime"
                placeholder="请选择"
                clearable
                :style="{ width: '100%' }"
                type="date"
                format="yyyy-MM-dd"
                value-format="timestamp"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
<!--          <el-col :span="8">-->
<!--            <el-form-item label="检验员" prop="inspectorId">-->
<!--              <user-search-->
<!--                v-model="dataForm.inspectorId"-->
<!--                :name="dataForm.inspectorName"-->
<!--                :defaultLogin="true"-->
<!--                @name="-->
<!--                  (value) => {-->
<!--                    dataForm.inspectorName = value;-->
<!--                  }-->
<!--                "-->
<!--              ></user-search>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :span="8">
            <el-form-item label="班  组" prop="teamName">
              <el-select
                v-model="dataForm.teamName"
                placeholder="请选择"
                clearable
                :style="{ width: '100%' }"
                :multiple="false"
              >
                <el-option
                  v-for="(item, index) in teamNameOptions"
                  :key="index"
                  :label="item.teamName"
                  :value="item.teamName"
                  :disabled="item.disabled"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="班  次" prop="shiftName">
              <el-select
                v-model="dataForm.shiftName"
                placeholder="请选择"
                clearable
                :style="{ width: '100%' }"
                :multiple="false"
              >
                <el-option
                  v-for="(item, index) in shiftNameOptions"
                  :key="index"
                  :label="item.classesName"
                  :value="item.classesName"
                  :disabled="item.disabled"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="检验规格" prop="inspectionSpecs">
              <el-select
                v-model="dataForm.inspectionSpecs"
                placeholder="请选择"
                clearable
                :style="{ width: '100%' }"
                :multiple="false"
              >
                <el-option
                  v-for="(item, index) in inspectionSpecsOptions"
                  :key="index"
                  :label="item.fullName"
                  :value="item.id"
                  :disabled="item.disabled"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="综合判定结果" prop="comprehensiveJudge">
              <el-select
                v-model="dataForm.comprehensiveJudge"
                placeholder="请选择"
                clearable
                :style="{ width: '100%' }"
                :multiple="false"
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
<!--          <el-col :span="8">-->
<!--            <el-form-item label="核准人" prop="approvalUserId">-->
<!--              <user-search-->
<!--                v-model="dataForm.approvalUserId"-->
<!--                :name="dataForm.approvalUserName"-->
<!--                :defaultLogin="true"-->
<!--                @name="-->
<!--                  (value) => {-->
<!--                    dataForm.approvalUserName = value;-->
<!--                  }-->
<!--                "-->
<!--              ></user-search>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :span="24">
            <el-card class="mb-20" shadow="always">
              <el-col :span="8">
                <el-form-item label="外 观" prop="appearanceNum">
                  <el-input
                    v-model="dataForm.appearanceNum"
                    placeholder="请输入"
                    clearable
                    :style="{ width: '100%' }"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="尺 寸" prop="sizeNum">
                  <el-input
                    v-model="dataForm.sizeNum"
                    placeholder="请输入"
                    clearable
                    :style="{ width: '100%' }"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="成 份" prop="ingredientsNum">
                  <el-input
                    v-model="dataForm.ingredientsNum"
                    placeholder="请输入"
                    clearable
                    :style="{ width: '100%' }"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="检验数量" prop="inspectionQty">
                  <el-input
                    v-model="dataForm.inspectionQty"
                    placeholder="检验数量"
                    clearable
                    :style="{ width: '100%' }"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="合格数量" prop="qualifiedQty">
                  <el-input
                    v-model="dataForm.qualifiedQty"
                    placeholder="合格数量"
                    clearable
                    :style="{ width: '100%' }"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-card>
          </el-col>


<!--          <el-col :span="24">-->
<!--            <el-button type="primary" @click="syncStandardList">同步检验标准</el-button>-->
<!--          </el-col>-->

          <el-col :span="24">
            <el-form-item label-width="0">
              <div class="JNPF-common-title">
                <h2>明细</h2>
              </div>
              <el-table
                :data="dataForm.bizmaterialinspectionrecordlistList"
                :span-method="arraySpanMethod"
                size="mini"
              >
                <el-table-column
                  type="index"
                  width="50"
                  label="序号"
                  align="center"
                />
                <el-table-column prop="inspectionItems" label="管理项目" width="130">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.inspectionItems"
                      clearable
                      :style="{ width: '100%' }"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="standardValue" label="标准值" width="210">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.standardValue"
                      clearable
                      :style="{ width: '100%' }"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="unit" label="单位" width="100">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.unit"
                      clearable
                      :style="{ width: '100%' }"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="inspectionMethod" label="检查方法" width="140">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.inspectionMethod"
                      clearable
                      :style="{ width: '100%' }"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="inspectionFrequency" label="检查频率" width="140">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.inspectionFrequency"
                      clearable
                      :style="{ width: '100%' }"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="sampleSize" label="样本大小" width="120">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.sampleSize"
                      placeholder="请输入"
                      clearable
                      :style="{ width: '100%' }"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="detectionValue" label="检测值1" width="120">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.detectionValue"
                      placeholder="请输入"
                      clearable
                      :style="{ width: '100%' }"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="detectionValue" label="检测值2" width="120">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.detectionValue2"
                      placeholder="请输入"
                      clearable
                      :disabled="scope.row.inspectionItems=='材质报告' || scope.row.inspectionItems=='REACH' || scope.row.inspectionItems=='ROHS'"
                      :style="{ width: '100%' }"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="detectionValue" label="检测值3" width="120">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.detectionValue3"
                      placeholder="请输入"
                      clearable
                      :disabled="scope.row.inspectionItems=='材质报告' || scope.row.inspectionItems=='REACH' || scope.row.inspectionItems=='ROHS'"
                      :style="{ width: '100%' }"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="detectionValue" label="检测值4" width="120">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.detectionValue4"
                      placeholder="请输入"
                      clearable
                      :disabled="scope.row.inspectionItems=='材质报告' || scope.row.inspectionItems=='REACH' || scope.row.inspectionItems=='ROHS'"
                      :style="{ width: '100%' }"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="detectionValue" label="检测值5" width="120">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.detectionValue5"
                      placeholder="请输入"
                      clearable
                      :disabled="scope.row.inspectionItems=='材质报告' || scope.row.inspectionItems=='REACH' || scope.row.inspectionItems=='ROHS'"
                      :style="{ width: '100%' }"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="judgmentResult" label="判定结果" width="120">
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.judgmentResult"
                      placeholder="请选择"
                      clearable
                      :style="{ width: '100%' }"
                      :multiple="false"
                    >
                      <el-option
                        v-for="(item, index) in judgmentResultOptions"
                        :key="index"
                        :label="item.fullName"
                        :value="item.id"
                        :disabled="item.disabled"
                      ></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="imgUrl" label="图片" width="110">
                  <template slot-scope="scope">
                    <el-upload
                      class="avatar-uploader"
                      :action="define.comUploadUrl + '/materialcheck'"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess"
                      accept="image/*"
                    >
                      <img
                        v-if="scope.row.imgUrl"
                        :src="define.comUrl + scope.row.imgUrl"
                        class="avatar"  width="100" height="100"
                      />
                      <i
                        v-else
                        class="el-icon-plus avatar-uploader-icon"
                        @click="chooseImgIndex(scope.$index)"
                      />
                    </el-upload>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="50">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="text"
                      class="JNPF-table-delBtn"
                      @click="
                        delbizmaterialinspectionrecordlistList(scope.$index)
                      "
                    >删除
                    </el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
              <div
                class="table-actions"
                @click="addbizmaterialinspectionrecordlistList()"
              >
                <el-button type="text" icon="el-icon-plus">添加</el-button>
              </div>
            </el-form-item>
          </el-col>
          <el-dialog
            title="任务列表"
            :close-on-click-modal="false"
            append-to-body
            :visible.sync="taskChooseShow"
            class="JNPF-dialog JNPF-dialog_center"
            lock-scroll
            width="1000px"
          >
            <task-choose
              ref="TaskChoose"
              @onChange="dialogTaskChange"
            ></task-choose>
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
  import {getDataClassesSelector, getDataTeamSelector,} from "@/api/systemData/dataTeam";
  import TaskChoose from "./taskChoose";

  export default {
    components: {TaskChoose},
    props: [],
    data() {
      return {
        visible: false,
        loading: false,
        isDetail: false,
        taskChooseShow: false,
        rowNum: 0,
        dataForm: {
          materialName: "",
          materialCode: "",
          specification: "",
          noticeListId: "",
          vendorName: "",
          inspectorTime: "",
          batchNumber: "",
          materialNumber: "",
          inspectionQty: "",
          qualifiedQty: "",
          receivingTime: "",
          inspectorId: "",
          inspectorName: "",
          teamName: "",
          shiftName: "",
          inspectionSpecs: "正常",
          comprehensiveJudge: "合格",
          approvalUserId: "",
          approvalUserName: "",
          state: "",
          approvalTime: "",
          appearanceNum: "",
          sizeNum: "",
          ingredientsNum: "",
          bizmaterialinspectionrecordlistList: [],
        },
        rules: {
          inspectionQty: [
            {
              pattern: /^(\d+)(\.\d+)?$/,
              message: '请输入正确的数字',
              trigger: 'blur'
            }
          ],
          qualifiedQty: [
            {
              pattern: /^(\d+)(\.\d+)?$/,
              message: '请输入正确的数字',
              trigger: 'blur'
            }
          ],
          batchNumber: [
            {
              required: true,
              message: "请输入",
              trigger: "blur",
            },
          ],
          receivingTime: [
            {
              required: true,
              message: "请选择",
              trigger: "change",
            },
          ],
          inspectorId: [
            {
              required: true,
              message: "请选择",
              trigger: "click",
            },
          ],
          inspectionSpecs: [
            {
              required: true,
              message: "请至少选择一个",
              trigger: "change",
            },
          ],
          comprehensiveJudge: [
            {
              required: true,
              message: "请选择",
              trigger: "change",
            },
          ],
        },
        teamNameOptions: [],
        shiftNameOptions: [],
        inspectionSpecsOptions: [
          {fullName: "正常", id: "正常"},
          {fullName: "减量", id: "减量"},
          {fullName: "加严", id: "加严"},
        ],
        comprehensiveJudgeOptions: [
          {fullName: "合格", id: "合格"},
          {fullName: "不合格", id: "不合格"},
          {fullName: "批退", id: "批退"},
          {fullName: "全检", id: "全检"},
        ],
        judgmentResultOptions: [
          {fullName: "OK", id: "OK"},
          {fullName: "NG", id: "NG"},
        ],
      };
    },
    computed: {},
    watch: {},
    created() {
      this.getteamNameOptions();
      this.getshiftNameOptions();
    },
    mounted() {
    },
    methods: {
      getteamNameOptions() {
        getDataTeamSelector().then((res) => {
          this.teamNameOptions = res.data;
        });
      },
      getshiftNameOptions() {
        getDataClassesSelector().then((res) => {
          this.shiftNameOptions = res.data;
        });
      },
      init(id, isDetail) {
        this.dataForm.id = id || 0;
        this.visible = true;
        this.isDetail = isDetail || false;
        this.$nextTick(() => {
          this.$refs["elForm"].resetFields();
          if (this.dataForm.id) {
            this.loading = true;
            request({
              url: "/api/project/BizMaterialInspectionRecord/" + this.dataForm.id,
              method: "get",
            }).then((res) => {
              this.dataInfo(res.data);
              this.loading = false;
            });
          } else {
            this.dataForm = this.$options.data().dataForm;
            this.dataForm.receivingTime = new Date().getTime();
          }
        });
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
        var _data = this.dataList();
        if (!this.dataForm.id) {
          request({
            url: "/api/project/BizMaterialInspectionRecord",
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
            url: "/api/project/BizMaterialInspectionRecord/" + this.dataForm.id,
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
      addbizmaterialinspectionrecordlistList() {
        let item = {
          inspectionItems: undefined,
          standardValue: undefined,
          unit: undefined,
          inspectionMethod: undefined,
          inspectionFrequency: undefined,
          sampleSize: undefined,
          detectionValue: undefined,
          detectionValue2: undefined,
          detectionValue3: undefined,
          detectionValue4: undefined,
          detectionValue5: undefined,
          judgmentResult: undefined,
          imgUrl: undefined,
        };
        this.dataForm.bizmaterialinspectionrecordlistList.push(item);
      },
      delbizmaterialinspectionrecordlistList(index) {
        this.dataForm.bizmaterialinspectionrecordlistList.splice(index, 1);
      },
      dataList() {
        return JSON.parse(JSON.stringify(this.dataForm));
      },
      dataInfo(dataAll) {
        this.dataForm = dataAll;
      },
      chooseTask() {
        this.taskChooseShow = true;
        this.$nextTick(() => {
          this.$refs.TaskChoose.initData();
        });
      },
      dialogTaskChange(task) {
        this.dataForm.materialCode = task.materialCode;
        this.dataForm.specification = task.materialSpecs;
        this.dataForm.materialName = task.materialName;
        this.dataForm.noticeListId = task.id;
        this.dataForm.vendorName = task.vendorName;
        this.dataForm.materialNumber = task.materialNumber;
        this.taskChooseShow = false;
        this.syncStandardList();
      },
      syncStandardList() {
        this.listLoading = true;
        this.$nextTick(() => {
          //this.$refs['elForm'].resetFields();
          if (this.dataForm.materialCode) {
            this.loading = true;
            request({
              url:
                "/api/project/BizMaterialStandard/getStandardList/" +
                this.dataForm.materialCode,
              method: "get",
            }).then((res) => {
              if (res.data.length > 0) {
                let delLength =
                  this.dataForm.bizmaterialinspectionrecordlistList.length;
                for (let j = 0; j < delLength; j++) {
                  this.delbizmaterialinspectionrecordlistList(0);
                }
              }
              debugger;
              for (let i = 0; i < res.data.length; i++) {
                this.addbizmaterialinspectionrecordlistList();
                if (res.data[i].inspectionItems == null || res.data[i].inspectionItems == "") {
                  this.dataForm.bizmaterialinspectionrecordlistList[i].inspectionItems = "/";
                } else {
                  this.dataForm.bizmaterialinspectionrecordlistList[i].inspectionItems = res.data[i].inspectionItems;
                }

                if (res.data[i].standardValue == null || res.data[i].standardValue == "") {
                  this.dataForm.bizmaterialinspectionrecordlistList[i].standardValue = "/";
                } else {
                  this.dataForm.bizmaterialinspectionrecordlistList[i].standardValue = res.data[i].standardValue;
                }

                if (res.data[i].unit == null || res.data[i].unit == "") {
                  this.dataForm.bizmaterialinspectionrecordlistList[i].unit = "/";
                } else {
                  this.dataForm.bizmaterialinspectionrecordlistList[i].unit = res.data[i].unit;
                }

                if (res.data[i].inspectionMethod == null || res.data[i].inspectionMethod == "") {
                  this.dataForm.bizmaterialinspectionrecordlistList[i].inspectionMethod = "/";
                } else {
                  this.dataForm.bizmaterialinspectionrecordlistList[i].inspectionMethod = res.data[i].inspectionMethod;
                }

                if (res.data[i].sampleSize == null || res.data[i].sampleSize == "") {
                  this.dataForm.bizmaterialinspectionrecordlistList[i].sampleSize = "/";
                } else {
                  this.dataForm.bizmaterialinspectionrecordlistList[i].sampleSize = res.data[i].sampleSize;
                }

                if (res.data[i].inspectionFrequency == null || res.data[i].inspectionFrequency == "") {
                  this.dataForm.bizmaterialinspectionrecordlistList[i].inspectionFrequency = "/";
                } else {
                  this.dataForm.bizmaterialinspectionrecordlistList[i].inspectionFrequency = res.data[i].inspectionFrequency;
                }
              }
              this.loading = false;
            });
          } else {
            this.$message({
              type: "info",
              message: "请选择检测任务!"
            });
          }
        });
      },
      handleAvatarSuccess(res) {
        if (res.code === 200 && res.data && res.data.url) {
          this.dataForm.bizmaterialinspectionrecordlistList[this.rowNum].imgUrl =
            res.data.url;
        } else {
          this.$message.error("图片上传失败");
        }
      },
      chooseImgIndex(index) {
        this.rowNum = index;
        return;
      },
      arraySpanMethod({row, column, rowIndex, columnIndex}) {
        // row和column是表格的行和列,里面是当前行和列的值,也就是tableData里的值,rowIndex,columnIndex是当前行和列的序号
        var indexs = [];//记录要合并项目的下标
        if (this.dataForm.bizmaterialinspectionrecordlistList != null && this.dataForm.bizmaterialinspectionrecordlistList.length > 0) {
          for (var i = 0; i < this.dataForm.bizmaterialinspectionrecordlistList.length; i++) {
            if (this.dataForm.bizmaterialinspectionrecordlistList[i].inspectionItems == '材质报告') {
              indexs.push(i);
            }
            if (this.dataForm.bizmaterialinspectionrecordlistList[i].inspectionItems == 'REACH') {
              indexs.push(i);
            }
            if (this.dataForm.bizmaterialinspectionrecordlistList[i].inspectionItems == 'ROHS') {
              indexs.push(i);
            }
          }
        }
        if (indexs != null && indexs.length > 0) {
          if (indexs.indexOf(rowIndex) >= 0) {
            // 合并第二行
            if (columnIndex === 7) {
              // 从第二列开始
              return [1, 5];
              // 这里返回的是行和列的合并数量,可以返回一个数组,也可以返回一个对象,效果一样
              // 这里rowspan为1是行有一行合并,colspan为3是列有3列合并,你要合并几行几列就写上相应的数字
              // 这里要写一个else的判断,不然被合并列的原始数据会填充到合并之后的表格里
              // 这个判断是把合并的第3列,第4列的值省略,在合并的表格右边直接填原先第5列的值,合并了几列,就省略几列的值
            } else if (columnIndex === 8 || columnIndex === 9 || columnIndex === 10 || columnIndex === 11) {
              return [0, 0];
            }
          }
        }
      },
    },
  };
</script>
