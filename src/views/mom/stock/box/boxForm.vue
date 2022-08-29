<template>
  <el-dialog :title="'箱号修改'"
             :close-on-click-modal="false" append-to-body
             :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
             width="1000px">
    <el-row :gutter="15" class="">
      <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="right">
        <template v-if="!loading">
          <el-col :span="8">
            <el-form-item label="箱号" prop="boxNum">
              <el-input v-model="dataForm.boxNum" :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="原箱号" prop="oldBoxNum">
              <el-input v-model="dataForm.oldBoxNum" readonly :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="装箱时间" prop="changeNumTime">
              <el-date-picker v-model="dataForm.changeNumTime" placeholder="请选择" clearable :style='{"width":"100%"}'
                              type="date" format="yyyy-MM-dd" value-format="timestamp">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </template>
      </el-form>
    </el-row>
    <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false"> 取 消</el-button>
        <el-button type="primary" @click="dataFormSubmit()" v-if="!isDetail"> 生 成</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import request from '@/utils/request'

  export default {
    components: {},
    props: [],
    data() {
      return {
        visible: false,
        loading: false,
        isDetail: false,
        dataForm: {
          boxNum: '',
          oldBoxNum: '',
          changeNumTime: '',
        },
        rules:
          {
            // changeNumTime: [
            //   {
            //     required: true,
            //     message: '请选择',
            //     trigger: 'click'
            //   },
            // ],
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
      init(id, isDetail) {
        this.dataForm.id = id || 0;
        this.visible = true;
        this.isDetail = isDetail || false;
        this.$nextTick(() => {
          this.$refs['elForm'].resetFields();
          if (this.dataForm.id) {
            this.loading = true
            request({
              url: '/api/project/BdBox/' + this.dataForm.id,
              method: 'get'
            }).then(res => {
              this.dataInfo(res.data);
              this.loading = false;

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
        request({
          url: '/api/project/BdBox/updateBoxNum/' + this.dataForm.id,
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
