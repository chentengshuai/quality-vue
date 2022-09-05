<template>
  <el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'"
             :close-on-click-modal="false" append-to-body
             :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
             width="700px">
    <el-row :gutter="15" class="">
      <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="120px" label-position="right">
        <template v-if="!loading">
          <el-col :span="24">
            <el-form-item label="产品模板编码" prop="productTemplateCode">
              <el-input prefix-icon="el-icon-search" readonly v-model="dataForm.productTemplateCode" placeholder="请选择" @click.native="materialShow()" clearable :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="产品模板名称" prop="productTemplateName">
              <el-input v-model="dataForm.productTemplateName" readonly placeholder="请选择" clearable :style='{"width":"100%"}'>
              </el-input>
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
<!--          <el-col :span="12">
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
          </el-col>-->
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
          <el-col :span="12">
            <el-form-item label="型号" prop="model">
<!--              <el-input v-model="dataForm.model" placeholder="请输入" :style='{"width":"70px"}'>
              </el-input>-->
              <el-input-number v-model="dataForm.model" placeholder="型号" :style='{"width":"100%"}' :step="1">
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="体积" prop="volume">
<!--              <el-input v-model="dataForm.volume" placeholder="请输入" :style='{"width":"70px"}'>
              </el-input>-->
              <el-input-number v-model="dataForm.volume" placeholder="体积" :style='{"width":"100%"}' :step="0.01">
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="重量" prop="weight">
<!--              <el-input v-model="dataForm.weight" placeholder="请输入" :style='{"width":"70px"}'>
              </el-input>-->
              <el-input-number v-model="dataForm.weight" placeholder="重量" :style='{"width":"100%"}' :step="0.01">
              </el-input-number>
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
          <el-col :span="24">
            <el-form-item label-width="0">
              <div class="JNPF-common-title">
                <h2>工序明细</h2>
                <el-button type="primary"  icon="el-icon-plus"
                           @click="processShow">选择工序
                </el-button>
              </div>
              <el-table :data="dataForm.productTemplateProcessList" size="mini">
                <el-table-column  type="index" width="50" label="序号"  align="center"/>
                <el-table-column prop="materialCode" label="生产工序编码">
                  <template slot-scope="scope">
                    <el-input  v-model="scope.row.productionProcessCode" readonly :style="{ width: '100%' }">
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="materialName" label="生产工序名称">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.productionProcessName" readonly :style="{ width: '100%' }">
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="typeName" label="描述">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.remark" readonly :style="{ width: '100%' }">
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="materialSpec" label="排序">
                  <template slot-scope="scope">
                    <el-input-number v-model="scope.row.seq" placeholder="排序"
                                     :style='{"width":"100%"}'>
                    </el-input-number>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="50">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" class="JNPF-table-delBtn"
                               @click="delProcessList(scope.$index)">删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>

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
              @onChange="materialDialogChange"></material-dialog>
          </el-dialog>

          <el-dialog
            title="工序"
            :close-on-click-modal="false"
            append-to-body
            :visible.sync="processVisible"
            class="JNPF-dialog JNPF-dialog_center"
            lock-scroll
            width="1000px">
            <process-dialog
              ref="processDialog"
              @onChange="processDialogChange"></process-dialog>
          </el-dialog>

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
  import materialDialog from "./materialDialog";
  import processDialog from "./processDialog";

  export default {
    components: { materialDialog , processDialog},
    props: [],
    data() {
      return {
        visible: false,
        loading: false,
        isDetail: false,
        materialVisible: false,
        processVisible: false,
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
          productTemplateProcessList:[],
        },
        rules:
          {
            productTemplateName: [
              {
                required: true,
                message: '请选择',
                trigger: 'blur'
              },
            ],
            productTemplateCode: [
              {
                required: true,
                message: '请选择',
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
        productCategoryOptions: [{"fullName": "半成品", "id": "1"}, {
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
          }else {
            this.dataForm = this.$options.data().dataForm
          }
        })
      },
      selectMaterialList(){

      },
      materialShow(){
        this.materialVisible = true;
        this.$nextTick(() => {
          this.$refs.materialDialog.initData();
        });
      },
      // 物料/半成品/ 成品
      materialDialogChange(dataRow){
        this.dataForm.productTemplateCode = dataRow.materialCode
        this.dataForm.productTemplateName = dataRow.materialName
        this.dataForm.productCategory = dataRow.type
        this.dataForm.specification = dataRow.materialSpec
        this.dataForm.uomId = dataRow.materialUnit
        this.materialVisible = false;
      },
      processShow(){
        this.processVisible = true
        this.$nextTick(() => {
          this.$refs.processDialog.initData();
        });
      },
      processDialogChange(dataRow){
        this.dataForm.productTemplateProcessList = dataRow
        this.processVisible = false;
      },
      delProcessList(index) {
        this.dataForm.productTemplateProcessList.splice(index, 1);
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
