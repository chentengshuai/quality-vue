<template>
    <div class="JNPF-common-layout">

        <div class="JNPF-common-layout-center">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                            <el-col :span="6">
                                <el-form-item label="设备类别名称">
                                        <el-input v-model="query.equipmentCategoryName" placeholder="请输入" clearable>  </el-input>
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
                                    <el-button type="text" icon="el-icon-download" @click="exportData()" >导出
                                    </el-button>
                                    <!-- <el-button type="text" icon="el-icon-delete" @click="handleBatchRemoveDel()" >批量删除
                                    </el-button> -->
                    </div>
                    <div class="JNPF-common-head-right">
                        <el-tooltip effect="dark" content="刷新" placement="top">
                            <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                                     @click="reset()"/>
                        </el-tooltip>
                        <screenfull isContainer/>
                    </div>
                </div>
                <JNPF-table v-loading="listLoading" :data="list" @sort-change='sortChange'  has-c @selection-change="handleSelectionChange">
                    <el-table-column prop="equipmentCategoryCode" label="设备类别编码" width="0" align="left"/>
                    <el-table-column prop="equipmentCategoryName" label="设备类别名称" width="0" align="left"/>
                    <el-table-column prop="enabledMark" label="是否启用" width="0" align="left">
                        <template slot-scope="scope">
                                <el-switch
                                    v-model="scope.row.enabledMark"
                                    active-value="1"
                                    inactive-value="0"
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
                query: {
                    equipmentCategoryName:undefined,
                },
                treeProps: {
                    children: 'children',
                    label: 'fullName',
                    value: 'id'
                },
                list: [],
                listLoading: true,
 multipleSelection: [],                    total: 0,
                listQuery: {
                        currentPage: 1,
                        pageSize: 20,
                    sort: "desc",
                    sidx: "",
                },
                formVisible: false,
                exportBoxVisible: false,
                columnList: [
                    {prop: 'equipmentCategoryName', label: '设备类别名称'},
                ],
            }
        },
        computed: {},
        created() {
                this.initData()
        },
        methods: {
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
                    url: `/api/project/BdEquipmentCategory/getList`,
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
                });
            },
            handleDel(id) {
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    type: 'warning'
                }).then(() => {
                    request({
                        url: `/api/project/BdEquipmentCategory/${id}`,
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
                handleSelectionChange(val) {
                    const res = val.map(item => item.id)
                    this.multipleSelection = res
                },
                handleBatchRemoveDel() {
                    if (!this.multipleSelection.length) {
                        this.$message({
                            type: 'error',
                            message: '请选择一条数据',
                            duration: 1500,
                        })
                        return
                    }
                    const ids = this.multipleSelection.join()
                    this.$confirm('您确定要删除这些数据吗, 是否继续？', '提示', {
                        type: 'warning'
                    }).then(() => {
                        request({
                            url: `/api/project/BdEquipmentCategory/batchRemove/${ids}`,
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
                    })
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
                    url: `/api/project/BdEquipmentCategory/Actions/Export`,
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
                    sidx: "",
                }
                this.initData()
            },  handleUpdateEnabledMark(row) {
                request({
                        url: '/api/project/BdEquipmentCategory/updateBdEquipmentCategoryEnable/'+ row.id,
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
