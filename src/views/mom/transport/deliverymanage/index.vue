<template>
    <div class="JNPF-common-layout">

        <div class="JNPF-common-layout-center">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                                                                <el-col :span="6">
                                <el-form-item label="发货编码">
                                        <el-input v-model="query.bdDeliveryCode" placeholder="请输入" clearable>  </el-input>
                                </el-form-item>
                            </el-col>
                        <el-col :span="6">
                                <el-form-item label="发货名称">
                                        <el-input v-model="query.bdDeliveryName" placeholder="请输入" clearable>  </el-input>
                                </el-form-item>
                            </el-col>
                        <el-col :span="6">
                                <el-form-item label="出库单号">
                                        <el-input v-model="query.stockMoveCode" placeholder="请输入" clearable>  </el-input>
                                </el-form-item>
                            </el-col>
                        <template v-if="showAll">
                                    <el-col :span="6">
                                        <el-form-item label="到货日期">
                                                <el-date-picker v-model="query.arrivalDate" type="datetimerange"
                                                                value-format="timestamp" format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期"
                                                                end-placeholder="结束日期" >
                                                </el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="始发地名称">
                                                <el-input v-model="query.originPlaceName" placeholder="请输入" clearable>  </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="目的地名称">
                                                <el-input v-model="query.aimPlaceName" placeholder="请输入" clearable>  </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="始发地">
                                                <JNPF-Address  v-model="query.originPlaceCode" placeholder="请选择" :level="0"
                                                               clearable/>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="目的地">
                                                <JNPF-Address  v-model="query.aimPlaceCode" placeholder="请选择" :level="0"
                                                               clearable/>
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
                <div class="JNPF-common-head">
                    <div>
                                    <el-button type="primary" icon="el-icon-plus"  @click="addOrUpdateHandle()">新增
                                    </el-button>
                                    <!-- <el-button type="text" icon="el-icon-download" @click="exportData()" >导出
                                    </el-button>
                                    <el-button type="text" icon="el-icon-delete" @click="handleBatchRemoveDel()" >批量删除
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
                            <el-table-column prop="bdDeliveryCode" label="发货编码" width="0" align="left"
/>
                            <el-table-column prop="bdDeliveryName" label="发货名称" width="0" align="left"
/>
                            <el-table-column prop="stockMoveId" label="出库单id" width="0" align="left"
/>
                            <el-table-column prop="stockMoveCode" label="出库单号" width="0" align="left"
/>
                            <el-table-column prop="originPlaceCode" label="始发地" width="0" align="left"
/>
                            <el-table-column prop="originPlaceName" label="始发地名称" width="0" align="left"
/>
                            <el-table-column prop="aimPlaceCode" label="目的地" width="0" align="left"
/>
                            <el-table-column prop="aimPlaceName" label="目的地名称" width="0" align="left"
/>
                            <el-table-column prop="arrivalDate" label="到货日期" width="0" align="left"
/>
                            <el-table-column prop="stockGrossWeight" label="出库单总毛重" width="0" align="left"
/>
                        <el-table-column label="操作" fixed="right"
                                         width="100" >
                            <template slot-scope="scope">
                                        <el-button type="text"
                                                   @click="addOrUpdateHandle(scope.row.id)" >编辑
                                        </el-button>
                                        <el-button type="text" class="JNPF-table-delBtn"  @click="handleDel(scope.row.id)">删除
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
                    showAll: false,
                query: {
                                bdDeliveryCode:undefined,
                                bdDeliveryName:undefined,
                                stockMoveCode:undefined,
                                arrivalDate:undefined,
                                originPlaceName:undefined,
                                aimPlaceName:undefined,
                                originPlaceCode:undefined,
                                aimPlaceCode:undefined,
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
                    sidx: "bdDeliveryCode",
                },
                formVisible: false,
                exportBoxVisible: false,
                columnList: [
                    {prop: 'bdDeliveryCode', label: '发货编码'},
                    {prop: 'bdDeliveryName', label: '发货名称'},
                    {prop: 'stockMoveId', label: '出库单id'},
                    {prop: 'stockMoveCode', label: '出库单号'},
                    {prop: 'originPlaceCode', label: '始发地'},
                    {prop: 'originPlaceName', label: '始发地名称'},
                    {prop: 'aimPlaceCode', label: '目的地'},
                    {prop: 'aimPlaceName', label: '目的地名称'},
                    {prop: 'arrivalDate', label: '到货日期'},
                    {prop: 'stockGrossWeight', label: '出库单总毛重'},
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
                    url: `/api/project/DmDeliveryManage/getList`,
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
                        url: `/api/project/DmDeliveryManage/${id}`,
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
                            url: `/api/project/DmDeliveryManage/batchRemove/${ids}`,
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
                    url: `/api/project/DmDeliveryManage/Actions/Export`,
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
                    sidx: "bdDeliveryCode",
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
                    sidx: "bdDeliveryCode",
                }
                this.initData()
            }
        }
    }
</script>
