<template>
  <el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'"
             :close-on-click-modal="false" append-to-body
             :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
             width="600px">
    <el-row :gutter="15" class="">
      <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="right">
        <template v-if="!loading">
          <el-col :span="12">
            <el-form-item label="仓库名称" prop="warehouseName">
              <el-input v-model="dataForm.warehouseName" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="仓库编码" prop="warehouseCode">
              <el-input v-model="dataForm.warehouseCode" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
<!--          <el-col :span="12">-->
<!--            <el-form-item label="仓库类型" prop="warehouseType">-->
<!--              <el-input v-model="dataForm.warehouseType" placeholder="请输入" clearable :style='{"width":"100%"}'>-->

<!--              </el-input>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :span="12">
            <el-form-item label="仓库类型" prop="warehouseType">
              <el-select v-model="dataForm.warehouseType" placeholder="请选择"
                         clearable>
                <el-option v-for="(item, index) in warehouseTypeOptions" :key="index"
                           :label="item.fullName" :value="item.id"
                           :disabled="item.disabled"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="位置id" prop="locationId">
              <el-input v-model="dataForm.locationId" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="位置名称" prop="locationName">
              <el-input v-model="dataForm.locationName" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="ERP ID" prop="erpId">
              <el-input v-model="dataForm.erpId" placeholder="请输入" clearable :style='{"width":"100%"}'>

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
  import { previewDataInterface } from '@/api/systemData/dataInterface'
  import { getDictionaryDataSelector } from '@/api/systemData/dictionary'

  export default {
    components: {},
    props: [],
    data() {
      return {
        visible: false,
        loading: false,
        isDetail: false,
        dataForm: {
          warehouseName: '',
          warehouseCode: '',
          warehouseType: '',
          locationId: '',
          locationName: '',
          erpId: ''
        },
        rules: {},
        warehouseTypeOptions: [{ 'fullName': '普通仓库', 'id': '1' }, { 'fullName': '车间仓库', 'id': '2' },
          { 'fullName': '供应商仓库', 'id': '3' }, { 'fullName': '客户仓库', 'id': '4' }, { 'fullName': '第三方仓储', 'id': '5' }]

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
        this.dataForm.id = id || 0
        this.visible = true
        this.isDetail = isDetail || false
        this.$nextTick(() => {
          this.$refs['elForm'].resetFields()
          if (this.dataForm.id) {
            this.loading = true
            request({
              url: '/api/project/Warehouse/' + this.dataForm.id,
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
            url: '/api/project/Warehouse',
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
            url: '/api/project/Warehouse/' + this.dataForm.id,
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
        var _data = JSON.parse(JSON.stringify(this.dataForm))
        return _data
      },
      dataInfo(dataAll) {
        let _dataAll = dataAll
        this.dataForm = _dataAll
      }
    }
  }

</script>
