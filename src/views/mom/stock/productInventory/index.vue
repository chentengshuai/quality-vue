<template>
    <div class="JNPF-common-layout">

        <div class="JNPF-common-layout-center">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                                                                <el-col :span="6">
                                <el-form-item label="盘点期间">
                                        <el-input v-model="query.periodCode" placeholder="请输入" clearable>  </el-input>
                                </el-form-item>
                            </el-col>
                        <el-col :span="6">
                                <el-form-item label="盘点类型">
                                        <el-select v-model="query.takeInventoryCode" placeholder="请选择"
                                                   clearable>
                                            <el-option v-for="(item, index) in takeInventoryCodeOptions" :key="index"
                                                       :label="item.fullName" :value="item.enCode"
                                                       :disabled="item.disabled"></el-option>
                                        </el-select>
                                </el-form-item>
                            </el-col>
                        <el-col :span="6">
                                <el-form-item label="盘点日期">
                                        <el-date-picker v-model="query.takeInventoryDate" type="daterange"
                                                        value-format="timestamp" format="yyyy-MM-dd" start-placeholder="开始日期"
                                                        end-placeholder="结束日期" >
                                        </el-date-picker>
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
                            <el-table-column prop="periodCode" label="盘点期间" width="0" align="left"/>
                            <el-table-column label="盘点类型" width="0" prop="takeInventoryName" algin="left"/>
                            <el-table-column prop="takeInventoryUserName" label="盘点人员" width="0" align="left"/>
                            <el-table-column prop="takeInventoryDate" label="盘点日期" width="0" align="left"/>
                            <el-table-column prop="theoreticalInventory" label="理论库存总量" width="0" align="left"/>
                            <el-table-column prop="actualInventory" label="实际库存总量" width="0" align="left"/>
                            <el-table-column prop="remarks" label="备注" width="0" align="left"/>
                            <el-table-column prop="state" label="盘点状态" width="0" align="left">
                                <template slot-scope="scope">
                                    <el-tag type="warning"  v-if="scope.row.state == '0'">未盘点</el-tag>
                                    <el-tag type="success"  v-else-if="scope.row.state == '1'">已盘点</el-tag>
                                </template>
                            </el-table-column>
                        <el-table-column label="操作" fixed="right"
                                         width="100" >
                            <template slot-scope="scope">
                                        <el-button type="text" v-if="scope.row.state == '0'" @click="addOrUpdateHandle(scope.row.id)" >编辑
                                        </el-button>
                                        <el-button type="text" v-if="scope.row.state == '0'" @click="handleCommit(scope.row.id,'submit')">提交
                                        </el-button>
                                        <el-button type="text" v-if="scope.row.state == '1'" @click="addOrUpdateHandle(scope.row.id,'look')" >详情
                                        </el-button>
                                        <el-button type="text" v-if="scope.row.state == '1'" @click="handleCommit(scope.row.id,'revoke')">撤回
                                        </el-button>
                                        <el-button type="text" v-if="scope.row.state == '0'" class="JNPF-table-delBtn"  @click="handleDel(scope.row.id)">删除
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
    import {getDictionaryDataSelector,getDictionaryDataByTypeCode} from '@/api/systemData/dictionary'
    import JNPFForm from './Form'
    import ExportBox from './ExportBox'
    import {previewDataInterface} from '@/api/systemData/dataInterface'

    export default {
        components: {JNPFForm, ExportBox},
        data() {
            return {
                query: {
                                periodCode:undefined,
                                takeInventoryCode:undefined,
                                takeInventoryDate:undefined,
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
                    {prop: 'periodCode', label: '盘点期间'},
                    {prop: 'takeInventoryCode', label: '盘点类型'},
                    {prop: 'takeInventoryUserId', label: '盘点人员'},
                    {prop: 'takeInventoryDate', label: '盘点日期'},
                    {prop: 'theoreticalInventory', label: '理论库存总量'},
                    {prop: 'actualInventory', label: '实际库存总量'},
                    {prop: 'remarks', label: '备注'},
                ],
                                takeInventoryCodeOptions:[],
                            takeInventoryCodeProps:{"label":"fullName","value":"enCode"},
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
                    url: `/api/project/ProductTakeInventory/getList`,
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
                getDictionaryDataByTypeCode("inventoryType").then(res => {
                    this.takeInventoryCodeOptions = res.data
                });
            },
            handleDel(id) {
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    type: 'warning'
                }).then(() => {
                    request({
                        url: `/api/project/ProductTakeInventory/${id}`,
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
                    url: `/api/project/ProductTakeInventory/Actions/Export`,
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
            },
            handleCommit(id, action) {
                let msg = "";
                if(action == "submit"){
                    msg = "确认提交?";
                }else if(action == "revoke"){
                    msg = "确认撤回?";
                }
                this.$confirm(msg, '提示', {
                    type: 'warning'
                }).then(() => {
                    request({
                        url: `/api/project/ProductTakeInventory/commit/${id}/${action}`,
                        method: 'PUT'
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
        }
    }
</script>
