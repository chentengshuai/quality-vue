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
        size="small"
        label-width="100px"
        label-position="right"
      >
        <template v-if="!loading">
          <el-col :span="24">
            <el-card class="mb-20" shadow="always">
              <el-col :span="24">
                <el-form-item label="检验类型" prop="standardType">
                  <el-select v-model="dataForm.standardType" placeholder="请选择检验类型" @change="clearStandard()">
                    <el-option v-for="(item, index) in standardTypeDataList" :key="index" :label="item.fullName"
                               :value="item.enCode" :disabled="item.disabled"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="基准编码" prop="materialName">
                  <el-input
                    v-model="dataForm.materialCode"
                    prefix-icon="el-icon-search"
                    placeholder="请选择"
                    :maxlength="150"
                    clearable
                    readonly
                    :style="{ width: '100%' }"
                    @click.native="selectStandard()"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="基准名称" prop="materialName">
                  <el-input
                    v-model="dataForm.materialName"
                    placeholder="请选择"
                    :maxlength="150"
                    clearable
                    :style="{ width: '100%' }"
                    readonly
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="规格型号" prop="specification">
                  <el-input
                    v-model="dataForm.specification"
                    placeholder="请输入"
                    clearable
                    :style="{ width: '100%' }"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" style="padding-bottom: 20px">
                <el-button type="primary" @click="chooseProduct"
                >查看历史版本
                </el-button
                >
              </el-col>
              <el-col :span="12">
                <el-form-item label="版   本" prop="versionNum">
                  <el-input
                    v-model="dataForm.versionNum"
                    placeholder="请输入"
                    clearable
                    :style="{ width: '100%' }"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="制作日期" prop="makeTime">
                  <el-date-picker
                    v-model="dataForm.makeTime"
                    clearable
                    :style="{ width: '100%' }"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="timestamp"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否启用" prop="enableFlag">
                  <el-switch
                    v-model="dataForm.enableFlag"
                    active-value="1"
                    inactive-value="0"
                  >
                  </el-switch>
                </el-form-item>
              </el-col>
              <el-col :sm="12">
                <el-form-item label="制作人员" prop="makeUserId">
                  <user-search
                    v-model="dataForm.makeUserId"
                    :name="dataForm.makeUserName"
                    :defaultLogin="true"
                    @name="
                      (value) => {
                        dataForm.makeUserName = value;
                      }
                    "
                  ></user-search>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="审查人员" prop="examineUserId">
                  <user-search
                    v-model="dataForm.examineUserId"
                    :name="dataForm.examineUserName"
                    :defaultLogin="true"
                    @name="
                      (value) => {
                        dataForm.examineUserName = value;
                      }
                    "
                  ></user-search>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="核准人员" prop="approvalUserId">
                  <user-search
                    v-model="dataForm.approvalUserId"
                    :name="dataForm.approvalUserName"
                    :defaultLogin="true"
                    @name="
                      (value) => {
                        dataForm.approvalUserName = value;
                      }
                    "
                  ></user-search>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="修订内容" prop="revisedContent">
                  <el-input
                    v-model="dataForm.revisedContent"
                    :maxlength="500"
                    :style="{ width: '100%' }"
                    true
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-card>
          </el-col>
          <el-col :span="24">
            <el-form-item label-width="0">
              <div class="JNPF-common-title">
                <h2>标准明细</h2>
              </div>
              <el-table
                :data="dataForm.bizmaterialstandardlistList"
                size="mini"
              >
                <el-table-column
                  type="index"
                  width="50"
                  label="序号"
                  align="center"
                />
                <el-table-column prop="inspectionItems" label="管理项目">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.inspectionItems"
                      placeholder="请输入"
                      clearable
                      :style="{ width: '100%' }"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="standardValue" label="标准值">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.standardValue"
                      placeholder="请输入"
                      clearable
                      :style="{ width: '100%' }"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="unit" label="单位">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.unit"
                      placeholder="请输入"
                      clearable
                      :style="{ width: '100%' }"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="inspectionMethod" label="检查方法">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.inspectionMethod"
                      placeholder="请输入"
                      clearable
                      :style="{ width: '100%' }"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="sampleSize" label="样本大小" v-if="false">
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
                <el-table-column prop="inspectionFrequency" :label="materialFlag?'样本大小':'检查频率'">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.inspectionFrequency"
                      placeholder="请输入"
                      clearable
                      :style="{ width: '100%' }"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="50">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="text"
                      class="JNPF-table-delBtn"
                      @click="delbizmaterialstandardlistList(scope.$index)"
                    >删除
                    </el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
              <div
                class="table-actions"
                @click="addbizmaterialstandardlistList()"
              >
                <el-button type="text" icon="el-icon-plus">添加</el-button>
              </div>
            </el-form-item>
          </el-col>
          <div>
            <el-dialog
              title="版本历史列表"
              :close-on-click-modal="false"
              append-to-body
              :visible.sync="productChooseShow"
              class="JNPF-dialog JNPF-dialog_center"
              lock-scroll
              width="1000px"
            >
              <product-choose
                ref="ProductChoose"
                @onChange="dialogProductChange"
              ></product-choose>
            </el-dialog>
          </div>
          <el-dialog
            title="原料半成品"
            :close-on-click-modal="false"
            append-to-body
            :visible.sync="materialVisible"
            class="JNPF-dialog JNPF-dialog_center"
            lock-scroll
            width="1000px"
          >
            <material-dialog
              ref="materialDialog"
              @onChange="materialDialogChange"
            ></material-dialog>
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
import {previewDataInterface} from "@/api/systemData/dataInterface";
import {getDictionaryDataByTypeCode} from "@/api/systemData/dictionary";
import ProductChoose from "./productChoose";
import materialDialog from "./materialDialog";

