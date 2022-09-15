<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="入库单号">
              <el-input v-model="query.stockMoveCode" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="物料名称">
              <el-input v-model="query.productName" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="规格型号">
              <el-input v-model="query.productSpc" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <template v-if="showAll">
            <el-col :span="6">
              <el-form-item label="入库类型">
                <el-select v-model="query.stockMoveType" placeholder="请选择"
                           clearable>
                  <el-option v-for="(item, index) in stockMoveTypeOptions" :key="index"
                             :label="item.fullName" :value="item.enCode"
                             :disabled="item.disabled"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="入库时间">
                <el-date-picker v-model="query.stockMoveDate" type="daterange"
                                value-format="timestamp" format="yyyy-MM-dd" start-placeholder="开始日期"
                                end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>

            </el-col>

          </template>
          <template v-if="showAll">
            <el-col :span="6">
              <el-form-item label="单据状态">
                <el-select v-model="query.status" placeholder="请选择"
                           clearable>
                  <el-option v-for="(item, index) in statusOptions" :key="index"
                             :label="item.fullName" :value="item.id"
                             :disabled="item.disabled"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="客户">
                <el-input v-model="query.customerName" placeholder="请输入" clearable></el-input>
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
            <el-button type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()">新增
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
        <JNPF-table v-loading="listLoading" :data="list" @sort-change='sortChange' @expand-change="expandChange">
          <el-table-column type="expand" width="40">
            <template slot-scope="props">
              <el-tabs v-model="props.row.activeName">
                <el-tab-pane label="明细">
                  <el-table :data="props.row.childTable" stripe size='mini'
                            :element-loading-text="$t('common.loadingText')">
                    <el-table-column type="index" width="50" label="序号" align="center"/>
                    <el-table-column prop="lotNumber" label="批号/箱号"/>
                    <el-table-column prop="productName" label="物料名称"/>
                    <el-table-column prop="productSpc" label="规格型号"/>
                    <el-table-column prop="productLvl" label="产品等级"/>
                    <el-table-column prop="uomName" label="单位"/>
                    <el-table-column prop="qty" label="数量"/>
                    <el-table-column prop="grossWeight" label="毛重"/>
                    <el-table-column prop="customerName" label="客户"/>
                    <el-table-column prop="contractNo" label="合同号"/>
                    <el-table-column prop="warehouseName" label="仓库"/>
<!--                    <el-table-column prop="giveAway" label="是否赠品"/>-->
                    <el-table-column prop="frp" label="FRP管"/>
                    <el-table-column prop="locationName" label="仓位"/>
                    <el-table-column prop="workShopName" label="生产车间"/>
                    <el-table-column prop="customerProductCode" width="150" label="客户物料编码"/>
                    <el-table-column prop="customerOrderNum" width="150" label="客户订单号" fixed="right"/>
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </template>
          </el-table-column>

          <el-table-column prop="stockMoveCode" label="入库单号" width="150" align="left"/>
          <el-table-column prop="stockMoveDate" label="入库时间" width="0" align="left"/>
          <el-table-column prop="status" label="单据状态" width="0" align="left">
            <template slot-scope="scope">
              {{ scope.row.status | dynamicText(statusOptions) }}
            </template>
          </el-table-column>
          <el-table-column label="入库类型" width="0" prop="stockMoveType" algin="left">
            <template slot-scope="scope">
              {{ scope.row.stockMoveType | dynamicTextByCode(stockMoveTypeOptions) }}
            </template>
          </el-table-column>
          <el-table-column prop="totalQty" label="总量" width="0" align="left"/>
          <el-table-column prop="stockPersonName" label="入库人员" width="0" align="left"/>
          <el-table-column prop="remark" label="备注" width="0" align="left"/>
          <el-table-column label="操作" fixed="right"
                           width="150">
            <template slot-scope="scope">
              <div v-if="scope.row.status==='0'">
                <el-button type="text" @click="addOrUpdateHandle(scope.row.id)">编辑
                </el-button>
                <el-button type="text" @click="submitHandle(scope.row.id)">审核
                </el-button>
                <el-button type="text" class="JNPF-table-delBtn" @click="handleDel(scope.row.id)">删除
                </el-button>
              </div>
              <div v-if="scope.row.status==='1'">
                <el-button type="text" @click="addOrUpdateHandle(scope.row.id,'look')">详情
                </el-button>
                <el-button type="text" @click="recallHandle(scope.row.id)">撤销
                </el-button>
              </div>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
                    @pagination="initData"/>
      </div>
    </div>
    <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh"/>
    <ExportBox v-if="exportBoxVisible" ref="ExportBox" @download="download"/>
  </div>
</template>

<script>
  import request from '@/utils/request'
  import JNPFForm from './Form'
  import ExportBox from './ExportBox'
  import {getDictionaryDataByTypeCode} from '@/api/systemData/dictionary'


  export default {
    components: {JNPFForm, ExportBox},
    data() {
      return {
        showAll: false,
        query: {
          stockMoveCode: undefined,
          stockMoveType: undefined,
          stockMoveName: undefined,
          stockMoveDate: undefined,
          customerName: undefined,
          status: undefined,
          productName: undefined,
          productSpc: undefined,
          billNo: undefined
        },
        treeProps: {  //设置树状属性
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
          {prop: 'stockMoveCode', label: '入库单号'},
          {prop: 'stockMoveDate', label: '库存移动时间'},
          {prop: 'stockMoveName', label: '库存移动名称'},
          {prop: 'stockMoveType', label: '库存移动类型'},
          {prop: 'stockOrgName', label: '移库组织名称'},
          {prop: 'customerName', label: '客户'},
          {prop: 'stockPersonName', label: '移库人员'},
          {prop: 'remark', label: '备注'},
          {prop: 'totalQty', label: '总量'},
        ],
        stockMoveTypeOptions: [],
        statusOptions: [
          {"fullName": "草稿", "id": "0"},
          {"fullName": "已审核", "id": "1"},
        ],
      }
    },
    computed: {},
    created() {
      this.getStockMoveTypeList();//获取入库类型的数据字典
      this.initData();
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
          url: `/api/InStock/BizStockMove/getList`,
          method: 'post',
          data: _query
        }).then(res => {
          var _list = [];
          for (let i = 0; i < res.data.list.length; i++) {
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
      handleDel(id) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          request({
            url: `/api/InStock/BizStockMove/${id}`,
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
          url: `/api/InStock/BizStockMove/Actions/Export`,
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
      expandChange(rows) {
        rows.isExpanded = !rows.isExpanded
        if (!rows.isExpanded) return
        if (rows.childTable.length) return
        request({
          url: `/api/InStock/BizStockMove/getLineinfo/${rows.id}`,
          method: 'get'
        }).then(res => {
          rows.childTable = res.data
        })
      },
      submitHandle(id) {
        this.$confirm('是否提交数据?', '提示', {
          type: 'warning'
        }).then(() => {
          request({
            url: `/api/InStock/BizStockMove/submitHandle/${id}`,
            method: 'post'
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
      recallHandle(id) {
        this.$confirm('是否撤回数据?', '提示', {
          type: 'warning'
        }).then(() => {
          request({
            url: `/api/InStock/BizStockMove/recall/${id}`,
            method: 'post'
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
      getStockMoveTypeList() {
        getDictionaryDataByTypeCode('inSockMoveType').then(res => {
          this.stockMoveTypeOptions = res.data
        }).catch(() => {
        })
      },
    }
  }
</script>
<style scoped>
  .row-expand-cover td:last-child .el-icon-arrow-right {
    visibility: hidden;
  }
</style>
