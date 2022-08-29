<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <el-col :span="6">
                        <el-form-item label="规格型号">
                            <el-input v-model="query.productSpc" placeholder="请输入" clearable>  </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="箱号">
                                <el-input v-model="query.lotNumber" placeholder="请输入" clearable>  </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="卷号">
                                <el-input v-model="query.rollNum" placeholder="请输入" clearable>  </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="库存状态">
                                <el-select   v-model="query.status" placeholder="请选择"  clearable  :style='{"width":"100%"}' :multiple="false" >
                                            <el-option v-for="(item, index) in statusOptions" :key="index" :label="item.fullName" :value="item.id" :disabled="item.disabled" ></el-option>
                                </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="合同号">
                                <el-input v-model="query.contractNo" placeholder="请输入" clearable>  </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="客户">
                                <el-input v-model="query.customerName" placeholder="请输入" clearable>  </el-input>
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
                <JNPF-table v-loading="listLoading" :data="list" @expand-change="expandChange" @sort-change='sortChange'
                                   @selection-change="selectionChange" hasC>
                      <el-table-column type="expand" width="40">
                        <template slot-scope="props">
                          <el-tabs v-model="props.row.activeName">
                            <el-tab-pane label="库存明细">
                              <el-table :data="props.row.childTable" stripe size='mini'
                                        :element-loading-text="$t('common.loadingText')">
                                <el-table-column type="index" width="50" label="序号" align="center"/>
                                <el-table-column prop="lotNumber" label="批号/箱号" width="0" align="left" />
                                <el-table-column prop="customerName" label="客户" width="0" align="left" />
                                <el-table-column prop="contractNo" label="合同号" width="0" align="left" />
                                <el-table-column prop="productSpc" label="规格型号" width="0" align="left" />
                                <el-table-column prop="uomName" label="单位" width="0" align="left" />
                                <el-table-column prop="qty" label="库存数量" width="0" align="left" />
                                <el-table-column label="操作" width="100" >
                                    <template slot-scope="scope">
                                        <el-button type="text"  @click="addOrUpdateHandle(scope.row.lotNumber)" >详情
                                        </el-button>
                                    </template>
                                </el-table-column>
                              </el-table>
                            </el-tab-pane>
                          </el-tabs>
                        </template>
                      </el-table-column>
                            <el-table-column prop="productCode" label="物料编码" width="0" align="left" />
                            <el-table-column prop="productName" label="产品名称" width="0" align="left" />
                            <el-table-column prop="productSpc" label="规格型号" width="0" align="left" />
                            <el-table-column prop="uomName" label="单位" width="0" align="left" />
                            <el-table-column prop="qty" label="库存数量" width="0" align="left" />
                        <!--<el-table-column label="操作" width="100" >
                            <template slot-scope="scope">
                                        <el-button type="text"  v-if="scope.row.boeStatus == 0"
                                                   @click="submitBoe(scope.row.id,'submit')" >提交
                                        </el-button>
                                        <el-button type="text"  v-if="scope.row.boeStatus == 0"
                                                   @click="addOrUpdateHandle(scope.row.id)" >编辑
                                        </el-button>
                                        <el-button type="text"  v-if="scope.row.boeStatus == 1"
                                                   @click="submitBoe(scope.row.id,'revoke')" >撤销
                                        </el-button>
                                        <el-button type="text"  v-if="scope.row.boeStatus == 1"
                                                   @click="addOrUpdateHandle(scope.row.id,'look')" >详情
                                        </el-button>
                                        <el-button type="text" class="JNPF-table-delBtn"  v-if="scope.row.boeStatus == 0"
                                                    @click="handleDel(scope.row.id)">删除
                                        </el-button>
                            </template>
                        </el-table-column>-->
                </JNPF-table>
                    <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="initData"/>
            </div>
        </div>
        <el-dialog title="装箱包装明细列表"
                   :close-on-click-modal="false" append-to-body
                   :visible.sync="formVisible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
                   width="1000px">
          <box-detail ref="BoxDetail" ></box-detail>
        </el-dialog>
    </div>
</template>

<script>
    import request from '@/utils/request'
    import {getDictionaryDataSelector} from '@/api/systemData/dictionary'
    import {previewDataInterface} from '@/api/systemData/dataInterface'
    import BoxDetail from './boxDetail'

    export default {
        components: {BoxDetail},
        data() {
            return {
                showAll: false,
                query: {
                    productSpc:undefined,
                    status:undefined,
                    lotNumber:undefined,
                    contractNo:undefined,
                    customerName:undefined,
                    rollNum:undefined,
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
                //exportBoxVisible: false,
                columnList: [
                    {prop: 'productCode', label: '物料编码'},
                    {prop: 'productName', label: '产品名称'},
                    {prop: 'productSpc', label: '规格型号'},
                    {prop: 'uomName', label: '单位'},
                    {prop: 'qty', label: '库存数量'},
                ],
                statusOptions:[{"fullName":"已撤回","id":"0"},{"fullName":"已入库","id":"1"},{"fullName":"已出库","id":"2"}],
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
                    url: `/api/project/stockReport/getList`,
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
            addOrUpdateHandle(lotNumber) {
                this.formVisible = true
                this.$nextTick(() => {
                    this.$refs.BoxDetail.listQuery.lotNumber = lotNumber
                    this.$refs.BoxDetail.listQuery.rollNum = ""
                    this.$refs.BoxDetail.initData()
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
            selectionChange(list) {
              debugger
              this.ids = list.map((x) => x.id).join(',')
              console.log('ids' + this.ids)
            },
            expandChange(rows) {
              rows.isExpanded = !rows.isExpanded
              if (!rows.isExpanded) return
              if (rows.childTable.length) return
              let _query = {
                  ...this.query,
                  productCode : rows.productCode,
                  productSpc : rows.productSpc,
                  uomName : rows.uomName
                  }
              request({
                url: `/api/project/stockReport/Items`,
                method: 'POST',
                data: _query
              }).then(res => {
                console.log(res)
                rows.childTable = res.data
                console.log(rows.childTable)
              })
            },
        }
    }
</script>
