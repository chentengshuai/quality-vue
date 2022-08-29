<template>
<el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'"
           :close-on-click-modal="false" append-to-body
           :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
           width="800px">
<el-row :gutter="15" class="">
<el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="right" >
    <template v-if="!loading">
            <el-col :span="24" >
                <el-form-item  label="业务伙伴编码"   prop="partnerCode" >
                    <el-input    v-model="dataForm.partnerCode"   readonly  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="业务伙伴名称"   prop="partnerName" >
                    <el-input    v-model="dataForm.partnerName"   readonly  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="业务伙伴类型"   prop="partnerType" >
                    <el-input    v-model="dataForm.partnerType"   readonly  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
    <el-col :span="24"  >
    <el-form-item label-width="0">
            <div class="JNPF-common-title">
                <h2>模板明细</h2>
            </div>
    <el-table :data="dataForm.partnerprinttemplateList" size='mini'>
        <el-table-column type="index" width="50" label="序号" align="center" />
            <el-table-column prop="templateName" label="模板名称" width="200">
                <template slot-scope="scope">
                    <el-input   v-model="scope.row.templateName" placeholder="请选择" readonly  clearable  :style='{"width":"100%"}' @click.native="chooseLabel(scope.$index)">
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column prop="templateTypeCode" label="模板类型">
                <template slot-scope="scope">
                    <el-input   v-model="scope.row.templateTypeName" readonly  clearable  :style='{"width":"100%"}'>
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column prop="templatePath" label="模板路径">
                <template slot-scope="scope">
                    <el-input   v-model="scope.row.templatePath" readonly  clearable  :style='{"width":"100%"}'>
                    </el-input>
                </template>
            </el-table-column>
    <el-table-column label="操作" width="50" >
        <template slot-scope="scope">
            <el-button size="mini" type="text" class="JNPF-table-delBtn" @click="delpartnerprinttemplateList(scope.$index)">删除</el-button>
        </template>
    </el-table-column>
    </el-table>
    <div class="table-actions" @click="addpartnerprinttemplateList()">
        <el-button type="text" icon="el-icon-plus">添加</el-button>
    </div>
    </el-form-item>
    </el-col>
    <el-dialog title="标签列表"
                :close-on-click-modal="false" append-to-body
                :visible.sync="labelChooseShow" class="JNPF-dialog JNPF-dialog_center" lock-scroll
                width="1000px">
        <label-choose ref="LabelChoose" @onChange="dialogLabelChange"></label-choose>
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
    import LabelChoose from './labelChoose'

    export default {
        components: {LabelChoose},
        props: [],
        data() {
            return {
                visible: false,
                loading: false,
                isDetail: false,
                labelChooseShow: false,
                rowIndex:0, 
            dataForm: {
                            partnerCode : '',
                            partnerName : '',
                            partnerType : '',
                        partnerprinttemplateList:[],
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
            chooseLabel(index) {
                this.rowIndex = index;
                this.labelChooseShow = true;
                this.$nextTick(() => {
                    this.$refs.LabelChoose.initData();
                })
            },
            dialogLabelChange(label) {
                this.dataForm.partnerprinttemplateList[this.rowIndex].templateId = label.id;
                this.dataForm.partnerprinttemplateList[this.rowIndex].templateName = label.name;
                this.dataForm.partnerprinttemplateList[this.rowIndex].templateTypeCode = label.templateTypeCode;
                this.dataForm.partnerprinttemplateList[this.rowIndex].templateTypeName = label.templateType;
                this.dataForm.partnerprinttemplateList[this.rowIndex].templatePath = label.template;
                
                this.labelChooseShow = false;
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
                            url: '/api/project/PartnerPrintTemplate/'+this.dataForm.id,
                            method: 'get'
                        }).then(res => {
                            this.dataInfo(res.data)
                            this.loading = false
                        })
                    }

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
                request({
                    url: '/api/project/PartnerPrintTemplate/'+this.dataForm.id,
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
            },
                addpartnerprinttemplateList(){
                    let item = {
                        templateId:undefined,
                        templateName:undefined,
                        templateTypeCode:undefined,
                        templateTypeName:undefined,
                        templatePath:undefined,
                    }
                    this.dataForm.partnerprinttemplateList.push(item)
                },
                delpartnerprinttemplateList(index) {
                    this.dataForm.partnerprinttemplateList.splice(index, 1);
                },
            dataList(){
                var _data = JSON.parse(JSON.stringify(this.dataForm));
                    for(let i=0;i<_data.partnerprinttemplateList.length;i++){
                        var _list = _data.partnerprinttemplateList[i];
                    }
                return _data;
            },
            dataInfo(dataAll){
                let _dataAll =dataAll
                    for(let i=0;i<_dataAll.partnerprinttemplateList.length;i++){
                        var _list = _dataAll.partnerprinttemplateList[i];
                    }
                this.dataForm = _dataAll
            },
            selectItemNode(node){
                const fullName = this.printTemplateTypeOptions.find(item => item.enCode === node.templateTypeCode).fullName;
                node.templateTypeName = fullName;
            },
        },
    }

</script>
