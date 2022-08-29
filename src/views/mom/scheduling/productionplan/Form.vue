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
          <!--  begin  -->
          <div class="coll-box">
            <h3><span class="text">订单详情</span>
              <el-button
                type="primary"
                @click="selectVisible=true"
                round
                size="mini"
              >选择销售订单明细
              </el-button>
            </h3>
            <div class="coll-main">

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

              <el-col :span="10">
                <el-form-item label="客户名称" prop="customerName">
                  <el-input
                    v-model="dataForm.customerName"
                    placeholder="请输入"
                    :readonly="true"
                    clearable
                    :style="{ width: '70%' }"
                    :disabled="true"
                  >
                  </el-input>
                  <el-button type="primary" @click="customerVisible =true" size="small"
                             style="width:calc(30% - 10px);margin-left:10px">选择客户
                  </el-button>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="产品等级" prop="productLvl">

                  <el-select v-model="dataForm.productLvl" placeholder="请选择"
                             clearable>
                    <el-option v-for="(item, index) in levelOptions" :key="index"
                               :label="item.levelName" :value="item.levelCode"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="预计交货日期" prop="deliveryDate">
                  <el-date-picker
                    v-model="dataForm.deliveryDate"
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
                <el-form-item label="客户要求" prop="remark">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 2}"
                    v-model="dataForm.remark"
                    placeholder="请输入"
                    clearable
                    :style="{ width: '100%' }"
                  >
                  </el-input>
                </el-form-item>
              </el-col>

            </div>
            <div class="clearfix"></div>
          </div>


          <div class="coll-box">
            <h3><span class="text">计划明细</span></h3>
            <div class="coll-main">
              <el-col :span="8">
                <el-form-item
                  label="生产计划编号"
                  prop="productionPlanCode"
                >
                  <el-input
                    v-model="dataForm.productionPlanCode"
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
                  <!-- <el-input    v-model="dataForm.productionPlanType" placeholder="请输入"  clearable  :style='{"width":"100%"}'>       </el-input>-->

                  <el-select v-model="dataForm.productionPlanType" placeholder="请选择">
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
                <el-form-item
                  label="生产计划日期"
                  prop="productionPlanDate"
                >
                  <el-date-picker
                    v-model="dataForm.productionPlanDate"
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
              <el-col :span="8">
                <el-form-item label="生产基地" prop="workshop">
                  <!-- <el-input
                    v-model="dataForm.workshop"
                    placeholder="请输入"
                    clearable
                    :style="{ width: '100%' }"
                  >
                  </el-input> -->

                  <el-select v-model="dataForm.workshop" placeholder="请选择">
                    <el-option
                      v-for="item in workshopOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>


                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="生产工序" prop="productionProcess">
                  <!-- <el-input
                    v-model="dataForm.productionProcess"
                    placeholder="请输入"
                    clearable
                    :style="{ width: '100%' }"
                  >
                  </el-input> -->
                  <el-select v-model="dataForm.productionProcess" placeholder="请选择">
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


              <!--                  <el-col :span="8">-->
              <!--                    <el-form-item label="计量单位" prop="uomId">-->
              <!--                      <el-input-->
              <!--                        v-model="dataForm.uomId"-->
              <!--                        placeholder="请输入"-->
              <!--                        clearable-->
              <!--                        :style="{ width: '100%' }"-->
              <!--                      >-->
              <!--                      </el-input>-->
              <!--                    </el-form-item>-->
              <!--                  </el-col>-->
              <!--                  <el-col :span="8">-->
              <!--                    <el-form-item label="计量单位名称" prop="uomName">-->
              <!--                      <el-input-->
              <!--                        v-model="dataForm.uomName"-->
              <!--                        placeholder="请输入"-->
              <!--                        clearable-->
              <!--                        :style="{ width: '100%' }"-->
              <!--                      >-->
              <!--                      </el-input>-->
              <!--                    </el-form-item>-->
              <!--                  </el-col>-->

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
                <el-form-item label="物料编码" prop="productCode">
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
                <el-form-item label="规格型号" prop="productSpc">
                  <el-input
                    v-model="dataForm.productSpc"
                    placeholder="请输入"
                    clearable
                    :style="{ width: '100%' }"
                    :disabled="true"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="销售订单数量" prop="saleOrderQty">
                  <el-input
                    v-model="dataForm.saleOrderQty"
                    placeholder="请输入"
                    clearable
                    :style="{ width: '100%' }"
                    :disabled="true"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="已完成量" prop="finishedQty">
                  <el-input
                    v-model="dataForm.finishedQty"
                    placeholder="请输入"
                    clearable
                    :style="{ width: '100%' }"
                    :disabled="true"
                  >
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="计划数量" prop="planQty">
                  <el-input
                    v-model="dataForm.planQty"
                    placeholder="请输入"
                    clearable
                    :style="{ width: '100%' }"
                  >
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="客户订单号" prop="customerOrderCode">
                  <el-input
                    v-model="dataForm.customerOrderCode"
                    placeholder="请输入"
                    clearable
                    :style="{ width: '100%' }"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="客户物料编码"
                  prop="customerProductCode"
                >
                  <el-input
                    v-model="dataForm.customerProductCode"
                    placeholder="请输入"
                    clearable
                    :style="{ width: '100%' }"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <div class="clearfix"></div>
            </div>
          </div>


          <div class="coll-box" v-if="dataForm.productionPlanType == '02'">
            <h3><span class="text">利用库存计划</span>
              <el-button
                type="primary"
                @click.stop="stockVisible = true"
                round
                size="mini"
              >选择成品库存
              </el-button>
            </h3>
            <div class="coll-main">
              <el-col :span="8">
                <el-form-item label="利用库存数量" prop="useStockQty">
                  <el-input
                    v-model="dataForm.useStockQty"
                    placeholder="请输入"
                    clearable
                    :style="{ width: '100%' }"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <div class="clearfix"></div>
            </div>
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

    <Select-Order-New :selectVisible="selectVisible" :visible.sync="selectVisible" v-if="selectVisible"
                      @closeorderDialog="CloseSelectOrder"/>
    <Select-Customer :customerVisible="customerVisible" :visible.sync="customerVisible" v-if="customerVisible"
                     @closeDialog="CloseSelectCustomer"/>
    <Search-Stock :stockVisible="stockVisible" :visible.sync="stockVisible" v-if="stockVisible"
                  @closeDialog="CloseSelectStock"/>

  </el-dialog>


