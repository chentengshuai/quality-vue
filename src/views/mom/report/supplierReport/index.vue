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
                    <el-col :span="24">
                        <div  style="height:29.5vh;">
                            <h4>供应商来料报表</h4>
                            <div class="box-chart" style="height:96%">
                                <SupplierMaterial :chartData="supplierMaterialData" ></SupplierMaterial>
                            </div>
                        </div>
                    </el-col>
            </el-row>
            
            <div class="JNPF-common-layout-main JNPF-flex-main">
                    <JNPF-table  v-loading="listLoading" :data="list" >
                            <el-table-column prop="bdPartnerName" label="供应商名称" width="0" align="left"/>
                            <el-table-column prop="badNumber" label="不良总数" width="0" align="left"/>
                            <el-table-column prop="badRateNumber" label="不良率" width="0" align="left"/>
                            <el-table-column prop="qualifiedRateNumber" label="合格率" width="0" align="left">
                                <template slot-scope="scope">
                                    {{scope.row.qualifiedRateNumber}}
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
    import SupplierMaterial from './supplierMaterial.vue'

    export default {
        components: {SupplierMaterial},
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
                supplierMaterialData:{},
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
                this.getSupplierMaterialReportData();//获取图形数据信息
                this.getSupplierMaterialReportPage();//获取列表数据信息
            }, getSupplierMaterialReportData(){
                let _query = {
                    ...this.listQuery,
                    ...this.query
                };
                request({
                    url: `/api/project/Partner/getSupplierMaterialReport`,
                    method: 'post',
                    data: _query
                }).then(res => {
                    this.supplierMaterialData=res.data;
                })
            },getSupplierMaterialReportPage(){
                let _query = {
                    ...this.listQuery,
                    ...this.query
                };
                request({
                    url: `/api/project/Partner/getSupplierMaterialReportPage`,
                    method: 'post',
                    data: _query
                }).then(res => {
                    let resultData=res.data;
                    //报表数据
                    this.list = resultData.list
                    this.total =resultData.pagination.total
                })
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
