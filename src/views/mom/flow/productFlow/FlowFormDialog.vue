<template>
  <el-drawer
    :title="!dataForm.id ? '新建' : isDetail ? '详情' : '编辑'"
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
              <el-form-item label="产品流程编码" prop="productFlowCode">
                <el-input v-model="dataForm.productFlowCode" placeholder="请选择" clearable :style='{"width":"100%"}'
                          readonly>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产品模板名称" prop="productTemplateName">
                <el-input prefix-icon="el-icon-search" v-model="dataForm.productTemplateName" placeholder="请选择"
                          clearable readonly @click.native="productTemplateShow()" :style='{"width":"100%"}'>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产品模板编码" prop="productTemplateCode">
                <el-input v-model="dataForm.productTemplateCode" readonly placeholder="请选择" clearable
                          :style='{"width":"100%"}'>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产品类型" prop="productType">
                <el-input v-model="dataForm.productType" readonly placeholder="请选择" clearable :style='{"width":"100%"}'>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产品数量" prop="qty">
                <el-input v-model="dataForm.qty" placeholder="请输入" clearable :style='{"width":"100%"}'>
                </el-input>
              </el-form-item>
            </el-col>
          </div>
          <div v-if="dataForm.productFlowProcessFormList.length>0">
            <el-col :span="24">
              <el-steps :active="dataForm.active" align-center>
                <el-step
                  v-for="(item, index) in dataForm.productFlowProcessFormList"
                  track-by="$index"
                  :key="index" title="{item.productionProcessName}" @click.native="switchingProcess(index)">
                  <span slot="title">{{ item.productionProcessName }}</span>
                </el-step>
              </el-steps>
            </el-col>
            <el-col>
              <div class="JNPF-common-title">
                <h2 style="padding-left: 24px;">>>工序属性<<</h2>
              </div>
              <el-table
                :data="dataForm.productFlowProcessFormList[dataForm.active].productFlowProcessAttributeList"
                size="mini">
                <el-table-column
                  type="index"
                  width="50"
                  label="序号"
                  align="center"/>
                <el-table-column prop="attributeName" label="属性名称">
                  <template slot-scope="scope">
                    {{ scope.row.attributeName }}
                  </template>
                </el-table-column>
                <el-table-column prop="attributeVal" label="属性值">
                  <template slot-scope="scope">
                    <div v-if="scope.row.attributeType==1">
                      <el-date-picker v-model="scope.row.attributeVal" placeholder="请选择" clearable
                                      :style='{"width":"100%"}'
                                      type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
                      </el-date-picker>
                    </div>
                    <div v-else-if="scope.row.attributeType==2">
                      <el-input-number v-model="scope.row.attributeVal" placeholder="数字" :step="0.01"
                                       :style='{"width":"100%"}'>
                      </el-input-number>
                    </div>
                    <div v-else>
                      <el-input v-model="scope.row.attributeVal" placeholder="请输入" clearable
                                :style='{"width":"100%"}'>
                      </el-input>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="uomName" label="计量单位">
                  <template slot-scope="scope">
                    {{ scope.row.uomName }}
                  </template>
                </el-table-column>
                <el-table-column prop="standardValue" label="标准值">
                  <template slot-scope="scope">
                    {{ scope.row.standardValue }}
                  </template>
                </el-table-column>
                <el-table-column prop="minValues" label="最小值">
                  <template slot-scope="scope">
                    {{ scope.row.minValues }}
                  </template>
                </el-table-column>
                <el-table-column prop="maxValues" label="最大值">
                  <template slot-scope="scope">
                    {{ scope.row.maxValues }}
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
            <el-col>
              <div class="JNPF-common-title">
                <h2 style="padding-left: 24px;">>>物料明细<<</h2>
              </div>
              <el-table
                :data="dataForm.productFlowProcessFormList[dataForm.active].productFlowProcessMaterialList"
                size="mini">
                <el-table-column
                  type="index"
                  width="50"
                  label="序号"
                  align="center"/>
                <el-table-column prop="materialCode" label="物料编号">
                  <template slot-scope="scope">
                    {{ scope.row.materialCode }}
                  </template>
                </el-table-column>
                <el-table-column prop="materialName" label="物料名称">
                  <template slot-scope="scope">
                    {{ scope.row.materialName }}
                  </template>
                </el-table-column>
                <el-table-column prop="typeName" label="类型">
                  <template slot-scope="scope">
                    {{ scope.row.typeName }}
                  </template>
                </el-table-column>
                <el-table-column prop="materialSpec" label="规格">
                  <template slot-scope="scope">
                    {{ scope.row.materialSpec }}
                  </template>
                </el-table-column>
                <el-table-column prop="materialModel" label="型号">
                  <template slot-scope="scope">
                    {{ scope.row.materialModel }}
                  </template>
                </el-table-column>
                <el-table-column prop="stockMoveCode" label="出库单编号">
                  <template slot-scope="scope">
                    {{ scope.row.stockMoveCode }}
                  </template>
                </el-table-column>
                <el-table-column prop="qty" label="出库单数量">
                  <template slot-scope="scope">
                    {{ scope.row.qty }}
                  </template>
                </el-table-column>
                <el-table-column prop="useQty" label="出库单使用数量">
                  <template slot-scope="scope">
                    {{ scope.row.useQty }}
                  </template>
                </el-table-column>
                <el-table-column prop="usableQty" label="出库单可用数量">
                  <template slot-scope="scope">
                    {{ scope.row.usableQty }}
                  </template>
                </el-table-column>
                <el-table-column prop="quantity" label="本次使用数量">
                  <template slot-scope="scope">
                    <el-input-number v-model="scope.row.quantity" placeholder="数字" :step="0.01"
                                     :style='{"width":"100%"}'>
                    </el-input-number>
                  </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right"
                                 width="100">
                  <template slot-scope="scope">
                    <el-button type="text" @click="selectMaterial(scope.$index,scope.row.materialCode)">选择物料
                    </el-button>
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
            <el-button type="primary" @click="dataFormSubmit()" v-if="!isDetail"> 确 定</el-button>
          </span>
      </div>
    </div>

    <el-dialog
      title="产品模板"
      :close-on-click-modal="false"
      append-to-body
      :visible.sync="productTemplateVisible"
      class="JNPF-dialog JNPF-dialog_center"
      lock-scroll
      width="1000px">
      <product-template-dialog
        ref="productTemplateDialog"
        @onChange="productTemplateChange"></product-template-dialog>
    </el-dialog>

    <el-dialog
      title="出库信息"
      :close-on-click-modal="false"
      append-to-body
      :visible.sync="outStockVisible"
      class="JNPF-dialog JNPF-dialog_center"
      lock-scroll
      width="1000px">
      <out-stock-dialog
        ref="outStockDialog"
        @onChange="outStockChange"></out-stock-dialog>
    </el-dialog>
  </el-drawer>
