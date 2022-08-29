<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="合同号">
              <el-input v-model="query.contractNo" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户名称">
              <el-input v-model="query.customerName" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="规格型号">
              <el-input v-model="query.productSpc" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="销售订单编码">
              <el-input v-model="query.saleOrderCode" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="query.status" placeholder="请选择"
                         clearable>
                <el-option v-for="(item, index) in statusOptions" :key="index"
                           :label="item.fullName" :value="item.id"
                           :disabled="item.disabled"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <template v-if="showAll">
            <el-col :span="6">
              <el-form-item label="生产计划类型">
                <el-select v-model="query.productionPlanType" placeholder="请选择"
                           clearable>
                  <el-option v-for="(item, index) in productionPlanTypeOptions" :key="index"
                             :label="item.fullName" :value="item.id"
                             :disabled="item.disabled"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="生产计划日期">
                <el-date-picker v-model="query.productionPlanDate" type="daterange"
                                value-format="timestamp" format="yyyy-MM-dd" start-placeholder="开始日期"
                                end-placeholder="结束日期">
                </el-date-picker>
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
        <JNPF-table v-loading="listLoading" :data="list" @sort-change='sortChange'>
          <el-table-column prop="productionPlanCode" label="生产计划编号" width="0" align="left"
          />
          <el-table-column prop="contractNo" label="合同号" width="0" align="left"
          />
          <el-table-column prop="customerName" label="客户名称" width="0" align="left"
          />
          <el-table-column prop="productName" label="产品名称" width="0" align="left"
          />
          <!--          <el-table-column prop="productLvlName" label="产品等级" width="0" align="left"-->
          <!--          />-->
          <el-table-column prop="productLvl" label="产品等级" width="0" algin="left"
          >
            <template slot-scope="scope">
              {{ scope.row.productLvl | dynamicText(levelOptions) }}
            </template>
          </el-table-column>
          <el-table-column prop="productCode" label="物料编码" width="0" align="left"
          />
          <el-table-column prop="productSpc" label="规格型号" width="0" align="left"
          />
          <el-table-column prop="saleOrderQty" label="销售订单数量" width="0" align="left"
          />
          <el-table-column prop="planQty" label="计划数量" width="0" align="left"
          />
          <el-table-column prop="finishedQty" label="已完成量" width="0" align="left"
          />
          <el-table-column prop="useStockQty" label="利用库存数量" width="0" align="left"
          />
          <el-table-column label="状态" width="0" prop="status" algin="left"
          >
            <template slot-scope="scope">
              {{ scope.row.status | dynamicText(statusOptions) }}
            </template>
          </el-table-column>
          <el-table-column prop="deliveryDate" label="预计交货日期" width="0" align="left"
          />
          <el-table-column label="生产计划类型" width="0" prop="productionPlanType" algin="left"
          >
            <template slot-scope="scope">
              {{ scope.row.productionPlanType | dynamicText(productionPlanTypeOptions) }}
            </template>
          </el-table-column>
          <el-table-column prop="productionPlanDate" label="生产计划日期" width="0" align="left"
          />
          <el-table-column label="生产基地" width="0" prop="workshop" algin="left"
          >
            <template slot-scope="scope">
              {{ scope.row.workshop | dynamicText(workshopOptions) }}
            </template>
          </el-table-column>
          <el-table-column label="生产工序" width="0" prop="productionProcess" algin="left"
          >
            <template slot-scope="scope">
              {{ scope.row.productionProcess | dynamicText(productionProcessOptions) }}
            </template>
          </el-table-column>
          <el-table-column prop="saleOrderCode" label="销售订单编号" width="0" align="left"
          />
          <el-table-column prop="customerOrderCode" label="客户订单号" width="0" align="left"
          />
          <el-table-column prop="customerProductCode" label="客户物料编码" width="0" align="left"
          />
          <el-table-column prop="remark" label="客户要求" width="0" align="left"
          />
          <el-table-column label="操作" fixed="right"
                           width="100">
            <template slot-scope="scope">
              <el-button type="text" v-if="[1,2,3].indexOf(scope.row.status)>-1"
                         @click="addOrUpdateHandle(scope.row.id,true)">查看
              </el-button>
              <el-button type="text" v-if="[1].indexOf(scope.row.status)>-1"
                         @click="publishPlan(scope.row.id)">发布
              </el-button>
              <el-button type="text" v-if="[2].indexOf(scope.row.status)>-1"
                         @click="cancelPlan(scope.row.id)">撤销
              </el-button>
              <el-button type="text" v-if="[1,2].indexOf(scope.row.status)>-1"
                         @click="addOrUpdateHandle(scope.row.id)">编辑
              </el-button>
              <el-button type="text" v-if="[2].indexOf(scope.row.status)>-1"
                         @click="donePlan(scope.row.id)">完成
              </el-button>
