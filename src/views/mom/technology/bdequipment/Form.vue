<template>
  <el-dialog
    :title="!dataForm.id ? '新建' : isDetail ? '详情' : '编辑'"
    :close-on-click-modal="false"
    append-to-body
    :visible.sync="visible"
    class="JNPF-dialog JNPF-dialog_center"
    lock-scroll
    width="600px"
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
            <el-form-item label="设备编码" prop="equipmentCode">
              <el-input
                v-model="dataForm.equipmentCode"
                placeholder="请输入"
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="设备名称" prop="equipmentName">
              <el-input
                v-model="dataForm.equipmentName"
                placeholder="请输入"
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
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

          <el-col :span="24">
            <el-form-item label="所属产线" prop="productLinesId">
              <el-select
                v-model="dataForm.productLinesId"
                placeholder="请选择"
                :style="{ width: '100%' }"
                :multiple="false"
              >
                <el-option
                  v-for="(item, index) in productLinesIdOptions"
                  :key="index"
                  :label="item.produceUnitName"
                  :value="item.id"
                  :disabled="item.disabled"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="设备类别" prop="equipmentCategoryId">
              <el-select
                v-model="dataForm.equipmentCategoryId"
                placeholder="请选择"
                :style="{ width: '100%' }"
                :multiple="false"
              >
                <el-option
                  v-for="(item, index) in equipmentCategoryIdOptions"
                  :key="index"
                  :label="item.equipmentCategoryName"
                  :value="item.id"
                  :disabled="item.disabled"
                >
                </el-option>
              </el-select>
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
import { getDictionaryDataSelector } from "@/api/systemData/dictionary";
import { getDataProcessSelector } from "@/api/systemData/dataTeam";
export default {
  components: {},
  props: [],
  data() {
    return {
      visible: false,
      loading: false,
      isDetail: false,
      dataForm: {
        equipmentCode: "",
        equipmentName: "",
        productionProcessId: "",
        productLinesId:"",
        equipmentCategoryId:""
      },
      rules: {
        equipmentCode: [
          {
            required: true,
            message: "请输入",
            trigger: "blur",
          },
        ],
        equipmentName: [
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
            trigger: "change",
          },
        ], productLinesId: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          }],
          equipmentCategoryId:[
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
      },
      productionProcessIdOptions: [],
      productLinesIdOptions:[],
      equipmentCategoryIdOptions:[],
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
            url: "/api/project/BdEquipment/" + this.dataForm.id,
            method: "get",
          }).then((res) => {
            this.dataInfo(res.data);
            this.loading = false;
          });
        } else {
          this.dataForm = this.$options.data().dataForm;
        }
      });
      getDataProcessSelector()
        .then((res) => {
          this.productionProcessIdOptions = res.data;
        })
        .catch(() => {});
        //获取产线下拉列表
        request({
          url: `/api/project/BdFactoryUnit/getBdFactoryUnitListByType?produceUnitType=4`,
            method: "get",
          }).then((res) => {
            this.productLinesIdOptions = res.data;
          });

        //获取所属设备类别下拉列表
        request({
          url: `/api/project/BdEquipmentCategory/getEquipmentCategoryList`,
            method: "get",
          }).then((res) => {
            this.equipmentCategoryIdOptions = res.data;
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
          url: "/api/project/BdEquipment",
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
          url: "/api/project/BdEquipment/" + this.dataForm.id,
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
    dataList() {
      var _data = JSON.parse(JSON.stringify(this.dataForm));
      return _data;
    },
    dataInfo(dataAll) {
      let _dataAll = dataAll;
      this.dataForm = _dataAll;
    },
  },
};
</script>
