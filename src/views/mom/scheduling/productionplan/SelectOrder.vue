<template>
  <el-dialog
    :title="'选择销售订单'"
    width="80%"
    @close="closeDialog"
    :close-on-click-modal="false"
    :visible.sync="orderShow"
    append-to-body
  >
    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="销售订单分类">
              <el-select v-model="query.saleOrderCategory" placeholder="请选择"
                         clearable>
                <el-option v-for="(item, index) in saleOrderCategoryOptions" :key="index"
                           :label="item.fullName" :value="item.id"
                           :disabled="item.disabled"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="销售订单编号">
              <el-input v-model="query.saleOrderCode" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="销售订单日期">
              <el-date-picker v-model="query.saleOrderDate" type="datetimerange"
                              value-format="timestamp" format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期"
                              end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="销售订单状态">
              <el-select v-model="query.status" placeholder="请选择"
                         clearable
                         :disabled="true"
              >
                <el-option v-for="(item, index) in statusCategoryOptions" :key="index"
                           :label="item.fullName" :value="item.id"
                           :disabled="item.disabled"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <template v-if="showAll">
            <el-col :span="6">
              <el-form-item label="销售订单名称">
                <el-input v-model="query.saleOrderName" placeholder="请输入" clearable></el-input>
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
    </div>


    <div class="myTable">
      <JNPF-table v-loading="listLoading" :data="list" @expand-change="expandChange"
                  ref="multipleTable"
      >
        <el-table-column type="expand" width="40">
          <template slot-scope="props">
            <el-tabs v-model="props.row.activeName">
              <el-tab-pane label="订单明细">

                <el-table :data="props.row.childTable" stripe size='mini'
                          :element-loading-text="$t('common.loadingText')">

                  <el-table-column align="center" width="55">
                    <template slot-scope="scope">
                      <img src="@/assets/images/check.png" class="imgCheck"
                           v-if="(props.$index != tableIndex || scope.$index != lineIndex)"
                           @click="tableCheck(props.$index, scope.$index)" alt="">
                      <img src="@/assets/images/checked.png" class="imgCheck"
                           v-else-if="(props.$index == tableIndex && scope.$index == lineIndex)" @click="tableNoCheck"
                           alt="">
                    </template>
                  </el-table-column>
                  <el-table-column type="index" width="50" label="序号" align="center"/>
                  <el-table-column prop="productName" width="130" label="产品名称"/>
                  <el-table-column prop="productCode" label="产品编码"/>
                  <el-table-column prop="specification" label="规格型号"/>
                  <el-table-column prop="qty" label="销售数量"/>
                  <el-table-column prop="uomName" label="计价单位"/>
                  <el-table-column prop="price" label="单价"/>
                  <el-table-column prop="cuPrice" label="铜价"/>
                  <el-table-column prop="processPrice" label="加工费单价"/>
                  <el-table-column prop="taxRate" label="税率%"/>
                  <el-table-column prop="taxAmount" label="税额"/>
                  <el-table-column prop="totalAmount" label="合计金额"/>
                  <el-table-column prop="remark" label="备注"/>
                  <el-table-column prop="deliveryDate" width="140" label="预计交货日期"/>
                </el-table>


              </el-tab-pane>
            </el-tabs>
          </template>
        </el-table-column>
        <el-table-column label="销售订单分类" width="100" prop="saleOrderCategory" algin="left"
        >
          <template slot-scope="scope">
            {{ scope.row.saleOrderCategory | dynamicText(saleOrderCategoryOptions) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="销售订单状态" width="100" align="left">
          <template slot-scope="scope">
            {{ scope.row.status | dynamicText(statusCategoryOptions) }}

          </template>
        </el-table-column>
        <el-table-column prop="saleOrderCode" label="销售订单编号" width="100" align="left"
        />
        <el-table-column prop="saleOrderDate" label="销售订单日期" width="100" align="left"
        />
        <el-table-column prop="saleOrderName" label="销售订单名称" width="100" align="left"
        />
        <el-table-column label="销售订单类型" width="100" prop="saleOrderType" algin="left"
        >
          <template slot-scope="scope">
            {{ scope.row.saleOrderType | dynamicText(saleOrderTypeOptions) }}
          </template>
        </el-table-column>
        <el-table-column prop="deliveryDate" label="预计交货日期" width="100" align="left"
        />
        <el-table-column prop="customerName" label="客户名称" width="0" align="left"
        />
        <el-table-column prop="salerName" label="销售员姓名" width="100" align="left"
        />
        <el-table-column prop="untaxedAmount" label="不含税金额" width="100" align="left"
        />
        <el-table-column prop="taxAmount" label="税额" width="0" align="left"
        />
        <el-table-column prop="totalAmount" label="合计金额" width="0" align="left"
        />
        <el-table-column prop="paymentTerm" label="付款条件" width="0" align="left"
        />
        <el-table-column prop="creatorName" label="创建人" width="0" align="left"
        />
        <el-table-column prop="creationTime" label="创建时间" width="0" align="left"
        />
        <el-table-column prop="lastModifierName" label="修改人" width="0" align="left"
        />
        <el-table-column prop="lastModificationTime" label="修改时间" width="0" align="left"
        />

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
  import request from '@/utils/request'

  export default {
    components: {},
    props: {
      selectVisible: {
        type: Boolean,
        default: false
      }
    },
    computed: {},
    data() {
      return {
        showAll: false,
        orderShow:true,
        query: {
          saleOrderCategory: undefined,
          saleOrderCode: undefined,
          saleOrderDate: undefined,
          saleOrderName: undefined,
          status: "2"
        },
        list: [],
        ids: '',
        listLoading: true,
        total: 0,
        listQuery: {
          currentPage: 1,
          pageSize: 8,
          sort: 'desc',
          sidx: ''
        },
        tableIndex: null,
        lineIndex: null,
        selectData: [],
        columnList: [
          { prop: 'saleOrderCategory', label: '销售订单分类' },
          { prop: 'saleOrderCode', label: '销售订单编号' },
          { prop: 'saleOrderDate', label: '销售订单日期' },
          { prop: 'saleOrderName', label: '销售订单名称' },
          { prop: 'saleOrderType', label: '销售订单类型' },
          { prop: 'deliveryDate', label: '预计交货日期' },
          { prop: 'customerName', label: '客户名称' },
          { prop: 'salerName', label: '销售员姓名' },
          { prop: 'untaxedAmount', label: '不含税金额' },
          { prop: 'taxAmount', label: '税额' },
          { prop: 'totalAmount', label: '合计金额' },
          { prop: 'paymentTerm', label: '付款条件' },
          { prop: 'status', label: '订单状态' },
          { prop: 'creatorName', label: '创建人' },
          { prop: 'creationTime', label: '创建时间' },
          { prop: 'lastModifierName', label: '修改人' },
          { prop: 'lastModificationTime', label: '修改时间' }
        ],
        saleOrderCategoryOptions: [
          { fullName: '报价单', id: '0' },
          { fullName: '销售订单', id: '1' }
        ],
        saleOrderCategoryProps: { label: 'fullName', value: 'id' },
        saleOrderTypeOptions: [
          { fullName: '选项一', id: '1' },
          { fullName: '选项二', id: '2' }
        ],
        saleOrderTypeProps: { label: 'fullName', value: 'id' },
        statusCategoryOptions: [
          { fullName: '创建', id: '0' },
          { fullName: '审核中', id: '1' },
          { fullName: '已审核', id: '2' },
          { fullName: '重新审核', id: '3' },
          { fullName: '作废', id: '4' }
        ]
      }
    },
    computed: {},
    watch: {
      selectVisible(newVal, oldVal){
        this.orderShow = newVal
      },
      immediate : true 
    },
    created() {
      this.initData()
    },
    mounted() {
    },
    methods: {
      closeDialog() {
        this.$emit('closeorderDialog')
      },
      tableCheck(pIndex, sIndex) {
        console.log(pIndex, sIndex)
        this.tableNoCheck()

        this.tableIndex = pIndex
        this.lineIndex = sIndex
      },
      tableNoCheck() {
        this.tableIndex = null
        this.tableIndex = null
      },
      selectHandle() {
        let obj = {
          OrderItem: this.list[this.tableIndex],
          saleOrderLineId: this.list[this.tableIndex]['childTable'][this.lineIndex].id
        }
        this.$emit('closeorderDialog', obj)
      },
      initData() {
        this.listLoading = true
        let _query = {
          ...this.listQuery,
          ...this.query
        }
        request({
          url: `/api/project/SaleOrder/getList`,
          method: 'post',
          data: _query
        }).then((res) => {
          console.log(res)
          var _list = []
          for (let i = 0; i < res.data.list.length; i++) {
            let _data = res.data.list[i]
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

      expandChange(rows) {
        rows.isExpanded = !rows.isExpanded
        if (!rows.isExpanded) return
        if (rows.childTable.length) return
        request({
          url: `/api/project/SaleOrder/${rows.id}/Items`,
          method: 'get'
        }).then((res) => {
          console.log(res)
          rows.childTable = res.data.list

        })
        // OrderReceivableList(rows.id).then(res => {
        //   rows.childTable1 = res.data.list
        // })
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

      select(selection, row) {
        // 清除 所有勾选项
        this.$nextTick(() => {
          for (var i = 0; i < this.$refs.multipleTable.$children.length; i++) {
            this.$refs.multipleTable.$children[i].clearSelection()
          }
        })
        // 当表格数据都没有被勾选的时候 就返回
        // 主要用于将当前勾选的表格状态清除
        if (selection.length == 0) return
        this.$nextTick(() => {
          for (var i = 0; i < this.$refs.multipleTable.$children.length; i++) {
            this.$refs.multipleTable.$children[i].toggleRowSelection(row, true)
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
      }
    }
  }
</script>

<style scoped>
  .myTable >>> .el-table__header .el-checkbox {
    display: none !important;
  }
</style>
