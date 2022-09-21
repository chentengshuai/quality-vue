<template>
  <el-dialog title="整改"
             :close-on-click-modal="false" append-to-body
             :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
             width="600px">
    <el-row :gutter="15" class="">
      <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="120px" label-position="right">
        <template v-if="!loading">
          <el-col :span="24">
            <el-form-item label="整改完成时间" prop="abarbeitungTime">
              <el-date-picker v-model="dataForm.abarbeitungTime" placeholder="请选择" clearable :style='{"width":"100%"}'
                              type="date" format="yyyy-MM-dd" value-format="timestamp">

              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="整改方案说明" prop="abarbeitungExplain">
              <el-input v-model="dataForm.abarbeitungExplain" placeholder="请输入" :style='{"width":"100%"}' true
                        type="textarea" :autosize='{"minRows":6,"maxRows":12}'>

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
        saleAbarbeitungId: '',
        saleInfoId: '',
        abarbeitungTime: '',
        abarbeitungExplain: '',
        status: '',
      },
      rules: {
        abarbeitungTime: [
          {
            required: true,
            message: "请选择",
            trigger: "blur",
          },
        ],
        abarbeitungExplain: [
          {
            required: true,
            message: "请填写",
            trigger: "blur",
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
    init(saleAbarbeitungId, saleInfoId) {
      this.dataForm.saleAbarbeitungId = saleAbarbeitungId
      this.dataForm.saleInfoId = saleInfoId
      this.visible = true;
      this.isDetail = isDetail || false;
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields();
        this.loading = true
        let _data = {}
        _data.saleAbarbeitungId = saleAbarbeitungId
        _data.saleInfoId = saleInfoId
        request({
          url: '/api/project/Sale_marketing_abarbeitung_detail/getDataList',
          method: 'get',
          data: _data
        }).then(res => {
          if(res.data){
            this.dataInfo(res.data)
          }
          this.loading = false
        })
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['elForm'].validate((valid) => {
        if (valid) {
          this.request()
          this.$emit("onChange");
        }
      })
    },
    request() {
      var _data = this.dataList()
      if (!this.dataForm.id) {
        request({
          url: '/api/project/Sale_marketing_abarbeitung_detail',
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
          url: '/api/project/Sale_marketing_abarbeitung_detail/' + this.dataForm.id,
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
