<template>
  <el-drawer
    title="产品追溯"
    :wrapperClosable="false"
    ref="drawer"
    :visible.sync="visible"
    :before-close="handleDrawerClose"
    class="JNPF-common-drawer"
    size="100%">
    <div class="JNPF-flex-main">
      <el-row :gutter="15" class="">
        <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="120px" label-position="right"
                 style="overflow: auto;height: calc(87vh)">
          <div height="100px" style="margin-top: 12px;">
            <el-col :span="8">
              <el-form-item label="产品编码" prop="materialName">
                <el-input v-model="dataForm.materialCode" :style='{"width":"100%"}'
                          readonly>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产品名称" prop="materialCode">
                <el-input v-model="dataForm.materialName" readonly
                          :style='{"width":"100%"}'>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产品追溯期间" prop="inspectTime">
                <el-date-picker v-model="dataForm.inspectTime" type="daterange"
                                value-format="timestamp" format="yyyy-MM-dd" start-placeholder="开始日期"
                                end-placeholder="结束日期" >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </div>

          <el-col>
            <el-card class="mb-20" shadow ="always">
            <div class="JNPF-common-title">
              <h2 style="padding-left: 24px;">>>检测单列表<<</h2>
            </div>
            <el-table
              :data="dataForm.inspectionList"
              size="mini"
              @row-click="rowClick"
              >
              <el-table-column
                type="index"
                width="50"
                label="序号"
                align="center"/>
              <el-table-column prop="inspectionCode" label="检测单号" width="0" align="left"/>
              <el-table-column prop="materialName" label="物料名称" width="0" align="left"/>
              <el-table-column prop="materialCode" label="物料编码" width="0" align="left"/>
              <el-table-column prop="relationName" label="检验信息1" width="0" align="left"/>
              <el-table-column prop="warehouseName" label="检验信息2" width="0" align="left"/>
              <el-table-column prop="materialNumber" label="货品数量" width="0" align="left"/>
              <el-table-column prop="sampleNumber" label="抽样数" width="0" align="left"/>
              <el-table-column prop="badNumber" label="不良数" width="0" align="left"/>
              <el-table-column prop="badPercent" label="不良率" width="0" align="left"/>
              <el-table-column label="检验结果" width="0" prop="result" algin="left">
                  <template slot-scope="scope">
                      <el-tag type="success" v-if="scope.row.result == 1">合格</el-tag>
                      <el-tag type="warning" v-if="scope.row.result == 2">不合格</el-tag>
                  </template>
              </el-table-column>
              <el-table-column prop="submitterName" label="送检人" width="0" align="left"/>
              <el-table-column prop="inspectorName" label="检验员" width="0" align="left"/>
              <el-table-column prop="inspectTime" label="检验时间" width="0" align="left"/>
              
              <el-table-column prop="handleCommentsName" label="处理意见" width="0" align="left"/>
              <el-table-column prop="handlerName" label="处理人" width="0" align="left"/>
              <el-table-column prop="handleTime" label="处理时间" width="0" align="left"/>

              <!-- <el-table-column prop="maxValues" label="最大值">
                <template slot-scope="scope">
                  {{ scope.row.maxValues }}
                </template>
              </el-table-column> -->
            </el-table>
            </el-card>
          </el-col>

          <div v-if="dataForm.productFlowProcessFormList.length>0">
            <el-col :span="24">
              <el-steps :active="dataForm.active" align-center>
                <el-step
                  v-for="(item, index) in dataForm.productFlowProcessFormList"
                  track-by="$index"
                  :key="index" title="{item.productionProcessName}" @click.native="switchingProcess(index,item)">
                  <span slot="title">{{ item.productionProcessName }}</span>
                </el-step>
              </el-steps>
            </el-col>

            <el-col>
              <div class="JNPF-common-title">
                <h2 style="padding-left: 24px;">>>半成品检测列表<<</h2>
              </div>
              <el-table
                :data="dataForm.semiProductInspectionList"
                size="mini"
                @row-click="toTrace"
                >
                <el-table-column
                  type="index"
                  width="50"
                  label="序号"
                  align="center"/>
                <el-table-column prop="inspectionCode" label="检测单号" width="0" align="left"/>
                <el-table-column prop="materialName" label="物料名称" width="0" align="left"/>
                <el-table-column prop="materialCode" label="物料编码" width="0" align="left"/>
                <el-table-column prop="relationName" label="产品模板" width="0" align="left"/>
                <el-table-column prop="materialNumber" label="货品数量" width="0" align="left"/>
                <el-table-column prop="sampleNumber" label="抽样数" width="0" align="left"/>
                <el-table-column prop="badNumber" label="不良数" width="0" align="left"/>
                <el-table-column prop="badPercent" label="不良率" width="0" align="left"/>
                <el-table-column label="检验结果" width="0" prop="result" algin="left">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.result == 1">合格</el-tag>
                        <el-tag type="warning" v-if="scope.row.result == 2">不合格</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="submitterName" label="送检人" width="0" align="left"/>
                <el-table-column prop="inspectorName" label="检验员" width="0" align="left"/>
                <el-table-column prop="inspectTime" label="检验时间" width="0" align="left"/>
                
                <el-table-column prop="handleCommentsName" label="处理意见" width="0" align="left"/>
                <el-table-column prop="handlerName" label="处理人" width="0" align="left"/>
                <el-table-column prop="handleTime" label="处理时间" width="0" align="left"/>
              </el-table>
            </el-col>

            <el-col>
              <div class="JNPF-common-title">
                <h2 style="padding-left: 24px;">>>物料检测列表<<</h2>
              </div>
              <el-table
                :data="dataForm.materialInspectionList"
                size="mini">
                <el-table-column
                  type="index"
                  width="50"
                  label="序号"
                  align="center"/>
                <el-table-column prop="inspectionCode" label="检测单号" width="0" align="left"/>
                <el-table-column prop="materialName" label="物料名称" width="0" align="left"/>
                <el-table-column prop="materialCode" label="物料编码" width="0" align="left"/>
                <el-table-column prop="relationName" label="产品模板" width="0" align="left"/>
                <el-table-column prop="materialNumber" label="货品数量" width="0" align="left"/>
                <el-table-column prop="sampleNumber" label="抽样数" width="0" align="left"/>
                <el-table-column prop="badNumber" label="不良数" width="0" align="left"/>
                <el-table-column prop="badPercent" label="不良率" width="0" align="left"/>
                <el-table-column label="检验结果" width="0" prop="result" algin="left">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.result == 1">合格</el-tag>
                        <el-tag type="warning" v-if="scope.row.result == 2">不合格</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="submitterName" label="送检人" width="0" align="left"/>
                <el-table-column prop="inspectorName" label="检验员" width="0" align="left"/>
                <el-table-column prop="inspectTime" label="检验时间" width="0" align="left"/>
                
                <el-table-column prop="handleCommentsName" label="处理意见" width="0" align="left"/>
                <el-table-column prop="handlerName" label="处理人" width="0" align="left"/>
                <el-table-column prop="handleTime" label="处理时间" width="0" align="left"/>
                <el-table-column label="操作" fixed="right"
                                 width="100">
                  <template slot-scope="scope">
                    <el-button type="text" @click="examineHandle(scope.row.id,scope.row.inspectionType)">查看
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>

            <el-col>
              <div class="JNPF-common-title">
                <h2 style="padding-left: 24px;">>>设备检测列表<<</h2>
              </div>
              <el-table
                :data="dataForm.equipmentInspectionList"
                size="mini">
                <el-table-column
                  type="index"
                  width="50"
                  label="序号"
                  align="center"/>
                <el-table-column prop="equipmentCode" label="设备编码"/>
                <el-table-column prop="equipmentName" label="设备名称"/>
                <el-table-column prop="productionProcessName" label="所属工序"/>
                <el-table-column  width="100" label="设备检测内容">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text"  @click="viewPatrolplanDeviceContentList(scope.row)">查看</el-button>
                    </template>
                </el-table-column>
              </el-table>
            </el-col>
          </div>
        </el-form>
      </el-row>
      <div style="padding-right: 26px;">
          <span slot="footer" class="dialog-footer" style="float:right">
            <el-button @click="visible = false"> 取 消</el-button>
          </span>
      </div>
    </div>

    <el-dialog title="查看设备检测内容"
                     :close-on-click-modal="false" append-to-body
                     :visible.sync="patrolplanDeviceContentViewShow" class="JNPF-dialog JNPF-dialog_center" lock-scroll
                     width="1000px">
            <patrolplan-device-content-view-list ref="PatrolplanDeviceContentViewList"></patrolplan-device-content-view-list>
    </el-dialog> 
    <ShowForm v-if="showFormVisible" ref="ShowForm"/>
  </el-drawer>
