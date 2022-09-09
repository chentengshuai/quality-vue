<template>
  <el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'"
             :close-on-click-modal="false" append-to-body
             :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
             width="1400px">
    <el-row :gutter="15" class="">
      <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="right">
        <template v-if="!loading">
          <el-col :span="24">
            <el-card class="mb-20" shadow="always">
              <el-col :span="8">
                <el-form-item label="出库单号" prop="stockMoveCode">
                  <el-input v-model="dataForm.stockMoveCode" placeholder="自动生成" readonly clearable
                            :style='{"width":"100%"}'>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="出库人" prop="stockPersonId">
                  <user-search v-model="currentUserOptions.userAccount" :name="dataForm.stockPersonName"
                               @name="value => { dataForm.stockPersonName = value }"></user-search>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="出库时间" prop="stockMoveDate">
                  <el-date-picker v-model="dataForm.stockMoveDate" placeholder="请选择" clearable :style='{"width":"100%"}'
                                  type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="timestamp">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="出库类型" prop="stockMoveType">
                  <el-select v-model="dataForm.stockMoveType" placeholder="请选择" clearable :style='{"width":"100%"}'
                             :multiple="false">
                    <el-option v-for="(item, index) in stockMoveTypeOptions" :key="index" :label="item.fullName"
                               :value="item.enCode" :disabled="item.disabled"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="8">
                <el-form-item label="通知单编号" v-if="noticeBillNoShow" prop="noticeBillNo">
                  <el-input v-model="dataForm.noticeBillNo" placeholder="请选择ERP发货通知单编号" readonly clearable
                            :style='{"width":"100%"}' @click.native="clickSalDeliveryNotice">

                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="库存组" prop="stockerGroup">
                  <el-select v-model="dataForm.stockerGroup" placeholder="请选择" clearable :style='{"width":"100%"}'
                             :multiple="false">
                    <el-option v-for="(item, index) in operatorGroupOptions" :key="index" :label="item.name"
                               :value="item.number" :disabled="item.disabled"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="仓管员" prop="stocker">
                  <el-select v-model="dataForm.stocker" placeholder="请选择" clearable :style='{"width":"100%"}'
                             :multiple="false">
                    <el-option v-for="(item, index) in operatorOptions" :key="index" :label="item.name"
                               :value="item.number" :disabled="item.disabled"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="deptName" prop="dept" v-if="deptShow">
                  <el-select v-model="dataForm.dept" placeholder="请选择" clearable :style='{"width":"100%"}'
                             :multiple="false">
                    <el-option v-for="(item, index) in departmentOptions" :key="index" :label="item.name"
                               :value="item.code" :disabled="item.disabled"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="运输单号" v-if="carriageNoShow" prop="carriageNo">
                  <el-input v-model="dataForm.carriageNo" placeholder="请输入" clearable :style='{"width":"100%"}'>

                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="领料人" v-if="pickerNameShow" prop="pickerName"
                              @click.native="choosePicker()">
                  <el-input v-model="dataForm.pickerName" placeholder="请输入" clearable :style='{"width":"100%"}'>

                  </el-input>
                </el-form-item>
              </el-col> -->
              <el-col :span="16">
                  <el-form-item label="备注" prop="remark">
                    <el-input v-model="dataForm.remark" placeholder="请输入" clearable :style='{"width":"100%"}'>
                    </el-input>
                  </el-form-item>
              </el-col>
            </el-card>
          </el-col>
          <el-col :span="24">
            <el-form-item label-width="0">
              <div class="JNPF-common-title">
                <h2>明细</h2>
                <!-- <div style="float:left;">
                  <el-button type="primary" @click="selectBdQuanList">选择出库数据</el-button>
                </div>
                <div>
                  <span style="float:right;">扫描批号/箱号
                        <el-input v-model="scanninglotNumber" placeholder="请扫描批号/箱号" clearable :style='{"width":"60%"}'
                                  @keyup.enter.native="scanningLotNumber()">
                        </el-input>
                    </span>
                  <span style="float:right;" v-if="scanningProductCodeShow">仓库编码
                        <el-input v-model="scanningWarehouseCode" placeholder="请选择仓库编码" clearable
                                  :style='{"width":"60%"}'>
                        </el-input>
                    </span>
                  <span style="float:right;" v-if="scanningProductCodeShow">物料编码
                        <el-input v-model="scanningProductCode" placeholder="请选择物料编码" clearable :style='{"width":"60%"}'
                                  @click.native="chooseMaterial()">
                        </el-input>
                    </span>
                </div> -->
              </div>
              <el-table :data="dataForm.bizstockmovelineList" size='mini'>
                <el-table-column type="index" label="序号" align="center"/>
                <!-- <el-table-column prop="lotNumber" label="批号/箱号" width="150">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.lotNumber" readonly placeholder="请输入" clearable
                              :style='{"width":"100%"}'>
                    </el-input>
                  </template>
                </el-table-column> -->
                <el-table-column prop="productCode" label="物料编码" width="140">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.productCode"  placeholder="请输入" clearable
                              :style='{"width":"100%"}'>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="productName" label="物料名称" width="150">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.productName"  placeholder="请输入" clearable
                              :style='{"width":"100%"}'>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="productSpc" label="规格型号" width="140">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.productSpc"  placeholder="请输入" clearable
                              :style='{"width":"100%"}'>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="productLvl" label="产品等级" width="120">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.productLvl"  placeholder="请输入" clearable
                              :style='{"width":"100%"}'>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="uomName" :label=uomName width="100">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.uomName"  placeholder="请输入" clearable
                              :style='{"width":"100%"}'>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="returnQty" v-if="returnQtyShow" label="应发数量" width="150">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.returnQty"  placeholder="请输入" clearable
                              :style='{"width":"100%"}'>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="qty" :label=qtyName width="150">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.qty"  placeholder="请输入" clearable
                              :style='{"width":"100%"}'>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="grossWeight"  label="毛重" width="150">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.grossWeight"  placeholder="请输入" clearable
                              :style='{"width":"100%"}'>
                    </el-input>
                  </template>
                </el-table-column>

                <!-- <el-table-column prop="stockType" label="退库类型" width="150" v-if="stockTypeShow">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.stockType" placeholder="请选择" clearable :style='{"width":"100%"}'
                               :multiple="false">
                      <el-option v-for="(item, index) in stockTypeOptions" :key="index" :label="item.name"
                                 :value="item.code" :disabled="item.disabled"></el-option>
                    </el-select>
                  </template>
                </el-table-column> -->

                <el-table-column prop="customerName" v-if="customerNameShow" label="客户" width="200">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.customerName"  placeholder="请输入" clearable
                              :style='{"width":"100%"}'>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column v-if="false" prop="warehouseCode" label="仓库编码">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.warehouseCode"  placeholder="请输入" clearable
                              :style='{"width":"100%"}'>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="warehouseName" label="仓库" width="150">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.warehouseName"  placeholder="请输入" clearable
                              :style='{"width":"100%"}'>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="locationName" label="仓位" width="150">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.locationName"  placeholder="请输入" clearable
                              :style='{"width":"100%"}'>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column v-if="false" prop="workShopCode" label="生产车间编码">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.workShopCode"  placeholder="请输入" clearable
                              :style='{"width":"100%"}'>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="workShopName" v-if="workShopNameShow" label="生产车间" width="150">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.workShopName" readonly placeholder="请输入" clearable
                              :style='{"width":"100%"}'>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="customerOrderNum" v-if="customerOrderNumShow" label="客户订单号" width="150">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.customerOrderNum" placeholder="请输入" clearable
                              :style='{"width":"100%"}'>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="customerProductCode" v-if="customerProductCodeShow" label="客户物料编码" width="150">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.customerProductCode" placeholder="请输入" clearable
                              :style='{"width":"100%"}'>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" width="150">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.remark" placeholder="请输入" clearable
                              :style='{"width":"100%"}'>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="50">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" class="JNPF-table-delBtn"
                               @click="delbizstockmovelineList(scope.$index)">删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="table-actions" @click="addbizstockmovelineList()">
                <el-button type="text" icon="el-icon-plus">添加</el-button>
              </div>
            </el-form-item>
          </el-col>
          <div>
            <!--            <el-dialog title="出库数据列表"-->
            <!--                       :close-on-click-modal="false" append-to-body-->
            <!--                       :visible.sync="productChooseShow" class="JNPF-dialog JNPF-dialog_center" lock-scroll-->
            <!--                       width="1300px">-->
            <!--              <product-choose ref="ProductChoose" @bdQuanListDataForm="processBdBoxList"-->
            <!--                              @bdQuanListDisplay="clickBdQuanListDisplay"></product-choose>-->
            <!--            </el-dialog>-->

            <inventory-choose ref="InventoryChoose" v-if="inventoryChooseShow" @bdQuanListDataForm="processBdBoxList"
                              @bdQuanListDisplay="clickBdQuanListDisplay"></inventory-choose>

            <el-dialog title="员工列表"
                       :close-on-click-modal="false" append-to-body
                       :visible.sync="pickerChooseShow" class="JNPF-dialog JNPF-dialog_center" lock-scroll
                       v-if="pickerChooseShow" width="1000px" height="800px">
              <picker-choose ref="PickerChoose" @returnEmpInfo="returnEmpInfo"></picker-choose>
            </el-dialog>
            <el-dialog title="物料列表"
                       :close-on-click-modal="false" append-to-body
                       :visible.sync="materialChooseShow" class="JNPF-dialog JNPF-dialog_center" lock-scroll
                       v-if="materialChooseShow" width="1000px" height="800px">
              <material-choose ref="MaterialChoose" @returnMaterialInfo="returnMaterialInfo"></material-choose>
            </el-dialog>

            <sal-delivery-notice-choose ref="SalDeliveryNoticeChoose" v-if="salDeliveryNoticeChooseShow"
                                        @selectSalDeliveryNotice="selectSalDeliveryNotice"
                                        @closeSalDeliveryNotice="closeSalDeliveryNotice"></sal-delivery-notice-choose>
          </div>

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
  import {getDepartmentSelector} from '@/api/permission/department'
  import ProductChoose from './productChoose'
  import InventoryChoose from './inventoryChoose'
  import PickerChoose from './pickerChoose'
  import MaterialChoose from './materialChoose'
  import {getDictionaryDataByTypeCode} from '@/api/systemData/dictionary'
  import SalDeliveryNoticeChoose from './salDeliveryNoticeChoose'

  export default {
    components: {ProductChoose, PickerChoose, MaterialChoose, InventoryChoose, SalDeliveryNoticeChoose},
    props: [],
    data() {
      return {
        visible: false,
        loading: false,
        isDetail: false,
        scanninglotNumber: '',
        scanningProductCode: '',
        scanningWarehouseCode: '',
        deptName: '发货部门',
        // spOutStockShow: false, //简单生产退库
        noticeBillNoShow: false,
        deptShow: false,
        returnQtyShow: false,
        grossWeightShow: false,
        stockTypeShow: false, //出库类型
        customerNameShow: false,
        workShopNameShow: false,
        customerOrderNumShow: false,
        customerProductCodeShow: false,
        pickerNameShow: false,
        carriageNoShow: false,
        scanningProductCodeShow: false, //简单生产领料
        pickerChooseShow: false,
        materialChooseShow: false,
        qtyReadOnly: true,
        uomName: "库存单位",
        qtyName: "实发数量",
        salDeliveryNoticeChooseShow: false,
        dataForm: {
          stockMoveCode: '',
          stockPersonId: '',
          stockPersonName: '',
          stockOrgId: '',
          productionOrganization: '',
          cargoOwnerId: '',
          cargoOwnerName: '',
          stockMoveDate: new Date().getTime(),
          stockMoveType: "",
          remark: '',
          stockerGroup: '',
          stocker: '',
          dept: '',
          carrier: '',
          carriageNo: '',
          noticeBillNo: '',
          pickerNo: '',
          pickerName: '',
          bizstockmovelineList: [],
        },
        rules:
          {
            stockOrgId: [
              {
                required: true,
                message: '请输入',
                trigger: 'blur'
              },
            ],
            productionOrganization: [
              {
                required: true,
                message: '请输入',
                trigger: 'blur'
              },
            ],
            cargoOwnerId: [
              {
                required: true,
                message: '请输入',
                trigger: 'blur'
              },
            ],
            stockMoveDate: [
              {
                required: true,
                message: '请选择',
                trigger: 'change'
              },
            ],
            stockMoveType: [
              {
                required: true,
                message: '请选择',
                trigger: 'change'
              },
            ],
            stocker: [
              {
                required: true,
                message: '请选择',
                trigger: 'change'
              },
            ],
          },
        stockMoveTypeOptions: [],
        departmentOptions: [],
        operatorGroupOptions: [],
        operatorOptions: [],
        departmentTreeData: [],
        currentUserOptions: [],
        productChooseShow: false,
        inventoryChooseShow: false,
        remainOutQty: {},
        stockTypeOptions: []
      }
    },
    computed: {},
    watch: {
      'dataForm.stockMoveType': {
        immediate: true,
        handler: function (newValue, oldValue) {

          /*切换为销售出库*/
          if (newValue === 'SAL_OUTSTOCK') {
            this.carriageNoShow = true
            this.pickerNameShow = false
            this.noticeBillNoShow = true
            this.deptShow = true
            this.returnQtyShow = true
            this.grossWeightShow = true
            this.stockTypeShow = false
            this.customerNameShow = true
            this.workShopNameShow = false
            this.customerOrderNumShow = true
            this.customerProductCodeShow = true
            this.qtyReadOnly = true;
            this.uomName = "库存单位";
            this.qtyName = "实发数量";
            this.deptName = "发货部门";
            this.scanningProductCodeShow = false;
          } else if (newValue === 'SP_OUTSTOCK') {
            this.carriageNoShow = false
            this.pickerNameShow = false
            this.noticeBillNoShow = false
            this.deptShow = false
            this.returnQtyShow = false
            this.grossWeightShow = true
            this.stockTypeShow = true
            this.customerNameShow = false
            this.workShopNameShow = true
            this.customerOrderNumShow = false
            this.customerProductCodeShow = false
            this.qtyReadOnly = true;
            this.uomName = "单位";
            this.qtyName = "实退数量";
            this.deptName = "发货部门";
            this.scanningProductCodeShow = false;
          } else if (newValue === 'SP_PickMtrl') {
            this.carriageNoShow = false
            this.pickerNameShow = true
            this.noticeBillNoShow = false
            this.deptShow = true
            this.returnQtyShow = false
            this.grossWeightShow = false
            this.stockTypeShow = false
            this.customerNameShow = false
            this.workShopNameShow = false
            this.customerOrderNumShow = false
            this.customerProductCodeShow = false
            this.qtyReadOnly = false
            this.uomName = "单位";
            this.qtyName = "实发数量";
            this.deptName = "生产部门";
            this.scanningProductCodeShow = true;
          }
        }
      }
    },
    created() {
      this.getCurrentUserOptions();
    },
    mounted() {

    },
    methods: {
      getCurrentUserOptions() {
        request({
          url: '/api/project/BizMaterialStandard/getCurrentUser',
          method: 'post'
        }).then(res => {
          this.currentUserOptions = res.data
          this.dataForm.stockPersonId = this.currentUserOptions.userAccount;
          this.dataForm.stockPersonName = this.currentUserOptions.userName;
        })
      },
      init(id, isDetail) {
        this.dataForm.id = id || 0;
        this.visible = true;
        this.isDetail = isDetail || false;
        this.$nextTick(() => {
          // this.$refs['elForm'].resetFields();
          if (this.dataForm.id) {
            this.loading = true
            this.getStockMoveTypeList().then(() => {
              request({
                url: '/api/project/outStock/' + this.dataForm.id,
                method: 'get'
              }).then(res => {
                let details = res.data.bizstockmovelineList;
                this.dataInfo(res.data)
                if (this.dataForm.stockMoveType === "SAL_OUTSTOCK") {
                  request({
                    url: '/api/project/stockApi/getDeliveryNoticeInfo?billNo=' + this.dataForm.noticeBillNo,
                    method: 'get'
                  }).then((res) => {
                    this.remainOutQty = res.data;
                    for (let i = 0; i < details.length; i++) {
                      let stockDetail = details[i];
                      this.remainOutQty[stockDetail["productCode"]] = this.remainOutQty[stockDetail["productCode"]] - stockDetail["returnQty"];
                    }
                  })
                }
                this.loading = false
              })
            })
          } else {
            this.getStockMoveTypeList()
            this.reset();
          }
          // 获取公司+部门
          getDepartmentSelector().then(res => {
            this.departmentTreeData = res.data.list
          })
        });
        getDictionaryDataByTypeCode("outSockMoveType").then(res => {
          this.stockMoveTypeOptions= res.data
        });
        // // 获取部门
        // this.getDepartmentListNoPaging();
        // // 获取库存组
        // this.getOperatorGroupBillNoPaging();
        // // 获取仓管员
        // this.getOperatorNoPaging();
        // //获取简单生产退库类型
        // this.getStockTypeList();
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
        if (this.dataForm.stockMoveType === "SAL_OUTSTOCK") {
          if (this.dataForm.noticeBillNo === ''
            || this.dataForm.noticeBillNo === undefined) {
            this.$message({
              message: "销售出库时,发货通知单编号不能为空!",
              type: 'error',
              duration: 1000
            })
            return;
          }
        }
        var _data = this.dataList()
        if (!this.dataForm.id) {
          request({
            url: '/api/project/outStock',
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
            url: '/api/project/outStock/' + this.dataForm.id,
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
      addbizstockmovelineList() {
        let item = {
          lotNumber: undefined,
          productCode: undefined,
          productName: undefined,
          productSpc: undefined,
          productLvl: undefined,
          productLvlCode: undefined,
          uomId: undefined,
          uomName: undefined,
          qty: undefined,
          frp: undefined,
          grossWeight: undefined,
          customerId: undefined,
          customerCode: undefined,
          customerName: undefined,
          warehouseId: undefined,
          warehouseCode: undefined,
          warehouseName: undefined,
          giveAway: 0,
          locationCode: undefined,
          locationName: undefined,
          workShopId: undefined,
          workShopCode: undefined,
          workShopName: undefined,
          contractNo: undefined,
          returnQty: undefined,
          remark: undefined,
          customerProductCode: undefined,
          customerOrderNum: undefined,
        }
        this.dataForm.bizstockmovelineList.push(item)
      },
      delbizstockmovelineList(index) {
        let stockDetail = this.dataForm.bizstockmovelineList[index];
        if (this.dataForm.stockMoveType === 'SAL_OUTSTOCK') {
          this.remainOutQty[stockDetail["productCode"]] = this.remainOutQty[stockDetail["productCode"]] + stockDetail["returnQty"];
        }
        this.dataForm.bizstockmovelineList.splice(index, 1);
      },
      dataList() {
        return JSON.parse(JSON.stringify(this.dataForm));
      },
      dataInfo(dataAll) {
        this.dataForm = dataAll
      },
      selectBdQuanList() {
        this.inventoryChooseShow = true;
        this.$nextTick(() => {
          this.$refs.InventoryChoose.initData();
        })
      },
      processBdBoxList(data) {
        let checkSaleOutStockStatus = this.checkSaleOutStock();
        if (checkSaleOutStockStatus)
          return;
        for (let i = 0; i < data.length; i++) {
          let stock = data[i];
          if (this.dataForm.stockMoveType === "SAL_OUTSTOCK"
            && this.dataForm.bizstockmovelineList.length === 0) {
            if (!this.dataForm.noticeBillNo) {
              this.$message({
                type: 'error',
                message: "单据编号不能为空!"
              });
              return;
            }
            request({
              url: '/api/project/stockApi/getDeliveryNoticeInfo?billNo=' + this.dataForm.noticeBillNo,
              method: 'get'
            }).then((res) => {
              this.remainOutQty = res.data;
              this.getStockQuantInfo(stock.lotNumber, stock.productCode, stock.warehouseCode);
            })
          } else
            this.getStockQuantInfo(stock.lotNumber, stock.productCode, stock.warehouseCode);
        }
      },
      checkSaleOutStock() {
        if (!this.dataForm.stockMoveType) {
          this.$message({
            message: "出库类型不能为空!",
            type: 'error',
            duration: 2000,
          })
          this.scanninglotNumber = '';
          return true;
        }
        if (this.dataForm.bizstockmovelineList.length === 0) {
          if (this.dataForm.stockMoveType === "SAL_OUTSTOCK") {
            if (!this.dataForm.noticeBillNo) {
              this.$message({
                message: "通知单编号不能为空!",
                type: 'error',
                duration: 2000,
              })
              this.scanninglotNumber = '';
              return true;
            }
          }
        }
        return false;
      },
      bdBoxListData(data) {
        this.productChooseShow = false;
        let checkList = [];
        if (!this.dataForm.bizstockmovelineList.length) {
          for (let i = 0; i < data.length; i++) {
            const e = data[i];
            let item = {
              lotNumber: e.lotNumber,
              productId: e.productId,
              productCode: e.productCode,
              productName: e.productName,
              productSpc: e.productSpc,
              productLvl: e.productLvl,
              productLvlCode: e.productLvlCode,
              uomName: e.uomName,
              uomId: e.uomId,
              qty: e.qty,
              frp: e.frp,
              grossWeight: e.grossQty,
              customerId: e.customerId,
              customerCode: e.customerCode,
              customerName: e.customerName,
              warehouseId: e.warehouseId,
              warehouseCode: e.warehouseCode,
              warehouseName: e.warehouseName,
              giveAway: 0,
              returnQty: e.returnQty,
              locationCode: e.locationCode,
              locationName: e.locationName,
              workShopId: e.workShopId,
              workShopCode: e.workShopCode,
              workShopName: e.workShopName,
              customerProductCode: e.customerProductCode,
              customerOrderNum: e.customerOrderNum,
              contractNo: e.contractNo,
              remark: ''
            }
            if (this.dataForm.stockMoveType === 'SP_OUTSTOCK')
              item['stockType'] = '2';
            checkList.push(item)
          }

          this.dataForm.bizstockmovelineList = checkList
        } else {
          for (let i = 0; i < data.length; i++) {
            const e = data[i];
            let boo = this.dataForm.bizstockmovelineList.some(o => o.lotNumber === e.lotNumber
              && o.productCode === e.productCode
              && o.warehouseCode === e.warehouseCode); //去重复
            if (!boo) {
              let item = {
                lotNumber: e.lotNumber,
                productId: e.productId,
                productCode: e.productCode,
                productName: e.productName,
                productSpc: e.productSpc,
                productLvl: e.productLvl,
                productLvlCode: e.productLvlCode,
                uomName: e.uomName,
                uomId: e.uomId,
                qty: e.qty,
                frp: e.frp,
                grossWeight: e.grossQty,
                customerId: e.customerId,
                customerCode: e.customerCode,
                customerName: e.customerName,
                warehouseId: e.warehouseId,
                warehouseCode: e.warehouseCode,
                warehouseName: e.warehouseName,
                giveAway: 0,
                returnQty: e.returnQty,
                locationCode: e.locationCode,
                locationName: e.locationName,
                workShopId: e.workShopId,
                workShopCode: e.workShopCode,
                workShopName: e.warehouseName,
                customerProductCode: e.customerProductCode,
                customerOrderNum: e.customerOrderNum,
                contractNo: e.contractNo,
                remark: ''
              }
              if (this.dataForm.stockMoveType === 'SP_OUTSTOCK')
                item['stockType'] = '2';
              checkList.push(item)
            }
          }
          this.dataForm.bizstockmovelineList = [...this.dataForm.bizstockmovelineList, ...checkList]
        }
      },
      clickBdQuanListDisplay() {
        this.inventoryChooseShow = false;
      },
      scanningLotNumber() {  //扫描批号/箱号
        let scanningProductCode = this.scanningProductCode.trim();
        let scanninglotNumber = this.scanninglotNumber.trim();
        let scanningWarehouseCode = this.scanningWarehouseCode.trim();
        if (!this.scanninglotNumber) {
          this.$message({
            type: 'error',
            message: "箱号/批号编码不能为空!"
          });
          this.scanninglotNumber = '';
          return;
        }
        let checkSaleOutStockStatus = this.checkSaleOutStock();
        if (checkSaleOutStockStatus)
          return;
        if (this.dataForm.stockMoveType === "SP_PickMtrl") {
          if (!this.scanningProductCode) {
            this.$message({
              type: 'error',
              message: "简单生产领料时,物料编码不能为空!"
            });
            this.scanninglotNumber = '';
            return;
          }
          if (!this.scanningWarehouseCode) {
            this.$message({
              type: 'error',
              message: "简单生产领料时,仓库编码编码不能为空!"
            });
            this.scanninglotNumber = '';
            return;
          }
        }
        if (this.dataForm.stockMoveType === "SAL_OUTSTOCK"
          && this.dataForm.bizstockmovelineList.length === 0) {
          if (!this.dataForm.noticeBillNo) {
            this.$message({
              type: 'error',
              message: "单据编号不能为空!"
            });
            return;
          }
          request({
            url: '/api/project/stockApi/getDeliveryNoticeInfo?billNo=' + this.dataForm.noticeBillNo,
            method: 'get'
          }).then((res) => {
            this.remainOutQty = res.data;
            this.getStockQuantInfo(scanninglotNumber, scanningProductCode, scanningWarehouseCode);
          })
        } else
          this.getStockQuantInfo(scanninglotNumber, scanningProductCode, scanningWarehouseCode);
        this.scanninglotNumber = '';
      },
      getStockQuantInfo(scanninglotNumber, scanningProductCode, scanningWarehouseCode) {
        let _data = {
          lotNumber: scanninglotNumber,
          productCode: scanningProductCode,
          warehouseCode: scanningWarehouseCode,
          stockMoveType: this.dataForm.stockMoveType
        }
        request({
          url: `/api/project/stockApi/getStockQuantInfo`,
          method: 'post',
          data: _data
        }).then(res => {
          let _list = [];
          let stockDetail = res.data;
          if (this.dataForm.stockMoveType === "SAL_OUTSTOCK") {
            let remainOutQty = this.remainOutQty[stockDetail["productCode"]];
            if (remainOutQty <= 0) {
              this.$message({
                type: 'error',
                message: "物料编码" + stockDetail["productCode"] + "的出库量已达到,无需再扫码!"
              });
              return;
            }
            let qty = stockDetail["qty"];
            if (remainOutQty - qty > 0)
              stockDetail["returnQty"] = qty;
            else
              stockDetail["returnQty"] = remainOutQty;
            this.remainOutQty[stockDetail["productCode"]] = remainOutQty - qty;
          }
          _list.push(stockDetail);
          this.bdBoxListData(_list); //调用公共数据回写
          this.$message({
            message: scanninglotNumber + "添加成功!",
            type: 'success',
            duration: 2000,
          })
        });
      },
      getStockMoveTypeList() {
        return getDictionaryDataByTypeCode('outSockMoveType').then(res => {
          this.stockMoveTypeOptions = res.data
          this.dataForm.stockMoveType = this.stockMoveTypeOptions[0].enCode;
        }).catch(() => {
        })
      },
      reset() {
        for (let key in this.dataForm) {
          if (key === "stockMoveDate") {
            this.dataForm[key] = new Date().getTime();
            continue;
          } else if (key === "bizstockmovelineList") {
            this.dataForm[key] = [];
            continue;
          }
          this.dataForm[key] = ''
        }
        this.remainOutQty = {};
        this.scanningProductCode = '';
        this.scanningWarehouseCode = '';
      },
      getDepartmentListNoPaging() {
        // let _query = {
        //   code: "BM000005"
        // };
        request({
          url: `/api/project/stockApi/getDepartmentListNoPaging`,
          method: 'post',
          data: {}
        }).then(res => {
          this.departmentOptions = res.data;
          this.dataForm.dept = "BM000005";
        });
      },
      getOperatorGroupBillNoPaging() {
        let _query = {
          "operatorGroupType": "KCZ"
        };
        request({
          url: `/api/project/stockApi/getOperatorGroupBillNoPaging`,
          method: 'post',
          data: _query
        }).then(res => {
          this.operatorGroupOptions = res.data
          this.dataForm.stockerGroup = this.operatorGroupOptions[0].number;
        });
      },
      getOperatorNoPaging() {
        let _query = {
          "operatorType": "WHY"
        };
        request({
          url: `/api/project/stockApi/getOperatorNoPaging`,
          method: 'post',
          data: _query
        }).then(res => {
          this.operatorOptions = res.data;
        });
      },
      getStockTypeList() {
        let _query = {
          "stockType": "SP_OUTSTOCK",
          "name": "",
          "code": ""
        };
        request({
          url: `/api/project/stockApi/getStockType`,
          method: 'post',
          data: _query
        }).then(res => {
          this.stockTypeOptions = res.data;
        });
      },
      choosePicker() {  //仓库弹框
        this.pickerChooseShow = true;
        this.$nextTick(() => {
          this.$refs.PickerChoose.initData();
        })
      },
      chooseMaterial() {  //仓库弹框
        this.materialChooseShow = true;
        this.$nextTick(() => {
          this.$refs.MaterialChoose.initData();
        })
      },
      returnEmpInfo(empInfo) {//仓库弹框返回值
        this.dataForm.pickerName = empInfo.name; //领料人名称
        this.dataForm.pickerNo = empInfo.code; //领料人编码
        this.pickerChooseShow = false;
      },
      returnMaterialInfo(materialInfo) {//仓库弹框返回值
        this.scanningProductCode = materialInfo.productCode; //物料条码
        this.scanningWarehouseCode = materialInfo.wareHouseCode; //仓库编码
        this.materialChooseShow = false;
      },
      clickSalDeliveryNotice() {
        this.salDeliveryNoticeChooseShow = true;
        this.$nextTick(() => {
          this.$refs.SalDeliveryNoticeChoose.initData();
        })
      },
      selectSalDeliveryNotice(data) {
        this.dataForm.noticeBillNo = data[0].billNo;
      },
      closeSalDeliveryNotice() {
        this.salDeliveryNoticeChooseShow = false;
      }
    }
  }
</script>
