<template>
  <el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'"
             :close-on-click-modal="false" append-to-body
             :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
             width="800px">
    <el-row :gutter="15" class="">
      <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="right">
        <template v-if="!loading">
          <el-col :span="12">
            <el-form-item label="位置名称" prop="locationName">
              <el-input v-model="dataForm.locationName" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="位置编码" prop="locationCode">
              <el-input v-model="dataForm.locationCode" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="位置类型" prop="locationType">
              <el-select v-model="dataForm.locationType" placeholder="请选择" clearable :style='{"width":"100%"}'
                         :multiple="false">
                <el-option v-for="(item, index) in locationTypeOptions" :key="index" :label="item.fullName"
                           :value="item.id" :disabled="item.disabled"></el-option>

              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上级位置" prop="locationParentId">
              <JNPF-TreeSelect :options="locationTree" v-model="dataForm.locationParentId" placeholder="选择上级位置"
                               :props="{value: 'id', label: 'locationName', children: 'children'}">
              </JNPF-TreeSelect>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="存放位置" prop="isStockLocation">
              <el-switch v-model="dataForm.isStockLocation" active-value="1" inactive-value="0">

              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="消耗位置" prop="isConsumeLocation">
              <el-switch v-model="dataForm.isConsumeLocation" active-value="1" inactive-value="0">

              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="报废位置" prop="isScrapLocation">
              <el-switch v-model="dataForm.isScrapLocation" active-value="1" inactive-value="0">

              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="排" prop="locationRow">
              <el-input v-model="dataForm.locationRow" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="列" prop="locationColumn">
              <el-input v-model="dataForm.locationColumn" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="层" prop="locationLayer">
              <el-input v-model="dataForm.locationLayer" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否启用" prop="statusMom">
              <el-switch v-model="dataForm.statusMom" active-value="1" inactive-value="0">

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
          locationName: '',
          locationCode: '',
          locationType: "",
          locationParentId: '',
          isStockLocation: 0,
          isConsumeLocation: 0,
          isScrapLocation: 0,
          locationRow: '',
          locationColumn: '',
          locationLayer: '',
          statusMom: 0,
          description: '',
        },
        rules:
          {},
        locationTree: [],
        locationTypeOptions: [],

      }
    },
    computed: {},
    watch: {},
    created() {
      this.getlocationTypeOptions();
      this.getLocationTree()
    },
    mounted() {
    },
    methods: {
      getlocationTypeOptions() {
        getDictionaryDataSelector('261038518426404101').then(res => {
          this.locationTypeOptions = res.data.list
        })
      },
      getLocationTree() {
        request({
          url: '/api/project/StockLocation/locationTree',
          method: "get"
        }).then((res) => {
          this.locationTree = res.data;
        });
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
              url: '/api/project/StockLocation/' + this.dataForm.id,
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
            url: '/api/project/StockLocation',
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
            url: '/api/project/StockLocation/' + this.dataForm.id,
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
