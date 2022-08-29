<template>
  <el-dialog
    :title="'选择生产计划'"
    width="80%"
    @close="closeDialog"
    :close-on-click-modal="false"
    :visible.sync="selectVisible"
    append-to-body
  >
    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="合同号">
              <el-input v-model="query.contractNo" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="生产计划编号">
              <el-input v-model="query.productionPlanCode" placeholder="请输入" clearable></el-input>
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
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
              <el-button icon="el-icon-refresh-right" @click="reset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>

    <div class="myTable">
      <JNPF-table v-loading="listLoading" :data="list" @sort-change='sortChange' hasC @select="select"
                  ref="multipleTable"
                  @selection-change="selectionChange"
      >
        <el-table-column prop="productionPlanCode" label="生产计划编号" width="0" align="left"
        />
        <el-table-column prop="contractNo" label="合同号" width="0" align="left"
        />
        <el-table-column prop="customerName" label="客户名称" width="0" align="left"
        />
        <el-table-column prop="productName" label="产品名称" width="0" align="left"
        />
        <el-table-column prop="productLvlName" label="产品等级" width="0" align="left"
        />
        <el-table-column prop="productCode" label="物料编码" width="0" align="left"
        />
        <el-table-column prop="productSpc" label="规格型号" width="0" align="left"
        />
        <el-table-column prop="planQty" label="计划数量" width="0" align="left"
        />
        <el-table-column prop="finishedQty" label="已完成量" width="0" align="left"
        />
        <el-table-column prop="useStockQty" label="利用库存数量" width="0" align="left"
        />
        <el-table-column prop="deliveryDate" label="预计交货日期" width="0" align="left"
        />
        <el-table-column label="生产计划类型" width="0" prop="productionPlanType" algin="left"
        >
          <template slot-scope="scope">
            {{ scope.row.productionPlanType | dynamicText(productionPlanTypeOptions) }}
          </template>
        </el-table-column>
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

      </JNPF-table>
    </div>
    <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
                @pagination="initData"/>
    <div>
      <el-button type="primary" size="medium" @click="selectHandle" round>确 定</el-button>
      <el-button plain size="medium" @click="selectHandle" round>取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import request from "@/utils/request";

  export default {
    components: {},

    props: {
      selectVisible: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        showAll: false,
        query: {
          productionTaskCode: undefined,
          productionPlanType: undefined,
          productionTaskTime: undefined,
          contractNo: undefined,
          productionPlanCode: undefined,
          saleOrderCode: undefined
        },
        treeProps: {
          children: 'children',
          label: 'fullName',
          value: 'id'
        },
        selectData: [],
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
          {prop: 'productionTaskCode', label: '生产派工编号'},
          {prop: 'productionPlanType', label: '生产计划类型(0正常生产/使用库存)'},
          {prop: 'productionTaskTime', label: '生产派工时间'},
          {prop: 'workshop', label: '生产基地'},
          {prop: 'productionPlanId', label: '生产计划ID'},
          {prop: 'productionPlanCode', label: '生产计划编号'},
          {prop: 'contractNo', label: '合同号'},
          {prop: 'saleOrderLineId', label: '销售订单明细ID'},
          {prop: 'saleOrderCode', label: '销售订单编号'},
          {prop: 'saleOrderName', label: '销售订单名称'},
          {prop: 'customerId', label: '客户ID'},
          {prop: 'customerName', label: '客户名称'},
          {prop: 'productId', label: '成品ID'},
          {prop: 'productCode', label: '物料编码'},
          {prop: 'productName', label: '产品名称'},
          {prop: 'productSpec', label: '规格型号'},
          {prop: 'deliveryDate', label: '预计交货日期'},
          {prop: 'productionProcessId', label: '生产工序ID'},
          {prop: 'productionProcessName', label: '生产工序名称'},
          {prop: 'equipmentId', label: '生产工位ID'},
          {prop: 'equipmentName', label: '生产工位名称'},
          {prop: 'uomId', label: '计量单位'},
          {prop: 'uomName', label: '计量单位名称'},
          {prop: 'planQty', label: '需要生产数量'},
          {prop: 'qty', label: '派工数量'},
          {prop: 'producedQty', label: '已生产数量'},
          {prop: 'toProduceQty', label: '待生产数量'},
          {prop: 'status', label: '状态(草稿/待执行/已执行/已取消)'},
          {prop: 'description', label: '描述'}
        ],
        workshopOptions: [{'fullName': '一厂', 'id': '01'}, {'fullName': '二厂', 'id': '02'}],
        productionPlanTypeOptions: [{'fullName': '按订单生产', 'id': '01'}, {'fullName': '利用库存生产', 'id': '02'}],
        productionProcessOptions: [{'fullName': '生箔', 'id': '01'}, {'fullName': '分切', 'id': '02'}]
      }
    },
    computed: {},
    watch: {},
    created() {
      this.initData();
    },
    mounted() {
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
        })
      },
      closeDialog() {
        this.$emit("closeDialog");
      },
      selectHandle() {
        this.$emit("closeDialog", this.selectData[0]);
      },

      addOrUpdateHandle(id, isDetail) {
        this.formVisible = true
        this.$nextTick(() => {
          this.$refs.JNPFForm.init(id, isDetail)
        })
      },


      select(selection, row) {
        // 清除 所有勾选项
        this.$nextTick(() => {
          for (var i = 0; i < this.$refs.multipleTable.$children.length; i++) {
            this.$refs.multipleTable.$children[i].clearSelection();
          }
        })
        // 当表格数据都没有被勾选的时候 就返回
        // 主要用于将当前勾选的表格状态清除
        if (selection.length === 0)
          return
        this.$nextTick(() => {
          for (var i = 0; i < this.$refs.multipleTable.$children.length; i++) {
            this.$refs.multipleTable.$children[i].toggleRowSelection(row, true);
          }
        })
      },
      // 表格的选中 可以获得当前选中的数据
      selectionChange(val) {
        // 将选中的数据存储起来
        this.selectData = val
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
      }
    }


  };
</script>

<style scoped>
  .myTable >>> .el-table__header .el-checkbox {
    display: none !important;
  }
</style>
