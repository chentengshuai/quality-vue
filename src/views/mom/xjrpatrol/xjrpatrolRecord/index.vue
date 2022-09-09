<template>
    <div class="JNPF-common-layout">

        <div class="JNPF-common-layout-center">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                            <el-col :span="6">
                                <el-form-item label="巡检计划编码">
                                        <el-input v-model="query.patrolPlanCode" placeholder="请输入" clearable>  </el-input>
                                </el-form-item>
                            </el-col>
                        <el-col :span="6">
                                <el-form-item label="巡检规则编码">
                                        <el-input v-model="query.patrolRulesCode" placeholder="请输入" clearable>  </el-input>
                                </el-form-item>
                            </el-col>
                        <el-col :span="6">
                                <el-form-item label="巡检规则名称">
                                        <el-input v-model="query.patrolRulesName" placeholder="请输入" clearable>  </el-input>
                                </el-form-item>
                            </el-col>
                        <template v-if="showAll">
                                    <el-col :span="6">
                                        <el-form-item label="处理人名称">
                                                <el-input v-model="query.patrolPlanHandleusername" placeholder="请输入" clearable>  </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="巡检单位">
                                                <el-select v-model="query.patrolUnit" placeholder="请选择"
                                                           clearable>
                                                    <el-option v-for="(item, index) in patrolUnitOptions" :key="index"
                                                               :label="item.fullName" :value="item.enCode"
                                                               :disabled="item.disabled"></el-option>
                                                </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="巡检计划状态">
                                                <el-select v-model="query.patrolPlanStatus" placeholder="请选择"
                                                           clearable>
                                                    <el-option v-for="(item, index) in patrolPlanStatusOptions" :key="index"
                                                               :label="item.fullName" :value="item.enCode"
                                                               :disabled="item.disabled"></el-option>
                                                </el-select>
                                        </el-form-item>
                                    </el-col>
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
            <div class="JNPF-common-layout-main JNPF-flex-main">
                <!-- <div class="JNPF-common-head">
                    <div>
                        <el-button type="primary" icon="el-icon-plus"  @click="addOrUpdateHandle()">新增
                        </el-button>
                    </div>
                    <div class="JNPF-common-head-right">
                        <el-tooltip effect="dark" content="刷新" placement="top">
                            <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                                     @click="reset()"/>
                        </el-tooltip>
                        <screenfull isContainer/>
                    </div>
                </div> -->
                <JNPF-table v-loading="listLoading" :data="list" @sort-change='sortChange' >
                            <el-table-column prop="patrolPlanCode" label="巡检计划编码" width="0" align="left"/>
                            <el-table-column prop="patrolRulesCode" label="巡检规则编码" width="0" align="left"/>
                            <el-table-column prop="patrolRulesName" label="巡检规则名称" width="0" align="left"/>
                            <el-table-column prop="patrolUnit" label="巡检单位" width="0" align="left"/>
                            <el-table-column prop="patrolPlanStarttime" label="计划开始时间" width="0" align="left"/>
                            <el-table-column prop="patrolPlanEndtime" label="计划结束时间" width="0" align="left"/>
                            <el-table-column prop="patrolPlanStatusName" label="巡检计划状态" width="0" align="left"/>
                            <el-table-column prop="patrolPlanHandleusername" label="处理人" width="0" align="left">
                                <template slot-scope="scope">
                                    {{scope.row.patrolPlanHandleusername}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="patrolRecordTime" label="巡检记录时间" width="0" align="left"/>
                        <el-table-column label="操作" fixed="right"
                                         width="150" >
                            <template slot-scope="scope">
                                     <el-button type="text" v-if="scope.row.patrolPlanStatus=='2'"
                                                   @click="addOrUpdateHandle(scope.row.id)" >编辑
                                        </el-button>
                                     
                                        <el-button type="text"  v-if="scope.row.patrolPlanStatus=='2'" @click="receivePatrolPlan(scope.row)" >
                                            退回
                                        </el-button> 
                                        <el-button type="text" @click="addOrUpdateHandle(scope.row.id,true)" >查看
                                        </el-button> 
                                                <!-- <el-button type="text" class="JNPF-table-delBtn"  @click="handleDel(scope.row.id)">删除
                                        </el-button> -->
                            </template>
                        </el-table-column>
                </JNPF-table>
                <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="initData"/>
            </div>
        </div>
        <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh"/>
        <ExportBox v-if="exportBoxVisible" ref="ExportBox" @download="download"/>
    </div>
</template>

<script>
    import request from '@/utils/request'
    import {getDictionaryDataSelector} from '@/api/systemData/dictionary'
    import JNPFForm from './Form'
    import ExportBox from './ExportBox'
    import {previewDataInterface} from '@/api/systemData/dataInterface'

    export default {
        components: {JNPFForm, ExportBox},
        data() {
            return {
                    showAll: false,
                query: {
                        patrolPlanCode:undefined,
                        patrolRulesCode:undefined,
                        patrolRulesName:undefined,
                        patrolUnit:undefined,
                        patrolPlanHandleusername:undefined,
                        patrolPlanStatus:undefined,
                },
                treeProps: {
                    children: 'children',
                    label: 'fullName',
                    value: 'id'
                },
                list: [],
                listLoading: true,
                    total: 0,
                listQuery: {
                        currentPage: 1,
                        pageSize: 20,
                    sort: "desc",
                    sidx: "patrolPlanCode",
                },
                formVisible: false,
                exportBoxVisible: false,
                columnList: [
                    {prop: 'patrolPlanCode', label: '巡检计划编码'},
                    {prop: 'patrolRulesCode', label: '巡检规则编码'},
                    {prop: 'patrolRulesName', label: '巡检规则名称'},
                    {prop: 'patrolUnit', label: '巡检单位'},
                    {prop: 'patrolPlanStarttime', label: '计划开始时间'},
                    {prop: 'patrolPlanEndtime', label: '计划结束时间'},
                    {prop: 'patrolPlanHandleusername', label: '处理人名称'},
                    {prop: 'patrolPlanHandleuser', label: '计划处理人id'},
                    {prop: 'patrolPlanStatus', label: '巡检计划状态'},
                    {prop: 'patrolRecordTime', label: '巡检记录时间'},
                ],
                patrolUnitOptions:[],
                patrolUnitProps:{"label":"fullName","value":"id"},
                patrolPlanStatusOptions:[],
                patrolPlanStatusProps:{"label":"fullName","value":"id"},
            }
        },
        computed: {},
        created() {
                this.initData()
                    this.getpatrolUnitOptions();
                    this.getpatrolPlanStatusOptions();
        },
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
                    },
            sortChange({column, prop, order}) {
                this.listQuery.sort = order == 'ascending' ? 'asc' : 'desc'
                this.listQuery.sidx = !order ? '' : prop
                this.initData()
            },
            initData() {
                this.listLoading = true;
                let _query = {
                    ...this.listQuery,
                    ...this.query
                };
                request({
                    url: `/api/project/XjrPatrolplanBase/getPatrolplanRecordPageList`,
                    method: 'post',
                    data: _query
                }).then(res => {
                    var _list =[];
                    for(let i=0;i<res.data.list.length;i++){
                        let _data = res.data.list[i];
                        _list.push(_data)
                    }
                    this.list = _list
                        this.total = res.data.pagination.total

                    this.listLoading = false
                })
            },
            handleDel(id) {
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    type: 'warning'
                }).then(() => {
                    request({
                        url: `/api/project/XjrPatrolplanBase/${id}`,
                        method: 'DELETE'
                    }).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.msg,
                            onClose: () => {
                                this.initData()
                            }
                        });
                    })
                }).catch(() => {
                });
            },
            addOrUpdateHandle(id, isDetail) {
                this.formVisible = true
                this.$nextTick(() => {
                    this.$refs.JNPFForm.init(id, isDetail)
                })
            },
            exportData() {
                this.exportBoxVisible = true
                this.$nextTick(() => {
                    this.$refs.ExportBox.init(this.columnList)
                })
            },
            download(data) {
                let query = {...data, ...this.listQuery, ...this.query}
                request({
                    url: `/api/project/XjrPatrolplanBase/Actions/Export`,
                    method: 'GET',
                    data: query
                }).then(res => {
                    if (!res.data.url) return
                    window.location.href = this.define.comUrl + res.data.url
                    this.$refs.ExportBox.visible = false
                    this.exportBoxVisible = false
                })
            },
            search() {
                this.listQuery = {
                        currentPage: 1,
                        pageSize: 20,
                    sort: "desc",
                    sidx: "patrolPlanCode",
                }
                this.initData()
            },
            refresh(isrRefresh) {
                this.formVisible = false
                if (isrRefresh) this.reset()
            },
            reset() {
                for (let key in this.query) {
                    this.query[key] = undefined
                }
                this.listQuery = {
                        currentPage: 1,
                        pageSize: 20,
                    sort: "desc",
                    sidx: "patrolPlanCode",
                }
                this.initData()
            }, receivePatrolPlan(val){
                this.$confirm("确定要退回此计划吗？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    }).then(() => {
                        request({
                        url: `/api/project/XjrPatrolplanBase/backPatrolPlan/`+val.id,
                        method: "PUT",
                        }).then((res) => {
                            this.$message({
                            type: 'success',
                            message: "退回成功",
                                onClose: () => {
                                    this.initData()
                                }
                            });
                        });
                });
            }
        }
    }
</script>
