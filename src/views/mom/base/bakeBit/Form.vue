<template>
<el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'"
           :close-on-click-modal="false" append-to-body
           :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
           width="600px">
<el-row :gutter="15" class="">
<el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="right" >
    <template v-if="!loading">
            <el-col :span="24" >
                <el-form-item  label="区域"   prop="areaName" >
                    <el-select    v-model="dataForm.areaName" placeholder="请选择"  clearable  :style='{"width":"100%"}' :multiple="false" >
                            <el-option v-for="(item, index) in areaNameOptions" :key="index" :label="item.fullName" :value="item.fullName" :disabled="item.disabled" ></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="烘烤位编码"   prop="equipmentCode" >
                    <el-input    v-model="dataForm.equipmentCode" placeholder="请输入"  clearable  :style='{"width":"100%"}'>
                    </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="烘烤位名称"   prop="equipmentName" >
                    <el-input    v-model="dataForm.equipmentName" placeholder="请输入"  clearable  :style='{"width":"100%"}'>
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
    import { getDictionaryDataSelector,getDictionaryDataByTypeCode } from '@/api/systemData/dictionary'
    export default {
        components: {},
        props: [],
        data() {
            return {
                visible: false,
                loading: false,
                isDetail: false,
            dataForm: {
                            areaName : "",
                            equipmentCode : '',
                            equipmentName : '',
            },
            rules:
            {
                            areaName: [
                                {
                                    required: true,
                                    message: '请选择',
                                    trigger: 'change'
                                },
                        ],
                            equipmentCode: [
                                {
                                    required: true,
                                    message: '请输入',
                                    trigger: 'blur'
                                },
                        ],
                            equipmentName: [
                                {
                                    required: true,
                                    message: '请输入',
                                    trigger: 'blur'
                                },
                        ],
            },
                        areaNameOptions:[],

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
                            url: '/api/project/BdBakeBit/'+this.dataForm.id,
                            method: 'get'
                        }).then(res => {
                            this.dataInfo(res.data)
                            this.loading = false
                        })
                    }

                });
                getDictionaryDataByTypeCode("region")
                .then((res) => {
                    this.areaNameOptions = res.data;
                })
                .catch(() => {
                });
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
                        url: '/api/project/BdBakeBit',
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
                        url: '/api/project/BdBakeBit/'+this.dataForm.id,
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
