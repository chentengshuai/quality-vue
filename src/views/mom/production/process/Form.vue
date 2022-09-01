<template>
  <el-dialog
    :title="!dataForm.id ? '新建' : isDetail ? '详情' : '编辑'"
    :close-on-click-modal="false"
    append-to-body
    :visible.sync="visible"
    class="JNPF-dialog JNPF-dialog_center"
    lock-scroll
    width="80%"
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
            <el-form-item label="生产工序名称" prop="productionProcessName">
              <el-input
                v-model="dataForm.productionProcessName"
                placeholder="请输入"
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产工序编码" prop="productionProcessCode">
              <el-input
                v-model="dataForm.productionProcessCode"
                placeholder="请输入"
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="描述" prop="description">
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
            <el-tabs tab-position="top" class="mb-20">
              <el-tab-pane label="工序明细">
                <el-col :span="24">
                  <el-form-item label-width="0">
                    <!--                  <div class="JNPF-common-title">
                                        <h2>明细</h2>
                                      </div>-->
                    <el-table :data="dataForm.bdproductionprocessattributeList" size="mini">
                      <el-table-column  type="index" width="50" label="序号"  align="center"/>
                      <el-table-column prop="groupName" label="分组名称">
                        <template slot-scope="scope">
                          <el-input  v-model="scope.row.groupName"  placeholder="请输入" clearable :style="{ width: '100%' }">
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="attributeName" label="属性名称">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.attributeName" placeholder="请输入" clearable  :style="{ width: '100%' }">
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="attributeType" label="属性类型">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.attributeType"  placeholder="请选择" clearable :style="{ width: '100%' }" :multiple="false" >
                            <el-option
                              v-for="(item, index) in attributeTypeOptions"
                              :key="index" :label="item.fullName"
                              :value="item.id" :disabled="item.disabled"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="uomName" label="计量单位">
                        <template slot-scope="scope">
                          <el-select
                            v-model="scope.row.uomName"
                            placeholder="请选择" clearable
                            :style="{ width: '100%' }" :multiple="false" >
                            <el-option
                              v-for="(item, index) in uomNameOptions"
                              :key="index" :label="item.fullName"
                              :value="item.id" :disabled="item.disabled" ></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="isColumnAttribute" label="是否列属性">
                        <template slot-scope="scope">
                          <el-switch v-model="scope.row.isColumnAttribute" active-value="1" inactive-value="0" >
                          </el-switch>
                        </template>
                      </el-table-column>
                      <el-table-column prop="standardType" label="标准类型">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.standardType"  placeholder="请输入" clearable :style="{ width: '100%' }">
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="standardValue" label="标准值">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.standardValue" placeholder="请输入"  clearable :style="{ width: '100%' }">
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="minValues" label="最小值">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.minValues" placeholder="请输入" clearable :style="{ width: '100%' }">
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="maxValues" label="最大值">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.maxValues" placeholder="请输入"  clearable :style="{ width: '100%' }">
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="defaultValue" label="默认值">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.defaultValue" placeholder="请输入"  clearable :style="{ width: '100%' }">
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="isPeriodicity" label="是否周期性">
                        <template slot-scope="scope">
                          <el-switch  v-model="scope.row.isPeriodicity" active-value="1"  inactive-value="0">
                          </el-switch>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" width="50">
                        <template slot-scope="scope">
                          <el-button size="mini" type="text" class="JNPF-table-delBtn"
                                     @click="delbdproductionprocessattributeList(scope.$index)">删除
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                    <div class="table-actions" @click="addbdproductionprocessattributeList()">
                      <el-button type="text" icon="el-icon-plus">添加</el-button>
                    </div>
                  </el-form-item>
                </el-col>
              </el-tab-pane>
              <el-tab-pane label="工序物料">
                <el-col :span="24">
                  <el-button type="primary"  icon="el-icon-plus"
                    @click="selectMaterialList">选择物料
                  </el-button>
                </el-col>
                <el-col :span="24">
                  <el-form-item label-width="0">
                    <el-table :data="dataForm.bdProductionProcessMaterialModelList" size="mini">
                      <el-table-column  type="index" width="50" label="序号"  align="center"/>
                      <el-table-column prop="materialCode" label="产品编码">
                        <template slot-scope="scope">
                          <el-input  v-model="scope.row.materialCode" readonly :style="{ width: '100%' }">
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="materialName" label="产品名称">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.materialName" readonly :style="{ width: '100%' }">
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="typeName" label="类型">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.typeName" readonly :style="{ width: '100%' }">
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="materialSpec" label="规格">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.materialSpec" readonly :style="{ width: '100%' }">
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="materialModel" label="型号">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.materialModel" readonly :style="{ width: '100%' }">
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" width="50">
                        <template slot-scope="scope">
                          <el-button size="mini" type="text" class="JNPF-table-delBtn"
                                     @click="delBdProductionProcessMaterialModelList(scope.$index)">删除
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form-item>
                </el-col>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </template>
      </el-form>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false"> 取 消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" v-if="!isDetail">
        确 定</el-button>
    </span>
    <el-dialog
      title="原料半成品"
      :close-on-click-modal="false"
      append-to-body
      :visible.sync="materialVisible"
      class="JNPF-dialog JNPF-dialog_center"
      lock-scroll
      width="1000px">

      <material-dialog
        ref="materialDialog"
        @onChange="materialDialogChange"
      ></material-dialog>
    </el-dialog>
  </el-dialog>
