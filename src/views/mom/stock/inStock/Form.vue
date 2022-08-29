<template>
  <el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'"
             :close-on-click-modal="false" append-to-body
             :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
             width="1200px">
    <el-row :gutter="15" class="">
      <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="right">
        <template v-if="!loading">
          <el-col :span="24">
            <el-collapse :accordion="false" v-model="activezblmsx" class="mb-20">
              <el-collapse-item title="基本信息" name="1">
                <el-col :span="8">
                  <el-form-item label="单据编号" prop="stockMoveCode">
                    <el-input v-model="dataForm.stockMoveCode" readonly :style='{"width":"100%"}'>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="入库人员" prop="stockPersonId">
                    <user-search v-model="dataForm.stockPersonId" :defaultLogin="true" :name="dataForm.stockPersonName"
                                 @name="value => { dataForm.stockPersonName = value }">
                    </user-search>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="入库时间" prop="stockMoveDate">
                    <el-date-picker v-model="dataForm.stockMoveDate" placeholder="请选择" clearable
                                    :style='{"width":"100%"}' type="datetime" format="yyyy-MM-dd HH:mm:ss"
                                    value-format="timestamp">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="入库类型" prop="stockMoveType">
                    <el-select v-model="dataForm.stockMoveType" placeholder="请选择" clearable :style='{"width":"100%"}'
                               :multiple="false">
                      <el-option v-for="(item, index) in stockMoveTypeOptions" :key="index" :label="item.fullName"
                                 :value="item.enCode" :disabled="item.disabled"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="通知单编号" v-if="saleReturnStockShow" prop="noticeBillNo">
                    <el-input v-model="dataForm.noticeBillNo" placeholder="请选择ERP退货通知单编号" readonly clearable
                              :style='{"width":"100%"}' @click.native="clickSalReturnNotice">

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
                  <el-form-item :label="deptName" prop="dept" v-if="saleReturnStockShow">
                    <el-select v-model="dataForm.dept" placeholder="请选择" clearable :style='{"width":"100%"}'
                               :multiple="false">
                      <el-option v-for="(item, index) in departmentOptions" :key="index" :label="item.name"
                                 :value="item.code" :disabled="item.disabled"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="运输单号" v-if="saleReturnStockShow" prop="carriageNo">
                    <el-input v-model="dataForm.carriageNo" placeholder="请输入" clearable :style='{"width":"100%"}'>

                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="16">
                  <el-form-item label="备注" prop="remark">
                    <el-input v-model="dataForm.remark" placeholder="请输入" clearable :style='{"width":"100%"}'>

                    </el-input>
                  </el-form-item>
                </el-col>
              </el-collapse-item>
              <div style="margin-top:5px;" v-show="!saleReturnStockShow">
                <el-button type="primary" icon="el-icon-plus" @click="selectBdBoxList()">选择装箱单
                </el-button>
                <span style="float:right;">扫描批号/箱号
                  <el-input v-model="boxNum" placeholder="请扫描批号/箱号" clearable :style='{"width":"60%"}'
                            @keyup.enter.native="scanningBoxNum()">
                  </el-input>
                </span>
              </div>
              <el-collapse-item title="明细" name="2">
                <el-col :span="24">
                  <el-form-item label-width="0">
                    <el-table :data="dataForm.bizstockmovelineList" size='mini'>
                      <el-table-column type="index" width="50" label="序号" align="center"/>
                      <el-table-column prop="lotNumber" label="批号/箱号" width="150">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.lotNumber" readonly :style='{"width":"100%"}'>
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="productCode" label="物料编码" width="150">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.productCode" readonly :style='{"width":"100%"}'>
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="productName" label="物料名称" width="150">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.productName" readonly :style='{"width":"100%"}'>
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="productSpc" label="规格型号" width="150">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.productSpc" readonly :style='{"width":"100%"}'>
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="productLvl" label="产品等级" width="150">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.productLvl" placeholder="请输入" readonly clearable
                                    :style='{"width":"100%"}'>
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="uomName" label="单位" width="150">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.uomName" readonly :style='{"width":"100%"}'>
                          </el-input>
                        </template>
                      </el-table-column>

                      <el-table-column prop="returnQty" label="应退数量" width="150" v-if="saleReturnStockShow">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.returnQty" readonly :style='{"width":"100%"}'>
                          </el-input>
                        </template>
                      </el-table-column>

                      <el-table-column prop="qty" label="数量" width="150">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.qty" :style='{"width":"100%"}'>
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="grossWeight" label="毛重" width="150" v-if="!saleReturnStockShow">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.grossWeight" readonly :style='{"width":"100%"}'>
                          </el-input>
                        </template>
                      </el-table-column>

                      <el-table-column prop="stockType" label="入库类型" width="150" v-if="!saleReturnStockShow">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.stockType" placeholder="请选择" clearable :style='{"width":"100%"}'
                                     :multiple="false">
                            <el-option v-for="(item, index) in stockTypeOptions" :key="index" :label="item.name"
                                       :value="item.code" :disabled="item.disabled"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>

                      <el-table-column prop="customerName" label="客户" width="150" v-if="!saleReturnStockShow">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.customerName" readonly :style='{"width":"100%"}'>
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="contractNo" label="合同号" width="150" v-if="!saleReturnStockShow">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.contractNo" readonly :style='{"width":"100%"}'>
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="warehouseName" label="仓库" width="150">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.warehouseName" placeholder="请输入" readonly
                                    :style='{"width":"100%"}' @click.native="choosePosition(scope.$index)">
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="locationName" label="仓位" width="150">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.locationName" readonly :style='{"width":"100%"}'>
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="frp" label="FRP管" width="150" v-if="!saleReturnStockShow">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.frp" placeholder="请输入" readonly clearable
                                    :style='{"width":"100%"}'>
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="workShopName" label="生产车间" width="150" v-if="!saleReturnStockShow">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.workShopName" placeholder="请输入" clearable readonly
                                    :style='{"width":"100%"}'>
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="customerProductCode" label="客户物料编码" width="150"
                                       v-if="!saleReturnStockShow">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.customerProductCode" placeholder="请输入" clearable
                                    :style='{"width":"100%"}'>
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="customerOrderNum" label="客户订单号" width="150" v-if="!saleReturnStockShow">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.customerOrderNum" placeholder="请输入" clearable
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
                  </el-form-item>
                </el-col>
              </el-collapse-item>
            </el-collapse>
          </el-col>

          <sal-return-notice-choose ref="SalReturnNoticeChoose" v-if="salReturnNoticeChooseShow"
                                    @selectSalReturnNotice="selectSalReturnNotice"
                                    @closeSalReturnNotice="closeSalReturnNotice"></sal-return-notice-choose>

          <el-dialog title="选择装箱单"
                     :close-on-click-modal="false" append-to-body
                     :visible.sync="bdBoxListShow" class="JNPF-dialog JNPF-dialog_center" lock-scroll
                     width="1000px">
            <bd-box-list ref="BdBoxList" @bdBoxListDataForm="processBdBoxList"
                         @bdBoxListDisplay="clickBdBoxListDisplay"></bd-box-list>
          </el-dialog>

          <el-dialog title="仓库列表"
                     :close-on-click-modal="false" append-to-body
                     :visible.sync="positionChooseShow" class="JNPF-dialog JNPF-dialog_center" lock-scroll
                     v-if="positionChooseShow" width="1000px" height="800px">
            <position-choose ref="PositionChoose" @returnPositionData="returnPositionData"></position-choose>
          </el-dialog>

        </template>
      </el-form>
    </el-row>
    <span slot="footer" class="dialog-footer">
        <el-button @click="closeForm()"> 取 消</el-button>
        <el-button type="primary" @click="dataFormSubmit()" v-if="!isDetail"> 确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import request from '@/utils/request'
  import {getOrderList} from '@/api/permission/order'
  import {getDepartmentSelector} from '@/api/permission/department'
  import BdBoxList from './bdBoxList'
  import PositionChoose from './positionChoose'
  import {getDictionaryDataByTypeCode} from '@/api/systemData/dictionary'
  import SalReturnNoticeChoose from './salReturnNoticeChoose'

  export default {
    components: {BdBoxList, PositionChoose, SalReturnNoticeChoose},
    props: [],
    data() {
      return {
        visible: false,
        loading: false,
        isDetail: false,
        salReturnNoticeChooseShow: false,
        bdBoxListShow: false,
        positionChooseShow: false,
        rowNum: 0,
        boxNum: '',
        deptName: '发货部门', //frp管变量名称
        saleReturnStockShow: false, //销售退库
        columnShow: true,
        dataForm: {
          stockMoveCode: '',
          cargoOwnerName: '',
          cargoOwnerId: '',
          stockOrgId: '',
          stockOrgName: '',
          productionOrganization: "",
          productionOrganizationName: "",
          stockPersonId: '',
          stockPersonName: '',
          stockMoveDate: new Date().getTime(),
          stockMoveName: '',
          stockMoveType: "",
          customerName: '',
          customerId: '',
          remark: '',
          orderNumber: '',
          stockerGroup: '',
          stocker: '',
          dept: '',
          carrier: '',
          carriageNo: '',
          noticeBillNo: '',
          bizstockmovelineList: [],
        },
        activezblmsx: ["1", "2"],
        rules:
          {
            stockPersonId: [
              {
                required: true,
                message: '请输入关键词',
                trigger: 'blur'
              },
            ],
            productionOrganization: [
              {
                required: true,
                message: '请选择',
                trigger: 'blur'
              },
            ],
            stockMoveDate: [
              {
                required: true,
                message: '请选择',
                trigger: 'blur'
              },
            ],
            stockMoveType: [
              {
                required: true,
                message: '请选择',
                trigger: 'blur'
              },
            ],
            stocker: [
              {
                required: true,
                message: '请选择',
                trigger: 'blur'
              },
            ]
          },
        stockMoveTypeOptions: [],
        departmentTreeData: [],
        getOrderListData: [],
        departmentOptions: [],
        operatorGroupOptions: [],
        operatorOptions: [],
        stockTypeOptions: []
      }
    },
    computed: {},
    watch: {
      'dataForm.stockMoveType': {
        immediate: true,
        handler: function (newValue, oldValue) {
          /*切换为销售退货入库*/
          if (newValue === 'SP_InStock') {
            this.deptName = '发货部门';
            this.saleReturnStockShow = false;
          } else if (newValue === 'SAL_RETURNSTOCK') {
            this.deptName = '库存部门';
            this.saleReturnStockShow = true;
          }
        }
      }
    },
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
          if (this.dataForm.id) {
            this.loading = true
            this.getStockMoveTypeList().then(() => {
              request({
                url: '/api/InStock/BizStockMove/' + this.dataForm.id,
                method: 'get'
              }).then(res => {
                this.dataInfo(res.data)
                this.loading = false
              })
            })
          } else {
            this.reset();
            this.getStockMoveTypeList();
          }

        });
        // 获取公司+部门
        getDepartmentSelector().then(res => {
          this.departmentTreeData = res.data.list
        });
        // 获取订单号下拉
        getOrderList().then(res => {
          this.getOrderListData = res.data
        });
        // 获取部门
        this.getDepartmentListNoPaging();
        // 获取库存组
        this.getOperatorGroupBillNoPaging();
        // 获取仓管员
        this.getOperatorNoPaging();
        //获取简单生产入库类型
        this.getStockTypeList();
      },
      //关闭表单
      closeForm() {
        debugger
        this.visible = false
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['elForm'].validate((valid) => {
          if (valid) {
            debugger
            this.request()
          }
        })
      },
      request() {
        if (this.dataForm.stockMoveType === "SAL_RETURNSTOCK") {
          if (!this.dataForm.noticeBillNo) {
            this.$message({
              message: "销售退货时,销售退货通知单编号不能为空!",
              type: 'error',
              duration: 2000
            })
            return;
          }
        }
        let _data = this.dataList()
        if (!this.dataForm.id) {
          request({
            url: '/api/InStock/BizStockMove',
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
            url: '/api/InStock/BizStockMove/' + this.dataForm.id,
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
          packageId: undefined,  //装箱单Id
          lotNumber: undefined,
          productId: undefined,
          productCode: undefined,
          productName: undefined,
          productSpc: undefined,
          productLvl: undefined,
          productLvlCode: undefined,
          uomId: undefined,
          uomName: undefined,
          qty: undefined,
          returnQty: undefined,
          grossWeight: undefined,
          customerId: undefined,
          customerCode: undefined,
          customerName: undefined,
          warehouseId: undefined,
          warehouseCode: undefined,
          warehouseName: undefined,
          giveAway: 0,
          frp: undefined,
          locationCode: undefined,
          locationName: undefined,
          workShopId: undefined,
          workShopName: undefined,
          workShopCode: undefined,
          customerProductCode: undefined,
          customerOrderNum: undefined,
          contractNo: undefined,
          remark: undefined
        }
        this.dataForm.bizstockmovelineList.push(item)
      },
      delbizstockmovelineList(index) {
        this.dataForm.bizstockmovelineList.splice(index, 1);
      },
      dataList() {
        return JSON.parse(JSON.stringify(this.dataForm));
      },
      dataInfo(dataAll) {
        this.dataForm = dataAll
      },
      selectBdBoxList() {  //选择装箱单
        this.bdBoxListShow = true;
        this.$nextTick(() => {
          this.$refs.BdBoxList.initData();
        })
      },
      processBdBoxList(data) {
        let _list = [];
        for (let i = 0; i < data.length; i++) {
          let bdBox = data[i];
          request({
            url: `/api/project/stockApi/getBoxInfo?boxNum=` + bdBox.boxNum,
            method: 'get'
          }).then(res => {
            _list.push(res.data);
            this.bdBoxListData(_list); //调用公共数据回写
          });
        }
      },
      bdBoxListData(data) {  //装箱弹框回写数据(公共回写方法)
        this.bdBoxListShow = false;
        let checkList = [];
        if (!this.dataForm.bizstockmovelineList.length) {
          for (let i = 0; i < data.length; i++) {
            const e = data[i];
            let item = {
              packageId: e.id,  //装箱单Id
              lotNumber: e.boxNum,
              productId: e.productId,
              productCode: e.productCode,
              productName: e.productName,
              productSpc: e.size,
              productLvl: e.productGradeName,
              productLvlCode: e.productGrade,
              uomId: e.uomId,
              uomName: e.uomUnit,
              qty: e.totalNetWeight,
              grossWeight: e.totalGrossWeight,
              customerId: e.clientId,
              customerCode: e.clientCode,
              customerName: e.clientName,
              warehouseId: e.warehouseId,
              warehouseCode: e.warehouseCode,
              warehouseName: e.warehouseName,
              giveAway: 0,
              locationCode: e.locationCode,
              locationName: e.locationName,
              frp: e.frp,
              workShopId: e.workShopId,
              workShopName: e.workShopName,
              workShopCode: e.workShopCode,
              customerProductCode: e.customerProductCode,
              customerOrderNum: e.customerOrderNum,
              contractNo: e.contractNo,
              remark: ''
            };
            if (this.dataForm.stockMoveType === 'SP_InStock')
              item['stockType'] = '1';
            checkList.push(item)
          }
          this.dataForm.bizstockmovelineList = checkList
        } else {
          for (let i = 0; i < data.length; i++) {
            const e = data[i];
            let boo = this.dataForm.bizstockmovelineList.some(o => o.lotNumber == e.boxNum); //去重复
            if (!boo) {
              let item = {
                packageId: e.id,  //装箱单Id
                lotNumber: e.boxNum,
                productId: e.productId,
                productCode: e.productCode,
                productName: e.productName,
                productSpc: e.size,
                productLvl: e.productGradeName,
                productLvlCode: e.productGrade,
                uomId: e.uomId,
                uomName: e.uomUnit,
                qty: e.totalNetWeight,
                grossWeight: e.totalGrossWeight,
                customerId: e.clientId,
                customerCode: e.clientCode,
                customerName: e.clientName,
                warehouseId: e.warehouseId,
                warehouseCode: e.warehouseCode,
                warehouseName: e.warehouseName,
                giveAway: 0,
                locationCode: e.locationCode,
                locationName: e.locationName,
                frp: e.frp,
                workShopId: e.workShopId,
                workShopName: e.workShopName,
                workShopCode: e.workShopCode,
                customerProductCode: e.customerProductCode,
                customerOrderNum: e.customerOrderNum,
                contractNo: e.contractNo,
                remark: ''
              };
              if (this.dataForm.stockMoveType === 'SP_InStock')
                item['stockType'] = '1';
              checkList.push(item)
            }
          }
          this.dataForm.bizstockmovelineList = [...this.dataForm.bizstockmovelineList, ...checkList]
        }
      },
      clickBdBoxListDisplay(flag) {  //装箱弹框显示或关闭
        this.bdBoxListShow = false;
      },
      choosePosition(index) {  //仓库弹框
        this.rowNum = index; //仓库行数
        this.positionChooseShow = true;
        this.$nextTick(() => {
          this.$refs.PositionChoose.initData();
        })
      },
      returnPositionData(positionData) {//仓库弹框返回值
        this.dataForm.bizstockmovelineList[this.rowNum].warehouseName = positionData.warehouseName; //仓库名称
        this.dataForm.bizstockmovelineList[this.rowNum].warehouseCode = positionData.warehouseCode; //仓库编码
        this.dataForm.bizstockmovelineList[this.rowNum].warehouseId = positionData.id; //仓库ID
        this.positionChooseShow = false;
      },
      scanningBoxNum() {  //扫描批号/箱号
        let scanBoxNum = this.boxNum.trim();
        if (scanBoxNum !== '' || scanBoxNum !== undefined) {
          request({
            url: `/api/project/stockApi/getBoxInfo?boxNum=` + scanBoxNum,
            method: 'get'
          }).then(res => {
            let _list = [];
            _list.push(res.data);
            this.bdBoxListData(_list); //调用公共数据回写
            this.$message({
              message: scanBoxNum + "添加成功!",
              type: 'success',
              duration: 2000,
            })
          });
        }
        this.boxNum = '';
      },
      getStockMoveTypeList() {
        return getDictionaryDataByTypeCode('inSockMoveType').then(res => {
          this.stockMoveTypeOptions = res.data
          this.dataForm.stockMoveType = this.stockMoveTypeOptions[0].enCode;
        }).catch(() => {
        })
      },
      getDepartmentListNoPaging() {
        let _query = {
          code: "BM000005"
        };
        request({
          url: `/api/project/stockApi/getDepartmentListNoPaging`,
          method: 'post',
          data: _query
        }).then(res => {
          this.departmentOptions = res.data
          this.dataForm.dept = this.departmentOptions[0].code;
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
      },
      getSaleReturnInInfo() {
        if (!this.dataForm.noticeBillNo) {
          this.$message({
            type: 'error',
            message: "单据编号不能为空!"
          });
          return;
        }
        request({
          url: '/api/project/stockApi/getSaleReturnInInfo?noticeBillNo=' + this.dataForm.noticeBillNo,
          method: 'get'
        }).then((res) => {
          let data = res.data;
          if (data.stocker)
            this.dataForm.stocker = data.stocker;
          if (data.dept)
            this.dataForm.dept = data.dept;
          if (data.carriageNo)
            this.dataForm.carriageNo = data.carriageNo;
          this.dataForm.bizstockmovelineList = [...this.dataForm.bizstockmovelineList, ...data.bizstockmovelineList];
        })
      },
      getStockTypeList() {
        let _query = {
          "stockType": "SP_InStock",
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
      clickSalReturnNotice() {
        this.salReturnNoticeChooseShow = true;
        this.$nextTick(() => {
          this.$refs.SalReturnNoticeChoose.initData();
        })
      },
      selectSalReturnNotice(data) {
        this.dataForm.noticeBillNo = data[0].billNo;
        this.getSaleReturnInInfo()
      },
      closeSalReturnNotice() {
        this.salReturnNoticeChooseShow = false;
      }
    }
  }

</script>
