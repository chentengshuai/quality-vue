<template>
    <div class="JNPF-common-layout">

        <div class="JNPF-common-layout-center">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                                                                <el-col :span="6">
                                <el-form-item label="业务伙伴编码">
                                        <el-input v-model="query.partnerCode" placeholder="请输入" clearable>  </el-input>
                                </el-form-item>
                            </el-col>
                        <el-col :span="6">
                                <el-form-item label="业务伙伴名称">
                                        <el-input v-model="query.partnerName" placeholder="请输入" clearable>  </el-input>
                                </el-form-item>
                            </el-col>
                        <el-col :span="6">
                                <el-form-item label="业务伙伴类型">
                                        <el-input v-model="query.partnerType" placeholder="请输入" clearable>  </el-input>
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
                                    <el-button  v-if="false" type="primary" icon="el-icon-plus"  @click="addOrUpdateHandle()">新增
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
                <JNPF-table v-loading="listLoading" :data="list" @expand-change="expandChange" @sort-change='sortChange'
                                   @selection-change="selectionChange" hasC>
                        <el-table-column type="expand" width="40">
                            <template slot-scope="props">
                            <el-tabs v-model="props.row.activeName">
                                <el-tab-pane label="模板明细">
                                <el-table :data="props.row.childTable" stripe size='mini'
                                            :element-loading-text="$t('common.loadingText')">
                                    <el-table-column type="index" width="50" label="序号" align="center"/>
                                    <el-table-column prop="templateName" label="模板名称"/>
                                    <el-table-column prop="templateTypeName" label="模板类型"/>
                                    <el-table-column prop="templatePath" label="模板路径"/>
                                </el-table>
                                </el-tab-pane>
                            </el-tabs>
                            </template>
                        </el-table-column>
                            <el-table-column prop="partnerCode" label="业务伙伴编码" width="0" align="left"/>
                            <el-table-column prop="partnerName" label="业务伙伴名称" width="0" align="left"/>
                            <el-table-column prop="partnerType" label="业务伙伴类型" width="0" align="left"/>
                        <el-table-column label="操作" fixed="right"
                                         width="100" >
                            <template slot-scope="scope">
                                        <el-button type="text"
                                                   @click="addOrUpdateHandle(scope.row.id)" >编辑
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
                                partnerCode:undefined,
                                partnerName:undefined,
                                partnerType:undefined,
                                isCustomer: true,
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
                    {prop: 'partnerCode', label: '业务伙伴编码'},
                    {prop: 'partnerName', label: '业务伙伴名称'},
                    {prop: 'partnerType', label: '业务伙伴类型'},
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
                    url: `/api/project/Partner/getList`,
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
                    for (let i = 0; i < this.list.length; i++) {
                      this.$set(this.list[i], 'isExpanded', false)
                      this.$set(this.list[i], 'activeName', '0')
                      this.$set(this.list[i], 'childTable', [])
                    }
                    this.listLoading = false
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
                    url: `/api/project/Partner/Actions/Export`,
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
                this.query.partnerCode = undefined
                this.query.partnerName = undefined
                this.query.partnerType = undefined
                this.listQuery = {
                        currentPage: 1,
                        pageSize: 20,
                    sort: "desc",
                    sidx: "",
                }
                this.initData()
            },
            selectionChange(list) {
              debugger
              this.ids = list.map((x) => x.id).join(',')
              console.log('ids' + this.ids)
            },
            expandChange(rows) {
              rows.isExpanded = !rows.isExpanded
              if (!rows.isExpanded) return
              if (rows.childTable.length) return
              request({
                url: `/api/project/PartnerPrintTemplate/${rows.id}/Items`,
                method: 'get'
              }).then(res => {
                rows.childTable = res.data
              })
            },
        }
    }
</script>
