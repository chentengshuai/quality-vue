<template>
    <div class="JNPF-common-layout">

        <div class="JNPF-common-layout-center">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                            <el-col :span="6">
                                <el-form-item label="质检时间">
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
                                <!-- <el-button type="text" icon="el-icon-arrow-down" @click="showAll=true" v-if="!showAll">
                                    展开
                                </el-button>
                                <el-button type="text" icon="el-icon-arrow-up" @click="showAll=false" v-else>
                                    收起
                                </el-button> -->
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-col :span="12">
                    <div class="border-box" style="height:39.5vh;">
                        <h4>检验规则计划完成率(%)</h4>
                        <div class="box-chart" style="height:94%">
                            <LeftChar  :chartData="patrolPlanFinishRateData" :style="{'height':'100%'}"></LeftChar>
                        </div>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="border-box" style="height:39.5vh;">
                        <h4>检验规则计划数据</h4>
                        <div class="box-chart" style="height:94%">
                            <RightChar :chartData="patrolPlanData" :style="{'height':'100%'}"></RightChar>
                        </div>
                    </div>
                </el-col>
            </el-row>

            <div class="JNPF-common-layout-main JNPF-flex-main">
                    <JNPF-table  v-loading="listLoading" :data="list" >
                            <el-table-column prop="ruleCode" label="检验规则编码" width="0" align="left"/>
                            <el-table-column prop="ruleName" label="检验规则名称" width="0" align="left"/>
                            <el-table-column prop="planSumNumber" label="检验规则计划总数" width="0" align="left"/>
                            <el-table-column prop="planFinishNumber" label="检验规则计划完成数量" width="0" align="left"/>
                            <el-table-column prop="planNotFinishNumber" label="检验规则计划未完成数量" width="0" align="left"/>
                                <!-- <template slot-scope="scope" >
                                    <el-link type="primary" @click.native="rulesUnPatrolView(scope.row)"> {{scope.row.patrolPlanNotFinishNumber}}</el-link>
                                </template>
                            </el-table-column> -->
                            <el-table-column prop="planFinishRate" label="检验规则计划完成率" width="0" align="left">
                                <template slot-scope="scope">
                                    {{scope.row.planFinishRate}}%
                                </template>
                            </el-table-column>
                    </JNPF-table>
                    <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="initData" :pageSizes="customPageSizes"/>
            </div>
        </div>
        <!-- <el-dialog title="查看检验规则计划未完成详情"
                     :close-on-click-modal="false" append-to-body
                     :visible.sync="rulesUnPatrolLisShow" class="JNPF-dialog JNPF-dialog_center" lock-scroll
                     width="1200px">
            <rules-un-patrol-list ref="RulesUnPatrolList"></rules-un-patrol-list>
        </el-dialog>  -->
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
                rulesUnPatrolLisShow:false,
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
                patrolPlanData:{},
                patrolPlanFinishRateData:{},
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
            }, 
            getEquipmentData(){
                let _query = {
                    ...this.listQuery,
                    ...this.query
                };
                request({
                    url: `/api/project/QualityInspectionRule/getInspectionPlanReportList`,
                    method: 'post',
                    data: _query
                }).then(res => {
                    let resultData=res.data;
                    let patrolPlanFinishRateList=resultData.patrolPlanFinishRateList;// 检验规则检验计划达成率（饼状图所属集合）
                    let patrolPlanData=  resultData.patrolPlanData;//检验计划数据
                    let patrolplanReportPag=resultData.patrolplanReportPag;// 获取设备检验规则数据
                    this.patrolPlanFinishRateData={
                        "patrolPlanFinishRateList":patrolPlanFinishRateList
                    }; //饼状图
                    this.patrolPlanData={
                        'patrolPlanNameList':patrolPlanData.patrolPlanNameList,
                        'patrolPlanSumNumberList':patrolPlanData.patrolPlanSumNumberList,
                        'patrolPlanFinishNumberList':patrolPlanData.patrolPlanFinishNumberList
                    }; //柱状图
                    //报表数据
                    this.list = patrolplanReportPag.list
                    this.total =patrolplanReportPag.pagination.total

                });
            }, 
            search() {
                this.listQuery = {
                    currentPage: 1,
                    pageSize: 10,
                }
                this.initData()
            }, 
            reset() {
                for (let key in this.query) {
                    this.query[key] = undefined
                }
                this.listQuery = {
                    currentPage: 1,
                    pageSize: 10,
                }
                this.initData()
            }, 
        }
    }
</script>
