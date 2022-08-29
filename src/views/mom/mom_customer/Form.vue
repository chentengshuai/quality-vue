<template>
<el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'"
           :close-on-click-modal="false" append-to-body
           :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
           width="600px">
<el-row :gutter="15" class="">
<el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="right" >
    <template v-if="!loading">
            <el-col :span="8" >
                <el-form-item  label="客户ERP ID"   prop="customerId" >
                    <el-input    v-model="dataForm.customerId" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item  label="客户名称"   prop="customerName" >
                    <el-input    v-model="dataForm.customerName" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item  label="客户编码"   prop="customerNumber" >
                    <el-input    v-model="dataForm.customerNumber" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item  label="创建组织"   prop="createOrg" >
                    <el-input    v-model="dataForm.createOrg" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item  label="使用组织"   prop="useOrg" >
                    <el-input    v-model="dataForm.useOrg" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item  label="国家"   prop="countryName" >
                    <el-input    v-model="dataForm.countryName" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item  label="地区"   prop="provincialName" >
                    <el-input    v-model="dataForm.provincialName" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item  label="地址"   prop="address" >
                    <el-input    v-model="dataForm.address" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item  label="发票抬头"   prop="invoiceTitle" >
                    <el-input    v-model="dataForm.invoiceTitle" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item  label="纳税登记号"   prop="taxRegisterCode" >
                    <el-input    v-model="dataForm.taxRegisterCode" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item  label="客户类别"   prop="custType" >
                    <el-input    v-model="dataForm.custType" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item  label="客户分组"   prop="groupName" >
                    <el-input    v-model="dataForm.groupName" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item  label="结算币别"   prop="tradingCurr" >
                    <el-input    v-model="dataForm.tradingCurr" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item  label="收款条件"   prop="recCondition" >
                    <el-input    v-model="dataForm.recCondition" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

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
                            customerId : '',
                            customerName : '',
                            customerNumber : '',
                            createOrg : '',
                            useOrg : '',
                            countryName : '',
                            provincialName : '',
                            address : '',
                            invoiceTitle : '',
                            taxRegisterCode : '',
                            custType : '',
                            groupName : '',
                            tradingCurr : '',
                            recCondition : '',
            },
            rules:
            {
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
                            url: '/api/project/Mom_customer/'+this.dataForm.id,
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
                        url: '/api/project/Mom_customer',
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
                        url: '/api/project/Mom_customer/'+this.dataForm.id,
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
