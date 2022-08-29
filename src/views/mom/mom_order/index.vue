<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="订单编号">
              <el-input v-model="query.orderNum" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-input v-model="query.documentStatus" placeholder="请输入" clearable></el-input>
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
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="订单号">
              <el-input v-model="orderNoInput" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="importFromERP()">ERP导入</el-button>
              <el-button icon="el-icon-refresh-right" @click="uploadForm()">ERP EXCEL导入</el-button>
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
        <JNPF-table v-loading="listLoading" :data="list" @expand-change="expandChange" :hasNO="false"
                    @sort-change='sortChange'>
          <el-table-column type="expand" width="40">
            <template slot-scope="props">
              <el-tabs v-model="props.row.activeName">
                <el-tab-pane label="订单明细">
                  <el-table :data="props.row.childTable" stripe size='mini'
                            :element-loading-text="$t('common.loadingText')">
                    <el-table-column type="index" width="50" label="序号" align="center"/>
                    <el-table-column prop="orderErpId" label="ERP订单ID" width="80"/>
                    <el-table-column prop="materialId" label="物料ID" width="80"/>
                    <el-table-column prop="materialName" label="物料名称" width="80"/>
                    <el-table-column prop="materialNumber" label="物料编码" width="80"/>
                    <el-table-column prop="specification" label="规格型号" width="80"/>
                    <el-table-column prop="productGrade" label="产品等级" width="80"/>
                    <el-table-column prop="unit" label="销售单位" width="80"/>
                    <el-table-column prop="qty" label="销售数量" width="80"/>
                    <el-table-column prop="priceUnit" label="计价单位" width="80"/>
                    <el-table-column prop="priceUnitQty" label="计价数量" width="80"/>
                    <el-table-column prop="cuPrice" label="铜价" width="80"/>
                    <el-table-column prop="processPrice" label="加工费单价" width="80"/>
                    <el-table-column prop="taxPrice" label="含税单价" width="80"/>
                    <el-table-column prop="taxRate" label="税率%" width="80"/>
                    <el-table-column prop="taxAmount" label="税额" width="80"/>
                    <el-table-column prop="allAmount" label="价税合计" width="80"/>
                    <el-table-column prop="remark" label="备注" width="80"/>
                    <el-table-column prop="price" label="单价" width="80"/>
                    <el-table-column prop="amount" label="金额" width="80"/>
                    <el-table-column prop="stockOrg" label="库存组织" width="80"/>
                    <el-table-column prop="isFree" label="是否赠品" width="80">
                      <template slot-scope="scope">
                        <el-switch v-model="scope.row.isFree" active-value="1" inactive-value="0" disabled>
                        </el-switch>
                      </template>
                    </el-table-column>
                    <el-table-column prop="deliveryDate" label="要货日期" width="80"/>
                    <el-table-column prop="settleOrg" label="结算组织" width="80"/>
                    <el-table-column prop="ownerType" label="货主类型" width="80"/>
                    <el-table-column prop="owner" label="货主" width="80"/>
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </template>
          </el-table-column>
          <el-table-column prop="orderNum" label="订单编号" width="0" align="left"
          />
          <el-table-column prop="orderId" label="ERP订单ID" width="0" align="left"
          />
          <el-table-column prop="documentStatus" label="状态" width="0" align="left"
          />
          <el-table-column prop="saleOrg" label="销售组织" width="0" align="left"
          />
          <el-table-column prop="saleDate" label="销售日期" width="0" align="left"
          />
          <el-table-column prop="saleCustName" label="客户名" width="0" align="left"
          />
          <el-table-column prop="saleDept" label="销售部门" width="0" align="left"
          />
          <el-table-column prop="saleGroup" label="销售组" width="0" align="left"
          />
          <el-table-column prop="saler" label="销售员" width="0" align="left"
          />
          <el-table-column prop="billType" label="单据类型" width="0" align="left"
          />
          <el-table-column prop="businessType" label="业务类型" width="0" align="left"
          />
          <el-table-column prop="headDeliveyWay" label="交货方式" width="0" align="left"
          />
          <el-table-column prop="headLoc" label="交货地点" width="0" align="left"
          />
          <el-table-column prop="contractNo" label="合同编号" width="0" align="left"
          />
          <el-table-column prop="remark" label="备注" width="0" align="left"
          />
          <el-table-column prop="createUser" label="创建人" width="0" align="left"
          />
          <el-table-column prop="createDate" label="创建日期" width="0" align="left"
          />
          <el-table-column prop="modifyUser" label="修改人" width="0" align="left"
          />
          <el-table-column prop="modifyDate" label="修改日期" width="0" align="left"
          />
          <el-table-column prop="approveUser" label="审批人" width="0" align="left"
          />
          <el-table-column prop="approveDate" label="审批日期" width="0" align="left"
          />
          <el-table-column prop="settleCurr" label="结算币别" width="0" align="left"
          />
          <el-table-column prop="isIncludedTax" label="是否含税" width="0" align="left"
          />
          <el-table-column prop="priceList" label="价目表" width="0" align="left"
          />
          <el-table-column prop="recCondition" label="收款条件" width="0" align="left"
          />
          <el-table-column prop="flowState" label="状态" width="100">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.flowState==1">等待审核</el-tag>
              <el-tag type="success" v-else-if="scope.row.flowState==2">审核通过</el-tag>
              <el-tag type="danger" v-else-if="scope.row.flowState==3">审核驳回</el-tag>
              <el-tag type="danger" v-else-if="scope.row.flowState==4">流程撤回</el-tag>
              <el-tag type="warning" v-else-if="scope.row.flowState==5">审核终止</el-tag>
              <el-tag type="info" v-else>等待提交</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right"
                           width="100">
            <template slot-scope="scope">
              <el-button type="text" :disabled="[1,2,5].indexOf(scope.row.flowState)>-1"
                         @click="addOrUpdateHandle(scope.row.id)">编辑
              </el-button>
              <el-button type="text" class="JNPF-table-delBtn" :disabled="[1,2,3,5].indexOf(scope.row.flowState)>-1"
                         @click="handleDel(scope.row.id)">删除
              </el-button>
              <el-button size="mini" type="text" :disabled="!scope.row.flowState"
                         @click="addOrUpdateHandle(scope.row.id,scope.row.flowState)"
              >详情
              </el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
                    @pagination="initData"/>
      </div>
    </div>
    <FlowBox v-if="flowVisible" ref="FlowBox" @close="colseFlow"/>
    <ExportBox v-if="exportBoxVisible" ref="ExportBox" @download="download"/>
    <ImportForm v-if="importFormVisible" ref="importForm" @refresh="reset()"/>
  </div>
