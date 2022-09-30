<template>
    <div class="JNPF-common-layout">

        <div class="JNPF-common-layout-center">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                                                                <el-col :span="6">
                                <el-form-item label="规则编号">
                                        <el-input v-model="query.ruleCode" placeholder="请输入" clearable>  </el-input>
                                </el-form-item>
                            </el-col>
                        <el-col :span="6">
                                <el-form-item label="规则名称">
                                        <el-input v-model="query.ruleName" placeholder="请输入" clearable>  </el-input>
                                </el-form-item>
                            </el-col>
                        <el-col :span="6">
                                <el-form-item label="物料名称">
                                        <el-input v-model="query.materialName" placeholder="请输入" clearable>  </el-input>
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
                            <el-table-column prop="ruleCode" label="规则编号" width="0" align="left"
/>
                            <el-table-column prop="ruleName" label="规则名称" width="0" align="left"
/>
                            <el-table-column prop="inspectionType" label="检验单类型" width="0" align="left">
                                <template slot-scope="scope">
                                    {{ scope.row.inspectionType | dynamicText(inspectionTypeOptions) }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="materialName" label="物料名称" width="0" align="left"
/>
                            <el-table-column prop="standardName" label="检验基准" width="0" align="left"
/>
                            <el-table-column prop="detectionFrequency" label="检测频次" width="0" align="left">
                                <template slot-scope="scope">
                                    {{ scope.row.detectionFrequency | dynamicText(frequencyOptions) }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="enabledFlag" label="是否启用" width="0" align="left">
                                <!-- <template slot-scope="scope" v-if="scope.row.enabledFlag == '1'">
                                    启用
                                </template>
                                <template slot-scope="scope" v-if="scope.row.enabledFlag == '0'">
                                    停用
                                </template> -->
                                <template slot-scope="scope">
                                    <el-tag type="warning" v-if="scope.row.enabledFlag == 0"
                                        >停用</el-tag
                                    >
                                    <el-tag type="success" v-else-if="scope.row.enabledFlag == 1"
                                        >启用</el-tag
                                    >
                                </template>
                            </el-table-column>
                            <el-table-column prop="startTime" label="开始时间" width="0" align="left"
/>
                            <el-table-column prop="endTime" label="结束时间" width="0" align="left"
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
                query: {
                                ruleCode:undefined,
                                ruleName:undefined,
                                materialName:undefined,
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
                    {prop: 'ruleCode', label: '规则编号'},
                    {prop: 'ruleName', label: '规则名称'},
                    {prop: 'inspectionType', label: '检验单类型'},
                    {prop: 'materialName', label: '物料名称'},
                    {prop: 'standardName', label: '检验基准'},
                    {prop: 'detectionFrequency', label: '检测频次'},
                    {prop: 'enabledFlag', label: '是否启用'},
                    {prop: 'startTime', label: '开始时间'},
                    {prop: 'endTime', label: '结束时间'},
                ],
                inspectionTypeOptions:[{"fullName":"来料检验","id":1},{"fullName":"成品检验","id":2},{"fullName":"半成品检验","id":3}
                ,{"fullName":"库存检验","id":4},{"fullName":"发货检验","id":5}],
                frequencyOptions:[{"fullName":"天","id":1},{"fullName":"周","id":2},{"fullName":"月","id":3}
                ,{"fullName":"年","id":4}],
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
                    url: `/api/project/QualityInspectionRule/getList`,
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
                        url: `/api/project/QualityInspectionRule/${id}`,
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
                    url: `/api/project/QualityInspectionRule/Actions/Export`,
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
