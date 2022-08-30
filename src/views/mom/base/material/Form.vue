<template>
<el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'"
           :close-on-click-modal="false" append-to-body
           :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
           width="1000px">
<el-row :gutter="15" class="">
<el-form ref="elForm" :model="dataForm" :rules="rules" size="medium" label-width="100px" label-position="right" >
    <template v-if="!loading">
            <el-col :span="12" >
                <el-form-item  label="产品名称"   prop="materialName" >
                    <el-input    v-model="dataForm.materialName" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" v-if="!dataForm.id">
                <el-form-item  label="产品编码"   prop="materialCode" >
                    <el-input    v-model="dataForm.materialCode" placeholder="请输入"  clearable  :style='{"width":"100%"}'>
                    </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" v-if="dataForm.id">
                <el-form-item  label="产品编码"   prop="materialCode" >
                    <el-input    v-model="dataForm.materialCode" placeholder="请输入"  clearable  :style='{"width":"100%"}' readonly >
                    </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="规格"   prop="materialSpec" >
                    <el-input    v-model="dataForm.materialSpec" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="型号"   prop="materialModel" >
                    <el-input    v-model="dataForm.materialModel" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="产品类型"   prop="materialType" >
                    <el-input    v-model="dataForm.materialType" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="单位"   prop="materialUnit" >
                    <el-input    v-model="dataForm.materialUnit" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="类型"   prop="type" >
                    <el-select
                        v-model="dataForm.type"
                        placeholder="请选择"
                        clearable
                        :style="{ width: '100%' }"
                        :multiple="false"
                    >
                        <el-option
                        v-for="(item, index) in typeOptions"
                        :key="index"
                        :label="item.fullname"
                        :value="item.value"
                        :disabled="item.disabled"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="是否启用"   prop="status" >
                    <el-switch    v-model="dataForm.status" active-value="1"  inactive-value="0" >

                </el-switch>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="描述"   prop="description" >
                    <el-input    v-model="dataForm.description" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

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
                                materialName : '',
                                materialCode : '',
                                materialSpec : '',
                                materialModel : '',
                                materialType : '',
                                materialUnit : '',
                                type : '',
                                status : 1,
                                description : '',
                },
                rules:
                {
                    materialName: [
                        {
                            required: true,
                            message: "请输入",
                            trigger: "click",
                        },
                    ],
                    materialCode: [
                        {
                            required: true,
                            message: "请输入",
                            trigger: "click",
                        },
                    ],
                    type: [
                        {
                            required: true,
                            message: "请选择",
                            trigger: "change",
                        },
                    ],
                },
                typeOptions: [{fullname:"原料",value:1},{fullname:"半成品",value:2}],
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
                            url: '/api/project/Material/'+this.dataForm.id,
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
                        url: '/api/project/Material',
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
                        url: '/api/project/Material/'+this.dataForm.id,
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
