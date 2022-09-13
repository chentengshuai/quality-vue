<template>
  <el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'"
             :close-on-click-modal="false" append-to-body
             :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
             width="900px">
    <el-row :gutter="15" class="">
      <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="120px" label-position="right">
        <template v-if="!loading">
          <el-col :span="12">
            <el-form-item label="售后信息" prop="saleInfoId">
              <el-input prefix-icon="el-icon-search" @click.native="selectSaleInfo()" readonly  v-model="dataForm.saleInfoId" placeholder="请选择" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="售后订单号" prop="salesOrderCode">
              <el-input readonly  v-model="dataForm.salesOrderCode" placeholder="请选择" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="售后处理结果" prop="saleType">
              <el-select v-model="dataForm.saleType" placeholder="请选择" clearable :style='{"width":"100%"}'
                         :multiple="false">
                <el-option v-for="(item, index) in afterSaleResultOptions" :key="index" :label="item.fullName"
                           :value="item.id" :disabled="item.disabled"></el-option>

              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="售后处理备注" prop="saleRemark">
              <el-input v-model="dataForm.saleRemark" placeholder="请输入" :style='{"width":"100%"}' true
                        type="textarea" :autosize='{"minRows":4,"maxRows":4}'>

              </el-input>
            </el-form-item>
          </el-col>
        </template>
      </el-form>
      <el-dialog
        title="售后信息"
        :close-on-click-modal="false"
        append-to-body
        :visible.sync="saleInfoVisible"
        class="JNPF-dialog JNPF-dialog_center"
        lock-scroll
        width="1000px">
        <saleInfoDialog
          ref="saleInfoDialog"
          @onChange="saleInfoDialogChange"
        ></saleInfoDialog>
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
import saleInfoDialog from './SaleInfoDialog'

export default {
  components: { saleInfoDialog },
  props: [],
  data() {
    return {
      visible: false,
      loading: false,
      isDetail: false,
      saleInfoVisible:false,
      dataForm: {
        saleType: '',
        salesOrderCode:'',
        saleRemark: '',
        saleInfoId: '',
      },
      afterSaleResultOptions: [],
      rules:
        {
          saleInfoId: [
            {
              required: true,
              message: '请选择',
              trigger: 'blur'
            },
          ],
          salesOrderCode: [
            {
              required: true,
              message: '请选择',
              trigger: 'blur'
            },
          ],
          saleType: [
            {
              required: true,
              message: '请选择',
              trigger: 'change'
            },
          ],
          saleRemark: [
            {
              required: true,
              message: '请输入',
              trigger: 'blur'
            },
          ],

        },

    }
  },
  computed: {},
  watch: {},
  created() {
    this.getafterSaleTypeOptions();
  },
  mounted() {
  },
  methods: {
    getafterSaleTypeOptions() {
      getDictionaryDataByTypeCode('saleResult').then(res => {
        this.afterSaleResultOptions = res.data
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
            url: '/api/project/Sale_marketing_service_result/' + this.dataForm.id,
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
          url: '/api/project/Sale_marketing_service_result',
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
          url: '/api/project/Sale_marketing_service_result/' + this.dataForm.id,
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
    selectSaleInfo(){
      this.saleInfoVisible = true;
      this.$nextTick(() => {
        this.$refs.saleInfoDialog.initData();
      });
    },
    saleInfoDialogChange(rowData){
      this.dataForm.saleInfoId = rowData.id
      this.dataForm.salesOrderCode = rowData.salesOrderCode
      this.saleInfoVisible = false
    }
  },
}

</script>