export default {
  components: {ProductChoose,materialDialog},
  props: [],
  data() {
    return {
      visible: false,
      loading: false,
      isDetail: false,
      materialFlag: false,
      standardTypeDataList: [],
      rowNum: 0,
      dataForm: {
        materialName: "",
        materialCode: "",
        specification: "",
        versionNum: "",
        makeTime: "",
        enableFlag: "0",
        makeUserId: "",
        makeUserName: "",
        examineUserId: "",
        examineUserName: "",
        approvalUserId: "",
        approvalUserName: "",
        revisedContent: "",
        bizmaterialstandardlistList: [],
      },
      rules: {
        materialName: [
          {
            required: true,
            message: "请选择",
            trigger: "blur",
          },
        ],
        standardType: [
          {
            required: true,
            message: "请选择",
            trigger: "blur",
          },
        ],
      },
      enableFlagOptions: [
        {fullName: "是", id: "1"},
        {fullName: "否", id: "0"},
      ],
      currentUserOptions: [],
      examineUserIdOptions: [],
      approvalUserIdOptions: [],
      productChooseShow: false,
      materialVisible:false,
      courseVisible:false,
      finishedVisible:false,
      equipmentVisible:false,
    };
  },
  computed: {},
  watch: {},
  created() {
    //this.getgetCurrentUserOptions();
  },
  mounted() {
  },
  methods: {
    getgetCurrentUserOptions() {
      //  request({
      //     url: '/api/project/BizMaterialStandard/getCurrentUser',
      //     method: 'post'
      // }).then(res => {
      //      this.currentUserOptions = res.data
      // })
    },
    init(id, isDetail) {
      this.dataForm.id = id || 0;
      this.visible = true;
      this.isDetail = isDetail || false;
      this.getStandardTypeDataList()
      this.$nextTick(() => {
        this.$refs["elForm"].resetFields();
        if (this.dataForm.id) {
          this.loading = true;
          request({
            url: "/api/project/BizMaterialStandard/" + this.dataForm.id,
            method: "get",
          }).then((res) => {
            this.dataInfo(res.data);
            this.loading = false;
          });
        } else {
          this.dataForm = this.$options.data().dataForm;
        }
      });
    },
    getStandardTypeDataList() {
      getDictionaryDataByTypeCode("standardType").then((res) => {
        this.standardTypeDataList = res.data
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.dataForm.enableFlag = '0';
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
          url: "/api/project/BizMaterialStandard/create",
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
          url: "/api/project/BizMaterialStandard/" + this.dataForm.id,
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
    addbizmaterialstandardlistList() {
      let item = {
        inspectionItems: undefined,
        standardValue: undefined,
        unit: undefined,
        inspectionMethod: undefined,
        sampleSize: undefined,
        inspectionFrequency: undefined,
        imgUrl: undefined,
      };
      this.dataForm.bizmaterialstandardlistList.push(item);
    },
    delbizmaterialstandardlistList(index) {
      this.dataForm.bizmaterialstandardlistList.splice(index, 1);
    },
    dataList() {
      var _data = JSON.parse(JSON.stringify(this.dataForm));
      for (let i = 0; i < _data.bizmaterialstandardlistList.length; i++) {
        var _list = _data.bizmaterialstandardlistList[i];
      }
      return _data;
    },
    dataInfo(dataAll) {
      let _dataAll = dataAll;
      for (let i = 0; i < _dataAll.bizmaterialstandardlistList.length; i++) {
        var _list = _dataAll.bizmaterialstandardlistList[i];
      }
      this.dataForm = _dataAll;
      this.setMaterialFlag();
    },
    chooseProduct() {
      var _materialCode = this.dataForm.materialCode;
      if (_materialCode == null || _materialCode == "") {
        this.$refs["elForm"].validate((valid) => {
          if (valid) {
            this.request();
          }
        });
      } else {
        this.productChooseShow = true;
        this.$nextTick(() => {
          this.$refs.ProductChoose.query.materialCode = _materialCode;
          this.$refs.ProductChoose.initData(this.dataForm.standardType);
        });
      }
    },

    dialogProductChange(product) {
      this.dataForm.materialName = product.materialName;
      this.dataForm.materialCode = product.materialCode;
      //  this.dataForm.versionNum = product.versionNum;
      // this.dataForm.makeTime = product.makeTime;
      this.dataForm.enableFlag = product.enableFlag;
      this.dataForm.makeUserId = product.makeUserId;
      this.dataForm.examineUserId = product.examineUserId;
      this.dataForm.approvalUserId = product.approvalUserId;
      this.dataForm.revisedContent = product.revisedContent;
      //  this.rollInfo(false);
      request({
        url:
          "/api/project/BizMaterialStandard/getStandardListList/" + product.id,
        method: "get",
      }).then((res) => {
        this.dataForm.bizmaterialstandardlistList = res.data;
        this.loading = false;
      });
      request({
        url:
          "/api/project/BizMaterialStandard/getMaxVersion/" + this.dataForm.materialCode,
        method: "get",
      }).then((res) => {
        var versionNum = res.data.versionNum;
        if (versionNum == null || versionNum == '') {
          this.dataForm.versionNum = '1';
        } else {
          try {
            this.dataForm.versionNum = versionNum / 1 + 0.1;
          } catch (e) {
            this.dataForm.versionNum = versionNum;
          }
        }
      });
      this.productChooseShow = false;
    },
    selectStandard() {
      if (this.dataForm.standardType) {
        if (this.dataForm.standardType == "materialCheck") { // 物料/半成品检验
          this.materialVisible = true;
          this.$nextTick(() => {
            this.$refs.materialDialog.initData();
          });
        } else if (this.dataForm.standardType == "courseCheck") { // 过程工序检验

        } else if (this.dataForm.standardType == "finishedCheck") { // 成品检验

        } else if (this.dataForm.standardType == "equipmentCheck") { // 设备检验

        }
      } else {
        this.$message.error("请选择检验类型");
      }
    },
    // 物料/半导体
    materialDialogChange(dataRow){
      this.dataForm.materialCode = dataRow.materialCode
      this.dataForm.materialName = dataRow.materialName
      this.dataForm.specification = dataRow.materialSpec
      this.materialVisible = false;
    },
    clearStandard() {
      this.dataForm.materialName = ""
      this.dataForm.materialCode = ""
      this.dataForm.specification = ""
      this.dataForm.specification = ""
    },
    setMaterialFlag() {
      //如果物资是 包含铜线或者盐酸 则显示 样本大小，否则显示 检测频率
      if (this.dataForm.materialName.indexOf('铜线') >= 0 || this.dataForm.materialName.indexOf('盐酸') >= 0) {
        this.materialFlag = true;
      } else {
        this.materialFlag = false;
      }
    },
    handleAvatarSuccess(res) {
      if (res.code === 200 && res.data && res.data.url) {
        this.dataForm.bizmaterialstandardlistList[this.rowNum].imgUrl =
          res.data.url;
      } else {
        this.$message.error("图片上传失败");
      }
    },
    chooseImgIndex(index) {
      console.log(index);
      this.rowNum = index;
      return;
    },
  },
};
</script>
