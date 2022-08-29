<template>
<el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'"
           :close-on-click-modal="false" append-to-body
            width="70%"
           :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
           >
<el-row :gutter="15" class="">
<el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="110px" label-position="right" >
    <template v-if="!loading">
            <el-col :span="12" >
                <el-form-item  label="生产计划编号"   prop="productionPlanCode" >
                    <el-input    v-model="dataForm.productionPlanCode" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="生产计划类型"   prop="productionPlanType" >
                    <el-input    v-model="dataForm.productionPlanType" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="生产计划日期"   prop="productionPlanDate" >
                    <el-date-picker    v-model="dataForm.productionPlanDate" placeholder="请选择"  clearable  :style='{"width":"100%"}' type="date"  format="yyyy-MM-dd"  value-format="timestamp" >

                </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="生产基地"   prop="workshop" >
                    <el-input    v-model="dataForm.workshop" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="生产工序"   prop="productionProcess" >
                    <el-input    v-model="dataForm.productionProcess" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="合同号"   prop="contractNo" >
                    <el-input    v-model="dataForm.contractNo" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="销售订单明细ID"   prop="saleOrderLineId" >
                    <el-input    v-model="dataForm.saleOrderLineId" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="销售订单编号"   prop="saleOrderCode" >
                    <el-input    v-model="dataForm.saleOrderCode" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="销售订单名称"   prop="saleOrderName" >
                    <el-input    v-model="dataForm.saleOrderName" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="客户ID"   prop="customerId" >
                    <el-input    v-model="dataForm.customerId" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="客户名称"   prop="customerName" >
                    <el-input    v-model="dataForm.customerName" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="预计交货日期"   prop="deliveryDate" >
                    <el-date-picker    v-model="dataForm.deliveryDate" placeholder="请选择"  clearable  :style='{"width":"100%"}' type="date"  format="yyyy-MM-dd"  value-format="timestamp" >

                </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="计量单位"   prop="uomId" >
                    <el-input    v-model="dataForm.uomId" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="计量单位名称"   prop="uomName" >
                    <el-input    v-model="dataForm.uomName" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="产品等级"   prop="productLvl" >
                    <el-input  v-model="dataForm.productLvl" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="产品名称"   prop="productName" >
                    <el-input    v-model="dataForm.productName" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="物料编码"   prop="productCode" >
                    <el-input    v-model="dataForm.productCode" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="规格型号"   prop="productSpc" >
                    <el-input    v-model="dataForm.productSpc" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="销售订单数量"   prop="saleOrderQty" >
                    <el-input    v-model="dataForm.saleOrderQty" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="已完成量"   prop="finishedQty" >
                    <el-input    v-model="dataForm.finishedQty" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="利用库存数量"   prop="useStockQty" >
                    <el-input    v-model="dataForm.useStockQty" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="需要生产数量"   prop="planQty" >
                    <el-input    v-model="dataForm.planQty" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="客户要求"   prop="remark" >
                    <el-input    v-model="dataForm.remark" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="客户订单号"   prop="customerOrderCode" >
                    <el-input    v-model="dataForm.customerOrderCode" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="客户物料编码"   prop="customerProductCode" >
                    <el-input    v-model="dataForm.customerProductCode" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

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
                            productionPlanCode : '',
                            productionPlanType : '',
                            productionPlanDate : '',
                            workshop : '',
                            productionProcess : '',
                            contractNo : '',
                            saleOrderLineId : '',
                            saleOrderCode : '',
                            saleOrderName : '',
                            customerId : '',
                            customerName : '',
                            deliveryDate : '',
                            uomId : '',
                            uomName : '',
                            productLvl : '',
                            productName : '',
                            productCode : '',
                            productSpc : '',
                            saleOrderQty : '',
                            finishedQty : '',
                            useStockQty : '',
                            planQty : '',
                            remark : '',
                            customerOrderCode : '',
                            customerProductCode : '',
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
                            url: '/api/project/ProductionPlan/'+this.dataForm.id,
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
                        url: '/api/project/ProductionPlan',
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
                        url: '/api/project/ProductionPlan/'+this.dataForm.id,
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
