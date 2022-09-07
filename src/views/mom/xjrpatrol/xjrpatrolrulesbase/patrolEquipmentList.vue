<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
          <el-row class="JNPF-common-search-box" :gutter="16">
            <el-form @submit.native.prevent>
              <el-col :span="8">
                <el-form-item label="设备编码">
                  <el-input v-model="query.equipmentCode" placeholder="请输入设备编码查询" clearable
                    @keyup.enter.native="search()" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备名称">
                  <el-input v-model="query.equipmentName" placeholder="请输入设备名称" clearable
                    @keyup.enter.native="search()" />
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
            <div class="JNPF-common-search-box-right">
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                  @click="reset()" />
              </el-tooltip>
            </div>
          </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <el-table v-loading="listLoading"  :data="list" size='mini' @row-click="rowClick">
          <el-table-column prop="equipmentCode" label="设备编码" width="0" align="left" />
          <el-table-column prop="equipmentName" label="设备名称" width="0" align="left" />
          <el-table-column prop="productionProcessName" label="生产工序" width="0" align="left" />
          <el-table-column prop="productLinesName" label="所属产线" width="0" align="left" />
          <el-table-column prop="equipmentCategoryName" label="所属设备类别" width="0" align="left" />
        </el-table>
        <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
                    @pagination="initData"/>
      </div>
      <!-- <span slot="footer" class="dialog-footer" style="background:#ffffff">
          <el-button style="float: right;"  @click="closeDialog">{{$t('common.cancelButton')}}</el-button>
          <el-button style="float: right;margin-right: 15px;" type="primary" @click="select()">{{$t('common.confirmButton')}}</el-button>
        </span> -->
    </div>

  </div>
</template>

<script>
  import request from '@/utils/request'
  import ExportBox from './ExportBox'

  export default {
    components: {ExportBox},
    data() {
      return {
        showAll: false,
        query: { 
          equipmentCode: undefined,
          equipmentName: undefined,
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
        checkedTxt: '',
        checkedRow: {},
        listQuery: {
          currentPage: 1,
          pageSize: 20,
          sort: "desc",
          sidx: "",
        },
        formVisible: false,
        exportBoxVisible: false,
        columnList: [
          {prop: 'equipmentCode', label: '设备编码'},
          {prop: 'equipmentName', label: '设备名称'},
          {prop: 'productionProcessName', label: '生产工序'},
          {prop: 'productLinesName', label: '所属产线'},
          {prop: 'equipmentCategoryName', label: '所属设备类别'},
          
        ],
      }
    },
    computed: {},
    created() {
      this.checked = this.value
      this.visible = true
    },
    mounted() {
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
          url: `/api/project/BdEquipment/getPatrolRulesEquipmentList`,
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
        this.listQuery.boxNum = ''
        this.listQuery.clientName = ''
        this.listQuery.currentPage = 1
        this.listQuery.pageSize = this.hasPage ? this.pageSize : 20
        this.initData()
      },
      clear() {
            this.checked = ''
            this.innerValue = ''
            this.checkedRow = {}
            this.$emit('input', this.checked)
            this.$emit('change', this.checked, this.checkedRow)
      },
      rowClick(row, preRow) {
          this.$emit('bdEquipmentListDataForm', row)
      },
      handleSelectionChange(val) {
       // this.checked = val;
      },
      select() {
        //this.$emit('bdEquipmentListDataForm', this.checked)
      },
      closeDialog() {
        //this.$emit('clickPatrolEquipmentListDisplay', false)
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
    >>> input {
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
>>> .el-dialog__body {
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
