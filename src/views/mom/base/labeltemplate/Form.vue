<template>
  <el-dialog :title="!dataForm.name ? '新建' :  isDetail ? '详情':'编辑'"
             :close-on-click-modal="false" append-to-body
             :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
             width="600px">
    <el-row :gutter="15" class="">
      <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="right">
        <template v-if="!loading">
          <el-col :span="24">
            <el-form-item label="标签名" prop="name">
              <el-input v-model="dataForm.name" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="标签模板" prop="template">
              <el-input v-model="dataForm.template" placeholder="请输入" :style='{"width":"100%"}' true type="textarea"
                        :autosize='{"minRows":11,"maxRows":11}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="标签描述" prop="nameDesc">
              <el-input v-model="dataForm.nameDesc" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="标签类型" prop="templateTypeCode">
              <el-select v-model="dataForm.templateTypeCode" placeholder="请选择" clearable :style='{"width":"100%"}'
                         :multiple="false" @change="selectItemNode()">
                <el-option v-for="(item, index) in printTemplateTypeOptions" :key="index" :label="item.fullName"
                           :value="item.enCode" :disabled="item.disabled"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否通用" prop="isCommon">
              <el-switch v-model="dataForm.isCommon" :active-value="'true'" :inactive-value="'false'"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="dataForm.remark" placeholder="请输入" :style='{"width":"100%"}' true type="textarea"
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
import {getDictionaryDataSelector, getDictionaryDataByTypeCode} from '@/api/systemData/dictionary'

export default {
  components: {},
  props: [],
  data() {
    return {
      visible: false,
      loading: false,
      isDetail: false,
      isEdit: false,
      dataForm: {
        name: '',
        template: '',
        templateType: '',
        templateTypeCode: '',
        nameDesc: '',
        remark: '',
        isCommon: '',
      },
      rules:
        {},
      printTemplateTypeOptions: [],

    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    init(name, isDetail) {
      this.dataForm.name = name;
      this.isEdit = !!name;
      this.visible = true;
      this.isDetail = isDetail || false;
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields();
        if (this.isEdit) {
          this.loading = true
          request({
            url: '/api/project/LabelTemplate/' + name,
            method: 'get'
          }).then(res => {
            this.dataInfo(res.data)
            this.loading = false
          })
        }

      });
      getDictionaryDataByTypeCode("printTemplateType").then(res => {
        this.printTemplateTypeOptions = res.data
      });
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
      if (!this.isEdit) {
        request({
          url: '/api/project/LabelTemplate',
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
          url: '/api/project/LabelTemplate/' + this.dataForm.name,
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
    selectItemNode() {
      const fullName = this.printTemplateTypeOptions.find(item => item.enCode === this.dataForm.templateTypeCode).fullName;
      this.dataForm.templateType = fullName;
    },
  },
}

</script>
