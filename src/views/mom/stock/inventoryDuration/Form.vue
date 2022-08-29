<template>
<el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'"
           :close-on-click-modal="false" append-to-body
           :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
           width="600px">
<el-row :gutter="15" class="">
<el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="right" >
    <template v-if="!loading">
            <el-col :span="24" >
                <el-form-item  label="盘点期间"   prop="inventoryDuration" >
                    <el-date-picker    v-model="dataForm.inventoryDuration" placeholder="请选择"  clearable  :style='{"width":"100%"}' type="month"  format="yyyy-MM"  value-format="yyyy-MM" >
                    </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="开始时间"   prop="inventoryStartTime" >
                    <el-date-picker    v-model="dataForm.inventoryStartTime" placeholder="请选择"  clearable  :style='{"width":"100%"}' type="date"  format="yyyy-MM-dd"  value-format="timestamp" >

                </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="结束时间"   prop="inventoryEndTime" >
                    <el-date-picker    v-model="dataForm.inventoryEndTime" placeholder="请选择"  clearable  :style='{"width":"100%"}' type="date"  format="yyyy-MM-dd"  value-format="timestamp" >

                </el-date-picker>
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
                            inventoryDuration : '',
                            inventoryStartTime : '',
                            inventoryEndTime : '',
            },
            rules:
            {
                   inventoryDuration: [
                           {
                               required: true,
                               message: '请选择',
                               trigger: 'change'
                           },
                   ],
                   inventoryStartTime: [
                           {
                               required: true,
                               message: '请选择',
                               trigger: 'change'
                           },
                   ],
                   inventoryEndTime: [
                           {
                               required: true,
                               message: '请选择',
                               trigger: 'change'
                           },
                   ],
            },

        }
        },
        computed: {},
        watch: {},
        created() {
        },
        mounted() {},
        methods: {
            init(id, isDetail) {
                this.dataForm.id = id || 0;
                this.visible = true;
                this.isDetail = isDetail || false;
                this.$nextTick(() => {
                    this.$refs['elForm'].resetFields();
                    if(this.dataForm.id){
                        this.loading = true
                        request({
                            url: '/api/project/BdInventoryDuration/'+this.dataForm.id,
                            method: 'get'
                        }).then(res => {
                            this.dataInfo(res.data)
                            this.loading = false
                        })
                    }

                })
            },
            compareDates(){
                
                console.log(inventoryStartTime + "###" + inventoryEndTime);
            },
            // 表单提交
            dataFormSubmit() {
                this.$refs['elForm'].validate((valid) => {
                    if (valid) {
                        let inventoryStartTime = this.dataForm.inventoryStartTime;
                        let inventoryEndTime = this.dataForm.inventoryEndTime;
                        if(inventoryStartTime > inventoryEndTime){
                            this.$message({
                                    message: "结束时间不能早于开始时间！",
                                    type: 'warning',
                                    duration: 2000,
                                })
                        }else{
                            this.request();
                        }
                    }
                })
            },
            request() {
                var _data =this.dataList()
                if (!this.dataForm.id) {
                    request({
                        url: '/api/project/BdInventoryDuration',
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
                        url: '/api/project/BdInventoryDuration/'+this.dataForm.id,
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
                return _data;
            },
            dataInfo(dataAll){
                let _dataAll =dataAll
                this.dataForm = _dataAll
            },
        },
    }

</script>
