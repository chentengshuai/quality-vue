<template>
<el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'"
           :close-on-click-modal="false" append-to-body
           :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
           width="1200px">
<el-row :gutter="15" class="">
<el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="right" >
    <template v-if="!loading">
            <el-col :span="24" >
                <el-form-item  label="检验规则编码"   prop="patrolRulesCode" >
                    <el-input    v-model="dataForm.patrolRulesCode" placeholder="自动生成"  :disabled="true"   :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="规则名称"   prop="patrolRulesName" >
                    <el-input    v-model="dataForm.patrolRulesName" placeholder="请输入"  :maxlength="100"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="检验单位"   prop="patrolUnit" >
                    <el-select    v-model="dataForm.patrolUnit" placeholder="请选择"  clearable  @change="handlerSelectpatrol_unit"    :style='{"width":"100%"}' :multiple="false" >
                            <el-option v-for="(item, index) in patrolUnitOptions" :key="index" :label="item.fullName" :value="item.enCode" :disabled="item.disabled" ></el-option>
                </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="检验负责人" prop="patrolResponsPerson">
                  <user-search
                    v-model="dataForm.patrolResponsPerson"
                    :name="dataForm.patrolResponsPersonName"
                    @name="(value) => {
                        dataForm.patrolResponsPersonName = value;
                      }
                    "
                  ></user-search>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="备注"   prop="memo" >
                    <el-input    v-model="dataForm.memo" placeholder="请输入"  :maxlength="300"  :style='{"width":"100%"}' true  type="textarea"  :autosize='{"minRows":4,"maxRows":4}' >

                </el-input>
                </el-form-item>
            </el-col>
    <el-col :span="24"   v-show="optionRulestime">
    <el-form-item label-width="0" >
            <div class="JNPF-common-title">
                <h2>检验时间</h2>
            </div>
    <el-table :data="dataForm.xjrpatrolrulestimeList" size='mini' >
        <el-table-column type="index" width="50" label="序号" align="center" />
        <el-table-column prop="patrolRulesTimelist"  align="center"  label="检验开始时间">
            <template slot-scope="scope">
                <el-time-picker
                    is-range
                    :style='{"width":"100%"}'
                    v-model="scope.row.patrolRulesTimelist"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    placeholder="选择时间范围"
                    value-format="HH:mm:ss"
                    format="HH:mm:ss"
                    >
                </el-time-picker>
        </template>
    </el-table-column>
    <el-table-column label="操作" width="50" >
        <template slot-scope="scope">
            <el-button size="mini" type="text" class="JNPF-table-delBtn" @click="delxjrpatrolrulestimeList(scope.$index)">删除</el-button>
        </template>
    </el-table-column>
    </el-table>
    <div class="table-actions" @click="addxjrpatrolrulestimeList()">
        <el-button type="text" icon="el-icon-plus">添加</el-button>
    </div>
    </el-form-item>
    </el-col>
    <el-col :span="24"  >
    <el-form-item label-width="0">
            <div class="JNPF-common-title">
                <h2>检验内容</h2>
            </div>
    <el-table :data="dataForm.xjrpatrolrulescontentList" size='mini'>
        <el-table-column type="index" width="50" label="序号" align="center" />
        <el-table-column prop="bdEquipmentName" label="设备名称">
            <template slot-scope="scope">
                <el-input   v-model="scope.row.bdEquipmentName" placeholder="请输入"   @click.native="selectEquipmentList(scope.$index)"  :readonly="true"    :style='{"width":"100%"}'>
                </el-input>
            </template>
        </el-table-column>
        <el-table-column prop="productLinesName" label="所属产线">
                <template slot-scope="scope">
                    <el-input   v-model="scope.row.productLinesName" placeholder="自动带出"   :readonly="true"    :style='{"width":"100%"}'>
                </el-input>
            </template>
        </el-table-column>
            <el-table-column prop="equipmentCategoryName" label="所属类别">
                <template slot-scope="scope">
                    <el-input   v-model="scope.row.equipmentCategoryName" placeholder="自动带出"   :readonly="true"   :style='{"width":"100%"}'>
                </el-input>
            </template>
        </el-table-column>
        <el-table-column prop="materialStandardId" label="检验基准">
                <template slot-scope="scope">
                <el-select   v-model="scope.row.materialStandardId" placeholder="请选择"    :style='{"width":"100%"}' :multiple="false" >
                        <el-option v-for="(item, index) in scope.row.materialStandardIdOptions" :key="index" :label="item.standardName" :value="item.id" :disabled="item.disabled" ></el-option>
                </el-select>
            </template>
        </el-table-column>
        <el-table-column  width="100" label="设备检测内容">
            <template slot-scope="scope">
                <el-button size="mini" type="text"  @click="viewMaterialStandardList(scope.row)">查看</el-button>
            </template>
        </el-table-column>
    <el-table-column label="操作" width="50" >
        <template slot-scope="scope">
            <el-button size="mini" type="text" class="JNPF-table-delBtn" @click="delxjrpatrolrulescontentList(scope.$index)">删除</el-button>
        </template>
    </el-table-column>
    </el-table>
    <div class="table-actions" @click="addxjrpatrolrulescontentList()">
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

    <el-dialog title="选择设备"
                     :close-on-click-modal="false" append-to-body
                     :visible.sync="bdEquipmentListShow" class="JNPF-dialog JNPF-dialog_center" lock-scroll
                     width="1000px">

        <patrol-equipment-list ref="PatrolEquipmentList" @bdEquipmentListDataForm="processEquipmentList" >
        </patrol-equipment-list>
        </el-dialog> 

        <el-dialog title="查看设备检测内容"
                     :close-on-click-modal="false" append-to-body
                     :visible.sync="patrolStandardListShow" class="JNPF-dialog JNPF-dialog_center" lock-scroll
                     width="1000px">
            <patrol-standard-list ref="PatrolStandardList">
            </patrol-standard-list>
        </el-dialog> 

    </el-dialog>

