<template>
    <div class="JNPF-common-layout">
                <div class="JNPF-common-layout-left">
                        <div class="JNPF-common-title">
                            <h2>工厂定义</h2>
                        </div>
                   <el-tree :data="treeData" :props="treeProps" default-expand-all highlight-current
                             ref="treeBox" :expand-on-click-node="false" @node-click="handleNodeClick"
                             class="JNPF-common-el-tree" node-key="id">
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                            <i :class="data.icon"></i>
                            <span class="text">{{node.label}}</span>
                        </span>
                    </el-tree>
                </div>

        <div class="JNPF-common-layout-center">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                                                                <el-col :span="6">
                                <el-form-item label="生产单元编码">
                                        <el-input v-model="query.produceUnitCode" placeholder="请输入" clearable>  </el-input>
                                </el-form-item>
                            </el-col>
                        <el-col :span="6">
                                <el-form-item label="生产单元名称">
                                        <el-input v-model="query.produceUnitName" placeholder="请输入" clearable>  </el-input>
                                </el-form-item>
                            </el-col>
                        <!-- <el-col :span="6">
                                <el-form-item label="生产单元类型">
                                        <el-select v-model="query.produceUnitType" placeholder="请选择"
                                                   clearable>
                                            <el-option v-for="(item, index) in produceUnitTypeOptions" :key="index"
                                                       :label="item.fullName" :value="item.id"
                                                       :disabled="item.disabled"></el-option>
                                        </el-select>
                                </el-form-item>
                            </el-col> -->
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
                            <el-table-column prop="produceUnitCode" label="生产单元编码" width="0" align="left"/>
                            <el-table-column prop="produceUnitName" label="生产单元名称" width="0" align="left"/>
                            <el-table-column prop="produceUnitTypeName" label="生产单元类型" width="0" align="left"/>
                            <el-table-column prop="produceUnitDutyPersonName" label="生产单元负责人名称" width="0" align="left"/>
                            <el-table-column prop="enabledMark" label="是否启用" width="0" align="left">
                                <template slot-scope="scope">
                                <el-switch
                                    v-model="scope.row.enabledMark"
                                    :active-value="1"
                                    :inactive-value="0"
                                    @change="handleUpdateEnabledMark(scope.row)">
                                </el-switch>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" fixed="right"
                                         width="100" >
                            <template slot-scope="scope">
                                <el-button type="text"
                                            @click="addOrUpdateHandle(scope.row.id)" >编辑
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
                    produceUnitCode:undefined,
                    produceUnitName:undefined,
                    produceUnitType:undefined,
                    produceUnitParentId:undefined,
                    produceUnitDutyPersonId:undefined,
                    produceUnitTypeName:undefined,
                    produceUnitDutyPersonName:undefined,
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
                    sidx: "",
                },
                formVisible: false,
                exportBoxVisible: false,
                columnList: [
                    {prop: 'produceUnitCode', label: '生产单元编码'},
                    {prop: 'produceUnitName', label: '生产单元名称'},
                    {prop: 'produceUnitType', label: '生产单元类型'},
                    {prop: 'produceUnitParentId', label: '上级生产单元'},
                    {prop: 'produceUnitDutyPersonId', label: '负责人'},
                    {prop: 'produceUnitTypeName', label: '生产单元类型名称'},
                    {prop: 'produceUnitDutyPersonName', label: '生产单元负责人名称'},
                ],
                    treeData: [],
                    treeActiveId: '',
                            produceUnitTypeOptions:[],
                            produceUnitTypeProps:{"label":"fullName","value":"id"},
                            produceUnitParentIdProps:{"label":"fullName","value":"id"},
            }
        },
        computed: {},
        created() {
                this.getTreeView();
                this.getproduceUnitTypeOptions();
        },
        methods: {
                    getproduceUnitTypeOptions() {
                        getDictionaryDataSelector('334623609026774277').then(res => {
                            this.produceUnitTypeOptions = res.data.list
                        })
                    },
            sortChange({column, prop, order}) {
                this.listQuery.sort = order == 'ascending' ? 'asc' : 'desc'
                this.listQuery.sidx = !order ? '' : prop
                this.initData()
            },
                getTreeView() { //获取左边树状数据
                        request({
                            url: `/api/project/BdFactoryUnit/tree`,
                            method: 'get',
                            data:""
                        }).then(res => {
                            this.treeData = res.data
                            this.initData()
                        });
                },
                handleNodeClick(data) {
                    this.treeActiveId = data.id
                    for(let key in this.query){
                        this.query[key] = undefined
                    }
                    this.query.produceUnitParentId = data.id
                    this.listQuery = {
                        currentPage: 1,
                        pageSize: 20,
                        sort: "desc",
                        sidx: "",
                    }
                    this.initData()
                },
            initData() {
                this.listLoading = true;
                let _query = {
                    ...this.listQuery,
                    ...this.query
                };
                request({
                    url: `/api/project/BdFactoryUnit/getList`,
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
                        url: `/api/project/BdFactoryUnit/${id}`,
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
                    url: `/api/project/BdFactoryUnit/Actions/Export`,
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
                    sidx: "",
                }
                this.initData()
            },
            refresh(isrRefresh) {
                this.formVisible = false
                if (isrRefresh) {
                    this.reset();
                }
            },
            reset() {
                for (let key in this.query) {
                    this.query[key] = undefined
                }
                this.listQuery = {
                        currentPage: 1,
                        pageSize: 20,
                    sort: "desc",
                    sidx: "",
                }
                this.getTreeView();
            },  handleUpdateEnabledMark(row) {
                request({
                        url: '/api/project/BdFactoryUnit/updateEnable/'+ row.id,
                        method: 'PUT'
                    }).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.msg,
                            duration: 1000,
                            onClose: () => {
                                this.initData();
                            }
                        });
                })
            },
        }
    }
</script>