</template>

<script>
  import request from '@/utils/request'
  import {getDictionaryDataSelector} from '@/api/systemData/dictionary'
  import FlowBox from '@/views/workFlow/components/FlowBox'
  import ExportBox from './ExportBox'
  import {previewDataInterface} from '@/api/systemData/dataInterface'
  import {OrderEntryList, OrderReceivableList} from "@/api/extend/order";
  import ImportForm from './ImportForm';


  export default {
    components: {FlowBox, ExportBox, ImportForm},
    data() {
      return {
        query: {
          orderNum: undefined,
          documentStatus: undefined,
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
        flowVisible: false,
        exportBoxVisible: false,
        orderNoInput: null,
        importFormVisible: false,
        columnList: [
          {prop: 'orderNum', label: '订单编号'},
          {prop: 'orderId', label: 'ERP订单ID'},
          {prop: 'documentStatus', label: '状态'},
          {prop: 'saleOrg', label: '销售组织'},
          {prop: 'saleDate', label: '销售日期'},
          {prop: 'saleCustName', label: '客户名'},
          {prop: 'saleDept', label: '销售部门'},
          {prop: 'saleGroup', label: '销售组'},
          {prop: 'saler', label: '销售员'},
          {prop: 'billType', label: '单据类型'},
          {prop: 'businessType', label: '业务类型'},
          {prop: 'headDeliveyWay', label: '交货方式'},
          {prop: 'headLoc', label: '交货地点'},
          {prop: 'contractNo', label: '合同编号'},
          {prop: 'remark', label: '备注'},
          {prop: 'createUser', label: '创建人'},
          {prop: 'createDate', label: '创建日期'},
          {prop: 'modifyUser', label: '修改人'},
          {prop: 'modifyDate', label: '修改日期'},
          {prop: 'approveUser', label: '审批人'},
          {prop: 'approveDate', label: '审批日期'},
          {prop: 'settleCurr', label: '结算币别'},
          {prop: 'isIncludedTax', label: '是否含税'},
          {prop: 'priceList', label: '价目表'},
          {prop: 'recCondition', label: '收款条件'},
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
          url: `/api/project/Mom_order/getList`,
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
      importFromERP() {
        request({
          url: `/api/project/Mom_order/importFromERP`,
          method: 'post',
          params: {
            orderNo: this.orderNoInput
          }
        }).then(res => {
          this.$message.success("导入成功");
          this.initData();
        })
      },
      handleDel(id) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          request({
            url: `/api/project/Mom_order/${id}`,
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
      addOrUpdateHandle(id, flowState) {
        let data = {
          id: id || '',
          enCode: 'order',
          flowId: '253266687472698629',
          formType: 1,
          opType: flowState ? 0 : '-1',
          status: flowState
        }
        this.flowVisible = true
        this.$nextTick(() => {
          this.$refs.FlowBox.init(data)
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
          url: `/api/project/Mom_order/Actions/Export`,
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
      colseFlow(isrRefresh) {
        this.flowVisible = false
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
        console.log('rowsssssssss', rows);
        rows.isExpanded = !rows.isExpanded
        if (!rows.isExpanded) return
        if (rows.childTable.length) return
        request({
          url: `/api/project/Mom_order/${rows.id}/Items`,
          method: 'get'
        }).then(res => {
          rows.childTable = res.data.list
        })
        // OrderReceivableList(rows.id).then(res => {
        //   rows.childTable1 = res.data.list
        // })
      },
      uploadForm() {
        this.importFormVisible = true
        this.$nextTick(() => {
          this.$refs.importForm.init()
        })
      }
    }
  }
</script>
