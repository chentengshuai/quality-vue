<template>
  <el-dialog title="转交用户"
             :close-on-click-modal="false" append-to-body
             :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
             width="600px">
    <el-row :gutter="15" class="">
      <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="right">
        <template v-if="!loading">
          <el-col :span="24">
            <el-form-item label="整改人" prop="userCode">
              <user-search v-model="dataForm.userCode" :name="dataForm.userName"
                           @name="value => { dataForm.userName = value }">
              </user-search>
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
import {getDictionaryDataSelector} from '@/api/systemData/dictionary'
import {mapGetters} from "vuex";

export default {
  components: {},
  props: [],
  data() {
    return {
      visible: false,
      loading: false,
      isDetail: false,
      dataForm: {
        userCode: '',
        userName: '',
        opinion: '',
        saleInfoId: '',
      },
      rules:
        {},

    }
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
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
      if(this.userInfo.userAccount == this.dataForm.userCode){
        this.$message({
          message: "转交人不能为当前登录人!",
          type: 'error',
          duration: 2000
        })
        return;
      }
      var _data = this.dataList()
      if (!this.dataForm.id) {
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
              this.visible = false
              this.$emit('refresh', true)
            }
          })
        })
      } else {
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
              this.visible = false
              this.$emit('refresh', true)
            }
          })
        })
      }
    },
    dataList() {
      var _data = JSON.parse(JSON.stringify(this.dataForm));
      _data.type = 2
      return _data;
    },
    dataInfo(dataAll) {
      let _dataAll = dataAll
      this.dataForm = _dataAll
    },
  },
}

</script>
