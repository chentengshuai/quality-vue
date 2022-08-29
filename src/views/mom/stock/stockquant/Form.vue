<template>
<el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'"
           :close-on-click-modal="false" append-to-body
           :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
           width="600px">
<el-row :gutter="15" class="">
<el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="right" >
    <template v-if="!loading">
            <el-col :span="24" >
                <el-form-item  label="合同号"   prop="contractNo" >
                    <el-input    v-model="dataForm.contractNo" placeholder="请输入"  clearable  :style='{"width":"100%"}'>
                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="批号/箱号"   prop="lotNumber" >
                    <el-input    v-model="dataForm.lotNumber" placeholder="请输入"  clearable  :style='{"width":"100%"}'>
                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24" v-if="false">
                <el-form-item  label="仓库ID"   prop="warehouseId" >
                    <el-input    v-model="dataForm.warehouseId" placeholder="请输入"  clearable  :style='{"width":"100%"}'>
                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="仓库名称"   prop="warehouseName" >
                    <el-input    v-model="dataForm.warehouseName" placeholder="请输入"  clearable  :style='{"width":"100%"}'>
                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24" v-if="false" >
                <el-form-item  label="位置ID"   prop="locationId" >
                    <el-input    v-model="dataForm.locationId" placeholder="请输入"  clearable  :style='{"width":"100%"}'>
                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="位置名称"   prop="locationName" >
                    <el-input    v-model="dataForm.locationName" placeholder="请输入"  clearable  :style='{"width":"100%"}'>
                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24" v-if="false">
                <el-form-item  label="产品ID"   prop="productId" >
                    <el-input    v-model="dataForm.productId" placeholder="请输入"  clearable  :style='{"width":"100%"}'>
                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="产品名称"   prop="productName" >
                    <el-input    v-model="dataForm.productName" placeholder="请输入"  clearable  :style='{"width":"100%"}'>
                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="物料编码"   prop="productCode" >
                    <el-input    v-model="dataForm.productCode" placeholder="请输入"  clearable  :style='{"width":"100%"}'>
                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="规格型号"   prop="productSpc" >
                    <el-input    v-model="dataForm.productSpc" placeholder="请输入"  clearable  :style='{"width":"100%"}'>
                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24" v-if="false">
                <el-form-item  label="计量单位ID"   prop="uomId" >
                    <el-input    v-model="dataForm.uomId" placeholder="请输入"  clearable  :style='{"width":"100%"}'>
                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="计量单位名称"   prop="uomName" >
                    <el-input    v-model="dataForm.uomName" placeholder="请输入"  clearable  :style='{"width":"100%"}'>
                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24" v-if="false">
                <el-form-item  label="客户ID"   prop="customerId" >
                    <el-input    v-model="dataForm.customerId" placeholder="请输入"  clearable  :style='{"width":"100%"}'>
                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="客户名称"   prop="customerName" >
                    <el-input    v-model="dataForm.customerName" placeholder="请输入"  clearable  :style='{"width":"100%"}'>
                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="数量"   prop="qty" >
                    <el-input    v-model="dataForm.qty" placeholder="请输入"  clearable  :style='{"width":"100%"}'>
                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="毛重"   prop="grossQty" >
                    <el-input    v-model="dataForm.grossQty" placeholder="请输入"  clearable  :style='{"width":"100%"}'>
                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="锁定数量"   prop="lockedQty" >
                    <el-input    v-model="dataForm.lockedQty" placeholder="请输入"  clearable  :style='{"width":"100%"}'>
                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="可用数量"   prop="availableQty" >
                    <el-input    v-model="dataForm.availableQty" placeholder="请输入"  clearable  :style='{"width":"100%"}'>
                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="入库时间"   prop="warehousingTime" >
                    <el-date-picker    v-model="dataForm.warehousingTime" placeholder="请选择"  clearable  :style='{"width":"100%"}' type="datetime"  format="yyyy-MM-dd HH:mm:ss"  value-format="timestamp" >
                </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="过期日期"   prop="expirationDate" >
                    <el-date-picker    v-model="dataForm.expirationDate" placeholder="请选择"  clearable  :style='{"width":"100%"}' type="date"  format="yyyy-MM-dd"  value-format="timestamp" >
                </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                  <el-form-item label="状态">
                          <el-select v-model="dataForm.status" placeholder="请选择" clearable>
                              <el-option label="已入库" value="1"></el-option>
                              <el-option label="已出库" value="2"></el-option>
                              <el-option label="已撤回" value="0"></el-option>
                          </el-select>
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
                            contractNo : '',
                            lotNumber : '',
                            warehouseId : '',
                            warehouseName : '',
                            locationId : '',
                            locationName : '',
                            productId : '',
                            productName : '',
                            productCode : '',
                            productSpc : '',
                            uomId : '',
                            uomName : '',
                            customerId : '',
                            customerName : '',
                            qty : '',
                            grossQty : '',
                            lockedQty : '',
                            availableQty : '',
                            warehousingTime : '',
                            expirationDate : '',
                            status : '',
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
                            url: '/api/project/StockQuant/'+this.dataForm.id,
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
                        url: '/api/project/StockQuant',
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
                        url: '/api/project/StockQuant/'+this.dataForm.id,
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
