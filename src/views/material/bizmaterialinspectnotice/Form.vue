<template>
  <el-dialog
    :title="!dataForm.id ? '新建' : isDetail ? '详情' : '编辑'"
    :close-on-click-modal="false"
    append-to-body
    :visible.sync="visible"
    class="JNPF-dialog JNPF-dialog_center"
    lock-scroll
    width="1200px"
  >
    <el-row :gutter="15" class="">
      <el-form
        ref="elForm"
        :model="dataForm"
        :rules="rules"
        size="medium"
        label-width="100px"
        label-position="right"
      >
        <template v-if="!loading">
          <el-col :span="12">
            <el-form-item label="单据号" prop="noticeNum">
              <el-input
                v-model="dataForm.noticeNum"
                placeholder="自动生成"
                readonly
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="通知单编码" prop="noticeNum">
              <el-input
                v-model="dataForm.billNo"
                placeholder="ERP收料通知单编码"
                readonly
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检验员" prop="inspectorId">
              <user-search
                v-model="dataForm.inspectorId"
                :name="dataForm.inspectorName"
                :defaultLogin="true"
                @name="
                  (value) => {
                    dataForm.inspectorName = value;
                  }
                "
              ></user-search>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检验时间" prop="detectionTime">
              <el-date-picker
                v-model="dataForm.detectionTime"
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
          <el-col :span="12">
            <el-form-item label="班组" prop="teamName">
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
          <el-col :span="12">
            <el-form-item label="班次" prop="shiftName">
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
          <el-col :span="12">
            <el-form-item label="仓管员" prop="warehouseId">
              <user-search
                v-model="dataForm.warehouseId"
                :name="dataForm.warehouseName"
                :defaultLogin="true"
                @name="
                  (value) => {
                    dataForm.warehouseName = value;
                  }
                "
              ></user-search>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收货日期" prop="receivingTime">
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
          <el-col :span="24">
            <el-form-item label-width="0">
              <div class="JNPF-common-title">
                <h2>明细</h2>
              </div>
              <el-table
                :data="dataForm.biz_material_inspect_notice_listList"
                size="mini"
              >
                <el-table-column
                  type="index"
                  width="50"
                  label="序号"
                  align="center"
                />

                <el-table-column
                  prop="materialCode"
                  label="物料编码"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.materialCode"
                      placeholder="请输入"
                      clearable
                      readonly
                      :style="{ width: '100%' }"
                      @click.native="chooseProduct(scope.$index)"
                    >
                    </el-input>
                  </template>
                </el-table-column>

                <el-table-column prop="materialName" label="物料名称">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.materialName" readonly> </el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="materialSpecs"
                  label="物料规格"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.materialSpecs"
                      placeholder="请输入"
                      readonly
                      clearable
                      :style="{ width: '100%' }"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="vendorName"
                  label="供方名称"
                  align="center"
                  width="240"
                >
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.vendorName"
                      placeholder="请输入"
                      clearable
                      readonly
                      :style="{ width: '100%' }"
                      @click.native="chooseSupplier(scope.$index)"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="materialNumber"
                  label="数量"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.materialNumber"
                      placeholder="请输入"
                      clearable
                      :style="{ width: '100%' }"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="detectionResult"
                  label="检测结果"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.detectionResult"
                      placeholder="请选择"
                      clearable
                      :style="{ width: '100%' }"
                      :multiple="false"
                    >
                      <el-option
                        v-for="(item, index) in detectionResultOptions"
                        :key="index"
                        :label="item.fullName"
                        :value="item.id"
                        :disabled="item.disabled"
                      ></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="50">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="text"
                      class="JNPF-table-delBtn"
                      @click="
                        delbiz_material_inspect_notice_listList(scope.$index)
                      "
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
              <div
                class="table-actions"
                @click="addbiz_material_inspect_notice_listList()"
              >
                <el-button type="text" icon="el-icon-plus">添加</el-button>
              </div>
            </el-form-item>
          </el-col>
          <el-dialog
            title="供应商列表"
            :close-on-click-modal="false"
            append-to-body
            :visible.sync="supplierChooseShow"
            class="JNPF-dialog JNPF-dialog_center"
            lock-scroll
            v-if="supplierChooseShow"
            width="1000px"
          >
            <supplier-choose
              ref="SupplierChoose"
              @onChange="dialogSupplierChange"
            ></supplier-choose>
          </el-dialog>
          <el-dialog
            title="产品列表"
            :close-on-click-modal="false"
            append-to-body
            :visible.sync="productChooseShow"
            class="JNPF-dialog JNPF-dialog_center"
            lock-scroll
            v-if="productChooseShow"
            width="1000px"
            height="800px"
          >
            <product-choose
              ref="ProductChoose"
              @onChange="dialogProductChange"
            ></product-choose>
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
  import {getDataClassesSelector, getDataTeamSelector} from "@/api/systemData/dataTeam";
  import ProductChoose from "./productChoose";
  import SupplierChoose from "./supplierChoose";

  export default {
  components: { ProductChoose, SupplierChoose },
  props: [],
  data() {
    return {
      visible: false,
      loading: false,
      isDetail: false,
      productChooseShow: false,
      supplierChooseShow: false,
      rowNum: 0,
      dataForm: {
        billNo: "",
        noticeNum: "",
        inspectorId: "",
        inspectorName: "",
        detectionTime: "",
        teamName: "",
        shiftName: "",
        warehouseId: "",
        warehouseName: "",
        receivingTime: "",
        biz_material_inspect_notice_listList: [],
      },
      rules: {
        inspectorId: [
          {
            required: true,
            message: "请输入",
            trigger: "click",
          },
        ],
        detectionTime: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
        warehouseId: [
          {
            required: true,
            message: "请输入",
            trigger: "click",
          },
        ],
        receivingTime: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
      },
      teamNameOptions: [],
      shiftNameOptions: [],

      detectionResultOptions: [
        { fullName: "未检测", id: "0" },
        { fullName: "正在检测", id: "1" },
        { fullName: "已完成检测", id: "2" },
      ],
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getteamNameOptions();
    this.getshiftNameOptions();
  },
  mounted() {},
  methods: {
    chooseSupplier(index) {
      this.supplierChooseShow = true;
      this.rowNum = index;
      this.$nextTick(() => {
        this.$refs.SupplierChoose.initData();
      });
    },
    chooseProduct(index) {
      this.rowNum = index;
      console.warn("rowNum:" + this.rowNum);
      this.productChooseShow = true;
      this.$nextTick(() => {
        this.$refs.ProductChoose.initData();
      });
    },
    dialogProductChange(product) {
      this.dataForm.biz_material_inspect_notice_listList[
        this.rowNum
      ].materialName = product.productName;
      this.dataForm.biz_material_inspect_notice_listList[
        this.rowNum
      ].materialId = product.id;
      this.dataForm.biz_material_inspect_notice_listList[
        this.rowNum
      ].materialSpecs = product.specification;
      this.dataForm.biz_material_inspect_notice_listList[
        this.rowNum
        ].materialCode = product.productCode;
      this.productChooseShow = false;
    },
    dialogSupplierChange(supplier) {
      this.dataForm.biz_material_inspect_notice_listList[
        this.rowNum
      ].vendorName = supplier.partnerName;
      this.dataForm.biz_material_inspect_notice_listList[this.rowNum].vendorId =
        supplier.id;
      this.dataForm.biz_material_inspect_notice_listList[this.rowNum].vendorCode =
        supplier.partnerCode;
      this.supplierChooseShow = false;
    },
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
            url: "/api/project/BizMaterialInspectNotice/" + this.dataForm.id,
            method: "get",
          }).then((res) => {
            this.dataInfo(res.data);
            this.loading = false;
          });
        } else {
          this.dataForm = this.$options.data().dataForm;
          this.dataForm.detectionTime = new Date().getTime();
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
          url: "/api/project/BizMaterialInspectNotice",
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
          url: "/api/project/BizMaterialInspectNotice/" + this.dataForm.id,
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
    addbiz_material_inspect_notice_listList() {
      let item = {
        materialName: undefined,
        materialId: undefined,
        materialSpecs: undefined,
        vendorName: undefined,
        vendorId: undefined,
        materialNumber: undefined,
        detectionResult: undefined,
        detailId: undefined,
        materialCode: undefined
      };
      this.dataForm.biz_material_inspect_notice_listList.push(item);
    },
    delbiz_material_inspect_notice_listList(index) {
      this.dataForm.biz_material_inspect_notice_listList.splice(index, 1);
    },
    dataList() {
      return JSON.parse(JSON.stringify(this.dataForm));
    },
    dataInfo(dataAll) {
      this.dataForm = dataAll;
    }
  },
};
</script>
