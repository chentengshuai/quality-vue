<template>
<el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'"
           :close-on-click-modal="false" append-to-body
           :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
           width="600px">
<el-row :gutter="15" class="">
<el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="right" >
    <template v-if="!loading">
            <el-col :span="24" >
                <el-form-item  label="编码"   prop="produceUnitCode" >
                    <el-input    v-model="dataForm.produceUnitCode" placeholder="请输入" :disabled="!!dataForm.id"   :style='{"width":"100%"}'>
                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="名称"   prop="produceUnitName" >
                    <el-input    v-model="dataForm.produceUnitName" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="类型"   prop="produceUnitType" >
                    <el-select    v-model="dataForm.produceUnitType" placeholder="请选择"  @change="produceUnitTypeChange"   :style='{"width":"100%"}' :multiple="false" >
                        <el-option value="" label="请选择"></el-option>
                        <el-option v-for="(item, index) in produceUnitTypeOptions" :key="index" :label="item.fullName" :value="item.enCode" :disabled="item.disabled" ></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="父级单元"   prop="produceUnitParentId" >
                    <el-select    v-model="dataForm.produceUnitParentId" placeholder="请选择"    :style='{"width":"100%"}' :multiple="false" >
                        <el-option v-for="(item, index) in produceUnitParentIdOptions" :key="index" :label="item.produceUnitName" :value="item.id" :disabled="item.disabled" ></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="负责人"   prop="produceUnitDutyPersonId" >
                    <user-search v-model="dataForm.produceUnitDutyPersonId" :defaultLogin="false" :name="dataForm.produceUnitDutyPersonName"
                                 @name="value => { dataForm.produceUnitDutyPersonName = value }">
                    </user-search>
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
import { compareByGeneratedPositionsDeflated } from 'source-map/lib/util'
    export default {
        components: {},
        props: [],
        data() {
            return {
                visible: false,
                loading: false,
                isDetail: false,
                parentDisabled:false,
            dataForm: {
                            produceUnitCode : '',
                            produceUnitName : '',
                            produceUnitType : "",
                            produceUnitParentId : "",
                            produceUnitDutyPersonId : '',
                            produceUnitTypeName : '',
                            produceUnitDutyPersonName : '',
            },
            rules:
            {
                            produceUnitCode: [
                                {
                                    required: true,
                                    message: '请输入',
                                    trigger: 'blur'
                                },
                        ],
                            produceUnitName: [
                                {
                                    required: true,
                                    message: '请输入',
                                    trigger: 'blur'
                                },
                        ],
                            produceUnitType: [
                                {
                                    required: true,
                                    message: '请选择',
                                    trigger: 'change'
                                },
                        ],
                        //     produceUnitParentId: [
                        //         {
                        //             required: true,
                        //             message: '请选择',
                        //             trigger: 'change'
                        //         },
                        // ],
            },
                        produceUnitTypeOptions:[],
                        produceUnitParentIdOptions:[],

        }
        },
        computed: {},
        watch: {},
        created() {
            this.getproduceUnitTypeOptions();//获取类型下拉框数据
        },
        mounted() {},
        methods: {
            getproduceUnitTypeOptions() {
                getDictionaryDataSelector('334623609026774277').then(res => {
                    this.produceUnitTypeOptions = res.data.list
                });
            },
            init(id, isDetail) { //初始化数据
                this.dataForm.id = id || 0;
                this.visible = true;
                this.isDetail = isDetail || false;
                this.$nextTick(() => {
                    this.$refs['elForm'].resetFields();
                    if(this.dataForm.id){ //编辑 详情
                        this.loading = true
                        request({
                            url: '/api/project/BdFactoryUnit/'+this.dataForm.id,
                            method: 'get'
                        }).then(res => {
                            this.dataInfo(res.data);
                            this.getProduceUnitParentSelector();//查询类型的父级单元
                            this.loading = false
                        });
                    }else{ //新建界面
                       this.resetDataForm();//重置数据
                       this.getProduceUnitParentSelector();//查询类型的父级单元
                    }
                });
            },
            // 表单提交
            dataFormSubmit() {
                this.$refs['elForm'].validate((valid) => {
                    if (valid) {
                        if(this.dataForm.produceUnitType!="1"&&this.dataForm.produceUnitParentId==""){ //非公司类型的不能为空
                            this.$message({
                            message: "请选择父级单元",
                            type: 'warning',
                            duration: 1000,
                            });
                            return false;
                        }
                        this.request()
                    }
                })
            },
            request() {
                var _data =this.dataList()
                if (!this.dataForm.id) {
                    request({
                        url: '/api/project/BdFactoryUnit',
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
                        url: '/api/project/BdFactoryUnit/'+this.dataForm.id,
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
            },produceUnitTypeChange(val) {
                this.produceUnitParentIdOptions=[];//清空父节点下拉数据
                this.dataForm.produceUnitParentId="";///清空父节点id
                if (!val) return;
                let produceUnitTypeObject= this.produceUnitTypeOptions.find(item => item.enCode === val);
                this.dataForm.produceUnitTypeName=produceUnitTypeObject.fullName;
                if(val=="1"){//公司类型
                    //公司类型为顶级节点
                    //this.parentDisabled=true;//父级几点则不能选择
                }else{ //其他类型 获取父级节点
                  //  this.parentDisabled=false;//父级几点则不能选择
                    //查询类型对应的父级单元信息
                   this.getProduceUnitParentSelector();
                }
            },
            getProduceUnitParentSelector(){ //查询类型对应的父级单元信息
                let produceUnitType=this.dataForm.produceUnitType;
                request({
                    url: `/api/project/BdFactoryUnit/getParentBdFactoryUnitListByType?produceUnitType=`+produceUnitType,
                    method: 'get',
                }).then(res => {
                    this.produceUnitParentIdOptions = res.data
                });
                
            },
            resetDataForm() { //重置数据
                this.dataForm= {
                    produceUnitCode : '',
                    produceUnitName : '',
                    produceUnitType : "",
                    produceUnitParentId : "",
                    produceUnitDutyPersonId : '',
                    produceUnitTypeName : '',
                    produceUnitDutyPersonName : '',
                }
            }
        },
    }

</script>
