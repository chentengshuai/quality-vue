<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="整改用户">
              <el-input v-model="query.userId" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="整改用户名称">
              <el-input v-model="query.userName" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="销售订单号">
              <el-input v-model="query.salesOrderCode" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <template v-if="showAll">
            <el-col :span="6">
              <el-form-item label="售后类型">
                <el-select v-model="query.afterSaleType" placeholder="请选择"
                           clearable>
                  <el-option v-for="(item, index) in afterSaleTypeOptions" :key="index"
                             :label="item.fullName" :value="item.id"
                             :disabled="item.disabled"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="售后产品名称">
                <el-input v-model="query.materialName" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="客户编码">
                <el-input v-model="query.clientCode" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="客户名称">
                <el-input v-model="query.clientName" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="售后原因">
                <el-input v-model="query.afterSaleCause" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="售后产品编码">
                <el-input v-model="query.materialCode" placeholder="请输入" clearable></el-input>
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
        <JNPF-table v-loading="listLoading" :data="list">
          <el-table-column prop="salesOrderCode" label="销售订单号" width="0" align="left"/>
          <el-table-column prop="customerCalls" label="客户联系电话" width="0" align="left"/>
          <el-table-column prop="afterSaleCause" label="售后原因" width="0" align="left"/>
          <el-table-column prop="materialCode" label="售后产品编码" width="0" align="left"/>
          <el-table-column prop="materialName" label="售后产品名称" width="0" align="left"/>
          <el-table-column prop="clientCode" label="客户编码" width="0" align="left"/>
          <el-table-column prop="clientName" label="客户名称" width="0" align="left"/>
          <el-table-column prop="status" label="状态" width="0" align="left">
            <template slot-scope="scope">
              <el-tag type="danger" v-if="scope.row.status == 0">未处理</el-tag>
              <el-tag type="success" v-if="scope.row.status == 1">已处理</el-tag>
              <el-tag type="warning" v-if="scope.row.status == 2">处理中</el-tag>
              <el-tag type="warning" v-if="scope.row.status == 3">整改中</el-tag>
              <el-tag type="success" v-if="scope.row.status == 4">整改完成</el-tag>
              <el-tag type="danger" v-if="scope.row.status == 5">取消整改</el-tag>
              <el-tag type="info" v-if="scope.row.status == 6">关闭</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="整改用户" width="0" align="left"/>
          <el-table-column prop="abarbeitungTime" label="整改预计时间" width="0" align="left">
            <template slot-scope="scope">
              {{ scope.row.abarbeitungTime | toDate('yyyy-MM-dd') }}
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="100">
            <template slot-scope="scope">
              <el-button type="text" @click="checkHandle(scope.row.saleInfoId)">查看
              </el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
                    @pagination="initData"/>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import {getDictionaryDataByTypeCode, getDictionaryDataSelector} from '@/api/systemData/dictionary'

export default {
  components: {},
  data() {
    return {
      showAll: false,
      query: {
        afterSaleCause: undefined,
        afterSaleType: undefined,
        clientCode: undefined,
        clientName: undefined,
        materialCode: undefined,
        materialName: undefined,
        salesOrderCode: undefined,
        userId: undefined,
        userName: undefined,
        opinion: undefined,
        saleInfoId: undefined,
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
      afterSaleTypeOptions: [],
      columnList: [
        {prop: 'userId', label: '整改用户'},
        {prop: 'userName', label: '整改用户名称'},
        {prop: 'opinion', label: '整改意见'},
        {prop: 'saleInfoId', label: '售后信息ID'},
      ],
    }
  },
  computed: {},
  created() {
    this.initData()
    this.getafterSaleTypeOptions();
  },
  methods: {
    getafterSaleTypeOptions() {
      getDictionaryDataByTypeCode('saleType').then(res => {
        this.afterSaleTypeOptions = res.data
      })
    },
    initData() {
      this.listLoading = true;
      let _query = {
        ...this.listQuery,
        ...this.query
      };
      request({
        url: `/api/project/Sale_marketing_abarbeitung/getAbarbeitungList`,
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
    checkHandle(saleInfoId) {
      this.$router.push(`/abarbeitungShow?id=${saleInfoId}`)
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