</template>
<script>
import request from '@/utils/request'
import productTemplateDialog from "./productTemplateDialog";
import outStockDialog from "./outStockDialog";

export default {
  name: 'flowFormDialog',
  components: {productTemplateDialog, outStockDialog},
  props: [],
  data() {
    return {
      visible: false,
      loading: false,
      isDetail: false,
      productTemplateVisible: false,
      outStockVisible: false,
      materialInx: 0,
      dataForm: {
        productTemplateId: '',
        productTemplateName: '',
        productFlowCode: '',
        productTemplateCode: '',
        productType: '',
        active: 0,
        productFlowProcessFormList: [],
      },
      rules: {
        productTemplateName: [
          {
            required: true,
            message: '请选择产品模板',
            trigger: 'blur'
          }
        ],
        qty: [
          {
            required: true,
            message: '请输入产品数量',
            trigger: 'blur'
          }
        ],
        attributeVal: [
          {
            required: true,
            message: '请输入属性值',
            trigger: 'blur'
          }
        ],
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
    init(id, isDetail) {
      this.dataForm.id = id || 0;
      this.visible = true;
      this.isDetail = isDetail || false;
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields();
        if (this.dataForm.id) {
          this.loading = true
          request({
            url: '/api/project/Bd_product_flow/' + this.dataForm.id,
            method: 'get'
          }).then(res => {
            this.dataInfo(res.data)
            this.loading = false
          })
        } else {
          this.dataForm = this.$options.data().dataForm
          this.dataForm.productFlowCode = new Date().getTime()
        }
      })
    },
    switchingProcess(index) {
      this.dataForm.active = index
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['elForm'].validate((valid) => {
        if (valid) {
          this.request()
        }
      })
    },
    productTemplateShow() {
      this.productTemplateVisible = true
      this.$nextTick(() => {
        this.$refs.productTemplateDialog.initData(id, isDetail)
      })
    },
    productTemplateChange(rowData) {
      let that = this
      this.dataForm.productTemplateId = rowData.id
      this.dataForm.productTemplateCode = rowData.productTemplateCode
      this.dataForm.productTemplateName = rowData.productTemplateName
      this.dataForm.productType = rowData.productType

      let _data = {}
      _data.productTemplateId = rowData.id
      request({
        url: '/api/project/Bd_product_flow/getProductTemplateData',
        method: 'post',
        data: _data
      }).then((res) => {
        that.dataForm.productFlowProcessFormList = res.data.productFlowProcessFormList;
      })
      that.productTemplateVisible = false
    },
    request() {
      let flag = false;
      var _data = this.dataList()
      if (_data) {
        let productFlowProcessFormListData = _data.productFlowProcessFormList
        productFlowProcessFormListData.forEach(item =>{
          let productFlowProcessAttributeListData = item.productFlowProcessAttributeList
          productFlowProcessAttributeListData.forEach(attrItem =>{
            if(!attrItem.attributeVal){
              this.$message({
                message: item.productionProcessName+"工序属性列表中属性值必填！",
                type: 'error',
                duration: 2000
              })
              flag = true;
              return
            }
          })
          let productFlowProcessMaterialListData = item.productFlowProcessMaterialList
          productFlowProcessMaterialListData.forEach(materialItem =>{
            if(!materialItem.stockMoveCode){
              this.$message({
                message: item.productionProcessName+"工序物料明细中请选择出库单信息！",
                type: 'error',
                duration: 2000
              })
              flag = true;
              return
            }
            if(!materialItem.quantity || parseFloat(materialItem.quantity)<=0){
              this.$message({
                message: item.productionProcessName+"工序物料明细中填写的使用数量必须大于0！",
                type: 'error',
                duration: 2000
              })
              flag = true;
              return
            }
            if(parseFloat(materialItem.quantity) > parseFloat(materialItem.usableQty)){
              this.$message({
                message: item.productionProcessName+"工序物料明细中填写的使用数量不能大于可用数量！",
                type: 'error',
                duration: 2000
              })
              flag = true;
              return
            }
          })
        })
      }
      if(flag){
        return
      }
      debugger
      if (!this.dataForm.id) {
        request({
          url: '/api/project/Bd_product_flow/createFlow',
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
          url: '/api/project/Bd_product_flow/' + this.dataForm.id,
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
    dataList() {
      var _data = JSON.parse(JSON.stringify(this.dataForm));
      return _data;
    },
    dataInfo(dataAll) {
      let _dataAll = dataAll
      try {
        debugger
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
    selectMaterial(index, materialCode) {
      this.outStockVisible = true
      this.materialInx = index
      this.$nextTick(() => {
        this.$refs.outStockDialog.init(materialCode)
      })
    },
    outStockChange(rowData) {
      let materialRow = this.dataForm.productFlowProcessFormList[this.dataForm.active].productFlowProcessMaterialList[this.materialInx];
      materialRow.stockMoveId = rowData.stockMoveId
      materialRow.stockMoveCode = rowData.stockMoveCode
      materialRow.stockMoveLineId = rowData.id
      materialRow.qty = parseFloat(rowData.qty).toFixed(2)
      materialRow.useQty = parseFloat(rowData.useQty ? rowData.useQty : 0).toFixed(2)
      materialRow.usableQty = parseFloat(rowData.usableQty).toFixed(2)
      this.outStockVisible = false
    }
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
