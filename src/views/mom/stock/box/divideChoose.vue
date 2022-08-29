<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="8">
            <el-form-item label="子卷号">
              <el-input v-model="query.rollNum" placeholder="请输入子卷号查询" clearable
                        @keyup.enter.native="search()"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="规格型号">
              <el-input v-model="query.size" placeholder="请输入规格型号查询" clearable
                        @keyup.enter.native="search()"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户名称">
              <el-input v-model="query.customerName" placeholder="请输入客户名称查询" clearable
                        @keyup.enter.native="search()"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同号">
              <el-input v-model="query.contractNo" placeholder="请输入合同号查询" clearable
                        @keyup.enter.native="search()"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()">
                {{$t('common.search')}}
              </el-button>
              <el-button icon="el-icon-refresh-right" @click="reset()">{{$t('common.reset')}}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <JNPF-table v-loading="listLoading" :data="list" hasC @selection-change="handleSelectionChange"
                    :border="false">
          <el-table-column prop="rollNum" label="子卷号" width="0"/>
          <el-table-column prop="levelName" label="产品等级" width="0"/>
          <el-table-column prop="size" label="尺寸" width="0"/>
          <el-table-column prop="customerName" label="客户名称" width="0"/>
          <el-table-column prop="contractNo" label="合同号" width="0"/>
          <el-table-column prop="producerName" label="分切人" width="0"/>
          <el-table-column prop="stationName" label="分切机台" width="0"/>
          <el-table-column prop="productionDate" label="分切时间" width="0"/>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
                    @pagination="initData"/>
      </div>
      <span slot="footer" class="dialog-footer" style="background:#ffffff">
                  <el-button type="primary" @click="select()" size="small" style="float:right">{{$t('common.confirmButton')}}</el-button>
          </span>
    </div>

  </div>
</template>

<script>
  import request from '@/utils/request'
  import {getDictionaryDataSelector} from '@/api/systemData/dictionary'
  import ExportBox from './ExportBox'
  import {previewDataInterface} from '@/api/systemData/dataInterface'

  export default {
    components: {ExportBox},
    data() {
      return {
        showAll: false,
        query: {
          rollNum: undefined,
          size: undefined,
          customerName: undefined,
          contractNo: undefined,
          isWeigh: true
        },
        treeProps: {
          children: 'children',
          label: 'fullName',
          value: 'id'
        },
        list: [],
        listLoading: true,
        total: 0,
        checked: [],

        listQuery: {
          currentPage: 1,
          pageSize: 20,
          sort: "desc",
          sidx: "",
        },
        formVisible: false,
        exportBoxVisible: false,
        columnList: [
          {prop: 'rollNum', label: '子卷号'},
          {prop: 'stationName', label: '机台号'},
        ],
      }
    },
    computed: {},
    created() {
      this.checked = this.value
      this.visible = true
    },
    mounted() {
      this.initData()
    },
    methods: {
      sortChange({column, prop, order}) {
        this.listQuery.sort = order == 'ascending' ? 'asc' : 'desc'
        this.listQuery.sidx = !order ? '' : prop
        this.initData()
      },
      initData() {
        debugger
        this.listLoading = true;
        let _query = {
          ...this.query,
          ...this.listQuery,
        };
        request({
          url: `/api/project/ProductionDivide/getFinishedDivideList`,
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
          //this.setDefault()
          this.listLoading = false
        })

      },
      search() {
        this.initData()
        this.listQuery.currentPage = 1
        this.listQuery.pageSize = this.hasPage ? this.pageSize : 20
      },
      reset() {
        for (let key in this.query) {
          if (key === 'isWeigh')
            continue;
          this.query[key] = undefined
        }
        this.listQuery.currentPage = 1
        this.listQuery.pageSize = this.hasPage ? this.pageSize : 20
        this.initData()
      },
      clear() {
        this.checked = [];
        this.$emit('onChange', this.checked)
      },
      rowClick(row) {
        //console.log(row);
        //this.checked = row.id
        //this.checkedTxt = row[this.relationField]
        //this.checked = row
      },
      select() {
        //console.log("this.checked:"+this.checked);
        this.$emit('onChange', this.checked)
      },
      handleSelectionChange(val) {
        //this.checked = val;
        this.checked = val.map(item => item.rollNum)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .popupSelect-container {
    width: 100%;

    .popupSelect-input {
      width: 100%;
      cursor: pointer;

      > > > input {
        cursor: pointer;
      }

      .el-icon-circle-close {
        display: none;
      }

      &:hover {
        .el-icon-circle-close {
          display: block;
        }

        .el-icon-arrow-down.clearable {
          display: none;
        }
      }
    }
  }

  > > > .el-dialog__body {
    height: 70vh;
    padding: 0 0 10px !important;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .JNPF-common-search-box {
      margin-bottom: 0;

      .JNPF-common-search-box-right {
        padding: 10px 10px 0 0;
      }
    }
  }
</style>
