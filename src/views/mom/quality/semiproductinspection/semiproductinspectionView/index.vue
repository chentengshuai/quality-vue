<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <div class="JNPF-common-layout-main JNPF-flex-main">

    <el-row :gutter="15" class="">
      <vue-easy-print tableShow ref="printRef">
        <el-form ref="elForm" :model="dataForm" :rules="rules" size="medium" label-width="100px" label-position="right">
          <template v-if="!loading">
            <el-col :span="8">
              <el-form-item label="检验编码" prop="inspectionCode">
                {{ dataForm.inspectionCode }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="物料名称" prop="materialName">
                {{ dataForm.materialName }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产品模板" prop="relationName">
                {{ dataForm.relationName }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="检验基准" prop="standardName">
                {{ dataForm.standardName }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="货品数量" prop="materialNumber">
                {{ dataForm.materialNumber }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="抽样数" prop="sampleNumber">
                {{ dataForm.sampleNumber }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="不良数" prop="badNumber">
                {{ dataForm.badNumber }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="不良率" prop="badPercent">
                {{ dataForm.badPercent }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="检验结果" prop="result">
                {{ dataForm.resultName }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="送检人" prop="submitterId">
                {{ dataForm.submitterName }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="检验员" prop="inspectorId">
                {{ dataForm.inspectorName }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="检验时间" prop="inspectTime">
                {{ dataForm.inspectTime }}
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                {{ dataForm.remark }}
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
                      {{ scope.row.inspectionItems }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="standardValue" label="标准值">
                    <template slot-scope="scope">
                      {{ scope.row.standardValue }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="unit" label="单位">
                    <template slot-scope="scope">
                      {{ scope.row.unit }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="inspectionMethod" label="检查方法">
                    <template slot-scope="scope">
                      {{ scope.row.inspectionMethod }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="inspectionFrequency" label="检查频率">
                    <template slot-scope="scope">
                      {{ scope.row.inspectionFrequency }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="detectionValue" label="检测值">
                    <template slot-scope="scope">
                      {{ scope.row.detectionValue }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="sampleNumber" label="抽样数">
                    <template slot-scope="scope">
                      {{ scope.row.sampleNumber }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="badNumber" label="不良数">
                    <template slot-scope="scope">
                      {{ scope.row.badNumber }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="badPercent" label="不良率">
                    <template slot-scope="scope">
                      {{ scope.row.badPercent }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="detailResult" label="检验结果">
                    <template slot-scope="scope">
                      {{ scope.row.detailResultName }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="remark" label="备注">
                    <template slot-scope="scope">
                      {{ scope.row.remark }}
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
          </template>
        </el-form>
      </vue-easy-print>
    </el-row>

</div>
</div>
</div>
</template>
<script>
import request from '@/utils/request'
import {getStandardOptions} from '@/api/systemData/dataTeam'
import vueEasyPrint from "vue-easy-print"

export default {
  components: {vueEasyPrint},
  props: [],
  data() {
    return {
      visible: false,
      loading: false,
      isDetail: false,
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
        inspectionType: 3,
        relationId: '',
        relationCode: '',
        relationName: '',
        standardId: '',
        standardName: '',
        remark: '',
        bizqualityinspectiondetailList: [],
      },
      rules: {},
      typeOptions: [{fullname: "合格", value: 1}, {fullname: "不合格", value: 2}],
      standardOptions: [],
    }
  },
  computed: {},
  watch: {},
  created() {
    this.init(this.$route.query.id);
  },
  mounted() {
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0;
      this.visible = true;
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
        }
      })
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
        this.typeOptions.forEach(item => {
          if(item.value == _list.detailResult){
            _list.detailResultName = item.fullname
          }
        })
      }
      var date = new Date(_dataAll.inspectTime);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      var D = date.getDate();
      _dataAll.inspectTime = Y + M + D
      this.typeOptions.forEach(item => {
        if(item.value == _dataAll.result){
          _dataAll.resultName = item.fullname
        }
      })
      this.dataForm = _dataAll
    },
    printOrder() {
      this.$refs.printRef.print()
    },

  },
}

</script>
