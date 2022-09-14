<template>
<el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'"
           :close-on-click-modal="false" append-to-body
           :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
           width="80%">
<el-row :gutter="15" class="">


<el-form ref="elForm" :model="dataForm" :rules="rules" size="medium" label-width="100px" label-position="right" >
    <template v-if="!loading">
            <el-col :span="8" >
                <el-form-item  label="处理意见"   prop="handleComments" >
                    <el-select
                        v-model="dataForm.handleComments"
                        placeholder="请选择"
                        :style="{ width: '100%' }"
                        :multiple="false"
                        @change="handleChange"
                    >
                        <el-option
                        v-for="(item, index) in handleOptions"
                        :key="index"
                        :label="item.fullName"
                        :value="item.enCode"
                        :disabled="item.disabled"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item  label="检测单ID"   prop="inspectionId" >
                    <el-input v-model="dataForm.inspectionId">
                    </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item  label="处理人"   prop="handlerId" >
                    <user-search v-model="dataForm.handlerId" :name="dataForm.handlerName"
                                 @name="value => { dataForm.handlerName = value }">
                    </user-search>
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item  label="处理时间"   prop="handleTime" >
                    <el-date-picker    v-model="dataForm.handleTime" placeholder="请选择"  clearable  :style='{"width":"100%"}' type="date"  format="yyyy-MM-dd"  value-format="timestamp" >
                    </el-date-picker>
                </el-form-item>
            </el-col>
            
            <el-col :span="24" >
                <el-form-item  label="备注"   prop="remark" >
                    <el-input    v-model="dataForm.remark" placeholder="请输入"  clearable  :style='{"width":"100%"}'>
                    </el-input>
                </el-form-item>
            </el-col>
    <el-col :span="24"  >
    <el-form-item label-width="0">
            <div class="JNPF-common-title">
                <h2>检验单详情</h2>
            </div>

            <el-col :span="8" >
                <el-form-item  label="物料名称">
                    {{ inspectionInfo.materialName }}
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item  label="检验信息1">
                    {{ inspectionInfo.relationName }}
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item  label="检验信息2">
                    {{ inspectionInfo.warehouseName }}
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item  label="检验基准">
                    {{ inspectionInfo.standardName }}
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item  label="货品数量">
                    {{ inspectionInfo.materialNumber }}
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item  label="抽样数">
                    {{ inspectionInfo.sampleNumber }}
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item  label="不良数">
                    {{ inspectionInfo.badNumber }}
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item  label="不良率">
                    {{ inspectionInfo.badPercent }}
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item  label="检验结果">
                    {{ inspectionInfo.result | dynamicText(resultOptions) }}
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item  label="送检人">
                    {{ inspectionInfo.submitterName }}（{{ inspectionInfo.submitterId }}）
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item  label="检验员">
                    {{ inspectionInfo.inspectorName }}（{{ inspectionInfo.inspectorId }}）
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item  label="检验时间"   prop="inspectTime">
                    <el-date-picker    v-model="inspectionInfo.inspectTime" placeholder="请选择"  clearable  :style='{"width":"100%"}' type="date"  format="yyyy-MM-dd"  value-format="timestamp" readonly>
                    </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="备注">
                    {{ inspectionInfo.remark }}
                </el-form-item>
            </el-col>

    <el-table :data="inspectionInfo.bizqualityinspectiondetailList" size='mini'>
        <el-table-column type="index" width="50" label="序号" align="center" />
            <el-table-column prop="inspectionItems" label="检测项">
                <template slot-scope="scope">
                    {{scope.row.inspectionItems}}
                </template>
            </el-table-column>
            <el-table-column prop="standardValue" label="标准值">
                <template slot-scope="scope">
                    {{scope.row.standardValue}}
                </template>
            </el-table-column>
            <el-table-column prop="unit" label="单位">
                <template slot-scope="scope">
                    {{scope.row.unit}}
                </template>
            </el-table-column>
            <el-table-column prop="inspectionMethod" label="检查方法">
                <template slot-scope="scope">
                    {{scope.row.inspectionMethod}}
                </template>
            </el-table-column>
            <el-table-column prop="inspectionFrequency" label="检查频率">
                <template slot-scope="scope">
                    {{scope.row.inspectionFrequency}}
                </template>
            </el-table-column>
            <el-table-column prop="detectionValue" label="检测值">
                <template slot-scope="scope">
                    {{scope.row.detectionValue}}
                </template>
            </el-table-column>
            <el-table-column prop="sampleNumber" label="抽样数">
                <template slot-scope="scope">
                    {{scope.row.sampleNumber}}
                </template>
            </el-table-column>
            <el-table-column prop="badNumber" label="不良数">
                <template slot-scope="scope">
                    {{scope.row.badNumber}}
                </template>
            </el-table-column>
            <el-table-column prop="badPercent" label="不良率">
                <template slot-scope="scope">
                    {{scope.row.badPercent}}
                </template>
            </el-table-column>
            <el-table-column prop="detailResult" label="检验结果" >
                <template slot-scope="scope">
                    {{ scope.row.detailResult | dynamicText(resultOptions) }}
                </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注">
                <template slot-scope="scope">
                    {{scope.row.remark}}
                </template>
            </el-table-column>
    </el-table>
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
    import { getDictionaryDataByTypeCode } from '@/api/systemData/dictionary'

    export default {
        components: {},
        props: [],
        data() {
            return {
                visible: false,
                loading: false,
                isDetail: false,
                materialChooseShow: false,
                templateChooseShow: false,
            dataForm: {
                            id : '',
                            inspectionId : '',
                            handleComments : '',
                            handleCommentsName : '',
                            remark : '',
                            status : '',
                            handlerId : '',
                            handlerName : '',
                            handleTime : '',
            },
            inspectionInfo: {
                            materialId : '',
                            materialCode : '',
                            materialName : '',
                            materialNumber : 0,
                            sampleNumber : 0,
                            badNumber : 0,
                            badPercent : 0,
                            result : '',
                            submitterId : '',
                            submitterName : '',
                            inspectorId : '',
                            inspectorName : '',
                            inspectTime : '',
                            inspectionType : '',
                            relationId : '',
                            relationCode : '',
                            relationName : '',
                            warehouseId : '',
                            warehouseCode : '',
                            warehouseName : '',
                            standardId : '',
                            standardName : '',
                            remark : '',
                        bizqualityinspectiondetailList:[],
            },
            rules:
            {
                handleComments: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'click'
                    },
                ],
                remark: [
                    {
                        required: true,
                        message: '请填写',
                        trigger: 'click'
                    },
                ],
                handlerId: [
                    {
                        required: true,
                        message: '请填写',
                        trigger: 'click'
                    },
                ],
                handleTime: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'click'
                    },
                ],
            },
            handleOptions: [],
            typeOptions: [{fullname:"合格",value:1},{fullname:"不合格",value:2}],
            resultOptions:[{"fullName":"合格","id":1},{"fullName":"不合格","id":2}],
            resultProps:{"label":"fullName","value":"id"},
        }
        },
        computed: {},
        watch: {},
        created() {
        },
        mounted() {},
        methods: {
            init(id, inspectionId, isDetail) {
                this.dataForm.id = id || 0;
                this.dataForm.inspectionId = inspectionId || 0;
                this.visible = true;
                this.isDetail = isDetail || false;
                this.inspectionInfo = this.$options.data().inspectionInfo;
                this.$nextTick(() => {
                    this.$refs['elForm'].resetFields();
                    if(this.dataForm.inspectionId){
                        this.loading = true
                        request({
                            url: '/api/project/BizQualityInspection/'+inspectionId,
                            method: 'get'
                        }).then(res => {
                            this.inspectionInfo = res.data;
                        })

                        if(this.dataForm.id){
                            request({
                                url: '/api/project/BizQualityInspectionException/'+this.dataForm.id,
                                method: 'get'
                            }).then(res => {
                                this.dataInfo(res.data)
                                this.loading = false
                            })
                        }else{
                            this.dataForm = this.$options.data().dataForm;
                            this.dataForm.inspectionId = inspectionId;
                            this.loading = false
                        }
                    }

                    getDictionaryDataByTypeCode("handleComments").then((res) => {
                        this.handleOptions = res.data
                    })
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
                        url: '/api/project/BizQualityInspectionException',
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
                        url: '/api/project/BizQualityInspectionException/'+this.dataForm.id,
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
                    // for(let i=0;i<_data.bizqualityinspectiondetailList.length;i++){
                    //     var _list = _data.bizqualityinspectiondetailList[i];
                    // }
                return _data;
            },
            dataInfo(dataAll){
                // let _dataAll =dataAll
                //     for(let i=0;i<_dataAll.bizqualityinspectiondetailList.length;i++){
                //         var _list = _dataAll.bizqualityinspectiondetailList[i];
                //     }
                this.dataForm = dataAll
            },
            handleChange(){
                debugger;
                var _this = this;
                let obj = _this.handleOptions.find(function (item) {
                    return item.enCode === _this.dataForm.handleComments;
                });
                _this.dataForm.handleCommentsName = obj.fullName;
            }
        },
    }

</script>
