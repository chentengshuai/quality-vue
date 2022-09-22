<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="120px" label-position="right">
          <template v-if="!loading">
            <el-col :span="24">
              <div class="JNPF-common-title">
                <h2 style="padding-left: 24px;">售后信息</h2>
              </div>
            </el-col>
            <el-col :span="12">
              <el-form-item label="销售订单号" prop="salesOrderCode">
                {{ dataForm.salesOrderCode }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="售后信息来源" prop="afterSaleSource">
                {{ dataForm.afterSaleSource | dynamicTextById(afterSaleSourceOptions) }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="售后类型" prop="afterSaleType">
                {{ dataForm.afterSaleType | dynamicTextById(afterSaleTypeOptions) }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="客户联系电话" prop="customerCalls">
                {{ dataForm.customerCalls }}
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="售后原因" prop="afterSaleCause">
                {{ dataForm.afterSaleCause }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="售后产品编码" prop="materialCode">
                {{ dataForm.materialCode }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="售后产品名称" prop="materialName">
                {{ dataForm.materialName }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="客户编码" prop="clientCode">
                {{ dataForm.clientCode }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="客户名称" prop="clientName">
                {{ dataForm.clientName }}
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <div class="JNPF-common-title">
                <h2 style="padding-left: 24px;">整改信息</h2>
              </div>
            </el-col>
            <el-col :span="24">
              <el-form-item label="整改意见" prop="clientName">
                {{ saleMarketingAbarbeitung.opinion }}
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <div class="JNPF-common-title">
                <h2 style="padding-left: 24px;">整改变更信息</h2>
              </div>
            </el-col>
            <el-col :span="24" style="overflow:auto;height: 240px;">
              <el-form-item v-for="item in appointValList" label="" :key="item.id">
                {{ item.val }}
              </el-form-item>
            </el-col>
          </template>
        </el-form>
        <div style="bottom:0;position:fixed;text-align: center;width: 90%;margin-bottom: 22px;">
          <span slot="footer" class="dialog-footer">
            <el-button v-if="careOfBtuShow" @click="confirmAbarDetail" type="primary">确认整改</el-button>
            <el-button v-if="careOfBtuShow" @click="careOfUser" type="primary">转 交</el-button>
            <el-button v-if="careOfBtuShow" @click="cancelRectification" type="primary">取消整改</el-button>
          </span>
        </div>
      </div>
    </div>
    <AbarbeitungDetailForm v-if="abDetailFormVisible" ref="abarbeitungDetailForm" @refresh="confirmAbarDetailChange"/>
    <AbarbeitungUserForm v-if="abUserVisible" ref="abarbeitungUserForm" @refresh="careOfUserChange"/>
    <CancelRectificationForm v-if="cancelRectVisible" ref="cancelRectificationForm" @refresh="cancelRectRefresh"/>
  </div>
</template>
<script>
import request from '@/utils/request'
import AbarbeitungDetailForm from './AbarbeitungDetailForm'
import AbarbeitungUserForm from './AbarbeitungUserForm'
import CancelRectificationForm from './CancelRectificationForm'
import {getDictionaryDataByTypeCode, getDictionaryDataSelector} from '@/api/systemData/dictionary'
import {mapGetters} from "vuex";

export default {
  components: {AbarbeitungDetailForm, AbarbeitungUserForm,CancelRectificationForm},
  props: [],
  data() {
    return {
      visible: false,
      loading: false,
      materialVisible: false,
      abDetailFormVisible: false,
      careOfBtuShow: false,
      abUserVisible: false,
      cancelRectVisible: false,
      dataForm: {
        salesOrderCode: '',
        afterSaleType: '',
        afterSaleSource: '',
        afterSaleSourceName: '',
        customerCalls: '',
        afterSaleCause: '',
        materialCode: '',
        materialName: '',
        clientCode: '',
        clientName: '',
      },
      saleMarketingAbarbeitungAppointList: [],
      saleMarketingAbarbeitung: {},
      appointValList: [],
      saleInfoId: '',
      rules: {},
      afterSaleTypeOptions: [],
      afterSaleSourceOptions: [],

    }
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  watch: {},
  created() {
    this.getafterSaleTypeOptions()
    this.getafterSaleSourceOptions()
    this.saleInfoId = this.$route.query.id
    this.init(this.saleInfoId)
  },
  mounted() {
  },
  methods: {
    getafterSaleTypeOptions() {
      getDictionaryDataByTypeCode('saleType').then(res => {
        this.afterSaleTypeOptions = res.data
      })
    },
    getafterSaleSourceOptions() {
      getDictionaryDataByTypeCode('afterSaleSource').then(res => {
        this.afterSaleSourceOptions = res.data
      })
    },
    init(id) {
      this.dataForm.id = id || 0;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields();
        if (this.dataForm.id) {
          this.loading = true
          request({
            url: '/api/project/Sale_marketing_service_info/' + this.dataForm.id,
            method: 'get'
          }).then(res => {
            this.dataInfo(res.data)
            request({
              url: '/api/project/Sale_marketing_abarbeitung/getDataListByInfoId/' + this.dataForm.id,
              method: 'get'
            }).then(res => {
              if (res.data.length > 0) {
                let il = res.data.length
                res.data.forEach(item => {
                  let ad = {}
                  ad.id = item.id
                  let dt = new Date(parseInt(item.creationTime))
                  var Y = dt.getFullYear() + '-'
                  var M = (dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1) + '-'
                  var D = dt.getDate() + ' '
                  var h = dt.getHours() + ':'
                  var m = dt.getMinutes() + ':'
                  var s = dt.getSeconds()
                  let dtVal = Y + M + D + h + m + s;
                  if (item.type == 1) {
                    this.saleMarketingAbarbeitung = item
                    ad.val = item.creatorName + "(" + item.creatorId + ")" + "于" + dtVal + "新增整改需求，指派负责人:" + item.userName + "(" + item.userCode + ")"
                  } else if (item.type == 2) {
                    ad.val = item.creatorName + "(" + item.creatorId + ")" + "于" + dtVal + "变更负责人:" + item.userName + "(" + item.userCode + ")"
                  } else if (item.type == 3) {
                    ad.val = item.creatorName + "(" + item.creatorId + ")" + "于" + dtVal + "取消整改,原因:"+item.opinion
                  } else if (item.type == 4) {
                    ad.val = item.creatorName + "(" + item.creatorId + ")" + "于" + dtVal + "重新指派整改需求，指派负责人:" + item.userName + "(" + item.userCode + ")"+",整改意见:"+item.opinion
                  } else if (item.type == 5) {
                    ad.val = item.creatorName + "(" + item.creatorId + ")" + "于" + dtVal + "确认整改！"
                  }
                  this.saleMarketingAbarbeitungAppointList.push(item)
                  this.appointValList.push(ad)
                  if (il == 1 && item.type != 5) {
                    if (this.userInfo.userAccount == item.userCode) {
                      this.careOfBtuShow = true
                    }
                  }
                  il--
                })
              }
              this.loading = false
            })
          })
        }
      })
    },
    dataList() {
      var _data = JSON.parse(JSON.stringify(this.dataForm));
      return _data;
    },
    dataInfo(dataAll) {
      let _dataAll = dataAll
      this.dataForm = _dataAll
    },
    confirmAbarDetail() { // 确认整改
      this.abDetailFormVisible = true
      this.$nextTick(() => {
        this.$refs.abarbeitungDetailForm.init(this.dataForm.id, this.saleInfoId)
      })
    },
    confirmAbarDetailChange() {
      this.careOfBtuShow = false
      this.abDetailFormVisible = false
    },
    careOfUser() { // 转交
      this.abUserVisible = true;
      this.$nextTick(() => {
        this.$refs.abarbeitungUserForm.init(this.saleInfoId)
      })
    },
    careOfUserChange() {
      this.careOfBtuShow = false
      this.abUserVisible = false
    },
    cancelRectification() { // 取消整改
      this.cancelRectVisible = true;
      this.$nextTick(() => {
        this.$refs.cancelRectificationForm.init(this.saleInfoId)
      })
    },
    cancelRectRefresh() { // 取消整改
      this.careOfBtuShow = false
      this.cancelRectVisible = false
    }
  },
}
</script>
