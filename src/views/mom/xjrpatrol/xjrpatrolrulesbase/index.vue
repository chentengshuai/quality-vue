<template>
    <div class="JNPF-common-layout">

        <div class="JNPF-common-layout-center">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                                                                <el-col :span="6">
                                <el-form-item label="巡检规则编码">
                                        <el-input v-model="query.patrolRulesCode" placeholder="请输入" clearable>  </el-input>
                                </el-form-item>
                            </el-col>
                        <el-col :span="6">
                                <el-form-item label="规则名称">
                                        <el-input v-model="query.patrolRulesName" placeholder="请输入" clearable>  </el-input>
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
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                            <el-button icon="el-icon-refresh-right" @click="reset()">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
                <div class="JNPF-common-head">
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
                </div>
                <JNPF-table v-loading="listLoading" :data="list" @sort-change='sortChange' >
                            <el-table-column prop="patrolRulesCode" label="巡检规则编码" width="0" align="left"/>
                            <el-table-column prop="patrolRulesName" label="规则名称" width="0" align="left"/>
                            <el-table-column prop="patrolUnit" label="巡检单位" width="0" align="left"/>
                            <el-table-column prop="memo" label="备注" width="0" align="left"/>
                            <el-table-column prop="patrolplanNextTime" label="产生巡检计划时间" width="0" align="left"/>
                            <el-table-column prop="patrolRulesStatusName" label="状态" width="0" align="left"/>

                        <el-table-column label="操作" fixed="right"
                                         width="200" >
                            <template slot-scope="scope">
                                        <el-button type="text" @click="viewHandle(scope.row.id,true)" >查看
                                        </el-button>
                                        <el-button type="text" @click="addOrUpdateHandle(scope.row.id)" >编辑
                                        </el-button>
                                        <el-button type="text"  v-if="scope.row.patrolRulesStatus=='1'"  @click="updateStatus(scope.row)">禁用
                                        </el-button>
                                        <el-button type="text"  v-if="scope.row.patrolRulesStatus=='0'"  @click="updateStatus(scope.row)">启用
                                        </el-button>
                                        <el-button type="text"   v-if="scope.row.patrolRulesStatus=='0'" class="JNPF-table-delBtn"  @click="handleDel(scope.row.id)">删除
                                        </el-button>
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
                query: {
                                patrolRulesCode:undefined,
                                patrolRulesName:undefined,
                                patrolUnit:undefined,
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
                    sidx: "patrolRulesCode",
                },
                formVisible: false,
                exportBoxVisible: false,
                columnList: [
                    {prop: 'patrolRulesCode', label: '巡检规则编码'},
                    {prop: 'patrolRulesName', label: '规则名称'},
                    {prop: 'patrolUnit', label: '巡检单位'},
                    {prop: 'memo', label: '备注'},
                ],
                            patrolUnitOptions:[],
                            patrolUnitProps:{"label":"fullName","value":"id"},
            }
        },
        computed: {},
        created() {
                this.initData()
                    this.getpatrolUnitOptions();
        },
        methods: {
                    getpatrolUnitOptions() {
                        getDictionaryDataSelector('336761078794945797').then(res => {
                            this.patrolUnitOptions = res.data.list
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
                    url: `/api/project/XjrPatrolrulesBase/getList`,
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
                        url: `/api/project/XjrPatrolrulesBase/${id}`,
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
            },updateStatus(val) {
                var tipMessga="";
                var patrolRulesStatus=val.patrolRulesStatus;
                if(patrolRulesStatus=='0'){
                    patrolRulesStatus='1';
                    tipMessga="启用";
                }else if(patrolRulesStatus=='1'){
                    patrolRulesStatus='0';
                    tipMessga="禁用";
                }
                this.$confirm("确定要"+tipMessga+"此项吗？", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                }).then(() => {
                    request({
                        url: `/api/project/XjrPatrolrulesBase/updateStatus/` + val.id+"/"+patrolRulesStatus,
                        method: "put",
                    }).then((res) => {
                        this.$message({
                            type: 'success',
                            message:tipMessga+"成功",
                            onClose: () => {
                                this.initData()
                            }
                        });
                    });
                });
            },
            addOrUpdateHandle(id, isDetail) {
                this.formVisible = true
                this.$nextTick(() => {
                    this.$refs.JNPFForm.init(id, isDetail)
                })
            }, viewHandle(id, isDetail) {
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
                    url: `/api/project/XjrPatrolrulesBase/Actions/Export`,
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
                    sidx: "patrolRulesCode",
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
                    sidx: "patrolRulesCode",
                }
                this.initData()
            }
        }
    }
</script>
