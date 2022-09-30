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
                            <!-- <el-col :span="6">
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
                            </el-col> -->
                            <!-- <el-col :span="6">
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
                            </el-col> -->
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
                    <el-table-column prop="inspectionCode" label="检验单号" width="0" align="left"/>
                    <el-table-column label="检验单类型" width="0" prop="inspectionType" algin="left">
                        <template slot-scope="scope">
                            {{ scope.row.inspectionType | dynamicText(inspectionTypeOptions) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="materialName" label="物料名称" width="0" align="left"/>
                    <el-table-column prop="materialCode" label="物料编码" width="0" align="left"/>
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
                                            @click="addOrUpdateHandle(scope.row.id,scope.row.inspectionId,true)">查看
                                    </el-button>
                        </template>
                    </el-table-column>
                </JNPF-table>
                <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="initData"/>
            </div>
        </div>
    </div>
</template>

<script>
    import request from '@/utils/request'
    import {getDictionaryDataSelector} from '@/api/systemData/dictionary'
    import {previewDataInterface} from '@/api/systemData/dataInterface'

    export default {
        components: {},
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
                    url: `/api/project/BizQualityInspection/getList`,
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
