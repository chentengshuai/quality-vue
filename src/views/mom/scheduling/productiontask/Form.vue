<template>
  <el-dialog
    :title="!dataForm.id ? '新建' : isDetail ? '详情' : '编辑'"
    :close-on-click-modal="false"
    append-to-body
    fullscreen
    :visible.sync="visible"
    class="JNPF-dialog JNPF-dialog_center"
    lock-scroll
  >
    <el-row :gutter="10" class="plan-box">
      <el-form
        ref="elForm"
        :model="dataForm"
        :rules="rules"
        size="small"
        label-width="110px"
        label-position="right"
      >
        <template v-if="!loading">
          <div class="coll-box">
            <h3>
              <span class="text">计划详情</span>
              <el-button
                type="primary"
                @click.stop="selectPlanVisible()"
                round
                size="mini"
              >选择生产计划
              </el-button
              >
            </h3>
            <div class="coll-main">
              <el-col :span="8">
                <el-form-item label="销售订单编号" prop="saleOrderCode">
                  <el-input
                    v-model="dataForm.saleOrderCode"
                    placeholder="请输入"
                    clearable
                    :style="{ width: '100%' }"
                    :disabled="true"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="销售订单名称" prop="saleOrderName">
                  <el-input
                    v-model="dataForm.saleOrderName"
                    placeholder="请输入"
                    clearable
                    :style="{ width: '100%' }"
                    :disabled="true"
                  >
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item
                  label="生产计划类型"
                  prop="productionPlanType"
                >
                  <el-select v-model="dataForm.productionPlanType" placeholder="请选择" :disabled="true">
                    <el-option
                      v-for="item in PlanTypeoptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="生产基地" prop="workshop">
                  <el-select v-model="dataForm.workshop" placeholder="请选择">
                    <el-option
                      v-for="item in workshopOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      :disabled="true"
                    >
                    </el-option>
                  </el-select>


                </el-form-item>
              </el-col>


              <el-col :span="8">
                <el-form-item label="合同号" prop="contractNo">
                  <el-input
                    v-model="dataForm.contractNo"
                    placeholder="请输入"
                    clearable
                    :style="{ width: '100%' }"
                    :disabled="true"
                  >
                  </el-input>
                </el-form-item>
              </el-col>


              <el-col :span="8">
                <el-form-item label="客户名称" prop="customerName">
                  <el-input
                    v-model="dataForm.customerName"
                    placeholder="请输入"
                    clearable
                    :style="{ width: '100%' }"
                    :disabled="true"
                  >
                  </el-input>
                </el-form-item>
              </el-col>


              <el-col :span="8">
                <el-form-item label="产品名称" prop="productName">
                  <el-input
                    v-model="dataForm.productName"
                    placeholder="请输入"
                    clearable
                    :style="{ width: '100%' }"
                    :disabled="true"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="产品编码" prop="productCode">
                  <el-input
                    v-model="dataForm.productCode"
                    placeholder="请输入"
                    clearable
                    :style="{ width: '100%' }"
                    :disabled="true"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="规格型号" prop="productSpec">
                  <el-input
                    v-model="dataForm.productSpec"
                    placeholder="请输入"
                    clearable
                    :style="{ width: '100%' }"
                    :disabled="true"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="预计交货日期" prop="deliveryDate">
                  <el-date-picker
                    v-model="dataForm.deliveryDate"
                    placeholder="请选择"
                    clearable
                    :style="{ width: '100%' }"
                    :disabled="true"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="timestamp"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>


              <el-col :span="8">
                <el-form-item label="计划数量" prop="planQty">
                  <el-input
                    v-model="dataForm.planQty"
                    placeholder="请输入"
                    clearable
                    :style="{ width: '100%' }"
                    :disabled="true"
                  >
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="已派工数量" prop="dispatchedQuantity">
                  <el-input v-model="dataForm.dispatchedQuantity" placeholder="请输入"
                            clearable
                            :style='{"width":"100%"}'
                            :disabled="true"
                  >

                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="客户要求" prop="description">
                  <el-input
                    v-model="dataForm.description"
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 2}"
                    placeholder="请输入"
                    clearable
                    :style="{ width: '100%' }"
                    :disabled="true"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </div>
            <div class="clearfix"></div>
          </div>

          <div class="coll-box">
            <h3>
              <span class="text">派工明细</span>

            </h3>
            <div class="coll-main">
              <el-col :span="8">
                <el-form-item label="生产派工编号" prop="productionTaskCode">
                  <el-input
                    v-model="dataForm.productionTaskCode"
                    placeholder="请输入"
                    clearable
                    :style="{ width: '100%' }"
                    :disabled="true"
                  >
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="生产工序" prop="productionProcess">
                  <el-select v-model="dataForm.productionProcessId" placeholder="请选择" :disabled="true">
                    <el-option
                      v-for="item in processOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>

                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="派工数量" prop="qty">
                  <el-input
                    v-model="dataForm.qty"
                    placeholder="请输入"
                    clearable
                    :style="{ width: '100%' }"
                  >
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="派工日期" prop="productionTaskTime">
                  <el-date-picker
                    v-model="dataForm.productionTaskTime"
                    placeholder="请选择"
                    clearable
                    :style="{ width: '100%' }"
                    type="datetime"
                    format="yyyy-MM-dd"
                    value-format="timestamp"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="客户订单号" prop="customerOrderCode">
                  <el-input v-model="dataForm.customerOrderCode" placeholder="请输入"
                            clearable
                            :style='{"width":"100%"}'
                            :disabled="true"
                  >
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="客户物料编码" prop="customerProductCode">
                  <el-input v-model="dataForm.customerProductCode" placeholder="请输入"
                            clearable
                            :style='{"width":"100%"}'
                            :disabled="true"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </div>
            <div class="clearfix"></div>
          </div>

          <!-- end -->
        </template>
      </el-form>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false"> 取 消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" v-if="!isDetail">
        确 定</el-button
      >
    </span>

    <Select-Plan :selectVisible="selectVisible" @closeDialog="CloseSelectPlan"/>
  </el-dialog>
