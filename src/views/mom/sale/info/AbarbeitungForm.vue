<template>
  <el-row :gutter="15" class="">
    <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="120px" label-position="right">
      <template v-if="!loading">
        <el-col :span="24">
          <el-form-item label="整改人" prop="userCode">
            <user-search v-model="dataForm.userCode" :name="dataForm.userName"
                         @name="value => { dataForm.userName = value }">
            </user-search>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="整改意见" prop="opinion">
            <el-input v-model="dataForm.opinion" placeholder="请输入" :style='{"width":"100%"}' true type="textarea"
                      :autosize='{"minRows":4,"maxRows":4}'>

            </el-input>
          </el-form-item>
        </el-col>
      </template>
    </el-form>
    <div class="JNPF-common-layout-main JNPF-flex-main" style="float: right;">
         <span slot="footer" class="dialog-footer" style="text-align: right">
            <el-button type="primary" @click="dataFormSubmit">
              {{ $t('common.confirmButton') }}</el-button>
        </span>
    </div>
  </el-row>
</template>
<script>
import request from '@/utils/request'
import {previewDataInterface} from '@/api/systemData/dataInterface'
import {getDictionaryDataByTypeCode, getDictionaryDataSelector} from '@/api/systemData/dictionary'

export default {
  components: {},
  props: [],
  data() {
    return {
      visible: false,
      loading: false,
      isDetail: false,
      type: '',
      dataForm: {
        userCode: '',
        userName: '',
        opinion: '',
        saleInfoId: '',
      },
      rules:
        {
          userCode: [
            {
              required: true,
              message: '请输入',
              trigger: 'blur'
            },
          ],
          opinion: [
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
  },
  mounted() {
  },
  methods: {
    init(id, type) {
      this.visible = true;
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields();
        if (this.dataForm.saleInfoId) {
          this.loading = true
          request({
            url: '/api/project/Sale_marketing_abarbeitung/getDataByInfoId/' + id,
            method: 'get'
          }).then(res => {
            this.dataInfo(res.data)
            this.dataForm.saleInfoId = id;
            this.loading = false
          })
        }
      })
      this.dataForm.saleInfoId = id;
      this.type = type
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
      // if (!this.dataForm.id) {
        request({
          url: '/api/project/Sale_marketing_abarbeitung',
          method: 'post',
          data: _data
        }).then((res) => {
          this.$message({
            message: res.msg,
            type: 'success',
            duration: 1000,
            onClose: () => {
              this.closeDialog();
              this.$emit('refresh', true)
            }
          })
        })
/*      } else {
        request({
          url: '/api/project/Sale_marketing_abarbeitung/updateDataByInfoId/' + this.dataForm.saleInfoId,
          method: 'PUT',
          data: _data
        }).then((res) => {
          this.$message({
            message: res.msg,
            type: 'success',
            duration: 1000,
            onClose: () => {
              this.closeDialog();
              this.$emit('refresh', true)
            }
          })
        })
      }*/
    },
    dataList() {
      var _data = JSON.parse(JSON.stringify(this.dataForm));
      if (this.type == "anew") {
        _data.type = 4
      } else {
        _data.type = 1
      }
      return _data;
    },
    dataInfo(dataAll) {
      let _dataAll = dataAll
      this.dataForm = _dataAll
    },
    closeDialog() {
      this.$emit("onChange", this.dataForm);
    },
  }
}

</script>
