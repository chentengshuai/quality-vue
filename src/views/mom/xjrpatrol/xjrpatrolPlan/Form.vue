<template>
<el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'"
           :close-on-click-modal="false" append-to-body
           :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
           width="1200px">
<el-row :gutter="15" class="">
<el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="right" >
    <template v-if="!loading">
            <el-col :span="12" >
                <el-form-item  label="检验计划编码"   prop="patrolPlanCode" >
                    <el-input    v-model="dataForm.patrolPlanCode" :disabled="true"  :style='{"width":"100%"}'>
                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="检验规则编码"   prop="patrolRulesCode" >
                    <el-input    v-model="dataForm.patrolRulesCode" :disabled="true"  :style='{"width":"100%"}'>
                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="检验规则名称"   prop="patrolRulesName" >
                    <el-input    v-model="dataForm.patrolRulesName"  :disabled="true" :style='{"width":"100%"}'>
                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="检验单位"   prop="patrolUnit" >
                    <el-select    v-model="dataForm.patrolUnit" :style='{"width":"100%"}' :disabled="true" :multiple="false" >
                        <el-option v-for="(item, index) in patrolUnitOptions" :key="index" :label="item.fullName" :value="item.enCode" :disabled="item.disabled" ></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="计划开始时间"   prop="patrolPlanStarttime" >
                    <el-input    v-model="dataForm.patrolPlanStarttime" :disabled="true"  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="计划结束时间"   prop="patrolPlanEndtime" >
                    <el-input    v-model="dataForm.patrolPlanEndtime" :disabled="true"  :style='{"width":"100%"}'>
                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="处理人名称"   prop="patrolPlanHandleusername" >
                    <el-input    v-model="dataForm.patrolPlanHandleusername" :disabled="true"  :style='{"width":"100%"}'>

                </el-input>
                 </el-form-item>
            </el-col>
      
            <el-col :span="12" >
                <el-form-item  label="检验计划状态"   prop="patrolPlanStatus" >
                    <el-select    v-model="dataForm.patrolPlanStatus" :disabled="true"  :style='{"width":"100%"}' :multiple="false" >
                        <el-option v-for="(item, index) in patrolPlanStatusOptions" :key="index" :label="item.fullName" :value="item.enCode" :disabled="item.disabled" ></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="检验记录时间"   prop="patrolRecordTime" >
                    <el-input    v-model="dataForm.patrolRecordTime" :disabled="true"  :style='{"width":"100%"}'>
                </el-input>
                </el-form-item>
            </el-col>
    <el-col :span="24"  >
    <el-form-item label-width="0">
            <div class="JNPF-common-title">
                <h2>检验计划内容</h2>
            </div>
    <el-table :data="dataForm.xjrpatrolplancontentList" size='mini'>
        <el-table-column type="index" width="50" label="序号" align="center" />
    
        <el-table-column prop="bdEquipmentName" label="设备名称">
                <template slot-scope="scope">
                    <el-input   v-model="scope.row.bdEquipmentName" :disabled="true"   :style='{"width":"100%"}'>
                </el-input>
            </template>
        </el-table-column>
            <el-table-column prop="productLinesName" label="所属产线">
                <template slot-scope="scope">
                    <el-input   v-model="scope.row.productLinesName" :disabled="true"   :style='{"width":"100%"}'>
                </el-input>
            </template>
        </el-table-column>
            <el-table-column prop="equipmentCategoryName" label="所属类别">
                <template slot-scope="scope">
                    <el-input   v-model="scope.row.equipmentCategoryName" :disabled="true"   :style='{"width":"100%"}'>
                </el-input>
            </template>
        </el-table-column>
            <el-table-column prop="materialStandardName" label="检验基准名称">
                <template slot-scope="scope">
                    <el-input   v-model="scope.row.materialStandardName" :disabled="true"   :style='{"width":"100%"}'>
                </el-input>
            </template>
        </el-table-column>
        <el-table-column prop="patrolEquipmentResult" label="检验结果">
                <template slot-scope="scope">
                    <el-select   v-model="scope.row.patrolEquipmentResult" placeholder=""    :style='{"width":"100%"}' :multiple="false" :disabled="true">
                            <el-option v-for="(item, index) in patrolResultOptions" :key="index" :label="item.fullName" :value="item.enCode"  :disabled="item.disabled"></el-option>
                    </el-select>
                </template>
        </el-table-column>
        <el-table-column  width="100" label="设备检测内容">
            <template slot-scope="scope">
                <el-button size="mini" type="text"  @click="viewPatrolplanDeviceContentList(scope.row)">查看</el-button>
            </template>
        </el-table-column>
    <!-- <el-table-column label="操作" width="50" >
        <template slot-scope="scope">
            <el-button size="mini" type="text" class="JNPF-table-delBtn" @click="delxjrpatrolplancontentList(scope.$index)">删除</el-button>
        </template>
    </el-table-column> -->
    </el-table>
    <div class="table-actions" :style="{display:!dataForm.id ? '' :  isDetail ? 'none':''}"  @click="addxjrpatrolplancontentList()">
        <el-button type="text" icon="el-icon-plus">添加</el-button>
    </div>
    </el-form-item>
    </el-col>
    </template>