</template>
<script>
  import request from "@/utils/request";
  import SelectOrder from './SelectOrder'
  import SelectOrderNew from './SelectOrderNew'
  import SelectCustomer from './SelectCustomer'
  import SearchStock from './SearchStock'

  export default {
    components: {SelectOrder, SelectOrderNew, SelectCustomer, SearchStock},
    props: [],
    data() {

      const isNum = (rule, value, callback) => {
        const age = /^[0-9]*$/
        if (!age.test(value)) {
          callback(new Error('请输入'))
        } else {
          callback()
        }
      }

      return {
        visible: false,
        loading: false,
        isDetail: false,
        selectVisible: false,  //订单弹窗
        customerVisible: false, //客户弹窗
        stockVisible: false, //库存
        activeNames: ["1", "2", "3"],
        workshopOptions: [
          {
            value: "01",
            label: "一厂",
          },
          {
            value: "02",
            label: "二厂",
          },
        ],
        PlanTypeoptions: [
          {
            value: "01",
            label: "按订单生产",
          },
          {
            value: "02",
            label: "利用库存生产",
          },
        ],
        processOptions: [
          {
            value: "01",
            label: "生箔",
          },
          {
            value: "02",
            label: "分切",
          },
        ],
        levelOptions: [],
        dataForm: {
          productionPlanCode: "",
          productionPlanType: "01",
          productionPlanDate: new Date().getTime(),
          workshop: "02",
          productionProcess: "02",
          contractNo: "",
          saleOrderLineId: "",
          saleOrderCode: "",
          saleOrderName: "",
          customerId: "",
          customerName: "",
          deliveryDate: "",
          uomId: "",
          uomName: "",
          productLvl: "",
          productName: "",
          productCode: "",
          productSpc: "",
          saleOrderQty: "",
          finishedQty: "",
          useStockQty: "",
          planQty: "",
          remark: "",
          customerOrderCode: "",
          customerProductCode: "",
          customerCode: "",
        },
        rules: {
          saleOrderCode: [
            {required: true, message: '请选择销售订单', trigger: 'change'}
          ],
          productLvl: [
            {required: true, message: '请选择产品等级', trigger: 'change'}
          ],
          customerName: [
            {required: true, message: '请选择客户', trigger: 'change'}
          ],
          planQty: [
            {required: true, message: '请填写计划数量', trigger: 'change'},
          ],
          useStockQty: [
            {required: true, message: '请填写利用库存数量', trigger: 'change'},
            {validator: isNum, trigger: 'blur'}
          ]

        },
      };
    },
    computed: {},
    watch: {},
    created() {
    },
    mounted() {
      this.getProductLevel();
    },
    methods: {
      init(id, isDetail) {
        this.dataForm.id = id || 0;
        this.visible = true;
        this.isDetail = isDetail || false;
        this.$nextTick(() => {
          if (this.dataForm.id) {
            this.loading = true;
            request({
              url: "/api/project/ProductionPlan/" + this.dataForm.id,
              method: "get",
            }).then((res) => {
              this.dataInfo(res.data);
              this.loading = false;
            });
          } else
            this.resetForm();
        });
      },


      resetForm() {
        this.dataForm = {
          productionPlanCode: "",
          productionPlanType: "01",
          productionPlanDate: new Date().getTime(),
          workshop: "02",
          productionProcess: "02",
          contractNo: "",
          saleOrderLineId: "",
          saleOrderCode: "",
          saleOrderName: "",
          customerId: "",
          customerName: "",
          deliveryDate: "",
          uomId: "",
          uomName: "",
          productLvl: "",
          productName: "",
          productCode: "",
          productSpc: "",
          saleOrderQty: "",
          finishedQty: "",
          useStockQty: "",
          planQty: "",
          remark: "",
          customerOrderCode: "",
          customerProductCode: "",
        }
      },

      CloseSelectOrder(selectData) {
        // console.log(selectData, 'selectData');
        if (selectData && selectData.contractNo) {
          Object.assign(this.dataForm, {
            contractNo: selectData.contractNo,
            saleOrderLineId: selectData.saleOrderLineId,
            saleOrderCode: selectData.saleOrderCode,
            saleOrderName: selectData.saleOrderName,
            customerId: selectData.customerId,
            customerName: selectData.customerName,
            deliveryDate: selectData.deliveryDate,
            uomId: selectData.uomId,
            uomName: selectData.uomName,
            productLvl: selectData.productLvl,
            productName: selectData.productName,
            productCode: selectData.productCode,
            productSpc: selectData.productSpc,
            saleOrderQty: selectData.saleOrderQty,
            finishedQty: 0,
            useStockQty: 0,
            planQty: selectData.planQty,
            customerOrderCode: selectData.customerOrderCode,
            customerProductCode: selectData.customerProductCode
          })

          // 请求订单的明细ID
          // this.getOrderAndItems(selectData.saleOrderLineId)

        }


        this.selectVisible = false
      },

      CloseSelectCustomer(selectData) {
        console.log(selectData, 'selectData');
        if (selectData && selectData['id']) {
          Object.assign(this.dataForm, {
            customerName: selectData.partnerName,
            customerId: selectData.id,
            customerCode: selectData.partnerCode
          })
        }
        this.customerVisible = false
      },
      // 选择库存确定
      CloseSelectStock() {
        this.stockVisible = false
      },
      // 查询等级
      getProductLevel() {
        this.listLoading = true
        let _query = {}
        request({
          url: `/api/project/ProductLevel/getList`,
          method: 'post',
          data: _query
        }).then(res => {
          var _list = []
          for (let i = 0; i < res.data.list.length; i++) {
            let _data = res.data.list[i]
            _list.push(_data)
          }
          this.levelOptions = _list

          this.listLoading = false
        })
      },
      getOrderAndItems(id) {
        request({
          url: `/api/project/SaleOrder/getOrderAndItems/${id}`,
          method: "get",
        }).then(res => {
          this.dataForm = {...this.dataForm, ...res.data}
        })
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
            url: "/api/project/ProductionPlan",
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
            url: "/api/project/ProductionPlan/" + this.dataForm.id,
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
<style scoped>
  .coll-box >>> .el-collapse-item__header {
    background-color: #fafafa;
  }

  .JNPF-dialog >>> .el-dialog__body {
    height: auto !important;
    max-height: 100vh !important;
  }
</style>
