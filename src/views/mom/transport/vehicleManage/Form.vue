<template>
<el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'"
           :close-on-click-modal="false" append-to-body
           :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
           width="1200px">
<el-row :gutter="15" class="">
<el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="right" >
    <template v-if="!loading">
            <el-col :span="12" >
                <el-form-item  label="驾驶人"   prop="driverAccount" >
                    <user-search v-model="dataForm.driverAccount" :defaultLogin="false" :name="dataForm.driverName"
                                    @name="value => { dataForm.driverName = value }">
                    </user-search>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="车辆品牌"   prop="vehicelBrand" >
                    <el-input    v-model="dataForm.vehicelBrand" placeholder="请输入"  clearable  :style='{"width":"100%"}'>
                    </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="车牌号 "   prop="licenseNumber" >
                    <el-input    v-model="dataForm.licenseNumber" placeholder="请输入" @change="getvehicleProvinceName"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="车辆省份"   prop="vehicleProvinceName" >
                    <el-input    v-model="dataForm.vehicleProvinceName" placeholder="车牌自动带出"  :readonly="true"  :style='{"width":"100%"}'>
                    </el-input>
                </el-form-item>
            </el-col>

            <el-col :span="12" >
                <el-form-item  label="车辆载重"   prop="vehicleLoad" >
                    <el-input    v-model.number="dataForm.vehicleLoad" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="车辆图片"   prop="vehiclePicture" >
                    <JNPF-UploadImg    v-model="dataForm.vehiclePicture" :fileSize="10"  sizeUnit="MB"  :limit="1" >

                    </JNPF-UploadImg>
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
import { number } from 'echarts/lib/export'
    export default {
        components: {},
        props: [],
        data() {
            return {
                visible: false,
                loading: false,
                isDetail: false,
            dataForm: {
                            driverAccount : '',
                            driverName : '',
                            licenseNumber : '',
                            vehicleProvinceName : '',
                            vehicelBrand : '',
                            vehicleLoad : '',
                            vehicleStatus : "",
                            vehiclePicture : [],
                            creationTime : '',
            },
            rules:
            {
                            driverAccount: [
                                {
                                    required: true,
                                    message: '请输入',
                                    trigger: 'blur'
                                },
                        ],
                            licenseNumber: [
                                {
                                    required: true,
                                    message: '请输入',
                                    trigger: 'blur'
                                },
                        ],
                            vehicleProvinceName: [
                                {
                                    required: true,
                                    message: '车牌自动带出',
                                    trigger: 'blur'
                                },
                        ],
                            vehicelBrand: [
                                {
                                    required: true,
                                    message: '请输入',
                                    trigger: 'blur'
                                },
                        ],
                            vehicleLoad: [
                                {
                                    required: true,
                                    message: '请输入',
                                    trigger: 'blur'
                                },  {
                                    type: 'number',
                                    message: '车辆载重必须为数字',
                                    trigger: 'blur'
                                },
                        ],
                            vehiclePicture: [
                                {
                                    required: true,
                                    message: '请至少选择一个',
                                    trigger: 'click'
                                },
                        ],
            },
                        vehicleStatusOptions:[],

        }
        },
        computed: {},
        watch: {},
        created() {
                    this.getvehicleStatusOptions();
        },
        mounted() {},
        methods: {
                    getvehicleStatusOptions() {
                        getDictionaryDataSelector('339366034601411845').then(res => {
                            this.vehicleStatusOptions = res.data.list
                        })
                    },
            init(id, isDetail) {
                this.dataForm.id = id || 0;
                this.visible = true;
                this.isDetail = isDetail || false;
                this.$nextTick(() => {
                    this.$refs['elForm'].resetFields();
                    if(this.dataForm.id){
                        this.loading = true
                        request({
                            url: '/api/project/DmVehicleManage/'+this.dataForm.id,
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
                var _data =this.dataList()
                if (!this.dataForm.id) {
                    request({
                        url: '/api/project/DmVehicleManage',
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
                }else{
                    request({
                        url: '/api/project/DmVehicleManage/'+this.dataForm.id,
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
            dataList(){
                var _data = JSON.parse(JSON.stringify(this.dataForm));
                        _data.vehiclePicture = JSON.stringify(_data.vehiclePicture)
                return _data;
            },
            dataInfo(dataAll){
                let _dataAll =dataAll
                        _dataAll.vehiclePicture = JSON.parse( _dataAll.vehiclePicture)
                this.dataForm = _dataAll
            },getvehicleProvinceName(){ //根据车牌号获取车辆省份信息
                let licenseNumber=this.dataForm.licenseNumber;
                if(licenseNumber){
                   let firstLicense=licenseNumber.substr(0,1);
                   request({
                        url: '/api/system/DictionaryData/getDictionaryDataByCode/provinceLicense/'+firstLicense,
                        method: 'get',
                    }).then((res) => {
                        let dictionaryData=res.data;
                        if(dictionaryData!=null){
                            this.dataForm.vehicleProvinceName=dictionaryData.fullName;
                        }
                    });
                }
            }
        },
    }

</script>