</el-form>
</el-row>
    <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false"> 取 消</el-button>
        <el-button type="primary" @click="dataFormSubmit()" v-if="!isDetail"> 确 定</el-button>
    </span>

    <el-dialog title="查看设备检测内容"
                     :close-on-click-modal="false" append-to-body
                     :visible.sync="patrolplanDeviceContentViewShow" class="JNPF-dialog JNPF-dialog_center" lock-scroll
                     width="1000px">
            <patrolplan-device-content-view-list ref="PatrolplanDeviceContentViewList"></patrolplan-device-content-view-list>
    </el-dialog> 

    </el-dialog>
</template>
<script>
    import request from '@/utils/request'
    import { previewDataInterface } from '@/api/systemData/dataInterface'
    import { getDictionaryDataSelector } from '@/api/systemData/dictionary'
    import PatrolplanDeviceContentViewList from './patrolplanDeviceContentViewList'
    export default {
        components: {PatrolplanDeviceContentViewList},
        props: [],
        data() {
            return {
                visible: false,
                loading: false,
                isDetail: false,
                patrolplanDeviceContentViewShow:false,
            dataForm: {
                patrolPlanCode : '',
                patrolRulesCode : '',
                patrolRulesName : '',
                patrolUnit : "",
                patrolPlanStarttime : '',
                patrolPlanEndtime : '',
                patrolPlanHandleusername : '',
                patrolPlanHandleuser : '',
                patrolPlanStatus : "",
                patrolRecordTime : '',
                xjrpatrolplancontentList:[],
            },
            rules:
            {
            },
            patrolUnitOptions:[],
            patrolPlanStatusOptions:[],
            patrolResultOptions:[],

        }
        },
        computed: {},
        watch: {},
        created() {
                    this.getpatrolUnitOptions();
                    this.getpatrolPlanStatusOptions();
                    this.getpatrolResultOptions();
        },
        mounted() {},
        methods: {
                    getpatrolUnitOptions() {
                        getDictionaryDataSelector('336761078794945797').then(res => {
                            this.patrolUnitOptions = res.data.list
                        })
                    },
                    getpatrolPlanStatusOptions() {
                        getDictionaryDataSelector('336761711560230149').then(res => {
                            this.patrolPlanStatusOptions = res.data.list
                        })
                    }, getpatrolResultOptions() {
                        getDictionaryDataSelector('341902226291164421').then(res => {
                            this.patrolResultOptions = res.data.list
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
                            url: '/api/project/XjrPatrolplanBase/'+this.dataForm.id,
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
                        url: '/api/project/XjrPatrolplanBase',
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
                        url: '/api/project/XjrPatrolplanBase/'+this.dataForm.id,
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
                addxjrpatrolplancontentList(){
                    let item = {
                        bdEquipmentId:undefined,
                        bdEquipmentName:undefined,
                        productLinesId:undefined,
                        equipmentCategoryId:undefined,
                        materialStandardId:undefined,
                }
                    this.dataForm.xjrpatrolplancontentList.push(item)
                },
                delxjrpatrolplancontentList(index) {
                    this.dataForm.xjrpatrolplancontentList.splice(index, 1);
                },
            dataList(){
                var _data = JSON.parse(JSON.stringify(this.dataForm));
                    for(let i=0;i<_data.xjrpatrolplancontentList.length;i++){
                        var _list = _data.xjrpatrolplancontentList[i];
                    }
                return _data;
            },
            dataInfo(dataAll){
                let _dataAll =dataAll
                    for(let i=0;i<_dataAll.xjrpatrolplancontentList.length;i++){
                        var _list = _dataAll.xjrpatrolplancontentList[i];
                    }
                this.dataForm = _dataAll
            },viewPatrolplanDeviceContentList(row) {  //查看检验内容
                let contentId=row.id;
                if(contentId){
                    this.patrolplanDeviceContentViewShow = true;
                    this.$nextTick(() => {
                        this.$refs.PatrolplanDeviceContentViewList.initData(contentId);
                    });
                }

            }
        },
    }

</script>