</template>
<script>
  import request from '@/utils/request'
  import SelectPlan from './SelectPlan'
  import {previewDataInterface} from '@/api/systemData/dataInterface'
  import {getDictionaryDataSelector} from '@/api/systemData/dictionary'

  export default {
    components: {SelectPlan},
    props: [],
    data() {
      return {
        visible: false,
        selectVisible: false,
        loading: false,
        isDetail: false,
        dataForm: {
          productionTaskCode: '',
          productionPlanType: '',
          productionTaskTime: '',
          workshop: '',
          productionPlanId: '',
          productionPlanCode: '',
          contractNo: '',
          saleOrderLineId: '',
          saleOrderCode: '',
          saleOrderName: '',
          customerId: '',
          customerName: '',
          productId: '',
          productCode: '',
          productName: '',
          productSpec: '',
          deliveryDate: '',
          productionProcessId: '',
          productionProcessName: '',
          equipmentId: '',
          equipmentName: '',
          uomId: '',
          uomName: '',
          planQty: '',
          qty: '',
          dispatchedQuantity: '',
          producedQty: '',
          toProduceQty: '',
          status: '',
          description: '',
          customerOrderCode: '',
          customerProductCode: '',
          customerCode: ""
        },
        workshopOptions: [
          {
            value: '01',
            label: '一厂'
          },
          {
            value: '02',
            label: '二厂'
          }
        ],
        PlanTypeoptions: [
          {
            value: '01',
            label: '按订单生产'
          },
          {
            value: '02',
            label: '利用库存生产'
          }
        ],
        processOptions: [
          {
            value: '01',
            label: '生箔'
          },
          {
            value: '02',
            label: '分切'
          }
        ],
        rules: {}
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
        this.dataForm.id = id || 0
        this.visible = true
        this.isDetail = isDetail || false
        this.$nextTick(() => {
          if (this.dataForm.id) {
            this.loading = true
            request({
              url: '/api/project/ProductionTask/' + this.dataForm.id,
              method: 'get'
            }).then((res) => {
              this.dataInfo(res.data)
              this.loading = false
            })
          } else
            this.reset();
        })
      },
      reset() {
        for (let key in this.dataForm)
          this.dataForm[key] = ''
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['elForm'].validate((valid) => {
          if (valid) {
            this.request()
          }
        })
      },
      selectPlanVisible() {
        this.selectVisible = true
      },
      CloseSelectPlan(planData) {
        if (planData && planData.id) {
          request({
            url: '/api/project/ProductionPlan/getPlan/' + planData.id,
            method: 'GET',
          }).then((res) => {
            this.dataForm = {...this.dataForm, ...res.data}
          })

          request({
            url: '/api/project/ProductionTask/getDispatchedQuantity/' + planData.id,
            method: 'GET',
          }).then((res) => {
            this.dataForm.dispatchedQuantity = res.data;
          })

        }
        this.selectVisible = false
      },
      request() {
        var _data = this.dataList()
        if (!this.dataForm.id) {
          request({
            url: '/api/project/ProductionTask',
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
            url: '/api/project/ProductionTask/' + this.dataForm.id,
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
        var _data = JSON.parse(JSON.stringify(this.dataForm))
        return _data
      },
      dataInfo(dataAll) {
        debugger
        this.dataForm = {...this.dataForm, ...dataAll}
        request({
          url: '/api/project/ProductionTask/getDispatchedQuantity/' + this.dataForm.productionPlanId,
          method: 'GET',
        }).then((res) => {
          this.dataForm.dispatchedQuantity = res.data;
        })
      }
    }
  }
</script>
