<template>
<div class="JNPF-common-layout">
    <div class="JNPF-preview-main">
        <div class="JNPF-common-page-header">
            <div class="options">
                <el-button type="primary" @click="dataFormSubmit()"> 保 存</el-button>
                <el-button @click="resetForm">重置</el-button>
            </div>
        </div>
    <el-row :gutter="15" class=" main" :style="{margin: '0 auto',width: '100%'}">
    <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="right">
<template v-if="!loading">
            <el-col :span="12">
                <el-form-item  label="物料产品ID"   prop="materialId" >
                    <el-input    v-model="dataForm.materialId" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item  label="工序属性ID"   prop="techDefineId" >
                    <el-input    v-model="dataForm.techDefineId" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item  label="备注"   prop="remark" >
                    <el-input    v-model="dataForm.remark" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item  label="状态"   prop="status" >
                    <el-input    v-model="dataForm.status" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
</template>
    </el-form>
</el-row>
    </div>
</div>
</template>
<script>
    import request from '@/utils/request'
    import {getDictionaryDataSelector} from '@/api/systemData/dictionary'
    import {previewDataInterface} from '@/api/systemData/dataInterface'

    export default {
        components: {},
        props: [],
        data() {
            return {
                loading:false,
            dataForm: {
                            materialId : '',
                            techDefineId : '',
                            remark : '',
                            status : '',
            },

            rules: {
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
                goBack() {
                    this.$emit('refresh')
                },
            init() {
            },
            // 表单提交
            dataFormSubmit() {
                this.$refs['elForm'].validate((valid) => {
                    if (valid) {
                        var _data =this.dataList()
                        request({
                            url: `/api/project/Bd_tech_define_material`,
                            method: 'post',
                            data: _data
                        }).then((res) => {
                            this.$message({
                                message: res.msg,
                                type: 'success',
                                duration: 1000,
                                onClose: () => {
                                    this.resetForm()
                                }
                            })
                        })
                    }
                })
            },
            resetForm(){
                this.$refs['elForm'].resetFields()
                this.init()
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




