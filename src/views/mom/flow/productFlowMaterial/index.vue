<template>
    <div class="JNPF-common-layout">

        <div class="JNPF-common-layout-center">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                                                                <el-col :span="6">
                                <el-form-item label="物料产品ID">
                                        <el-input v-model="query.materialId" placeholder="请输入" clearable>  </el-input>
                                </el-form-item>
                            </el-col>
                        <el-col :span="6">
                                <el-form-item label="产品工序流程对应工序信息ID">
                                        <el-input v-model="query.productFlowProcessId" placeholder="请输入" clearable>  </el-input>
                                </el-form-item>
                            </el-col>
                        <el-col :span="6">
                                <el-form-item label="工序属性ID">
                                        <el-input v-model="query.productionProcessId" placeholder="请输入" clearable>  </el-input>
                                </el-form-item>
                            </el-col>
                        <template v-if="showAll">
                                    <el-col :span="6">
                                        <el-form-item label="使用数量">
                                                <el-input v-model="query.quantity" placeholder="请输入" clearable>  </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="备注">
                                                <el-input v-model="query.remark" placeholder="请输入" clearable>  </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="状态">
                                                <el-input v-model="query.status" placeholder="请输入" clearable>  </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="出库单ID">
                                                <el-input v-model="query.stockMoveId" placeholder="请输入" clearable>  </el-input>
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
                            <el-table-column prop="materialId" label="物料产品ID" width="0" align="left"
/>
                            <el-table-column prop="productFlowProcessId" label="产品工序流程对应工序信息ID" width="0" align="left"
/>
                            <el-table-column prop="productionProcessId" label="工序属性ID" width="0" align="left"
/>
                            <el-table-column prop="quantity" label="使用数量" width="0" align="left"
/>
                            <el-table-column prop="remark" label="备注" width="0" align="left"
/>
                            <el-table-column prop="status" label="状态" width="0" align="left"
/>
                            <el-table-column prop="stockMoveId" label="出库单ID" width="0" align="left"
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
                                materialId:undefined,
                                productFlowProcessId:undefined,
                                productionProcessId:undefined,
                                quantity:undefined,
                                remark:undefined,
                                status:undefined,
                                stockMoveId:undefined,
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
                    {prop: 'materialId', label: '物料产品ID'},
                    {prop: 'productFlowProcessId', label: '产品工序流程对应工序信息ID'},
                    {prop: 'productionProcessId', label: '工序属性ID'},
                    {prop: 'quantity', label: '使用数量'},
                    {prop: 'remark', label: '备注'},
                    {prop: 'status', label: '状态'},
                    {prop: 'stockMoveId', label: '出库单ID'},
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
                    url: `/api/project/Bd_product_flow_process_material/getList`,
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
                        url: `/api/project/Bd_product_flow_process_material/${id}`,
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
                    url: `/api/project/Bd_product_flow_process_material/Actions/Export`,
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
            }
        }
    }
</script>
