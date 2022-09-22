<template>
  <el-dialog title="取消整改"
             :close-on-click-modal="false" append-to-body
             :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
             width="600px">
    <el-row :gutter="15" class="">
      <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="120px" label-position="right">
        <template v-if="!loading">
          <el-col :span="24">
            <el-form-item label="取消原因" prop="opinion">
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
  </el-dialog>
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
    init(id) {
      this.visible = true;
      this.dataForm.saleInfoId = id;
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
    },
    dataList() {
      var _data = JSON.parse(JSON.stringify(this.dataForm));
      _data.type = 3
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
