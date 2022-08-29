<template>
  <el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'"
             :close-on-click-modal="false" append-to-body
             :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
             width="600px">
    <el-row :gutter="15" class="">
      <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="right">
        <template v-if="!loading">
          <el-col :span="24">
            <el-form-item label="产品模板名称" prop="productTemplateName">
              <el-input v-model="dataForm.productTemplateName" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="产品模板编码" prop="productTemplateCode">
              <el-input v-model="dataForm.productTemplateCode" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="产品分类" prop="productCategory">
              <el-select v-model="dataForm.productCategory" placeholder="请选择" clearable :style='{"width":"100%"}'
                         :multiple="false">
                <el-option v-for="(item, index) in productCategoryOptions" :key="index" :label="item.fullName"
                           :value="item.id" :disabled="item.disabled"></el-option>

              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="产品类型" prop="productType">
              <el-select v-model="dataForm.productType" placeholder="请选择" clearable :style='{"width":"100%"}'
                         :multiple="false">
                <el-option v-for="(item, index) in productTypeOptions" :key="index" :label="item.fullName"
                           :value="item.id" :disabled="item.disabled"></el-option>

              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="服务类型" prop="serviceType">
              <el-select v-model="dataForm.serviceType" placeholder="请选择" clearable :style='{"width":"100%"}'
                         :multiple="false">
                <el-option v-for="(item, index) in serviceTypeOptions" :key="index" :label="item.fullName"
                           :value="item.id" :disabled="item.disabled"></el-option>

              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="追溯类型" prop="trackingType">
              <el-select v-model="dataForm.trackingType" placeholder="请选择" clearable :style='{"width":"100%"}'
                         :multiple="false">
                <el-option v-for="(item, index) in trackingTypeOptions" :key="index" :label="item.fullName"
                           :value="item.id" :disabled="item.disabled"></el-option>

              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="可采购" prop="purchasable">
              <el-switch v-model="dataForm.purchasable" active-value="1" inactive-value="0">

              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="可销售" prop="salable">
              <el-switch v-model="dataForm.salable" active-value="1" inactive-value="0">

              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购说明" prop="descriptionPurchase">
              <el-input v-model="dataForm.descriptionPurchase" placeholder="请输入" :style='{"width":"100%"}' true
                        type="textarea" :autosize='{"minRows":4,"maxRows":4}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="销售说明" prop="descriptionSale">
              <el-input v-model="dataForm.descriptionSale" placeholder="请输入" :style='{"width":"100%"}' true
                        type="textarea" :autosize='{"minRows":4,"maxRows":4}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
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
          <el-col :span="8">
            <el-form-item label="型号" prop="model">
              <el-input v-model="dataForm.model" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="体积" prop="volume">
              <el-input v-model="dataForm.volume" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="重量" prop="weight">
              <el-input v-model="dataForm.weight" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计量单位" prop="uomId">
              <el-input v-model="dataForm.uomId" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购计量单位" prop="uomPoId">
              <el-input v-model="dataForm.uomPoId" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
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
          productTemplateName: '',
          productTemplateCode: '',
          productCategory: "",
          productType: "",
          serviceType: "",
          trackingType: "",
          purchasable: 0,
          salable: 0,
          descriptionPurchase: '',
          descriptionSale: '',
          purchasePrice: '',
          specification: '',
          model: '',
          volume: '',
          weight: '',
          uomId: '',
          uomPoId: '',
          description: '',
        },
        rules:
          {
            productTemplateName: [
              {
                required: true,
                message: '请输入',
                trigger: 'blur'
              },
            ],
            productTemplateCode: [
              {
                required: true,
                message: '请输入',
                trigger: 'blur'
              },
            ],
            productCategory: [
              {
                required: true,
                message: '请选择',
                trigger: 'change'
              },
            ],
          },
        productCategoryOptions: [{"fullName": "物料", "id": "0"}, {"fullName": "半成品", "id": "1"}, {
          "fullName": "成品",
          "id": "2"
        }],
        productTypeOptions: [],
        serviceTypeOptions: [{"fullName": "采购", "id": "0"}, {"fullName": "生产", "id": "1"}],
        trackingTypeOptions: [{"fullName": "按唯一序列号", "id": "0"}, {"fullName": "按批次", "id": "1"}, {
          "fullName": "不追溯",
          "id": "2"
        }],

      }
    },
    computed: {},
    watch: {},
    created() {
      this.getproductTypeOptions();
    },
    mounted() {
    },
    methods: {
      getproductTypeOptions() {
        getDictionaryDataSelector('261038218101654789').then(res => {
          this.productTypeOptions = res.data.list
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
              url: '/api/project/ProductTemplate/' + this.dataForm.id,
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
            url: '/api/project/ProductTemplate',
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
            url: '/api/project/ProductTemplate/' + this.dataForm.id,
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
