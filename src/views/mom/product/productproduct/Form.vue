<template>
  <el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'"
             :close-on-click-modal="false" append-to-body
             :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
             width="600px">
    <el-row :gutter="15" class="">
      <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="right">
        <template v-if="!loading">
          <el-col :span="24">
            <el-form-item label="产品模板ID" prop="productTemplateId">
              <el-input v-model="dataForm.productTemplateId" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="产品名称" prop="productName">
              <el-input v-model="dataForm.productName" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="产品编码" prop="productCode">
              <el-input v-model="dataForm.productCode" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="销售价格" prop="purchasePrice">
              <el-input v-model="dataForm.purchasePrice" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规格" prop="specification">
              <el-input v-model="dataForm.specification" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="型号" prop="model">
              <el-input v-model="dataForm.model" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="体积" prop="volume">
              <el-input v-model="dataForm.volume" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="重量" prop="weight">
              <el-input v-model="dataForm.weight" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="产品主图" prop="productImage">
              <JNPF-UploadImg v-model="dataForm.productImage" :fileSize="5" sizeUnit="MB" :limit="9">

              </JNPF-UploadImg>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否启用" prop="status">
              <el-switch v-model="dataForm.status" active-value="1" inactive-value="0">

              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="description">
              <el-input v-model="dataForm.description" placeholder="请输入" :style='{"width":"100%"}' true type="textarea"
                        :autosize='{"minRows":4,"maxRows":4}'>

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
          productTemplateId: '',
          productName: '',
          productCode: '',
          purchasePrice: '',
          specification: '',
          model: '',
          volume: '',
          weight: '',
          productImage: [],
          status: 0,
          description: '',
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
              url: '/api/project/ProductProduct/' + this.dataForm.id,
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
            url: '/api/project/ProductProduct',
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
            url: '/api/project/ProductProduct/' + this.dataForm.id,
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
        _data.productImage = JSON.stringify(_data.productImage)
        return _data;
      },
      dataInfo(dataAll) {
        let _dataAll = dataAll
        _dataAll.productImage = JSON.parse(_dataAll.productImage)
        this.dataForm = _dataAll
      },
    },
  }

</script>