</template>
<script>
import request from '@/utils/request'
import PatrolplanDeviceContentViewList from './patrolplanDeviceContentViewList'
import ShowForm from './ShowForm'

export default {
  name: 'flowFormDialog',
  components: {PatrolplanDeviceContentViewList, ShowForm},
  props: [],
  data() {
    return {
      visible: false,
      loading: false,
      productTemplateVisible: false,
      outStockVisible: false,
      patrolplanDeviceContentViewShow:false,
      showFormVisible: false,
      materialInx: 0,
      tracebackIntervalTime: '',
      dataForm: {
        materialName: '',
        materialCode: '',
        inspectTime: '',
        inspectionList: [],
        active: 0,
        productFlowProcessFormList: [],
        semiProductInspectionList: [],
        materialInspectionList: [],
        equipmentInspectionList: [],
      },
      rules: {
      },
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    init(inspectTime,materialName,materialCode) {
      this.dataForm.inspectTime = inspectTime;
      this.dataForm.materialName = materialName;
      this.dataForm.materialCode = materialCode;
      this.visible = true;
      this.$nextTick(() => {
        //this.$refs['elForm'].resetFields();
        this.loading = true
        let _query = {
          inspectTime:inspectTime,
          materialName:materialName,
          materialCode:materialCode,
        };
        request({
          url: `/api/project/ProductTrace/getInspectionList`,
          method: 'post',
          data: _query
        }).then(res => {
          var _list = [];

          for (let i = 0; i < res.data.length; i++) {
            let _data = res.data[i];
            _list.push(_data)
          }
          this.dataForm.inspectionList = _list
          this.loading = false
        })
      })
    },
    rowClick(row, preRow){
        //查询工序，设置查询时间区间，用于追溯检测单
        //this.tracebackIntervalTime
        let endTime = row.creationTime;
        let beginTime = endTime - 15*24*60*60*1000;
        this.tracebackIntervalTime = [beginTime, endTime];
        //console.log(this.tracebackIntervalTime);
        this.loading = true
        let _query = {
          productCode:row.materialCode,
        };
        request({
          url: `/api/project/ProductTrace/getProductTemplateProcessList`,
          method: 'post',
          data: _query
        }).then(res => {
          var _list = [];
          for (let i = 0; i < res.data.length; i++) {
            let _data = res.data[i];
            _list.push(_data)
          }
          this.dataForm.productFlowProcessFormList = _list
          this.loading = false
          var item = res.data[0];
          this.switchingProcess(0,item);
        })
    },
    switchingProcess(index,item) {
      //查询工序下所有原料，半成品，设备检测单。
      this.dataForm.active = index;
      this.loading = true
      let _query = {
        productionProcessId:item.productionProcessId,
        inspectTime:this.tracebackIntervalTime,
      };
      request({
        url: `/api/project/ProductTrace/getRawQualityInspectionList`,
        method: 'post',
        data: _query
      }).then(res => {
        var _list = [];
        for (let i = 0; i < res.data.length; i++) {
          let _data = res.data[i];
          _list.push(_data)
        }
        this.dataForm.materialInspectionList = _list
      })

      request({
        url: `/api/project/ProductTrace/getPartiallyQualityInspectionList`,
        method: 'post',
        data: _query
      }).then(res => {
        var _list = [];
        for (let i = 0; i < res.data.length; i++) {
          let _data = res.data[i];
          _list.push(_data)
        }
        this.dataForm.semiProductInspectionList = _list
      })

      request({
        url: `/api/project/ProductTrace/getBdEquipmentList`,
        method: 'post',
        data: _query
      }).then(res => {
        var _list = [];
        for (let i = 0; i < res.data.length; i++) {
          let _data = res.data[i];
          _list.push(_data)
        }
        this.dataForm.equipmentInspectionList = _list
      })

      this.loading = false
    },
    viewPatrolplanDeviceContentList(row) {  //查看巡检内容
        let contentId=row.id;
        if(contentId){
            this.patrolplanDeviceContentViewShow = true;
            this.$nextTick(() => {
                this.$refs.PatrolplanDeviceContentViewList.initData(contentId);
            });
        }
    },
    toTrace(row){
      //继续追溯半成品
      var inspectTime = this.tracebackIntervalTime;
      this.dataForm = this.$options.data().dataForm;
      this.init(inspectTime,row.materialName,row.materialCode);
    },
    examineHandle(id,inspectionType) {
      this.showFormVisible = true
      this.$nextTick(() => {
        this.$refs.ShowForm.init(id,inspectionType)
      })
    },
    dataList() {
      var _data = JSON.parse(JSON.stringify(this.dataForm));
      return _data;
    },
    dataInfo(dataAll) {
      let _dataAll = dataAll
      try {
        _dataAll.active = 0
        this.dataForm = _dataAll
      } catch (e) {
        this.dataForm.active = 0
      }
    },
    handleDrawerClose(done) {
      done()
      this.$emit('refreshDataList')
    },
  },
}

</script>

<style lang="scss" rel="stylesheet/scss">
.step .el-steps--simple {
  margin-top: 0 !important;
}

.el-drawer.rtl {
  overflow: scroll;
}
</style>
