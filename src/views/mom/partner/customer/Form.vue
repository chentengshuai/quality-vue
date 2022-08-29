<template>
  <el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'"
             :close-on-click-modal="false" append-to-body
             :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
             width="600px">
    <el-row :gutter="15" class="">
      <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="right">
        <template v-if="!loading">
          <el-col :span="12">
            <el-form-item label="业务伙伴编码" prop="partnerCode">
              <el-input v-model="dataForm.partnerCode" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="业务伙伴类型" prop="partnerType">
              <el-input v-model="dataForm.partnerType" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="业务伙伴名称" prop="partnerName">
              <el-input v-model="dataForm.partnerName" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="业务伙伴简称" prop="partnerShortName">
              <el-input v-model="dataForm.partnerShortName" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否供应商" prop="isSupplier">
              <el-switch v-model="dataForm.isSupplier" active-value="1" inactive-value="0">

              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否客户" prop="isCustomer">
              <el-switch v-model="dataForm.isCustomer" active-value="1" inactive-value="0">

              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否个人" prop="isPersonal">
              <el-switch v-model="dataForm.isPersonal" active-value="1" inactive-value="0">

              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="tel">
              <el-input v-model="dataForm.tel" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="传真" prop="fax">
              <el-input v-model="dataForm.fax" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="国家/地区" prop="country">
              <el-input v-model="dataForm.country" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="省/州" prop="province">
              <el-input v-model="dataForm.province" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="城市" prop="city">
              <el-input v-model="dataForm.city" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="区" prop="regional">
              <el-input v-model="dataForm.regional" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地址" prop="addr">
              <el-input v-model="dataForm.addr" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="统一社会信用代码" prop="taxCode">
              <el-input v-model="dataForm.taxCode" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发票抬头" prop="invoiceTitle">
              <el-input v-model="dataForm.invoiceTitle" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户银行" prop="bankName">
              <el-input v-model="dataForm.bankName" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="银行户名" prop="bankAccountName">
              <el-input v-model="dataForm.bankAccountName" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="银行账号" prop="bankAccountNumber">
              <el-input v-model="dataForm.bankAccountNumber" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
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

  export default {
    components: {},
    props: [],
    data() {
      return {
        visible: false,
        loading: false,
        isDetail: false,
        dataForm: {
          partnerCode: '',
          partnerType: '',
          partnerName: '',
          partnerShortName: '',
          isSupplier: 0,
          isCustomer: 0,
          isPersonal: 0,
          tel: '',
          fax: '',
          country: '',
          province: '',
          city: '',
          regional: '',
          addr: '',
          taxCode: '',
          invoiceTitle: '',
          bankName: '',
          bankAccountName: '',
          bankAccountNumber: '',
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
      init(id, isDetail) {
        this.dataForm.id = id || 0;
        this.visible = true;
        this.isDetail = isDetail || false;
        this.$nextTick(() => {
          this.$refs['elForm'].resetFields();
          if (this.dataForm.id) {
            this.loading = true
            request({
              url: '/api/project/Partner/' + this.dataForm.id,
              method: 'get'
            }).then(res => {
              this.dataInfo(res.data)
              this.loading = false
            })
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
            url: '/api/project/Partner',
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
            url: '/api/project/Partner/' + this.dataForm.id,
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
        this.dataForm = _dataAll
      },
    },
  }

</script>
