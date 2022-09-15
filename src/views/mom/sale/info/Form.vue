<template>
  <el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'"
             :close-on-click-modal="false" append-to-body
             :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
             width="900px">
    <el-row :gutter="15" class="">
      <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="120px" label-position="right">
        <template v-if="!loading">
          <el-col :span="12">
            <el-form-item label="销售订单号" prop="salesOrderCode">
              <el-input v-model="dataForm.salesOrderCode" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="售后信息来源" prop="afterSaleSource">
                <el-select v-model="dataForm.afterSaleSource" placeholder="请选择" clearable :style='{"width":"100%"}'
                           :multiple="false">
                  <el-option v-for="(item, index) in afterSaleSourceOptions" :key="index" :label="item.fullName"
                             :value="item.id" :disabled="item.disabled"></el-option>

                </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="售后类型" prop="afterSaleType">
              <el-select v-model="dataForm.afterSaleType" placeholder="请选择" clearable :style='{"width":"100%"}'
                         :multiple="false">
                <el-option v-for="(item, index) in afterSaleTypeOptions" :key="index" :label="item.fullName"
                           :value="item.id" :disabled="item.disabled"></el-option>

              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户联系电话" prop="customerCalls">
              <el-input v-model="dataForm.customerCalls" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="售后原因" prop="afterSaleCause">
              <el-input v-model="dataForm.afterSaleCause" placeholder="请输入" :style='{"width":"100%"}' true
                        type="textarea" :autosize='{"minRows":4,"maxRows":4}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="售后产品编码" prop="materialCode">
              <el-input prefix-icon="el-icon-search" @click.native="selectMaterial()" readonly v-model="dataForm.materialCode" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="售后产品名称" prop="materialName">
              <el-input v-model="dataForm.materialName" readonly placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户编码" prop="clientCode">
              <el-input v-model="dataForm.clientCode" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称" prop="clientName">
              <el-input v-model="dataForm.clientName" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
        </template>
      </el-form>
      <el-dialog
        title="半成品成品"
        :close-on-click-modal="false"
        append-to-body
        :visible.sync="materialVisible"
        class="JNPF-dialog JNPF-dialog_center"
        lock-scroll
        width="1000px">
        <material-dialog
          ref="materialDialog"
          @onChange="materialDialogChange"
        ></material-dialog>
      </el-dialog>
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
import {getDictionaryDataByTypeCode, getDictionaryDataSelector} from '@/api/systemData/dictionary'
import materialDialog from "@/views/mom/product/producttemplate/materialDialog";

export default {
  components: { materialDialog },
  props: [],
  data() {
    return {
      visible: false,
      loading: false,
      isDetail: false,
      materialVisible:false,
      dataForm: {
        salesOrderCode: '',
        afterSaleType: '',
        afterSaleSource:'',
        afterSaleSourceName:'',
        customerCalls:'',
        afterSaleCause: '',
        materialCode: '',
        materialName: '',
        clientCode: '',
        clientName: '',
      },
      rules:
        {
          salesOrderCode: [
            {
              required: true,
              message: '请输入',
              trigger: 'blur'
            },
          ],
          afterSaleType: [
            {
              required: true,
              message: '请选择',
              trigger: 'change'
            },
          ],
          afterSaleSource: [
            {
              required: true,
              message: '请选择',
              trigger: 'change'
            },
          ],
          afterSaleCause: [
            {
              required: true,
              message: '请输入',
              trigger: 'blur'
            },
          ],
          customerCalls: [
            {
              required: true,
              message: '请输入',
              trigger: 'blur'
            },
          ],
          materialCode: [
            {
              required: true,
              message: '请选择',
              trigger: 'blur'
            },
          ],
          materialName: [
            {
              required: true,
              message: '请选择',
              trigger: 'blur'
            },
          ],
          clientName: [
            {
              required: true,
              message: '请输入',
              trigger: 'blur'
            },
          ],
        },
      afterSaleTypeOptions: [],
      afterSaleSourceOptions: [],

    }
  },
  computed: {},
  watch: {},
  created() {
    this.getafterSaleTypeOptions()
    this.getafterSaleSourceOptions()
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
    init(id, isDetail) {
      this.dataForm.id = id || 0;
      this.visible = true;
      this.isDetail = isDetail || false;
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields();
        if (this.dataForm.id) {
          this.loading = true
          request({
            url: '/api/project/Sale_marketing_service_info/' + this.dataForm.id,
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
          url: '/api/project/Sale_marketing_service_info',
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
          url: '/api/project/Sale_marketing_service_info/' + this.dataForm.id,
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
    selectMaterial(){ // 半成品显示
      this.materialVisible = true;
      this.$nextTick(() => {
        this.$refs.materialDialog.initData();
      });
    },
    materialDialogChange(dataRow){ // 半成品选择
      this.dataForm.materialCode = dataRow.materialCode
      this.dataForm.materialName = dataRow.materialName
      this.materialVisible = false;
    },
  },
}

</script>
