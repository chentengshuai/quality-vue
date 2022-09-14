<template>
<el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'"
           :close-on-click-modal="false" append-to-body
           :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
           width="1200px">
<el-row :gutter="15" class="">
<el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="right" >
    <template v-if="!loading">
            <el-col :span="12" >
                <el-form-item  label="发货编码"   prop="bdDeliveryCode" >
                    <el-input    v-model="dataForm.bdDeliveryCode" placeholder="自动生成"  :disabled="true"  :style='{"width":"100%"}'>
                    </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="发货名称"   prop="bdDeliveryName" >
                    <el-input    v-model="dataForm.bdDeliveryName" placeholder="请输入"  :maxlength="100"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
   
            <el-col :span="12" >
                <el-form-item  label="出库单号"   prop="stockMoveCode" >
                    <el-input    v-model="dataForm.stockMoveCode" placeholder="请选择"  readonly  @click.native="selectOutStockMoveList()"  :style='{"width":"100%"}'>
                    </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="出库单总毛重"   prop="stockGrossWeight" >
                    <el-input    v-model="dataForm.stockGrossWeight" placeholder="出库单自动带出"  readonly  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="始发地"   prop="originPlaceCode" >
                    <JNPF-Address    v-model="dataForm.originPlaceCode" placeholder="请选择"  clearable  level=0 filterable >
                    </JNPF-Address>
                </el-form-item>
            </el-col>
  
            <el-col :span="12" >
                <el-form-item  label="目的地"   prop="aimPlaceCode" >
                    <JNPF-Address    v-model="dataForm.aimPlaceCode" placeholder="请选择"  clearable level=0  filterable >
                    </JNPF-Address>
                </el-form-item>
            </el-col>
          
            <el-col :span="12" >
                <el-form-item  label="到货日期"   prop="arrivalDate" >
                    <el-date-picker    v-model="dataForm.arrivalDate" placeholder="请选择"  clearable  :style='{"width":"100%"}' type="datetime"  format="yyyy-MM-dd HH:mm:ss"  value-format="timestamp" >

                </el-date-picker>
                </el-form-item>
            </el-col>
            <!-- <el-col :span="24" >
                <el-form-item  label="删除人姓名"   prop="deleterName" >
                    <JNPF-Address    v-model="dataForm.deleterName" placeholder="请选择"  clearable  level=2 >

                </JNPF-Address>
                </el-form-item>
            </el-col> -->
    <el-col :span="24"  >
    <el-form-item label-width="0">
            <div class="JNPF-common-title">
                <h2>车辆信息</h2>
            </div>
    <el-table :data="dataForm.dmdeliverymanagelineList" size='mini'>
        <el-table-column type="index" width="50" label="序号" align="center" />
        <el-table-column prop="licenseNumber" label="车牌号 ">
                <template slot-scope="scope">
                    <el-input   v-model="scope.row.licenseNumber" placeholder="请选择"  readonly  clearable   @click.native="selectVehicleList(scope.$index)"  :style='{"width":"100%"}'>
                </el-input>
            </template>
        </el-table-column>
          
            <el-table-column prop="driverName" label="驾驶人">
                <template slot-scope="scope">
                    <el-input   v-model="scope.row.driverName" placeholder="自动带出"  readonly  clearable  :style='{"width":"100%"}'>
                </el-input>
            </template>
        </el-table-column>
           
            <el-table-column prop="vehicelBrand" label="车辆品牌">
                <template slot-scope="scope">
                    <el-input   v-model="scope.row.vehicelBrand" placeholder="自动带出"  readonly  clearable  :style='{"width":"100%"}'>
                </el-input>
            </template>
        </el-table-column>
            <el-table-column prop="vehicleProvinceName" label="车辆所属省份">
                <template slot-scope="scope">
                    <el-input   v-model="scope.row.vehicleProvinceName" placeholder="自动带出"  readonly  clearable  :style='{"width":"100%"}'>
                </el-input>
            </template>
        </el-table-column>
            <el-table-column prop="vehicleLoad" label="车辆最大载重">
                <template slot-scope="scope">
                    <el-input   v-model="scope.row.vehicleLoad" placeholder="自动带出"  readonly  clearable  :style='{"width":"100%"}'>
                </el-input>
            </template>
        </el-table-column>
    <el-table-column label="操作" width="50" >
        <template slot-scope="scope">
            <el-button size="mini" type="text" class="JNPF-table-delBtn" @click="deldmdeliverymanagelineList(scope.$index)">删除</el-button>
        </template>
    </el-table-column>
    </el-table>
    <div class="table-actions" @click="adddmdeliverymanagelineList()">
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

    <el-dialog title="选择出库单"
                     :close-on-click-modal="false" append-to-body
                     :visible.sync="outStockMoveListShow" class="JNPF-dialog JNPF-dialog_center" lock-scroll
                     width="1000px">
        <out-stock-move-list ref="outStockMoveList" @outStockMoveDataForm="processOutStockMove" ></out-stock-move-list>
    </el-dialog> 

    <el-dialog title="选择车辆"
                     :close-on-click-modal="false" append-to-body
                     :visible.sync="vehicleListShow" class="JNPF-dialog JNPF-dialog_center" lock-scroll
                     width="1000px">
        <vehicle-list ref="vehicleList" @vehicleDataForm="processVehicle" ></vehicle-list>
    </el-dialog> 


    </el-dialog>
