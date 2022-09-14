<template>
    <div class="JNPF-common-layout">

        <div class="JNPF-common-layout-center">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                            <el-col :span="6">
                                <el-form-item label="物料名称">
                                        <el-input v-model="query.materialName" placeholder="请输入" clearable>  </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="物料编码">
                                        <el-input v-model="query.materialCode" placeholder="请输入" clearable>  </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="检验结果">
                                        <el-select
                                            v-model="query.result"
                                            placeholder="请选择"
                                            clearable
                                            :style="{ width: '100%' }"
                                            :multiple="false"
                                        >
                                            <el-option
                                            v-for="(item, index) in resultOptions"
                                            :key="index"
                                            :label="item.fullName"
                                            :value="item.id"
                                            :disabled="item.disabled"
                                            ></el-option>
                                        </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="检验单类型">
                                        <el-select
                                            v-model="query.inspectionType"
                                            placeholder="请选择"
                                            clearable
                                            :style="{ width: '100%' }"
                                            :multiple="false"
                                        >
                                            <el-option
                                            v-for="(item, index) in inspectionTypeOptions"
                                            :key="index"
                                            :label="item.fullName"
                                            :value="item.id"
                                            :disabled="item.disabled"
                                            ></el-option>
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
                    <div class="JNPF-common-head-right">
                        <el-tooltip effect="dark" content="刷新" placement="top">
                            <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                                     @click="reset()"/>
                        </el-tooltip>
                        <screenfull isContainer/>
                    </div>
                </div>
                <JNPF-table v-loading="listLoading" :data="list" @sort-change='sortChange' >
                    <el-table-column prop="materialName" label="物料名称" width="0" align="left"/>
                    <el-table-column prop="materialCode" label="物料编码" width="0" align="left"/>
                    <el-table-column prop="relationName" label="检验信息1" width="0" align="left"/>
                    <el-table-column prop="warehouseName" label="检验信息2" width="0" align="left"/>
                    <el-table-column prop="materialNumber" label="货品数量" width="0" align="left"/>
                    <el-table-column prop="sampleNumber" label="抽样数" width="0" align="left"/>
                    <el-table-column prop="badNumber" label="不良数" width="0" align="left"/>
                    <el-table-column prop="badPercent" label="不良率" width="0" align="left"/>
                    <el-table-column label="检验结果" width="0" prop="result" algin="left">
                        <template slot-scope="scope">
                            {{ scope.row.result | dynamicText(resultOptions) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="submitterName" label="送检人" width="0" align="left"/>
                    <el-table-column prop="inspectorName" label="检验员" width="0" align="left"/>
                    <el-table-column prop="inspectTime" label="检验时间" width="0" align="left"/>
                    
                    <el-table-column prop="handleCommentsName" label="处理意见" width="0" align="left"/>
                    <el-table-column prop="handlerName" label="处理人" width="0" align="left"/>
                    <el-table-column prop="handleTime" label="处理时间" width="0" align="left"/>

                    <el-table-column prop="status" label="状态" width="0" align="left">
                        <template slot-scope="scope">
                            <el-tag type="danger" v-if="scope.row.status == 0">草稿</el-tag>
                            <el-tag type="warning" v-else-if="scope.row.status == 1">已提交</el-tag>
                            <el-tag type="success" v-else-if="scope.row.status == 2">已审核</el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column prop="remark" label="备注" width="0" align="left"/>
                    <el-table-column label="操作" fixed="right"
                                    width="100" >
                        <template slot-scope="scope">
                                    <el-button type="text" v-if="!scope.row.status || scope.row.status == 0"
                                            @click="addOrUpdateHandle(scope.row.id,scope.row.inspectionId)" >异常处理
                                    </el-button>
                                    <el-button type="text" v-if="scope.row.status == 0 || scope.row.status == 1 || scope.row.status == 2"
                                            @click="addOrUpdateHandle(scope.row.id,scope.row.inspectionId,true)" >详情
                                    </el-button>
                                    <el-button type="text" v-if="scope.row.status == 0"
                                            @click="submitHandle(scope.row.id,'submit')" >提交
                                    </el-button>
                                    <el-button type="text" v-if="scope.row.status == 1"
                                            @click="submitHandle(scope.row.id,'revoke')" >撤销
                                    </el-button>
                                    <el-button type="text" v-if="scope.row.status == 1"
                                            @click="submitHandle(scope.row.id,'audit')" >审核
                                    </el-button>
                        </template>
                    </el-table-column>
                </JNPF-table>
                <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="initData"/>
                <!-- <el-tabs  v-model="activedfurpk"  tab-position="top" class="mb-20" @tab-click='handleClick'>
                    <el-tab-pane  label="全部" >
                        <JNPF-table v-loading="listLoading" :data="list" @sort-change='sortChange' >
                            <el-table-column prop="materialName" label="物料名称" width="0" align="left"/>
                            <el-table-column prop="materialCode" label="物料编码" width="0" align="left"/>
                            <el-table-column prop="warehouseName" label="仓库" width="0" align="left"/>
                            <el-table-column prop="relationName" label="位置" width="0" align="left"/>
                            <el-table-column prop="materialNumber" label="货品数量" width="0" align="left"/>
                            <el-table-column prop="sampleNumber" label="抽样数" width="0" align="left"/>
                            <el-table-column prop="badNumber" label="不良数" width="0" align="left"/>
                            <el-table-column prop="badPercent" label="不良率" width="0" align="left"/>
                            <el-table-column label="检验结果" width="0" prop="result" algin="left">
                                <template slot-scope="scope">
                                    {{ scope.row.result | dynamicText(resultOptions) }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="submitterName" label="送检人" width="0" align="left"/>
                            <el-table-column prop="inspectorName" label="检验员" width="0" align="left"/>
                            <el-table-column prop="inspectTime" label="检验时间" width="0" align="left"/>
                            
                            <el-table-column prop="handleCommentsName" label="处理意见" width="0" align="left"/>
                            <el-table-column prop="handlerName" label="处理人" width="0" align="left"/>
                            <el-table-column prop="handleTime" label="处理时间" width="0" align="left"/>
                            <el-table-column prop="remark" label="备注" width="0" align="left"/>
                            <el-table-column label="操作" fixed="right"
                                            width="100" >
                                <template slot-scope="scope">
                                            <el-button type="text"
                                                    @click="addOrUpdateHandle(scope.row.id,scope.row.inspectionId)" >异常处理
                                            </el-button>
                                            <el-button type="text"
                                                    @click="addOrUpdateHandle(scope.row.id)" >提交
                                            </el-button>
                                            <el-button type="text"
                                                    @click="addOrUpdateHandle(scope.row.id)" >审核
                                            </el-button>
                                </template>
                            </el-table-column>
                        </JNPF-table>
                        <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="initData"/>
                    </el-tab-pane >
                    <el-tab-pane  label="来料检验" >
                        <JNPF-table v-loading="listLoading" :data="list" @sort-change='sortChange' >
                            <el-table-column prop="materialName" label="物料名称" width="0" align="left"/>
                            <el-table-column prop="materialCode" label="物料编码" width="0" align="left"/>
                            <el-table-column prop="relationName" label="采购订单号" width="0" align="left"/>
                            <el-table-column prop="materialNumber" label="货品数量" width="0" align="left"/>
                            <el-table-column prop="sampleNumber" label="抽样数" width="0" align="left"/>
                            <el-table-column prop="badNumber" label="不良数" width="0" align="left"/>
                            <el-table-column prop="badPercent" label="不良率" width="0" align="left"/>
                            <el-table-column label="检验结果" width="0" prop="result" algin="left">
                                <template slot-scope="scope">
                                    {{ scope.row.result | dynamicText(resultOptions) }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="submitterName" label="送检人" width="0" align="left"/>
                            <el-table-column prop="inspectorName" label="检验员" width="0" align="left"/>
                            <el-table-column prop="inspectTime" label="检验时间" width="0" align="left"/>
                            <el-table-column prop="remark" label="备注" width="0" align="left"/>
                            <el-table-column label="操作" fixed="right"
                                            width="100" >
                                <template slot-scope="scope">
                                            <el-button type="text"
                                                    @click="addOrUpdateHandle(scope.row.id)" >异常处理
                                            </el-button>
                                </template>
                            </el-table-column>
                        </JNPF-table>
                        <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="initData"/>
                    </el-tab-pane >
                    <el-tab-pane  label="成品检验">
                        <JNPF-table v-loading="listLoading" :data="list" @sort-change='sortChange' >
                            <el-table-column prop="materialName" label="物料名称" width="0" align="left"/>
                            <el-table-column prop="materialCode" label="物料编码" width="0" align="left"/>
                            <el-table-column prop="relationName" label="产品模板" width="0" align="left"/>
                            <el-table-column prop="materialNumber" label="货品数量" width="0" align="left"/>
                            <el-table-column prop="sampleNumber" label="抽样数" width="0" align="left"/>
                            <el-table-column prop="badNumber" label="不良数" width="0" align="left"/>
                            <el-table-column prop="badPercent" label="不良率" width="0" align="left"/>
                            <el-table-column label="检验结果" width="0" prop="result" algin="left">
                                <template slot-scope="scope">
                                    {{ scope.row.result | dynamicText(resultOptions) }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="submitterName" label="送检人" width="0" align="left"/>
                            <el-table-column prop="inspectorName" label="检验员" width="0" align="left"/>
                            <el-table-column prop="inspectTime" label="检验时间" width="0" align="left"/>
                            <el-table-column prop="remark" label="备注" width="0" align="left"/>
                            <el-table-column label="操作" fixed="right"
                                            width="100" >
                                <template slot-scope="scope">
                                            <el-button type="text"
                                                    @click="addOrUpdateHandle(scope.row.id)" >异常处理
                                            </el-button>
                                </template>
                            </el-table-column>
                        </JNPF-table>
                        <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="initData"/>
                    </el-tab-pane >
                    <el-tab-pane  label="半成品检验">
                        <JNPF-table v-loading="listLoading" :data="list" @sort-change='sortChange' >
                            <el-table-column prop="materialName" label="物料名称" width="0" align="left"/>
                            <el-table-column prop="materialCode" label="物料编码" width="0" align="left"/>
                            <el-table-column prop="relationName" label="产品模板" width="0" align="left"/>
                            <el-table-column prop="materialNumber" label="货品数量" width="0" align="left"/>
                            <el-table-column prop="sampleNumber" label="抽样数" width="0" align="left"/>
                            <el-table-column prop="badNumber" label="不良数" width="0" align="left"/>
                            <el-table-column prop="badPercent" label="不良率" width="0" align="left"/>
                            <el-table-column label="检验结果" width="0" prop="result" algin="left">
                                <template slot-scope="scope">
                                    {{ scope.row.result | dynamicText(resultOptions) }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="submitterName" label="送检人" width="0" align="left"/>
                            <el-table-column prop="inspectorName" label="检验员" width="0" align="left"/>
                            <el-table-column prop="inspectTime" label="检验时间" width="0" align="left"/>
                            <el-table-column prop="remark" label="备注" width="0" align="left"/>
                            <el-table-column label="操作" fixed="right"
                                            width="100" >
                                <template slot-scope="scope">
                                            <el-button type="text"
                                                    @click="addOrUpdateHandle(scope.row.id)" >异常处理
                                            </el-button>
                                </template>
                            </el-table-column>
                        </JNPF-table>
                        <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="initData"/>
                    </el-tab-pane >
                    <el-tab-pane  label="库存检验">
                        <JNPF-table v-loading="listLoading" :data="list" @sort-change='sortChange' >
                            <el-table-column prop="materialName" label="物料名称" width="0" align="left"/>
                            <el-table-column prop="materialCode" label="物料编码" width="0" align="left"/>
                            <el-table-column prop="warehouseName" label="仓库" width="0" align="left"/>
                            <el-table-column prop="relationName" label="位置" width="0" align="left"/>
                            <el-table-column prop="materialNumber" label="货品数量" width="0" align="left"/>
                            <el-table-column prop="sampleNumber" label="抽样数" width="0" align="left"/>
                            <el-table-column prop="badNumber" label="不良数" width="0" align="left"/>
                            <el-table-column prop="badPercent" label="不良率" width="0" align="left"/>
                            <el-table-column label="检验结果" width="0" prop="result" algin="left">
                                <template slot-scope="scope">
                                    {{ scope.row.result | dynamicText(resultOptions) }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="submitterName" label="送检人" width="0" align="left"/>
                            <el-table-column prop="inspectorName" label="检验员" width="0" align="left"/>
                            <el-table-column prop="inspectTime" label="检验时间" width="0" align="left"/>
                            <el-table-column prop="remark" label="备注" width="0" align="left"/>
                            <el-table-column label="操作" fixed="right"
                                            width="100" >
                                <template slot-scope="scope">
                                            <el-button type="text"
                                                    @click="addOrUpdateHandle(scope.row.id)" >异常处理
                                            </el-button>
                                </template>
                            </el-table-column>
                        </JNPF-table>
                        <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="initData"/>
                    </el-tab-pane >
                    <el-tab-pane  label="发货检验">
                        <JNPF-table v-loading="listLoading" :data="list" @sort-change='sortChange' >
                            <el-table-column prop="materialName" label="物料名称" width="0" align="left"/>
                            <el-table-column prop="materialCode" label="物料编码" width="0" align="left"/>
                            <el-table-column prop="relationName" label="发货单号" width="0" align="left"/>
                            <el-table-column prop="materialNumber" label="货品数量" width="0" align="left"/>
                            <el-table-column prop="sampleNumber" label="抽样数" width="0" align="left"/>
                            <el-table-column prop="badNumber" label="不良数" width="0" align="left"/>
                            <el-table-column prop="badPercent" label="不良率" width="0" align="left"/>
                            <el-table-column label="检验结果" width="0" prop="result" algin="left">
                                <template slot-scope="scope">
                                    {{ scope.row.result | dynamicText(resultOptions) }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="submitterName" label="送检人" width="0" align="left"/>
                            <el-table-column prop="inspectorName" label="检验员" width="0" align="left"/>
                            <el-table-column prop="inspectTime" label="检验时间" width="0" align="left"/>
                            <el-table-column prop="remark" label="备注" width="0" align="left"/>
                            <el-table-column label="操作" fixed="right"
                                            width="100" >
                                <template slot-scope="scope">
                                            <el-button type="text"
                                                    @click="addOrUpdateHandle(scope.row.id)" >异常处理
                                            </el-button>
                                </template>
                            </el-table-column>
                        </JNPF-table>
                        <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="initData"/>
                    </el-tab-pane >
                </el-tabs> -->
                
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
                    activedfurpk: 'ceshi',
                query: {
                                materialName:undefined,
                                result:undefined,
                                inspectTime:undefined,
                                inspectorId:undefined,
                                submitterId:undefined,
                                inspectionType:undefined,
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
                    {prop: 'materialName', label: '物料名称'},
                    {prop: 'materialNumber', label: '货品数量'},
                    {prop: 'sampleNumber', label: '抽样数'},
                    {prop: 'badNumber', label: '不良数'},
                    {prop: 'badPercent', label: '不良率'},
                    {prop: 'result', label: '检验结果'},
                    {prop: 'submitterId', label: '送检人'},
                    {prop: 'inspectorId', label: '检验员'},
                    {prop: 'inspectTime', label: '检验时间'},
                    {prop: 'remark', label: '备注'},
                ],
                resultOptions:[{"fullName":"合格","id":1},{"fullName":"不合格","id":2}],
                resultProps:{"label":"fullName","value":"id"},
                inspectionTypeOptions:[{"fullName":"来料检验","id":1},{"fullName":"成品检验","id":2},{"fullName":"半成品检验","id":3}
                ,{"fullName":"库存检验","id":4},{"fullName":"发货检验","id":5}],
            }
        },
        computed: {},
        created() {
                this.initData()
        },
        methods: {

            handleClick(target, action) {
                if(target.index != "0"){
                    this.query.inspectionType = target.index
                }else{
                    this.query.inspectionType = undefined
                }
                this.reset();
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
                    ...this.query,
                };
                request({
                    url: `/api/project/BizQualityInspectionException/getList`,
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
                        url: `/api/project/BizQualityInspection/${id}`,
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
            addOrUpdateHandle(id, inspectionId, isDetail) {
                this.formVisible = true
                this.$nextTick(() => {
                    this.$refs.JNPFForm.init(id, inspectionId, isDetail)
                })
            },
            submitHandle(id,action){
                var msg = "";
                if (action == 'submit') {
                    msg = "是否确认提交？";
                } else if (action == 'revoke') {
                    msg = "是否确认撤销？";
                } else if (action == 'revoke') {
                    msg = "是否确认审核通过？";
                }
                this.$confirm(msg, '提示', {
                type: 'warning'
                }).then(() => {
                request({
                    url: `/api/project/BizQualityInspectionException/submit/${id}/${action}`,
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
            exportData() {
                this.exportBoxVisible = true
                this.$nextTick(() => {
                    this.$refs.ExportBox.init(this.columnList)
                })
            },
            download(data) {
                let query = {...data, ...this.listQuery, ...this.query}
                request({
                    url: `/api/project/BizQualityInspection/Actions/Export`,
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
                    //if(key!="inspectionType"){
                        this.query[key] = undefined
                    //}
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