</template>
<script>
    import request from '@/utils/request'
    import { previewDataInterface } from '@/api/systemData/dataInterface'
    import { getDictionaryDataSelector } from '@/api/systemData/dictionary'
    import { compareByGeneratedPositionsDeflated } from 'source-map/lib/util'
    import PatrolEquipmentList from './patrolEquipmentList'
    import PatrolStandardList from './patrolStandardList'
    export default {
        components: {PatrolEquipmentList,PatrolStandardList},
        props: [],
        data() {
            return {
                visible: false,
                loading: false,
                isDetail: false,
                optionRulestime:false,
                bdEquipmentListShow:false,
                clickEquipmentContentRow:-1,
                patrolStandardListShow:false,
            dataForm: {
                            patrolRulesCode : '',
                            patrolRulesName : '',
                            patrolUnit : "",
                            patrolResponsPerson:"",
                            patrolResponsPersonName:"",
                            memo : '',
                        xjrpatrolrulestimeList:[],
                        xjrpatrolrulescontentList:[],
            },
            rules:
            {
                            patrolRulesName: [
                                {
                                    required: true,
                                    message: '请输入',
                                    trigger: 'blur'
                                },
                        ],
                            patrolUnit: [
                                {
                                    required: true,
                                    message: '请选择',
                                    trigger: 'change'
                                },
                        ],
                        patrolResponsPerson:[
                            {
                                required: true,
                                message: '请输入',
                                trigger: 'blur'
                            }
                        ]
            },
            patrolUnitOptions:[],
          
            
        }
        },
        computed: {},
        watch: {},
        created() {
                    this.getpatrolUnitOptions();
        },
        mounted() {},
        methods: {
                    getpatrolUnitOptions() {
                        getDictionaryDataSelector('336761078794945797').then(res => {
                            this.patrolUnitOptions = res.data.list
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
                            url: '/api/project/XjrPatrolrulesBase/'+this.dataForm.id,
                            method: 'get'
                        }).then(res => {
                            this.dataInfo(res.data);
                            this.rulesTimeTableChange();//根据检验单位切换检验时间tabel
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
                        url: '/api/project/XjrPatrolrulesBase',
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
                        url: '/api/project/XjrPatrolrulesBase/'+this.dataForm.id,
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
                addxjrpatrolrulestimeList(){
                    let item = {
                        patrolRulesStarttime:undefined,
                        patrolRulesEndtime:undefined,
                        patrolRulesTimelist:undefined
                }
                    this.dataForm.xjrpatrolrulestimeList.push(item)
                },
                delxjrpatrolrulestimeList(index) {
                    this.dataForm.xjrpatrolrulestimeList.splice(index, 1);
                },
                getxjrpatrolrulescontentObj(){
                    let xjrpatrolrulescontentObj= {
                        id:undefined,
                        patrolRulesBasecode:undefined,
                        patrolRulesBaseid:undefined,
                        bdEquipmentId:undefined,
                        bdEquipmentName:undefined,
                        equipmentCategoryId:undefined,
                        equipmentCategoryName:undefined,
                        productLinesId:undefined,
                        productLinesName:undefined,
                        materialStandardId:undefined,
                        materialStandardIdOptions:[], //校验基准下拉框
                    };
                    return xjrpatrolrulescontentObj;
                },
                addxjrpatrolrulescontentList(){
                    let item =this.getxjrpatrolrulescontentObj();
                    this.dataForm.xjrpatrolrulescontentList.push(item)
                },
                delxjrpatrolrulescontentList(index) {
                    this.dataForm.xjrpatrolrulescontentList.splice(index, 1);
                },
            dataList(){
                var _data = JSON.parse(JSON.stringify(this.dataForm));
                    for(let i=0;i<_data.xjrpatrolrulestimeList.length;i++){
                        var _list = _data.xjrpatrolrulestimeList[i];
                    }
                    for(let i=0;i<_data.xjrpatrolrulescontentList.length;i++){
                        var _list = _data.xjrpatrolrulescontentList[i];
                    }
                return _data;
            },
            dataInfo(dataAll){
                let _dataAll =dataAll
                    for(let i=0;i<_dataAll.xjrpatrolrulestimeList.length;i++){
                        var _list = _dataAll.xjrpatrolrulestimeList[i];
                    }
                    for(let i=0;i<_dataAll.xjrpatrolrulescontentList.length;i++){
                        var _list = _dataAll.xjrpatrolrulescontentList[i];
                    }
                this.dataForm = _dataAll
            },handlerSelectpatrol_unit(val) {
                this.dataForm.xjrpatrolrulestimeList=[];//置空检验时间
                this.rulesTimeTableChange();
            }, rulesTimeTableChange(){ //检验时间列表根据检验单位进行隐藏显示切换
                let patrolUnit=this.dataForm.patrolUnit;
                if(patrolUnit=="DAY"){
                    this.optionRulestime=true;
                }else{
                    this.optionRulestime=false;
                }
            },
            selectEquipmentList(rowIndex) {  //选择设备弹框
                this.bdEquipmentListShow = true;
                this.clickEquipmentContentRow=rowIndex;
                this.$nextTick(() => {
                    this.$refs.PatrolEquipmentList.initData();
                })
            }, clickPatrolEquipmentListDisplay(flag) {  //选择设备弹框显示或关闭
                this.bdEquipmentListShow = false;
            },processEquipmentList(data){ //数据回写
                let getSeletedRowData=this.dataForm.xjrpatrolrulescontentList[this.clickEquipmentContentRow];
                getSeletedRowData.bdEquipmentId=data.id  //设备id
                getSeletedRowData.bdEquipmentName=data.equipmentName;//设备名称
                getSeletedRowData.equipmentCategoryId= data.equipmentCategoryId;//所属类别id
                getSeletedRowData.equipmentCategoryCode= data.equipmentCategoryCode;//所属类别编码
                getSeletedRowData.equipmentCategoryName= data.equipmentCategoryName;//所属类别名称
                getSeletedRowData.productLinesId=data.productLinesId;//所属产线id
                getSeletedRowData.productLinesName=data.productLinesName;  //所属产线名称
                this.bdEquipmentListShow = false;
                //重置校验基准数据
                getSeletedRowData.materialStandardId="";
                getSeletedRowData.materialStandardIdOptions=[];
                //所属类别编码获取对应的校验基准下拉信息
                request({
                    url: `/api/project/BizMaterialStandard/getPatrolStandardList/` + data.equipmentCategoryCode,
                    method: 'get'
                }).then(res => {
                    getSeletedRowData.materialStandardIdOptions=res.data;
                });
            }, viewMaterialStandardList(row) {  //查看检验内容
                let materialStandardId=row.materialStandardId;
                if(materialStandardId){
                    this.patrolStandardListShow = true;
                    this.$nextTick(() => {
                        this.$refs.PatrolStandardList.initData(materialStandardId);
                    });
                    
                }else{
                    this.$message({
                        message:"请选择检验基准!",
                        type: 'warning',
                        duration: 2000,
                        onClose: () => {
                        }
                    })
                }

            }
        },
    }

</script>
