<template>
  <el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'"
             :close-on-click-modal="false" append-to-body
             :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
             width="80%">
    <el-row :gutter="15" class="">
      <el-form ref="elForm" :model="dataForm" :rules="rules" size="medium" label-width="100px" label-position="right">
        <template v-if="!loading">
          <el-col :span="8">
            <el-form-item label="检验编码" prop="inspectionCode">
              <el-input v-model="dataForm.inspectionCode" clearable readonly :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物料名称" prop="materialName">
              <el-input v-model="dataForm.materialName" placeholder="请输入" clearable readonly :style='{"width":"100%"}'
                        @click.native="chooseMaterial()">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="采购订单号" prop="relationName">
              <el-input v-model="dataForm.relationName" placeholder="请输入" clearable :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="检验基准" prop="standardName">
              <el-select
                v-model="dataForm.standardName"
                placeholder="请选择"
                :style="{ width: '100%' }"
                :multiple="false"
                @change="changeStandard"
              >
                <el-option
                  v-for="(item, index) in standardOptions"
                  :key="index"
                  :label="item.standardName"
                  :value="item.standardName"
                  :disabled="item.disabled"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="货品数量" prop="materialNumber">
              <el-input-number v-model="dataForm.materialNumber" placeholder="数字文本" :step="1" controls-position='right'
                               @blur="materialNumberChange(dataForm.materialNumber)">
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="抽样数" prop="sampleNumber">
              <el-input-number v-model="dataForm.sampleNumber" placeholder="数字文本" :step="1" controls-position='right'
                               @blur="sampleNumberChange(dataForm.sampleNumber)">
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="不良数" prop="badNumber">
              <el-input-number v-model="dataForm.badNumber" placeholder="数字文本" :step="1" controls-position='right'
                               @blur="badNumberChange(dataForm.badNumber)">
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="不良率" prop="badPercent">
              <el-input v-model="dataForm.badPercent" placeholder="请输入" readonly clearable :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="检验结果" prop="result">
              <el-select
                v-model="dataForm.result"
                placeholder="请选择"
                clearable
                :style="{ width: '100%' }"
                :multiple="false"
              >
                <el-option
                  v-for="(item, index) in typeOptions"
                  :key="index"
                  :label="item.fullname"
                  :value="item.value"
                  :disabled="item.disabled"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="送检人" prop="submitterId">
              <user-search v-model="dataForm.submitterId" :name="dataForm.submitterName"
                           @name="value => { dataForm.submitterName = value }">
              </user-search>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="检验员" prop="inspectorId">
              <user-search v-model="dataForm.inspectorId" :name="dataForm.inspectorName"
                           @name="value => { dataForm.inspectorName = value }">
              </user-search>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="检验时间" prop="inspectTime">
              <el-date-picker v-model="dataForm.inspectTime" placeholder="请选择" clearable :style='{"width":"100%"}'
                              type="date" format="yyyy-MM-dd" value-format="timestamp">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="供应商" prop="partnerName">
              <el-input v-model="dataForm.partnerName" placeholder="请输入" clearable readonly :style='{"width":"100%"}'
                        @click.native="choosePartner()">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="dataForm.remark" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label-width="0">
              <div class="JNPF-common-title">
                <h2>明细</h2>
              </div>
              <el-table :data="dataForm.bizqualityinspectiondetailList" size='mini'>
                <el-table-column type="index" width="50" label="序号" align="center"/>
                <el-table-column prop="inspectionItems" label="检测项">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.inspectionItems" placeholder="请输入" readonly :style='{"width":"100%"}'>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="standardValue" label="标准值">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.standardValue" placeholder="请输入" readonly :style='{"width":"100%"}'>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="unit" label="单位">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.unit" placeholder="请输入" readonly :style='{"width":"100%"}'>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="inspectionMethod" label="检查方法">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.inspectionMethod" placeholder="请输入" readonly :style='{"width":"100%"}'>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="inspectionFrequency" label="检查频率">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.inspectionFrequency" placeholder="请输入" readonly
                              :style='{"width":"100%"}'>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="detectionValue" label="检测值">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.detectionValue" placeholder="请输入" clearable :style='{"width":"100%"}'>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="sampleNumber" label="抽样数">
                  <template slot-scope="scope">
                    <el-input-number v-model="scope.row.sampleNumber" placeholder="数字文本" :step="1"
                                     controls-position='right' @blur="rowNumberChange(scope.row)"
                                     :style='{"width":"100%"}'>
                    </el-input-number>
                  </template>
                </el-table-column>
                <el-table-column prop="badNumber" label="不良数">
                  <template slot-scope="scope">
                    <el-input-number v-model="scope.row.badNumber" placeholder="数字文本" :step="1"
                                     controls-position='right' @blur="rowNumberChange(scope.row)"
                                     :style='{"width":"100%"}'>
                    </el-input-number>
                  </template>
                </el-table-column>
                <el-table-column prop="badPercent" label="不良率">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.badPercent" readonly :style='{"width":"100%"}'>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="detailResult" label="检验结果">
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.detailResult"
                      placeholder="请选择"
                      clearable
                      :style="{ width: '100%' }"
                      :multiple="false"
                    >
                      <el-option
                        v-for="(item, index) in typeOptions"
                        :key="index"
                        :label="item.fullname"
                        :value="item.value"
                        :disabled="item.disabled"
                      ></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.remark" placeholder="请输入" clearable :style='{"width":"100%"}'>
                    </el-input>
                  </template>
                </el-table-column>
                <!-- <el-table-column label="操作" width="50" >
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" class="JNPF-table-delBtn" @click="delbizqualityinspectiondetailList(scope.$index)">删除</el-button>
                    </template>
                </el-table-column> -->
              </el-table>
              <!-- <div class="table-actions" @click="addbizqualityinspectiondetailList()">
                  <el-button type="text" icon="el-icon-plus">添加</el-button>
              </div> -->
            </el-form-item>
          </el-col>
          <el-dialog title="物料列表"
                     :close-on-click-modal="false" append-to-body
                     :visible.sync="materialChooseShow" class="JNPF-dialog JNPF-dialog_center" lock-scroll
                     v-if="materialChooseShow" width="1000px">
            <material-choose ref="MaterialChoose" @onChange="dialogMaterialChange"></material-choose>
          </el-dialog>

          <el-dialog title="供应商列表"
                     :close-on-click-modal="false" append-to-body
                     :visible.sync="partnerChooseShow" class="JNPF-dialog JNPF-dialog_center" lock-scroll
                     v-if="partnerChooseShow" width="1000px">
            <partner-choose ref="PartnerChoose" @onChange="dialogPartnerChange"></partner-choose>
          </el-dialog>
        </template>
      </el-form>
    </el-row>
    <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false"> 取 消</el-button>
        <el-button type="primary" @click="dataFormSubmit()" v-if="!isDetail"> 确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import request from '@/utils/request'