</template>
<script>
    import request from '@/utils/request'
    import { previewDataInterface } from '@/api/systemData/dataInterface'
    import { getDictionaryDataSelector } from '@/api/systemData/dictionary'
    import outStockMoveList from './outStockMoveList'
    import vehicleList from './vehicleList'
    export default {
        components: {outStockMoveList,vehicleList},
        props: [],
        data() {
            return {
                visible: false,
                loading: false,
                isDetail: false,
                outStockMoveListShow:false,
                vehicleListShow:false,
                clickVehicleRow:-1,
            dataForm: {
                            bdDeliveryCode : '',
                            bdDeliveryName : '',
                            stockMoveId : '',
                            stockMoveCode : '',
                            stockGrossWeight : '',
                            originPlaceCode : [],
                            originPlaceName : '',
                            aimPlaceCode : [],
                            aimPlaceName : '',
                            arrivalDate : '',
                            deleterName : [],
                        dmdeliverymanagelineList:[],
            },
            rules:
            {
                            bdDeliveryName: [
                                {
                                    required: true,
                                    message: '请输入',
                                    trigger: 'blur'
                                },
                        ],
                            stockMoveCode: [
                                {
                                    required: true,
                                    message: '请选择',
                                    trigger: 'blur'
                                },
                        ],
                            originPlaceCode: [
                                {
                                    required: true,
                                    message: '请至少选择一个',
                                    trigger: 'change'
                                },
                        ],
                            aimPlaceCode: [
                                {
                                    required: true,
                                    message: '请至少选择一个',
                                    trigger: 'change'
                                },
                        ],
                            arrivalDate: [
                                {
                                    required: true,
                                    message: '请选择',
                                    trigger: 'change'
                                },
                        ],
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
                            url: '/api/project/DmDeliveryManage/'+this.dataForm.id,
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
                        url: '/api/project/DmDeliveryManage',
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
                        url: '/api/project/DmDeliveryManage/'+this.dataForm.id,
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
                adddmdeliverymanagelineList(){
                    let item = {
                        vehicelId:undefined,
                        driverAccount:undefined,
                        driverName:undefined,
                        licenseNumber:undefined,
                        vehicelBrand:undefined,
                        vehicleProvinceName:undefined,
                        vehicleLoad:undefined,
                        vehiclePicture:undefined,
                }
                    this.dataForm.dmdeliverymanagelineList.push(item)
                },
                deldmdeliverymanagelineList(index) {
                    this.dataForm.dmdeliverymanagelineList.splice(index, 1);
                },
            dataList(){
                var _data = JSON.parse(JSON.stringify(this.dataForm));
                        _data.originPlaceCode = JSON.stringify(_data.originPlaceCode)
                        _data.aimPlaceCode = JSON.stringify(_data.aimPlaceCode)
                        _data.deleterName = JSON.stringify(_data.deleterName)
                    for(let i=0;i<_data.dmdeliverymanagelineList.length;i++){
                        var _list = _data.dmdeliverymanagelineList[i];
                    }
                return _data;
            },
            dataInfo(dataAll){
                let _dataAll =dataAll
                        _dataAll.originPlaceCode = JSON.parse( _dataAll.originPlaceCode)
                        _dataAll.aimPlaceCode = JSON.parse( _dataAll.aimPlaceCode)
                        _dataAll.deleterName = JSON.parse( _dataAll.deleterName)
                    for(let i=0;i<_dataAll.dmdeliverymanagelineList.length;i++){
                        var _list = _dataAll.dmdeliverymanagelineList[i];
                    }
                this.dataForm = _dataAll
            }, selectOutStockMoveList() {  //选择出库单
                this.outStockMoveListShow = true;
                this.$nextTick(() => {
                    this.$refs.outStockMoveList.initData();
                });
            },processOutStockMove(data){  //数据回写
                this.dataForm.stockMoveId=data.id
                this.dataForm.stockMoveCode=data.stockMoveCode
                this.dataForm.stockGrossWeight=data.stockSumGrossWeight
                this.outStockMoveListShow = false;
            }, selectVehicleList(rowIndex) {  //选择车辆信息
                this.vehicleListShow = true;
                this.clickVehicleRow=rowIndex;
                this.$nextTick(() => {
                    this.$refs.vehicleList.initData();
                });
            },processVehicle(data){  //车辆信息数据回写
                let getSeletedRowData=this.dataForm.dmdeliverymanagelineList[this.clickVehicleRow];
                getSeletedRowData.vehicelId=data.id  //车辆信息id
                getSeletedRowData.driverAccount=data.driverAccount;//驾驶人
                getSeletedRowData.driverName= data.driverName;//驾驶人名称
                getSeletedRowData.licenseNumber= data.licenseNumber;// 车牌号 
                getSeletedRowData.vehicelBrand= data.vehicelBrand;//车辆品牌
                getSeletedRowData.vehicleProvinceName=data.vehicleProvinceName;//车辆所属省份
                getSeletedRowData.vehicleLoad=data.vehicleLoad;  //车辆最大载重
                getSeletedRowData.vehiclePicture=data.vehiclePicture;  //车辆图片
                this.vehicleListShow = false;
            }

        },
    }

</script>
