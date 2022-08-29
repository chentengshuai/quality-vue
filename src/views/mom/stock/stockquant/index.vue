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
            <el-form-item label="批号/箱号">
              <el-input v-model="query.lotNumber" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户">
              <el-input v-model="query.customerName" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <template v-if="showAll">
            <el-col :span="6">
              <el-form-item label="状态">
                <el-select v-model="query.status" placeholder="请选择" clearable>
                  <el-option label="已入库" value="1"></el-option>
                  <el-option label="已出库" value="2"></el-option>
                  <el-option label="已撤回" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="产品">
                <el-input v-model="query.productName" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="仓库">
                <el-input v-model="query.warehouseName" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="位置">
                <el-input v-model="query.locationName" placeholder="请输入" clearable></el-input>
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
        <!--<div class="JNPF-common-head">
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
        </div>-->
        <JNPF-table v-loading="listLoading" :data="list" @sort-change='sortChange'>
          <el-table-column prop="contractNo" label="合同号" width="0" align="left"/>
          <el-table-column prop="lotNumber" label="批号/箱号" width="100" align="left"/>
          <el-table-column v-if="false" prop="warehouseId" label="仓库ID" width="0" align="left"/>
          <el-table-column prop="warehouseName" label="仓库名称" width="0" align="left"/>
          <el-table-column v-if="false" prop="locationId" label="位置ID" width="0" align="left"/>
          <el-table-column prop="locationName" label="位置名称" width="0" align="left"/>
          <el-table-column v-if="false" prop="productId" label="产品ID" width="0" align="left"/>
          <el-table-column prop="productName" label="产品名称" width="100" align="left"/>
          <el-table-column prop="productCode" label="物料编码" width="100" align="left"/>
          <el-table-column prop="productSpc" label="规格型号" width="0" align="left"/>
          <el-table-column v-if="false" prop="uomId" label="计量单位ID" width="0" align="left"/>
          <el-table-column prop="uomName" label="单位" width="0" align="left"/>
          <el-table-column v-if="false" prop="customerId" label="客户ID" width="0" align="left"/>
          <el-table-column prop="customerName" label="客户名称" width="180" align="left"/>
          <el-table-column prop="qty" label="数量" width="0" align="left"/>
          <el-table-column prop="grossQty" label="毛重" width="0" align="left"/>
          <!--          <el-table-column prop="lockedQty" label="锁定数量" width="0" align="left"/>-->
          <!--          <el-table-column prop="availableQty" label="可用数量" width="0" align="left"/>-->
          <el-table-column prop="warehousingTime" label="入库时间" width="0" align="left"/>
          <el-table-column prop="expirationDate" label="过期日期" width="0" align="left"/>
          <el-table-column prop="status" label="状态" width="0" align="left">
            <template slot-scope="scope">
              {{ scope.row.status | dynamicText(statusOptions) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right"
                           width="100">
            <template slot-scope="scope">
              <el-button type="text"
                         @click="addOrUpdateHandle(scope.row.id,'look')">详情
              </el-button>
              <!--<el-button type="text" v-if="scope.row.status == 1" class="JNPF-table-delBtn"  @click="handleRecall(scope.row.id,scope.row.lotNumber)">撤回
              </el-button>-->
              <!-- <el-button type="text" class="JNPF-table-delBtn"  @click="handleDel(scope.row.id)">删除
               </el-button>-->
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
          qty: undefined,
          contractNo: undefined,
          lotNumber: undefined,
          customerName: undefined,
          warehouseName: undefined,
          locationName: undefined,
          productName: undefined,
          status: undefined,
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
          {prop: 'contractNo', label: '合同号'},
          {prop: 'lotNumber', label: '批号/箱号'},
          {prop: 'warehouseId', label: '仓库ID'},
          {prop: 'warehouseName', label: '仓库名称'},
          {prop: 'locationId', label: '位置ID'},
          {prop: 'locationName', label: '位置名称'},
          {prop: 'productId', label: '产品ID'},
          {prop: 'productName', label: '产品名称'},
          {prop: 'productCode', label: '物料编码'},
          {prop: 'productSpc', label: '规格型号'},
          {prop: 'uomId', label: '计量单位ID'},
          {prop: 'uomName', label: '计量单位名称'},
          {prop: 'customerId', label: '客户ID'},
          {prop: 'customerName', label: '客户名称'},
          {prop: 'qty', label: '数量'},
          {prop: 'grossQty', label: '毛重'},
          {prop: 'lockedQty', label: '锁定数量'},
          {prop: 'availableQty', label: '可用数量'},
          {prop: 'warehousingTime', label: '入库时间'},
          {prop: 'expirationDate', label: '过期日期'},
          {prop: 'status', label: '状态'},
        ],
        statusOptions: [
          {"fullName": "已撤回", "id": "0"},
          {"fullName": "已入库", "id": "1"},
          {"fullName": "已出库", "id": "2"},
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
          url: `/api/project/StockQuant/getList`,
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

          this.listLoading = false
        })
      },
      handleDel(id) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          request({
            url: `/api/project/StockQuant/${id}`,
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
      handleRecall(id, lotNumber) {
        debugger;
        this.$confirm('此操作会将库存数量清空, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          request({
            url: `/api/project/StockQuant/recallQuant/${id}/${lotNumber}`,
            method: 'get'
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
          url: `/api/project/StockQuant/Actions/Export`,
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