<!--              <el-button type="text" class="JNPF-table-delBtn"-->
<!--                         v-if="[1].indexOf(scope.row.status)>-1"-->
<!--                         @click="handleDel(scope.row.id)">删除-->
<!--              </el-button>-->
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

  export default {
    components: {JNPFForm, ExportBox},
    data() {
      return {
        showAll: false,
        query: {
          contractNo: undefined,
          customerName: undefined,
          productSpc: undefined,
          saleOrderCode: undefined,
          productionPlanCode: undefined,
          productionPlanDate: undefined,
          productionPlanType: undefined
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
          sort: 'desc',
          sidx: ''
        },
        formVisible: false,
        exportBoxVisible: false,
        columnList: [
          {prop: 'productionPlanCode', label: '生产计划编号'},
          {prop: 'productionPlanType', label: '生产计划类型'},
          {prop: 'productionPlanDate', label: '生产计划日期'},
          {prop: 'workshop', label: '生产基地'},
          {prop: 'productionProcess', label: '生产工序'},
          {prop: 'contractNo', label: '合同号'},
          {prop: 'saleOrderLineId', label: '销售订单明细ID'},
          {prop: 'saleOrderCode', label: '销售订单编号'},
          {prop: 'saleOrderName', label: '销售订单名称'},
          {prop: 'customerId', label: '客户ID'},
          {prop: 'customerName', label: '客户名称'},
          {prop: 'deliveryDate', label: '预计交货日期'},
          {prop: 'uomId', label: '计量单位'},
          {prop: 'uomName', label: '计量单位名称'},
          {prop: 'productLvl', label: '产品等级'},
          {prop: 'productName', label: '产品名称'},
          {prop: 'productCode', label: '物料编码'},
          {prop: 'productSpc', label: '规格型号'},
          {prop: 'saleOrderQty', label: '销售订单数量'},
          {prop: 'finishedQty', label: '已完成量'},
          {prop: 'useStockQty', label: '利用库存数量'},
          {prop: 'planQty', label: '需要生产数量'},
          {prop: 'remark', label: '客户要求'},
          {prop: 'customerOrderCode', label: '客户订单号'},
          {prop: 'customerProductCode', label: '客户物料编码'}
        ],
        workshopOptions: [{'fullName': '一厂', 'id': '01'}, {'fullName': '二厂', 'id': '02'}],
        productionPlanTypeOptions: [{'fullName': '按订单生产', 'id': '01'}, {'fullName': '利用库存生产', 'id': '02'}],
        productionProcessOptions: [{'fullName': '生箔', 'id': '01'}, {'fullName': '分切', 'id': '02'}],
        statusOptions: [{'fullName': '草稿', 'id': 1}, {'fullName': '已下发', 'id': 2}, {'fullName': '已完成', 'id': 3}],
        levelOptions: []
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
        this.listLoading = true
        let _query = {
          ...this.listQuery,
          ...this.query
        }
        request({
          url: `/api/project/ProductionPlan/getList`,
          method: 'post',
          data: _query
        }).then(res => {
          var _list = []
          for (let i = 0; i < res.data.list.length; i++) {
            let _data = res.data.list[i]
            _list.push(_data)
          }
          this.list = _list
          this.total = res.data.pagination.total

          this.listLoading = false
        });
        this.getProductLevel();
      },
      publishPlan(id) {
        request({
          url: `/api/project/ProductionPlan/publishPlan/${id}`,
          method: 'POST'
        }).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            onClose: () => {
              this.initData()
            }
          })
        })
      },
      cancelPlan(id) {
        request({
          url: `/api/project/ProductionPlan/cancelPlan/${id}`,
          method: 'POST'
        }).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            onClose: () => {
              this.initData()
            }
          })
        })
      },
      donePlan(id) {
        request({
          url: `/api/project/ProductionPlan/donePlan/${id}`,
          method: 'POST'
        }).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            onClose: () => {
              this.initData()
            }
          })
        })
      },
      handleDel(id) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          request({
            url: `/api/project/ProductionPlan/${id}`,
            method: 'DELETE'
          }).then(res => {
            this.$message({
              type: 'success',
              message: res.msg,
              onClose: () => {
                this.initData()
              }
            })
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
          url: `/api/project/ProductionPlan/Actions/Export`,
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
          sort: 'desc',
          sidx: ''
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
          sort: 'desc',
          sidx: ''
        }
        this.initData()
      },
      // 查询等级
      getProductLevel() {
        this.listLoading = true
        let _query = {}
        request({
          url: `/api/project/ProductLevel/getList`,
          method: 'post',
          data: _query
        }).then(res => {
          var _list = []
          for (let i = 0; i < res.data.list.length; i++) {
            let _data = res.data.list[i]
            let tmp = {
              "fullName": _data["levelName"],
              "id": _data["levelCode"]
            };
            _list.push(tmp)
          }
          this.levelOptions = _list

          this.listLoading = false
        })
      },
    }
  }
</script>
