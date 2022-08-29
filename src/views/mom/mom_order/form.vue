<template>
  <div>
    <el-row :gutter="15">
      <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="right"
               :disabled="setting.readonly">
        <template v-if="!loading">
          <el-col :span="12" v-if="judgeShow('orderNum')">
            <el-form-item label="订单编号" prop="orderNum">
              <el-input :disabled="judgeWrite('orderNum')" v-model="dataForm.orderNum" placeholder="请输入" clearable
                        :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="judgeShow('orderId')">
            <el-form-item label="ERP订单ID" prop="orderId">
              <el-input :disabled="judgeWrite('orderId')" v-model="dataForm.orderId" placeholder="请输入" clearable
                        :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="judgeShow('documentStatus')">
            <el-form-item label="状态" prop="documentStatus">
              <el-input :disabled="judgeWrite('documentStatus')" v-model="dataForm.documentStatus" placeholder="请输入"
                        clearable :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="judgeShow('saleOrg')">
            <el-form-item label="销售组织" prop="saleOrg">
              <el-input :disabled="judgeWrite('saleOrg')" v-model="dataForm.saleOrg" placeholder="请输入" clearable
                        :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="judgeShow('saleDate')">
            <el-form-item label="销售日期" prop="saleDate">
              <el-date-picker :disabled="judgeWrite('saleDate')" v-model="dataForm.saleDate" placeholder="请选择" clearable
                              :style='{"width":"100%"}' type="date" format="yyyy-MM-dd" value-format="timestamp">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="judgeShow('saleCustName')">
            <el-form-item label="客户名" prop="saleCustName">
              <el-input :disabled="judgeWrite('saleCustName')" v-model="dataForm.saleCustName" placeholder="请输入"
                        clearable :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="judgeShow('saleDept')">
            <el-form-item label="销售部门" prop="saleDept">
              <el-input :disabled="judgeWrite('saleDept')" v-model="dataForm.saleDept" placeholder="请输入" clearable
                        :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="judgeShow('saleGroup')">
            <el-form-item label="销售组" prop="saleGroup">
              <el-input :disabled="judgeWrite('saleGroup')" v-model="dataForm.saleGroup" placeholder="请输入" clearable
                        :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="judgeShow('saler')">
            <el-form-item label="销售员" prop="saler">
              <el-input :disabled="judgeWrite('saler')" v-model="dataForm.saler" placeholder="请输入" clearable
                        :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="judgeShow('billType')">
            <el-form-item label="单据类型" prop="billType">
              <el-input :disabled="judgeWrite('billType')" v-model="dataForm.billType" placeholder="请输入" clearable
                        :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="judgeShow('businessType')">
            <el-form-item label="业务类型" prop="businessType">
              <el-input :disabled="judgeWrite('businessType')" v-model="dataForm.businessType" placeholder="请输入"
                        clearable :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="judgeShow('headDeliveyWay')">
            <el-form-item label="交货方式" prop="headDeliveyWay">
              <el-input :disabled="judgeWrite('headDeliveyWay')" v-model="dataForm.headDeliveyWay" placeholder="请输入"
                        clearable :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="judgeShow('headLoc')">
            <el-form-item label="交货地点" prop="headLoc">
              <el-input :disabled="judgeWrite('headLoc')" v-model="dataForm.headLoc" placeholder="请输入" clearable
                        :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="judgeShow('contractNo')">
            <el-form-item label="合同编号" prop="contractNo">
              <el-input :disabled="judgeWrite('contractNo')" v-model="dataForm.contractNo" placeholder="请输入" clearable
                        :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="judgeShow('remark')">
            <el-form-item label="备注" prop="remark">
              <el-input :disabled="judgeWrite('remark')" v-model="dataForm.remark" placeholder="请输入" clearable
                        :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="judgeShow('createUser')">
            <el-form-item label="创建人" prop="createUser">
              <el-input :disabled="judgeWrite('createUser')" v-model="dataForm.createUser" placeholder="请输入" clearable
                        :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="judgeShow('createDate')">
            <el-form-item label="创建日期" prop="createDate">
              <el-date-picker :disabled="judgeWrite('createDate')" v-model="dataForm.createDate" placeholder="请选择"
                              clearable :style='{"width":"100%"}' type="datetime" format="yyyy-MM-dd HH:mm:ss"
                              value-format="timestamp">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="judgeShow('modifyUser')">
            <el-form-item label="修改人" prop="modifyUser">
              <el-input :disabled="judgeWrite('modifyUser')" v-model="dataForm.modifyUser" placeholder="请输入" clearable
                        :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="judgeShow('modifyDate')">
            <el-form-item label="修改日期" prop="modifyDate">
              <el-date-picker :disabled="judgeWrite('modifyDate')" v-model="dataForm.modifyDate" placeholder="请选择"
                              clearable :style='{"width":"100%"}' type="datetime" format="yyyy-MM-dd HH:mm:ss"
                              value-format="timestamp">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="judgeShow('approveUser')">
            <el-form-item label="审批人" prop="approveUser">
              <el-input :disabled="judgeWrite('approveUser')" v-model="dataForm.approveUser" placeholder="请输入" clearable
                        :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="judgeShow('approveDate')">
            <el-form-item label="审批日期" prop="approveDate">
              <el-date-picker :disabled="judgeWrite('approveDate')" v-model="dataForm.approveDate" placeholder="请选择"
                              clearable :style='{"width":"100%"}' type="datetime" format="yyyy-MM-dd HH:mm:ss"
                              value-format="timestamp">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="judgeShow('settleCurr')">
            <el-form-item label="结算币别" prop="settleCurr">
              <el-input :disabled="judgeWrite('settleCurr')" v-model="dataForm.settleCurr" placeholder="请输入" clearable
                        :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="judgeShow('isIncludedTax')">
            <el-form-item label="是否含税" prop="isIncludedTax">
              <el-switch :disabled="judgeWrite('isIncludedTax')" v-model="dataForm.isIncludedTax" active-value="1"
                         inactive-value="0">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="judgeShow('priceList')">
            <el-form-item label="价目表" prop="priceList">
              <el-input :disabled="judgeWrite('priceList')" v-model="dataForm.priceList" placeholder="请输入" clearable
                        :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="judgeShow('recCondition')">
            <el-form-item label="收款条件" prop="recCondition">
              <el-input :disabled="judgeWrite('recCondition')" v-model="dataForm.recCondition" placeholder="请输入"
                        clearable :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="judgeShow('mom_order_materialList')">
            <el-form-item label-width="0">
              <div class="JNPF-common-title">
                <h2>设计子表</h2>
              </div>
              <el-table :data="dataForm.mom_order_materialList" size='mini'>
                <el-table-column type="index" width="50" label="序号" align="center"/>
                <el-table-column prop="orderErpId" label="ERP订单ID">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.orderErpId" placeholder="请输入" clearable :style='{"width":"100%"}'
                              :disabled="setting.readonly||judgeWrite('mom_order_materialList')"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="materialId" label="物料ID">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.materialId" placeholder="请输入" clearable :style='{"width":"100%"}'
                              :disabled="setting.readonly||judgeWrite('mom_order_materialList')"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="materialName" label="物料名称">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.materialName" placeholder="请输入" clearable :style='{"width":"100%"}'
                              :disabled="setting.readonly||judgeWrite('mom_order_materialList')"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="materialNumber" label="物料编码">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.materialNumber" placeholder="请输入" clearable :style='{"width":"100%"}'
                              :disabled="setting.readonly||judgeWrite('mom_order_materialList')"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="specification" label="规格型号">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.specification" placeholder="请输入" clearable :style='{"width":"100%"}'
                              :disabled="setting.readonly||judgeWrite('mom_order_materialList')"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="productGrade" label="产品等级">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.productGrade" placeholder="请输入" clearable :style='{"width":"100%"}'
                              :disabled="setting.readonly||judgeWrite('mom_order_materialList')"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="unit" label="销售单位">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.unit" placeholder="请输入" clearable :style='{"width":"100%"}'
                              :disabled="setting.readonly||judgeWrite('mom_order_materialList')"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="qty" label="销售数量">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.qty" placeholder="请输入" clearable :style='{"width":"100%"}'
                              :disabled="setting.readonly||judgeWrite('mom_order_materialList')"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="priceUnit" label="计价单位">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.priceUnit" placeholder="请输入" clearable :style='{"width":"100%"}'
                              :disabled="setting.readonly||judgeWrite('mom_order_materialList')"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="priceUnitQty" label="计价数量">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.priceUnitQty" placeholder="请输入" clearable :style='{"width":"100%"}'
                              :disabled="setting.readonly||judgeWrite('mom_order_materialList')"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="cuPrice" label="铜价">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.cuPrice" placeholder="请输入" clearable :style='{"width":"100%"}'
                              :disabled="setting.readonly||judgeWrite('mom_order_materialList')"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="processPrice" label="加工费单价">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.processPrice" placeholder="请输入" clearable :style='{"width":"100%"}'
                              :disabled="setting.readonly||judgeWrite('mom_order_materialList')"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="taxPrice" label="含税单价">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.taxPrice" placeholder="请输入" clearable :style='{"width":"100%"}'
                              :disabled="setting.readonly||judgeWrite('mom_order_materialList')"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="taxRate" label="税率%">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.taxRate" placeholder="请输入" clearable :style='{"width":"100%"}'
                              :disabled="setting.readonly||judgeWrite('mom_order_materialList')"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="taxAmount" label="税额">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.taxAmount" placeholder="请输入" clearable :style='{"width":"100%"}'
                              :disabled="setting.readonly||judgeWrite('mom_order_materialList')"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="allAmount" label="价税合计">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.allAmount" placeholder="请输入" clearable :style='{"width":"100%"}'
                              :disabled="setting.readonly||judgeWrite('mom_order_materialList')"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.remark" placeholder="请输入" clearable :style='{"width":"100%"}'
                              :disabled="setting.readonly||judgeWrite('mom_order_materialList')"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="price" label="单价">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.price" placeholder="请输入" clearable :style='{"width":"100%"}'
                              :disabled="setting.readonly||judgeWrite('mom_order_materialList')"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="amount" label="金额">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.amount" placeholder="请输入" clearable :style='{"width":"100%"}'
                              :disabled="setting.readonly||judgeWrite('mom_order_materialList')"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="stockOrg" label="库存组织">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.stockOrg" placeholder="请输入" clearable :style='{"width":"100%"}'
                              :disabled="setting.readonly||judgeWrite('mom_order_materialList')"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="isFree" label="是否赠品">
                  <template slot-scope="scope">
                    <el-switch v-model="scope.row.isFree" active-value="1" inactive-value="0"
                               :disabled="setting.readonly||judgeWrite('mom_order_materialList')"
                    >
                    </el-switch>
                  </template>
                </el-table-column>
                <el-table-column prop="deliveryDate" label="要货日期">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.deliveryDate" placeholder="请输入" clearable :style='{"width":"100%"}'
                              :disabled="setting.readonly||judgeWrite('mom_order_materialList')"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="settleOrg" label="结算组织">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.settleOrg" placeholder="请输入" clearable :style='{"width":"100%"}'
                              :disabled="setting.readonly||judgeWrite('mom_order_materialList')"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="ownerType" label="货主类型">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.ownerType" placeholder="请输入" clearable :style='{"width":"100%"}'
                              :disabled="setting.readonly||judgeWrite('mom_order_materialList')"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="owner" label="货主">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.owner" placeholder="请输入" clearable :style='{"width":"100%"}'
                              :disabled="setting.readonly||judgeWrite('mom_order_materialList')"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="50"
                                 v-if="!setting.readonly && !judgeWrite('mom_order_materialList')">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" class="JNPF-table-delBtn"
                               @click="delmom_order_materialList(scope.$index)">删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="table-actions" @click="addmom_order_materialList()"
                   v-if="!setting.readonly && !judgeWrite('mom_order_materialList')">
                <el-button type="text" icon="el-icon-plus">添加</el-button>
              </div>
            </el-form-item>
          </el-col>
        </template>
      </el-form>
    </el-row>
    <UserBox v-if="userBoxVisible" ref="userBox" @submit="submit"/>
  </div>
