<template>
<el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'"
           :close-on-click-modal="false" append-to-body
           :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
           width="1000px">
<el-row :gutter="15" class="">
<el-form ref="elForm" :model="dataForm" :rules="rules" size="medium" label-width="100px" label-position="right" >
    <template v-if="!loading">
            <el-col :span="8" >
                <el-form-item  label="规则编号"   prop="ruleCode" >
                    <el-input    v-model="dataForm.ruleCode" placeholder="自动生成"  readonly  :style='{"width":"100%"}'>
                    </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item  label="规则名称"   prop="ruleName" >
                    <el-input    v-model="dataForm.ruleName" placeholder="请输入"  clearable  :style='{"width":"100%"}'>
                    </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item  label="检验单类型"   prop="inspectionType" >
                    <el-select
                        v-model="dataForm.inspectionType"
                        placeholder="请选择"
                        clearable
                        :style="{ width: '100%' }"
                        :multiple="false"
                    >
                        <el-option
                        v-for="(item, index) in inspectionTypeOptions"
                        :key="index"
                        :label="item.fullName"
                        :value="item.id"
                        :disabled="item.disabled"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item  label="物料名称"   prop="materialName" >
                    <el-input    v-model="dataForm.materialName" placeholder="请选择"  :style='{"width":"100%"}'
                                    @click.native="chooseMaterial()">
                    </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item  label="检验基准"   prop="standardName" >
                    <el-select
                        v-model="dataForm.standardName"
                        placeholder="请选择"
                        :style="{ width: '100%' }"
                        :multiple="false"
                        @change="changeStandard"
                    >
                        <el-option
                        v-for="(item, index) in standardOptions"
                        :key="index"
                        :label="item.standardName"
                        :value="item.standardName"
                        :disabled="item.disabled"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item  label="检测频次"   prop="detectionFrequency" >
                    <el-select
                        v-model="dataForm.detectionFrequency"
                        placeholder="请选择"
                        :style="{ width: '100%' }"
                        :multiple="false"
                        @change="changeFrequency"
                    >
                        <el-option
                        v-for="(item, index) in frequencyOptions"
                        :key="index"
                        :label="item.fullName"
                        :value="item.id"
                        :disabled="item.disabled"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item  label="是否启用"   prop="enabledFlag" >
                    <el-switch    v-model="dataForm.enabledFlag" active-value="1"  inactive-value="0" >
                    </el-switch>
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item  label="开始时间"   prop="startTime" >
                    <el-date-picker    v-model="dataForm.startTime" placeholder="请选择"  clearable  :style='{"width":"100%"}' type="date"  format="yyyy-MM-dd"  value-format="timestamp" >

                </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item  label="结束时间"   prop="endTime" >
                    <el-date-picker    v-model="dataForm.endTime" placeholder="请选择"  clearable  :style='{"width":"100%"}' type="date"  format="yyyy-MM-dd"  value-format="timestamp" >

                </el-date-picker>
                </el-form-item>
            </el-col>
    <el-col :span="24"  >
    <el-form-item label-width="0">
            <div class="JNPF-common-title">
                <h2 v-if="dataForm.detectionFrequency === 1">频率明细(请填写检测的时间点，例如：12：00：00)</h2>
                <h2 v-else-if="dataForm.detectionFrequency === 2">频率明细(请填写检测的天数，例如：周一)</h2>
                <h2 v-else-if="dataForm.detectionFrequency === 3">频率明细(请填写检测的日期，例如：31)</h2>
                <h2 v-else-if="dataForm.detectionFrequency === 4">频率明细(请填写检测的月份，例如：12)</h2>
                <h2 v-else>频率明细</h2>
            </div>
    <el-table :data="dataForm.qualityinspectionrulelineList" size='mini'>
        <el-table-column type="index" width="50" label="序号" align="center" />
            <el-table-column prop="frequency" label="检测频率">
                <template slot-scope="scope" v-if="dataForm.detectionFrequency === 1" >
                    <el-time-picker   v-model="scope.row.frequency" placeholder="请选择"  clearable  :style='{"width":"100%"}' format="HH:mm:ss"  value-format="HH:mm:ss"  :picker-options='{"selectableRange":"00:00:00-23:59:59"}'>
                    </el-time-picker>
                </template>
                <template slot-scope="scope" v-if="dataForm.detectionFrequency != 1">
                    <el-input   v-model="scope.row.frequency" placeholder="请输入"  clearable  :style='{"width":"100%"}'>
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column prop="remark" label="说明">
                <template slot-scope="scope">
                    <el-input   v-model="scope.row.remark" placeholder="请输入"  clearable  :style='{"width":"100%"}'>
                    </el-input>
                </template>
            </el-table-column>
    <el-table-column label="操作" width="50" >
        <template slot-scope="scope">
            <el-button size="mini" type="text" class="JNPF-table-delBtn" @click="delqualityinspectionrulelineList(scope.$index)">删除</el-button>
        </template>
    </el-table-column>
    </el-table>
    <div class="table-actions" @click="addqualityinspectionrulelineList()">
        <el-button type="text" icon="el-icon-plus">添加</el-button>
    </div>
    </el-form-item>
    </el-col>
            <el-dialog title="物料列表"
                     :close-on-click-modal="false" append-to-body
                     :visible.sync="materialChooseShow" class="JNPF-dialog JNPF-dialog_center" lock-scroll
                     v-if="materialChooseShow" width="1000px">
                <material-choose ref="MaterialChoose" @onChange="dialogMaterialChange"></material-choose>
            </el-dialog>
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
    import { getStandardOptions } from '@/api/systemData/dataTeam'
    import MaterialChoose from './materialChoose'
    export default {
        components: {MaterialChoose},
        props: [],
        data() {
            return {
                visible: false,
                loading: false,
                isDetail: false,
                materialChooseShow: false,
            dataForm: {
                            ruleCode : '',
                            ruleName : '',
                            inspectionType : '',
                            materialCode : '',
                            materialName : '',
                            standardId : '',
                            standardName : '',
                            detectionFrequency : '',
                            enabledFlag : 1,
                            startTime : '',
                            endTime : '',
                        qualityinspectionrulelineList:[],
            },
            rules:
            {
                ruleName: [
                    {
                        required: true,
                        message: '请填写',
                        trigger: 'click'
                    },
                ], 
                inspectionType: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'click'
                    },
                ], 
                materialName: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'click'
                    },
                ], 
                standardName: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'click'
                    },
                ], 
                detectionFrequency: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'click'
                    },
                ], 
                startTime: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'click'
                    },
                ], 
                endTime: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'click'
                    },
                ], 
            },
            inspectionTypeOptions:[{"fullName":"来料检验","id":1},{"fullName":"成品检验","id":2},{"fullName":"半成品检验","id":3}
                ,{"fullName":"库存检验","id":4},{"fullName":"发货检验","id":5}],
            frequencyOptions:[{"fullName":"天","id":1},{"fullName":"周","id":2},{"fullName":"月","id":3}
                ,{"fullName":"年","id":4}],
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
                            url: '/api/project/QualityInspectionRule/'+this.dataForm.id,
                            method: 'get'
                        }).then(res => {
                            this.dataInfo(res.data)
                            this.loading = false
                        })
                    } else {
                        this.dataForm = this.$options.data().dataForm;
                        this.dataForm.ruleCode = "R"+new Date().getTime()
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
                        url: '/api/project/QualityInspectionRule',
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
                        url: '/api/project/QualityInspectionRule/'+this.dataForm.id,
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
                addqualityinspectionrulelineList(){
                    let item = {
                        frequency:undefined,
                        remark:undefined,
                }
                    this.dataForm.qualityinspectionrulelineList.push(item)
                },
                delqualityinspectionrulelineList(index) {
                    this.dataForm.qualityinspectionrulelineList.splice(index, 1);
                },
            dataList(){
                var _data = JSON.parse(JSON.stringify(this.dataForm));
                    for(let i=0;i<_data.qualityinspectionrulelineList.length;i++){
                        var _list = _data.qualityinspectionrulelineList[i];
                    }
                return _data;
            },
            dataInfo(dataAll){
                let _dataAll =dataAll
                    for(let i=0;i<_dataAll.qualityinspectionrulelineList.length;i++){
                        var _list = _dataAll.qualityinspectionrulelineList[i];
                    }
                this.dataForm = _dataAll
            },
            chooseMaterial() {
                this.materialChooseShow = true;
                this.$nextTick(() => {
                this.$refs.MaterialChoose.initData();
                })
            },
            dialogMaterialChange(material) {
                this.dataForm.materialName = material.materialName;
                this.dataForm.materialCode = material.materialCode;
                this.dataForm.materialId = material.id;
                //查询检验基准下拉框
                getStandardOptions(this.dataForm.materialCode).then((res) => {
                    this.standardOptions = res.data
                    if(res.data != null && res.data.length>0){
                        this.dataForm.standardId = res.data[0].id;
                        this.dataForm.standardName = res.data[0].standardName;
                    }
                })
                this.materialChooseShow = false;
            },
            changeStandard(){
                let obj = this.standardOptions.find(function (item) {
                    return item.standardName === this.dataForm.standardName;
                });
                this.dataForm.standardId = obj.id;
            },
            changeFrequency(){
                let listLength = this.dataForm.qualityinspectionrulelineList.length
                for (let i = 0; i < listLength; i++) {
                    this.delqualityinspectionrulelineList(0);
                }
            },
        },
    }

</script>