</template>
<script>
import request from "@/utils/request";
import {previewDataInterface} from "@/api/systemData/dataInterface";
import {getDictionaryDataSelector} from "@/api/systemData/dictionary";
import materialDialog from "./materialDialog";

export default {
  components: {materialDialog},
  props: [],
  data() {
    return {
      visible: false,
      loading: false,
      isDetail: false,
      materialVisible:false,
      dataForm: {
        productionProcessName: "",
        productionProcessCode: "",
        description: "",
        bdproductionprocessattributeList: [],
        bdProductionProcessMaterialModelList:[]
      },
      rules: {},

      attributeTypeOptions: [
        {fullName: "选项一", id: "1"},
        {fullName: "选项二", id: "2"},
      ],
      uomNameOptions: [
        {fullName: "选项一", id: "1"},
        {fullName: "选项二", id: "2"},
      ],
    };
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    init(id, isDetail) {
      debugger;
      this.dataForm.id = id || 0;
      this.visible = true;
      this.isDetail = isDetail || false;
      this.$nextTick(() => {
        //this.$refs['elForm'].resetFields();

        if (this.dataForm.id) {
          this.loading = true;
          request({
            url: "/api/project/BdProductionProcess/" + this.dataForm.id,
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
    // 表单提交
    dataFormSubmit() {
      this.$refs["elForm"].validate((valid) => {
        if (valid) {
          this.request();
        }
      });
    },
    materialDialogChange(dataList){
      this.dataForm.bdProductionProcessMaterialModelList = dataList
      this.materialVisible = false;
    },
    selectMaterialList(){
      this.materialVisible = true;
      this.$nextTick(() => {
        this.$refs.materialDialog.initData(this.dataForm.bdProductionProcessMaterialModelList);
      });
    },
    delBdProductionProcessMaterialModelList(index) {
      this.dataForm.bdProductionProcessMaterialModelList.splice(index, 1);
    },
    request() {
      var _data = this.dataList();
      if (!this.dataForm.id) {
        request({
          url: "/api/project/BdProductionProcess",
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
          url: "/api/project/BdProductionProcess/" + this.dataForm.id,
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
    addbdproductionprocessattributeList() {
      let item = {
        groupName: undefined,
        attributeName: undefined,
        attributeType: undefined,
        uomName: undefined,
        isColumnAttribute: undefined,
        standardType: undefined,
        standardValue: undefined,
        minValues: undefined,
        maxValues: undefined,
        defaultValue: undefined,
        isPeriodicity: undefined,
      };
      this.dataForm.bdproductionprocessattributeList.push(item);
    },
    delbdproductionprocessattributeList(index) {
      this.dataForm.bdproductionprocessattributeList.splice(index, 1);
    },
    dataList() {
      var _data = JSON.parse(JSON.stringify(this.dataForm));
      for (let i = 0; i < _data.bdproductionprocessattributeList.length; i++) {
        var _list = _data.bdproductionprocessattributeList[i];
      }
      return _data;
    },
    dataInfo(dataAll) {
      let _dataAll = dataAll;
      for (
        let i = 0;
        i < _dataAll.bdproductionprocessattributeList.length;
        i++
      ) {
        var _list = _dataAll.bdproductionprocessattributeList[i];
      }
      this.dataForm = _dataAll;
    },
  },
};
</script>