</template>
<script>
  import request from '@/utils/request'
  import {previewDataInterface} from '@/api/systemData/dataInterface'
  import {getDictionaryDataSelector} from '@/api/systemData/dictionary'

  export default {
    components: {},
    props: [],
    data() {
      return {
        visible: false,
        loading: false,
        setting: {},
        eventType: '',
        userBoxVisible: false,
        dataForm: {
          id: '',
          flowId: '',
          status: 1,
          freeapproveruserid: '',
          orderNum: '',
          orderId: '',
          documentStatus: '',
          saleOrg: '',
          saleDate: '',
          saleCustName: '',
          saleDept: '',
          saleGroup: '',
          saler: '',
          billType: '',
          businessType: '',
          headDeliveyWay: '',
          headLoc: '',
          contractNo: '',
          remark: '',
          createUser: '',
          createDate: '',
          modifyUser: '',
          modifyDate: '',
          approveUser: '',
          approveDate: '',
          settleCurr: '',
          isIncludedTax: 0,
          priceList: '',
          recCondition: '',
          mom_order_materialList: [],
        },
        rules:
          {},

      }
    },
    computed: {},
    watch: {},
    created() {
    },
    mounted() {
    },
    methods: {
      judgeShow(id) {
        if (!this.setting.formOperates || !this.setting.formOperates.length) return true
        let arr = this.setting.formOperates.filter(o => o.id === id) || []
        if (!arr.length) return true
        let item = arr[0]
        return item.read
      },
      judgeWrite(id) {
        if (!this.setting.formOperates || !this.setting.formOperates.length) return false
        let arr = this.setting.formOperates.filter(o => o.id === id) || []
        if (!arr.length) return true
        let item = arr[0]
        return !item.write
      },
      goBack() {
        this.$emit('refresh')
      },
      init(data) {
        this.dataForm.id = data.id || "";
        this.setting = data;
        this.visible = true;
        this.$nextTick(() => {
          this.$refs['elForm'].resetFields();
          if (this.dataForm.id) {
            this.loading = true
            request({
              url: '/api/project/Mom_order/' + this.dataForm.id,
              method: 'get'
            }).then(res => {
              this.dataInfo(res.data)
              this.loading = false
            })
          }
          this.$emit('setPageLoad')

        })
      },
      // 表单提交
      dataFormSubmit(eventType) {
        this.$refs['elForm'].validate((valid) => {
          if (valid) {
            if (eventType === 'audit' || eventType === 'reject') {
              this.$emit('eventReciver', this.dataForm, eventType)
              return
            }
            this.dataForm.status = eventType === 'submit' ? 0 : 1
            this.eventType = eventType
            if (this.eventType === 'submit') {
              this.$confirm('您确定要提交当前流程吗, 是否继续?', '提示', {
                type: 'warning'
              }).then(() => {
                this.request()
              }).catch(() => {
              });
            } else {
              this.request()
            }
          }
        })
      },
      request() {
        var _data = this.dataList()
        if (!this.dataForm.id) {
          request({
            url: '/api/project/Mom_order',
            method: 'post',
            data: _data
          }).then((res) => {
            this.$message({
              message: res.msg,
              type: 'success',
              duration: 1000,
              onClose: () => {
                this.visible = false
                this.$emit('close', true)
              }
            })
          })
        } else {
          request({
            url: '/api/project/Mom_order/' + this.dataForm.id,
            method: 'PUT',
            data: _data
          }).then((res) => {
            this.$message({
              message: res.msg,
              type: 'success',
              duration: 1000,
              onClose: () => {
                this.visible = false
                this.$emit('close', true)
              }
            })
          })
        }
      },
      addmom_order_materialList() {
        let item = {
          orderErpId: undefined,
          materialId: undefined,
          materialName: undefined,
          materialNumber: undefined,
          specification: undefined,
          productGrade: undefined,
          unit: undefined,
          qty: undefined,
          priceUnit: undefined,
          priceUnitQty: undefined,
          cuPrice: undefined,
          processPrice: undefined,
          taxPrice: undefined,
          taxRate: undefined,
          taxAmount: undefined,
          allAmount: undefined,
          remark: undefined,
          price: undefined,
          amount: undefined,
          stockOrg: undefined,
          isFree: undefined,
          deliveryDate: undefined,
          settleOrg: undefined,
          ownerType: undefined,
          owner: undefined,
        }
        this.dataForm.mom_order_materialList.push(item)
      },
      delmom_order_materialList(index) {
        this.dataForm.mom_order_materialList.splice(index, 1);
      },
      dataList() {
        var _data = JSON.parse(JSON.stringify(this.dataForm));
        for (let i = 0; i < _data.mom_order_materialList.length; i++) {
          var _list = _data.mom_order_materialList[i];
        }
        return _data;
      },
      dataInfo(dataAll) {
        let _dataAll = dataAll
        for (let i = 0; i < _dataAll.mom_order_materialList.length; i++) {
          var _list = _dataAll.mom_order_materialList[i];
        }
        this.dataForm = _dataAll
      },
    },
  }

</script>
