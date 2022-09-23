<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <el-table v-loading="listLoading"  :data="list" size='mini' >
          <el-table-column prop="patrolPlanCode" label="检验计划编码" width="0" align="left"/>
          <el-table-column prop="patrolRulesCode" label="检验规则编码" width="0" align="left"/>
          <el-table-column prop="patrolRulesName" label="检验规则名称" width="0" align="left"/>
          <el-table-column prop="patrolUnit" label="检验单位" width="0" align="left"/>
          <el-table-column prop="patrolPlanStarttime" label="计划开始时间" width="0" align="left"/>
          <el-table-column prop="patrolPlanEndtime" label="计划结束时间" width="0" align="left"/>
          <el-table-column prop="patrolPlanStatusName" label="检验计划状态" width="0" align="left"/>
        </el-table>
      </div>
    </div>

  </div>
</template>

<script>
  import request from '@/utils/request'
  export default {
    components: {},
    data() {
      return {
        showAll: false,
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
      }
    },
    computed: {},
    created() {
      this.checked = this.value
      this.visible = true
    },
    mounted() {
     
    },
    methods: {
      initData(bdEquipmentId) {
        this.listLoading = true;
        request({
          url: `/api/project/XjrPatrolplanBase/getEquipmentUnPatrolList/`+bdEquipmentId,
          method: 'get',
        }).then(res => {
          this.list = res.data
          console.log(this.list);
          this.listLoading = false
        })
      },
      closeDialog() {
        
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
