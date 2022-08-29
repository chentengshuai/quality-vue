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
            <el-form-item label="销售订单编号">
              <el-input v-model="query.saleOrderCode" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="合同号">
              <el-input v-model="query.contractNo" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="产品编码">
              <el-input v-model="query.productCode" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="产品名称">
              <el-input v-model="query.productName" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <template v-if="showAll">
            <el-col :span="6">
              <el-form-item label="产品规格">
                <el-input v-model="query.productSpc" placeholder="请输入" clearable></el-input>
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
      <JNPF-table v-loading="listLoading" :data="list"   @select="select" ref="multipleTable"  @selection-change="selectionChange" hasC>
        <el-table-column prop="contractNo" label="合同号"  align="left"
        />
        <el-table-column prop="saleOrderCode" label="销售订单编号"  align="left"
        />
        <el-table-column prop="productCode" label="产品编号"  align="left"
        />
        <el-table-column prop="productName" label="产品名称" align="left"
        />
        <el-table-column prop="productSpc" label="产品规格" align="left"
        />
        <el-table-column prop="productSpc" label="产品规格" align="left"
        />
        <el-table-column prop="customerOrderCode" label="客户订单号" align="left"
        />
        <el-table-column prop="customerProductCode" label="客户物料编码" align="left"
        />
        <el-table-column prop="deliveryDate" label="预计交货日期"  align="left"
        />
        <el-table-column prop="salerName" label="销售员姓名" width="100" align="left"
        />

      </JNPF-table>
    </div>

    <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
                @pagination="initData"/>
    <div>
      <el-button type="primary" size="medium" @click="selectHandle" round>确 定</el-button>
      <el-button plain size="medium" @click="closeHandle" round>取 消</el-button>
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
          saleOrderCode: undefined,
          contractNo: undefined,
          productCode: undefined,
          productName: undefined,
          productSpc: undefined
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
        selectData: []
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
      selectHandle() {
        if(this.selectData[0] && this.selectData){
          this.$emit('closeorderDialog', this.selectData[0])
        }
      },
      closeHandle(){
        this.$emit('closeorderDialog')
      },
      initData() {
        this.listLoading = true
        let _query = {
          ...this.listQuery,
          ...this.query
        }
        request({
          url: `/api/project/SaleOrder/getSaleOrderPlanInfoList`,
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
          this.listLoading = false
        })
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
