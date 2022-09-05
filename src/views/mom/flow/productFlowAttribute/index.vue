<template>
    <div class="JNPF-common-layout">

        <div class="JNPF-common-layout-center">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                                                                <el-col :span="6">
                                <el-form-item label="属性ID">
                                        <el-input v-model="query.attributeId" placeholder="请输入" clearable>  </el-input>
                                </el-form-item>
                            </el-col>
                        <el-col :span="6">
                                <el-form-item label="属性名称">
                                        <el-input v-model="query.attributeName" placeholder="请输入" clearable>  </el-input>
                                </el-form-item>
                            </el-col>
                        <el-col :span="6">
                                <el-form-item label="属性类型(勾选/单选/多选/颜色/日期/时间/数字/文字)">
                                        <el-input v-model="query.attributeType" placeholder="请输入" clearable>  </el-input>
                                </el-form-item>
                            </el-col>
                        <template v-if="showAll">
                                    <el-col :span="6">
                                        <el-form-item label="属性值">
                                                <el-input v-model="query.attributeVal" placeholder="请输入" clearable>  </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="并发戳">
                                                <el-input v-model="query.concurrencyStamp" placeholder="请输入" clearable>  </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="最大值">
                                                <el-input v-model="query.maxValue" placeholder="请输入" clearable>  </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="最小值">
                                                <el-input v-model="query.minValue" placeholder="请输入" clearable>  </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="产品工序流程对应工序信息ID">
                                                <el-input v-model="query.productFlowProcessId" placeholder="请输入" clearable>  </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="生产工序ID">
                                                <el-input v-model="query.productionProcessId" placeholder="请输入" clearable>  </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="标准类型(值/公差/区间/工艺卡/文字/无)">
                                                <el-input v-model="query.standardType" placeholder="请输入" clearable>  </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="标准值">
                                                <el-input v-model="query.standardValue" placeholder="请输入" clearable>  </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="计量单位ID">
                                                <el-input v-model="query.uomId" placeholder="请输入" clearable>  </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="计量单位名称">
                                                <el-input v-model="query.uomName" placeholder="请输入" clearable>  </el-input>
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
                            <el-table-column prop="attributeId" label="属性ID" width="0" align="left"
/>
                            <el-table-column prop="attributeName" label="属性名称" width="0" align="left"
/>
                            <el-table-column prop="attributeType" label="属性类型(勾选/单选/多选/颜色/日期/时间/数字/文字)" width="0" align="left"
/>
                            <el-table-column prop="attributeVal" label="属性值" width="0" align="left"
/>
                            <el-table-column prop="concurrencyStamp" label="并发戳" width="0" align="left"
/>
                            <el-table-column prop="maxValue" label="最大值" width="0" align="left"
/>
                            <el-table-column prop="minValue" label="最小值" width="0" align="left"
/>
                            <el-table-column prop="productFlowProcessId" label="产品工序流程对应工序信息ID" width="0" align="left"
/>
                            <el-table-column prop="productionProcessId" label="生产工序ID" width="0" align="left"
/>
                            <el-table-column prop="standardType" label="标准类型(值/公差/区间/工艺卡/文字/无)" width="0" align="left"
/>
                            <el-table-column prop="standardValue" label="标准值" width="0" align="left"
/>
                            <el-table-column prop="uomId" label="计量单位ID" width="0" align="left"
/>
                            <el-table-column prop="uomName" label="计量单位名称" width="0" align="left"
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
                                attributeId:undefined,
                                attributeName:undefined,
                                attributeType:undefined,
                                attributeVal:undefined,
                                concurrencyStamp:undefined,
                                maxValue:undefined,
                                minValue:undefined,
                                productFlowProcessId:undefined,
                                productionProcessId:undefined,
                                standardType:undefined,
                                standardValue:undefined,
                                uomId:undefined,
                                uomName:undefined,
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
                    {prop: 'attributeId', label: '属性ID'},
                    {prop: 'attributeName', label: '属性名称'},
                    {prop: 'attributeType', label: '属性类型(勾选/单选/多选/颜色/日期/时间/数字/文字)'},
                    {prop: 'attributeVal', label: '属性值'},
                    {prop: 'concurrencyStamp', label: '并发戳'},
                    {prop: 'maxValue', label: '最大值'},
                    {prop: 'minValue', label: '最小值'},
                    {prop: 'productFlowProcessId', label: '产品工序流程对应工序信息ID'},
                    {prop: 'productionProcessId', label: '生产工序ID'},
                    {prop: 'standardType', label: '标准类型(值/公差/区间/工艺卡/文字/无)'},
                    {prop: 'standardValue', label: '标准值'},
                    {prop: 'uomId', label: '计量单位ID'},
                    {prop: 'uomName', label: '计量单位名称'},
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
                    url: `/api/project/Bd_product_flow_process_attribute/getList`,
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
                        url: `/api/project/Bd_product_flow_process_attribute/${id}`,
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
                    url: `/api/project/Bd_product_flow_process_attribute/Actions/Export`,
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
