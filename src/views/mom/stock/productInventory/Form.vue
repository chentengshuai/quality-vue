<template>
<el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'"
           :close-on-click-modal="false" append-to-body
           :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
           width="80%">
<el-row :gutter="15" class="">
<el-form ref="elForm" :model="dataForm" :rules="rules" size="medium" label-width="100px" label-position="right" >
    <template v-if="!loading">
            <el-col :span="8" >
                <el-form-item  label="盘点期间"   prop="periodCode" >
                    <el-input    v-model="dataForm.periodCode" placeholder="请选择"  readonly  :style='{"width":"100%"}' @click.native="chooseDuration()">

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item  label="盘点类型"   prop="takeInventoryCode" >
                    <el-select    v-model="dataForm.takeInventoryCode" placeholder="请选择"  clearable  :style='{"width":"100%"}' :multiple="false" @change="selectItemNode()">
                            <el-option v-for="(item, index) in takeInventoryCodeOptions" :key="index" :label="item.fullName" :value="item.enCode" :disabled="item.disabled" ></el-option>

                </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item  label="盘点人员"   prop="takeInventoryUserId" >
                    <user-search v-model="dataForm.takeInventoryUserId" :name="dataForm.takeInventoryUserName" :defaultLogin="true"
                                     @name="value => { dataForm.takeInventoryUserName = value }">
                    </user-search>
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item  label="盘点日期"   prop="takeInventoryDate" >
                    <el-date-picker    v-model="dataForm.takeInventoryDate" placeholder="请选择"  clearable  :style='{"width":"100%"}' type="date"  format="yyyy-MM-dd"  value-format="timestamp" >

                </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item  label="理论库存总量"   prop="theoreticalInventory" >
                    <el-input    v-model="dataForm.theoreticalInventory" :disabled="true"  :style='{"width":"100%"}'>
                    </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item  label="实际库存总量"   prop="actualInventory" >
                    <el-input    v-model="dataForm.actualInventory" :disabled="true"  :style='{"width":"100%"}'>
                    </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="备注"   prop="remarks" >
                    <el-input    v-model="dataForm.remarks" placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
    <el-col :span="24"  >
    <el-form-item label-width="0">
            <div class="JNPF-common-title">
                <h2>明细</h2>
            </div>
    <el-table :data="dataForm.producttakeinventorylineList" size='mini'>
        <el-table-column type="index" width="50" label="序号" align="center" />
            <el-table-column prop="lotNumber" label="箱号/批号" width="150">
                <template slot-scope="scope">
                    <el-input   v-model="scope.row.lotNumber" placeholder="请选择"  readonly :style='{"width":"100%"}' @click.native="chooseQuant(scope.$index)">
                </el-input>
            </template>
        </el-table-column>
            <el-table-column prop="productCode" label="物料编码" width="150">
                <template slot-scope="scope">
                    <el-input   v-model="scope.row.productCode"    :disabled="true" :style='{"width":"100%"}'>
                </el-input>
            </template>
        </el-table-column>
            <el-table-column prop="productName" label="物料名称" width="150">
                <template slot-scope="scope">
                    <el-input   v-model="scope.row.productName"    :disabled="true" :style='{"width":"100%"}'>
                </el-input>
            </template>
        </el-table-column>
            <el-table-column prop="productSpc" label="规格型号" width="150">
                <template slot-scope="scope">
                    <el-input   v-model="scope.row.productSpc"    :disabled="true" :style='{"width":"100%"}'>
                </el-input>
            </template>
        </el-table-column>
            <el-table-column prop="productLvl" label="产品等级" width="150">
                <template slot-scope="scope">
                    <el-input   v-model="scope.row.productLvl"   :disabled="true"  :style='{"width":"100%"}'>
                </el-input>
            </template>
        </el-table-column>
            <el-table-column prop="uomName" label="单位" width="100">
                <template slot-scope="scope">
                    <el-input   v-model="scope.row.uomName"   :disabled="true"  :style='{"width":"100%"}'>
                </el-input>
            </template>
        </el-table-column>
            <el-table-column prop="theoreticalInventory" label="理论库存数量" width="200">
                <template slot-scope="scope">
                    <el-input   v-model="scope.row.theoreticalInventory"   :disabled="true"  :style='{"width":"100%"}'>
                </el-input>
            </template>
        </el-table-column>
            <el-table-column prop="actualInventory" label="实际库存数量" width="210">
                <template slot-scope="scope">
                    <el-input-number   v-model="scope.row.actualInventory"  :step="1"  controls-position='right' @change="countInventory()">
                </el-input-number>
            </template>
        </el-table-column>
            <el-table-column prop="customerName" label="客户" width="250">
                <template slot-scope="scope">
                    <el-input   v-model="scope.row.customerName"   :disabled="true"  :style='{"width":"100%"}'>
                </el-input>
            </template>
        </el-table-column>
            <el-table-column prop="warehouseName" label="仓库名称" width="170">
                <template slot-scope="scope">
                    <el-input   v-model="scope.row.warehouseName"  :disabled="true"  :style='{"width":"100%"}'>
                </el-input>
            </template>
        </el-table-column>
            <el-table-column prop="locationName" label="仓位" width="180">
                <template slot-scope="scope">
                    <el-input   v-model="scope.row.locationName"   :disabled="true"  :style='{"width":"100%"}'>
                </el-input>
            </template>
        </el-table-column>
            <el-table-column prop="workShopName" label="生产车间" width="250">
                <template slot-scope="scope">
                    <el-input   v-model="scope.row.workShopName"   :disabled="true"  :style='{"width":"100%"}'>
                </el-input>
            </template>
        </el-table-column>
    <el-table-column label="操作" width="50" >
        <template slot-scope="scope">
            <el-button size="mini" type="text" class="JNPF-table-delBtn" @click="delproducttakeinventorylineList(scope.$index)" v-if="!isDetail">删除</el-button>
        </template>
    </el-table-column>
    </el-table>
    <div class="table-actions" @click="addproducttakeinventorylineList()">
        <el-button type="text" icon="el-icon-plus" v-if="!isDetail">添加</el-button>
    </div>
    </el-form-item>
    </el-col>
        <el-dialog title="盘点期间"
                   :close-on-click-modal="false" append-to-body
                   :visible.sync="durationChooseShow" class="JNPF-dialog JNPF-dialog_center" lock-scroll
                   v-if="durationChooseShow" width="1000px">
          <duration-choose ref="DurationChoose" @onChange="dialogDurationChange"></duration-choose>
        </el-dialog>
        <el-dialog title="盘点列表"
                   :close-on-click-modal="false" append-to-body
                   :visible.sync="quantChooseShow" class="JNPF-dialog JNPF-dialog_center" lock-scroll
                   v-if="quantChooseShow" width="1000px">
          <quant-choose ref="QuantChoose" @onChange="dialogQuantChange"></quant-choose>
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
    import { getDictionaryDataSelector,getDictionaryDataByTypeCode } from '@/api/systemData/dictionary'
    import DurationChoose from './durationChoose'
    import QuantChoose from './quantChoose'

    export default {
        components: {DurationChoose,QuantChoose},
        props: [],
        data() {
            return {
                visible: false,
                loading: false,
                isDetail: false,
                durationChooseShow: false,
                quantChooseShow: false,
                rowIndex: 0,
            dataForm: {
                            periodCode : '',
                            periodId : '',
                            periodStartDate : '',
                            periodEndDate : '',
                            takeInventoryCode : "",
                            takeInventoryName : "",
                            takeInventoryUserId : '',
                            takeInventoryUserName : '',
                            takeInventoryDate : '',
                            theoreticalInventory : '',
                            actualInventory : '',
                            remarks : '',
                        producttakeinventorylineList:[],
            },
            rules:
            {
            },
                        takeInventoryCodeOptions:[],

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
                            url: '/api/project/ProductTakeInventory/'+this.dataForm.id,
                            method: 'get'
                        }).then(res => {
                            this.dataInfo(res.data)
                            this.loading = false
                        })
                    }

                });
                getDictionaryDataByTypeCode("inventoryType").then(res => {
                    this.takeInventoryCodeOptions = res.data
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
                let flag = true;
                if(this.dataForm.producttakeinventorylineList.length==0){
                    flag = false;
                }else{
                    for(let j=0;j<this.dataForm.producttakeinventorylineList.length;j++){
                        if(this.dataForm.producttakeinventorylineList[j].lotNumber == "" || this.dataForm.producttakeinventorylineList[j].lotNumber == undefined){
                            flag = false;
                        }
                    }
                }

                if(flag){
                    if (!this.dataForm.id) {
                        request({
                            url: '/api/project/ProductTakeInventory',
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
                            url: '/api/project/ProductTakeInventory/'+this.dataForm.id,
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
                }else{
                    this.$message({
                        message: "请填写行明细信息！",
                        type: 'warning',
                        duration: 2000,
                    })
                }
            },
                addproducttakeinventorylineList(){
                    let item = {
                        contractNo:undefined,
                        lotNumber:undefined,
                        warehouseId:undefined,
                        warehouseCode:undefined,
                        warehouseName:undefined,
                        locationId:undefined,
                        locationCode:undefined,
                        locationName:undefined,
                        productId:undefined,
                        productName:undefined,
                        productCode:undefined,
                        productSpc:undefined,
                        uomId:undefined,
                        uomName:undefined,
                        customerId:undefined,
                        customerCode:undefined,
                        customerName:undefined,
                        frp:undefined,
                        theoreticalInventory:undefined,
                        actualInventory:undefined,
                        warehousingTime:undefined,
                        productLvl:undefined,
                        productLvlCode:undefined,
                        workShopId:undefined,
                        workShopCode:undefined,
                        workShopName:undefined,
                }
                    this.dataForm.producttakeinventorylineList.push(item)
                },
                delproducttakeinventorylineList(index) {
                    this.dataForm.producttakeinventorylineList.splice(index, 1);
                    this.countInventory();
                },
            dataList(){
                var _data = JSON.parse(JSON.stringify(this.dataForm));
                    for(let i=0;i<_data.producttakeinventorylineList.length;i++){
                        var _list = _data.producttakeinventorylineList[i];
                    }
                return _data;
            },
            dataInfo(dataAll){
                let _dataAll =dataAll
                    for(let i=0;i<_dataAll.producttakeinventorylineList.length;i++){
                        var _list = _dataAll.producttakeinventorylineList[i];
                    }
                this.dataForm = _dataAll
            },
            selectItemNode(){
                debugger;
                const takeInventoryName = this.takeInventoryCodeOptions.find(item => item.enCode === this.dataForm.takeInventoryCode).fullName;
                this.dataForm.takeInventoryName = takeInventoryName;
            },
            countInventory(){
                debugger;
                let actualInventory = 0 ;
                for(let j=0;j<this.dataForm.producttakeinventorylineList.length;j++){
                    actualInventory += this.dataForm.producttakeinventorylineList[j].actualInventory;
                }
                this.dataForm.actualInventory = actualInventory;
            },
            chooseDuration() {
              this.durationChooseShow = true;
              this.$nextTick(() => {
                this.$refs.DurationChoose.initData();
              })
            },
            dialogDurationChange(duration) {
                //TODO 1.盘点期间相关数据；2.删除行明细；3.库存信息

                this.dataForm.periodCode = duration.inventoryDuration;
                this.dataForm.periodId = duration.id;
                this.dataForm.periodStartDate = duration.inventoryStartTime;
                this.dataForm.periodEndDate = duration.inventoryEndTime;

              let _query = {
                  inventoryStartTime : this.dataForm.periodStartDate,
                  inventoryEndTime : this.dataForm.periodEndDate,
              }  
               //查询库存明细
              request({
                    url: `/api/project/StockQuant/getStockList`,
                    method: 'post',
                    data: _query
                }).then(res => {
                    console.log(res.data);

                    console.log("this.dataForm.producttakeinventorylineList.length:"+this.dataForm.producttakeinventorylineList.length)
                    let delLength = this.dataForm.producttakeinventorylineList.length;
                    for(let j=0;j<delLength;j++){
                        console.log("===del.j:"+j)
                        this.delproducttakeinventorylineList(0);
                    }
                    let theoreticalInventory = 0 ;
                    for(let i=0;i<res.data.length;i++){
                        let _data = res.data[i];
                        //明细行赋值
                        this.addproducttakeinventorylineList();
                        let j = this.dataForm.producttakeinventorylineList.length-1;
                        this.dataForm.producttakeinventorylineList[j].contractNo = _data.contractNo;
                        this.dataForm.producttakeinventorylineList[j].lotNumber = _data.lotNumber;
                        this.dataForm.producttakeinventorylineList[j].warehouseId = _data.warehouseId;
                        this.dataForm.producttakeinventorylineList[j].warehouseCode = _data.warehouseCode;
                        this.dataForm.producttakeinventorylineList[j].warehouseName = _data.warehouseName;
                        this.dataForm.producttakeinventorylineList[j].locationId = _data.locationId;
                        this.dataForm.producttakeinventorylineList[j].locationCode = _data.locationCode;
                        this.dataForm.producttakeinventorylineList[j].locationName = _data.locationName;
                        this.dataForm.producttakeinventorylineList[j].productId = _data.productId;
                        this.dataForm.producttakeinventorylineList[j].productName = _data.productName;
                        this.dataForm.producttakeinventorylineList[j].productCode = _data.productCode;
                        this.dataForm.producttakeinventorylineList[j].productSpc = _data.productSpc;
                        this.dataForm.producttakeinventorylineList[j].uomId = _data.uomId;
                        this.dataForm.producttakeinventorylineList[j].uomName = _data.uomName;
                        this.dataForm.producttakeinventorylineList[j].customerId = _data.customerId;
                        this.dataForm.producttakeinventorylineList[j].customerCode = _data.customerCode;
                        this.dataForm.producttakeinventorylineList[j].customerName = _data.customerName;
                        this.dataForm.producttakeinventorylineList[j].frp = _data.frp;
                        this.dataForm.producttakeinventorylineList[j].theoreticalInventory = _data.qty;
                        this.dataForm.producttakeinventorylineList[j].actualInventory = _data.qty;
                        this.dataForm.producttakeinventorylineList[j].warehousingTime = _data.warehousingTime;
                        this.dataForm.producttakeinventorylineList[j].productLvl = _data.productLvl;
                        this.dataForm.producttakeinventorylineList[j].productLvlCode = _data.productLvlCode;
                        this.dataForm.producttakeinventorylineList[j].workShopId = _data.workShopId;
                        this.dataForm.producttakeinventorylineList[j].workShopCode = _data.workShopCode;
                        this.dataForm.producttakeinventorylineList[j].workShopName = _data.workShopName;
                        theoreticalInventory += _data.qty;
                    }
                    this.dataForm.theoreticalInventory = theoreticalInventory ;
                    this.dataForm.actualInventory = theoreticalInventory ;
                })
              this.durationChooseShow = false;
            },
            chooseQuant(index) {
              this.rowIndex = index;
              this.quantChooseShow = true;
              this.$nextTick(() => {
                this.$refs.QuantChoose.initData();
              })
            },
            dialogQuantChange(quant) {
                //TODO 库存明细行
                debugger;
                let flag = true;
                for(let i=0;i<this.dataForm.producttakeinventorylineList.length-1;i++){
                    if(this.dataForm.producttakeinventorylineList[i].lotNumber === quant.lotNumber){
                        flag = false;
                    }
                }
                if(flag){
                    let j = this.rowIndex;
                    this.dataForm.producttakeinventorylineList[j].contractNo = quant.contractNo;
                    this.dataForm.producttakeinventorylineList[j].lotNumber = quant.lotNumber;
                    this.dataForm.producttakeinventorylineList[j].warehouseId = quant.warehouseId;
                    this.dataForm.producttakeinventorylineList[j].warehouseCode = quant.warehouseCode;
                    this.dataForm.producttakeinventorylineList[j].warehouseName = quant.warehouseName;
                    this.dataForm.producttakeinventorylineList[j].locationId = quant.locationId;
                    this.dataForm.producttakeinventorylineList[j].locationCode = quant.locationCode;
                    this.dataForm.producttakeinventorylineList[j].locationName = quant.locationName;
                    this.dataForm.producttakeinventorylineList[j].productId = quant.productId;
                    this.dataForm.producttakeinventorylineList[j].productName = quant.productName;
                    this.dataForm.producttakeinventorylineList[j].productCode = quant.productCode;
                    this.dataForm.producttakeinventorylineList[j].productSpc = quant.productSpc;
                    this.dataForm.producttakeinventorylineList[j].uomId = quant.uomId;
                    this.dataForm.producttakeinventorylineList[j].uomName = quant.uomName;
                    this.dataForm.producttakeinventorylineList[j].customerId = quant.customerId;
                    this.dataForm.producttakeinventorylineList[j].customerCode = quant.customerCode;
                    this.dataForm.producttakeinventorylineList[j].customerName = quant.customerName;
                    this.dataForm.producttakeinventorylineList[j].frp = quant.frp;
                    this.dataForm.producttakeinventorylineList[j].theoreticalInventory = quant.qty;
                    this.dataForm.producttakeinventorylineList[j].actualInventory = quant.qty;
                    this.dataForm.producttakeinventorylineList[j].warehousingTime = quant.warehousingTime;
                    this.dataForm.producttakeinventorylineList[j].productLvl = quant.productLvl;
                    this.dataForm.producttakeinventorylineList[j].productLvlCode = quant.productLvlCode;
                    this.dataForm.producttakeinventorylineList[j].workShopId = quant.workShopId;
                    this.dataForm.producttakeinventorylineList[j].workShopCode = quant.workShopCode;
                    this.dataForm.producttakeinventorylineList[j].workShopName = quant.workShopName;
                    this.countInventory();
                }else{
                    this.$message({
                        message: "箱号/批号已存在，请勿重复添加！",
                        type: 'warning',
                        duration: 2000,
                    })
                }

                this.quantChooseShow = false;
            },

        },
    }

</script>