import {previewDataInterface} from '@/api/systemData/dataInterface'
import {getDictionaryDataSelector} from '@/api/systemData/dictionary'
import {getStandardOptions} from '@/api/systemData/dataTeam'
import MaterialChoose from './materialChoose'

import PartnerChoose from './partnerChoose'


export default {
  components: {MaterialChoose, PartnerChoose},
  props: [],
  data() {
    return {
      visible: false,
      loading: false,
      isDetail: false,
      materialChooseShow: false,
      partnerChooseShow: false,
      dataForm: {
        inspectionCode: '',
        materialId: '',
        materialCode: '',
        materialName: '',
        materialNumber: 0,
        sampleNumber: 0,
        badNumber: 0,
        badPercent: 0,
        result: '',
        submitterId: '',
        submitterName: '',
        inspectorId: '',
        inspectorName: '',
        inspectTime: new Date().getTime(),
        inspectionType: 1,
        relationId: '',
        relationCode: '',
        relationName: '',
        standardId: '',
        standardName: '',
        remark: '',
        partnerName: '',
        bdPartnerId: '',
        bizqualityinspectiondetailList: [],
      },
      rules:
        {
          materialName: [
            {
              required: true,
              message: '请填写',
              trigger: 'click'
            },
          ],
          materialNumber: [
            {
              required: true,
              message: '请填写',
              trigger: 'click'
            },
          ],
          sampleNumber: [
            {
              required: true,
              message: '请填写',
              trigger: 'click'
            },
          ],
          badNumber: [
            {
              required: true,
              message: '请填写',
              trigger: 'click'
            },
          ],
          result: [
            {
              required: true,
              message: '请填写',
              trigger: 'click'
            },
          ],
          submitterId: [
            {
              required: true,
              message: '请填写',
              trigger: 'click'
            },
          ],
          inspectorId: [
            {
              required: true,
              message: '请填写',
              trigger: 'click'
            },
          ],
          standardName: [
            {
              required: true,
              message: '请填写',
              trigger: 'click'
            },
          ],
          inspectTime: [
            {
              required: true,
              message: '请选择',
              trigger: 'click'
            },
          ], partnerName: [
            {
              required: true,
              message: '请填写',
              trigger: 'click'
            },
          ],
        },
      typeOptions: [{fullname: "合格", value: 1}, {fullname: "不合格", value: 2}],
      standardOptions: [],
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    init(id, isDetail) {
      this.dataForm.id = id || 0;
      this.visible = true;
      this.isDetail = isDetail || false;
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields();
        if (this.dataForm.id) {
          this.loading = true
          let materialCode = "";
          request({
            url: '/api/project/BizQualityInspection/' + this.dataForm.id,
            method: 'get'
          }).then(res => {
            this.dataInfo(res.data)
            getStandardOptions(res.data.materialCode).then((resp) => {
              this.standardOptions = resp.data
            })
            this.loading = false
          })

        } else {
          this.dataForm = this.$options.data().dataForm;
          this.dataForm.inspectionCode = "J"+new Date().getTime()
        }

      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['elForm'].validate((valid) => {
        if (valid) {
          this.request()
        }
      })
    },
    request() {
      var _data = this.dataList()
      if (!this.dataForm.id) {
        request({
          url: '/api/project/BizQualityInspection',
          method: 'post',
          data: _data
        }).then((res) => {
          this.$message({
            message: res.msg,
            type: 'success',
            duration: 1000,
            onClose: () => {
              this.visible = false
              this.$emit('refresh', true)
            }
          })
        })
      } else {
        request({
          url: '/api/project/BizQualityInspection/' + this.dataForm.id,
          method: 'PUT',
          data: _data
        }).then((res) => {
          this.$message({
            message: res.msg,
            type: 'success',
            duration: 1000,
            onClose: () => {
              this.visible = false
              this.$emit('refresh', true)
            }
          })
        })
      }
    },
    addbizqualityinspectiondetailList() {
      let item = {
        inspectionItems: undefined,
        standardValue: undefined,
        unit: undefined,
        inspectionMethod: undefined,
        inspectionFrequency: undefined,
        detectionValue: undefined,
        sampleNumber: undefined,
        badNumber: undefined,
        badPercent: undefined,
        detailResult: undefined,
        remark: undefined,
      }
      this.dataForm.bizqualityinspectiondetailList.push(item)
    },
    delbizqualityinspectiondetailList(index) {
      this.dataForm.bizqualityinspectiondetailList.splice(index, 1);
    },
    dataList() {
      var _data = JSON.parse(JSON.stringify(this.dataForm));
      for (let i = 0; i < _data.bizqualityinspectiondetailList.length; i++) {
        var _list = _data.bizqualityinspectiondetailList[i];
      }
      return _data;
    },
    dataInfo(dataAll) {
      let _dataAll = dataAll
      for (let i = 0; i < _dataAll.bizqualityinspectiondetailList.length; i++) {
        var _list = _dataAll.bizqualityinspectiondetailList[i];
      }
      this.dataForm = _dataAll
    },
    chooseMaterial() {
      this.materialChooseShow = true;
      this.$nextTick(() => {
        this.$refs.MaterialChoose.initData();
      })
    },
    dialogMaterialChange(material) {
      this.dataForm.materialName = material.materialName;
      this.dataForm.materialCode = material.materialCode;
      this.dataForm.materialId = material.id;
      //查询检验基准下拉框
      getStandardOptions(this.dataForm.materialCode).then((res) => {
        this.standardOptions = res.data
        if (res.data != null && res.data.length > 0) {
          this.dataForm.standardId = res.data[0].id;
          this.dataForm.standardName = res.data[0].standardName;
          let listLength = this.dataForm.bizqualityinspectiondetailList.length
          for (let i = 0; i < listLength; i++) {
            console.log(this.dataForm.bizqualityinspectiondetailList.length + ";" + i)
            this.delbizqualityinspectiondetailList(0);
          }
          let bizmaterialstandardlistList = res.data[0].bizmaterialstandardlistList;
          for (let i = 0; i < bizmaterialstandardlistList.length; i++) {
            let item = {
              inspectionItems: bizmaterialstandardlistList[i].inspectionItems,
              standardValue: bizmaterialstandardlistList[i].standardValue,
              unit: bizmaterialstandardlistList[i].unit,
              inspectionMethod: bizmaterialstandardlistList[i].inspectionMethod,
              inspectionFrequency: bizmaterialstandardlistList[i].inspectionFrequency,
              detectionValue: undefined,
              sampleNumber: undefined,
              badNumber: undefined,
              badPercent: undefined,
              detailResult: undefined,
              remark: undefined,
            }
            this.dataForm.bizqualityinspectiondetailList.push(item)
          }

        }
      })
      this.materialChooseShow = false;
    },
    changeStandard() {
      let listLength = this.dataForm.bizqualityinspectiondetailList.length
      for (let i = 0; i < listLength; i++) {
        this.delbizqualityinspectiondetailList(0);
      }

      let obj = this.standardOptions.find(function (item) {
        return item.standardName === this.dataForm.standardName;
      });
      this.dataForm.standardId = obj.id;

      let bizmaterialstandardlistList = obj.bizmaterialstandardlistList;
      for (let i = 0; i < bizmaterialstandardlistList.length; i++) {
        let item = {
          inspectionItems: bizmaterialstandardlistList[i].inspectionItems,
          standardValue: bizmaterialstandardlistList[i].standardValue,
          unit: bizmaterialstandardlistList[i].unit,
          inspectionMethod: bizmaterialstandardlistList[i].inspectionMethod,
          inspectionFrequency: bizmaterialstandardlistList[i].inspectionFrequency,
          detectionValue: undefined,
          sampleNumber: 0,
          badNumber: 0,
          badPercent: 0,
          detailResult: undefined,
          remark: undefined,
        }
        this.dataForm.bizqualityinspectiondetailList.push(item)
      }
    },

    materialNumberChange(materialNumber) {
      if (materialNumber == undefined) {
        this.dataForm.materialNumber = 0;
      }
      this.numberChange();
    },
    sampleNumberChange(sampleNumber) {
      if (sampleNumber == undefined) {
        this.dataForm.sampleNumber = 0;
      }
      this.numberChange();
    },
    badNumberChange(badNumber) {
      if (badNumber == undefined) {
        this.dataForm.badNumber = 0;
      }
      this.numberChange();
    },
    numberChange() {
      let materialNumber = this.dataForm.materialNumber;
      let sampleNumber = this.dataForm.sampleNumber;
      let badNumber = this.dataForm.badNumber;
      let msg = "";
      if (materialNumber < sampleNumber) {
        msg += "抽样数不能大于货品数量！"
        this.dataForm.sampleNumber = 0;
      }
      if (sampleNumber < badNumber) {
        msg += "不良数不能大于抽样数！"
        this.dataForm.badNumber = 0;
      }

      if (msg.length > 0) {
        this.$message({
          message: msg,
          type: 'error',
          duration: 1000,
        })
      } else {
        this.dataForm.badPercent = sampleNumber == 0 ? 0 : (badNumber / sampleNumber).toFixed(4);
      }
    },
    rowNumberChange(row) {
      if (row.sampleNumber == undefined) {
        row.sampleNumber = 0;
      }
      if (row.badNumber == undefined) {
        row.badNumber = 0;
      }
      let msg = "";
      if (row.sampleNumber < row.badNumber) {
        msg = "不良数不能大于抽样数！"
        row.badNumber = 0;
      }
      if (msg.length > 0) {
        this.$message({
          message: msg,
          type: 'error',
          duration: 1000,
        })
      } else {
        row.badPercent = row.sampleNumber == 0 ? 0 : (row.badNumber / row.sampleNumber).toFixed(4);
      }
    },
    choosePartner() {
      this.partnerChooseShow = true;
      this.$nextTick(() => {
        this.$refs.PartnerChoose.initData();
      });
    },
    dialogPartnerChange(partner) {
      console.log(partner);
      this.dataForm.partnerName = partner.partnerName;
      this.dataForm.bdPartnerId = partner.id;
      this.partnerChooseShow = false;
    },

  },
}

</script>
