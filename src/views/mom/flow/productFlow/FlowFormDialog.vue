<template>
  <el-drawer
    :title="!dataForm.id ? '新建' : isDetail ? '详情' : '编辑'"
    :wrapperClosable="false"
    ref="drawer"
    :visible.sync="visible"
    :before-close="handleDrawerClose"
    class="JNPF-common-drawer"
    size="100%">
    <el-row :gutter="15" class="">
      <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="right"
               style="overflow: auto;height: calc(87vh)">
        <div height="100px" style="margin-top: 12px;">
          <el-col :span="8">
            <el-form-item label="产品流程编码" prop="productFlowCode">
              <el-input v-model="dataForm.productFlowCode" placeholder="请选择" clearable :style='{"width":"100%"}' readonly>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品模板名称" prop="productTemplateName">
              <el-input prefix-icon="el-icon-search" v-model="dataForm.productTemplateName" placeholder="请选择" clearable
                        readonly @click.native="productTemplateShow()" :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品模板编码" prop="productTemplateCode">
              <el-input v-model="dataForm.productTemplateCode" placeholder="请选择" clearable :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品类型" prop="productType">
              <el-input v-model="dataForm.productType" placeholder="请选择" clearable :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
        </div>
      </el-form>
    </el-row>
    <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false"> 取 消</el-button>
        <el-button type="primary" @click="dataFormSubmit()" v-if="!isDetail"> 确 定</el-button>
    </span>

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
  </el-drawer>
</template>
<script>
import request from '@/utils/request'
import productTemplateDialog from "./productTemplateDialog";

export default {
  name: 'flowFormDialog',
  components: {productTemplateDialog},
  props: [],
  data() {
    return {
      visible: false,
      loading: false,
      isDetail: false,
      productTemplateVisible: false,
      dataForm: {
        productTemplateId: '',
        productTemplateName: '',
        productFlowCode: '',
        productTemplateCode: '',
        productType: '',
        status: '',
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
            url: '/api/project/Bd_product_flow/' + this.dataForm.id,
            method: 'get'
          }).then(res => {
            this.dataInfo(res.data)
            this.loading = false
          })
        } else {
          debugger
          this.dataForm = this.$options.data().dataForm
          this.dataForm.productFlowCode = new Date().getTime()
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
    productTemplateShow() {
      this.productTemplateVisible = true
      this.$nextTick(() => {
        this.$refs.productTemplateDialog.initData(id, isDetail)
      })
    },
    productTemplateChange(rowData) {
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
           debugger
      })
      this.productTemplateVisible = false
    },
    request() {
      var _data = this.dataList()
      if (!this.dataForm.id) {
        request({
          url: '/api/project/Bd_product_flow',
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
      this.dataForm = _dataAll
    },
    handleDrawerClose(done) {
      done()
      this.$emit('refreshDataList')
    },
  },
}

</script>
