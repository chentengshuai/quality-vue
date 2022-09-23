<template>
    <div class="JNPF-common-layout">

        <div class="JNPF-common-layout-center">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                            <el-col :span="6">
                                <el-form-item label="检验时间">
                                    <el-date-picker
                                        v-model="query.timelist"
                                        type="daterange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                                        </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <template v-if="showAll">
                            </template>
                    <el-col :span="6">
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                            <el-button icon="el-icon-refresh-right" @click="reset()">重置</el-button>
                                <el-button type="text" icon="el-icon-arrow-down" @click="showAll=true" v-if="!showAll">
                                    展开
                                </el-button>
                                <el-button type="text" icon="el-icon-arrow-up" @click="showAll=false" v-else>
                                    收起
                                </el-button>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-col :span="12">
                    <div class="border-box" style="height:39.5vh;">
                        <h4>设备不合格数占比</h4>
                        <div class="box-chart" style="height:94%">
                            <LeftChar  :chartData="equipmentFaultNumberData" :style="{'height':'100%'}"></LeftChar>
                        </div>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="border-box" style="height:39.5vh;">
                        <h4>设备故障率</h4>
                        <div class="box-chart" style="height:94%">
                            <RightChar :chartData="equipmentFaultRateData" :style="{'height':'100%'}"></RightChar>
                        </div>
                    </div>
                </el-col>
            </el-row>

            <div class="JNPF-common-layout-main JNPF-flex-main">
                    <JNPF-table  v-loading="listLoading" :data="list" >
                            <el-table-column prop="bdEquipmentName" label="设备名称" width="0" align="left"/>
                            <el-table-column prop="equipmentFaultNumber" label="设备故障次数" width="0" align="left"/>
                            <el-table-column prop="equipmentSumNumber" label="设备检验总次数" width="0" align="left"/>
                            <el-table-column prop="equipmentFaultRate" label="设备故障率" width="0" align="left">
                                <template slot-scope="scope">
                                    {{scope.row.equipmentFaultRate}}%
                                </template>
                            </el-table-column>
                    </JNPF-table>
                    <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="initData" :pageSizes="customPageSizes"/>
            </div>
        </div>
    </div>
</template>

<script>
    import request from '@/utils/request'
    import RightChar from './rightChar.vue'
    import LeftChar from './leftChar.vue'

    export default {
        components: {RightChar,LeftChar},
        data() {
            return {
                showAll: false,
                customPageSizes:[10, 20, 50, 100],
                query: {
                    timelist:undefined,
                },
                list: [],
                listLoading: false,
                total: 0,
                listQuery: {
                    currentPage: 1,
                    pageSize: 10,
                },
                equipmentFaultRateData:{},
                equipmentFaultNumberData:{},
            }
        },
        computed: {
           
        },
        mounted(){
            this.initData();
        },
        created() {
             
        },
        methods: {
            initData(){
                this.getEquipmentData();//获取检测设备报表数据信息
            }, getEquipmentData(){
                let _query = {
                    ...this.listQuery,
                    ...this.query
                };
                request({
                    url: `/api/project/XjrPatrolplanBase/getPatrolEquipmentReportData`,
                    method: 'post',
                    data: _query
                }).then(res => {
                    let resultData=res.data;
                    let equipmentFaultNumberList=resultData.equipmentFaultNumberList;//设备对应故障次数（饼状图所属集合）
                    let equipmentNameList=  resultData.equipmentNameList;// 设备名称集合
                    let faultRateList=resultData.faultRateList;// 设备故障比率集合
                    let equipmentPageList=resultData.equipmentPageList;//报表数据

                    this.equipmentFaultNumberData={
                        "equipmentFaultNumberList":equipmentFaultNumberList
                    }; //饼状图
                    this.equipmentFaultRateData={  //柱状图
                        'equipmentNameList':equipmentNameList,
                        'faultRateList':faultRateList
                    };
                    //报表数据
                    this.list = equipmentPageList.list
                    this.total =equipmentPageList.pagination.total

                });
            }, search() {
                this.listQuery = {
                    currentPage: 1,
                    pageSize: 10,
                }
                this.initData()
            }, reset() {
                for (let key in this.query) {
                    this.query[key] = undefined
                }
                this.listQuery = {
                    currentPage: 1,
                    pageSize: 10,
                }
                this.initData()
            }
        }
    }
</script>
