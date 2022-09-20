<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <el-table v-loading="listLoading"  :data="list" size='mini' >
          <el-table-column prop="bdEquipmentName" label="设备名称" width="0" align="left" />
          <el-table-column prop="xjrPatrolplanBaseInfoVO.patrolRulesCode" label="巡检编码" width="0" align="left" />
          <el-table-column prop="xjrPatrolplanBaseInfoVO.patrolRulesName" label="巡检名称" width="0" align="left" />
          <el-table-column prop="xjrPatrolplanBaseInfoVO.patrolPlanHandleuser" label="巡检人工号" width="0" align="left" />
          <el-table-column prop="xjrPatrolplanBaseInfoVO.patrolPlanHandleusername" label="巡检人" width="0" align="left" />
          <el-table-column prop="xjrPatrolplanBaseInfoVO.patrolPlanStarttime" label="开始时间" width="0" align="left" />
          <el-table-column prop="xjrPatrolplanBaseInfoVO.patrolRecordTime" label="结束时间" width="0" align="left" />
          <el-table-column prop="xjrPatrolplanBaseInfoVO.patrolPlanStatus" label="巡检状态" width="0" align="left" />
        </el-table>
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
        debugger;
        this.listLoading = true;
        let _query = {
          bdEquipmentId:bdEquipmentId,
        };
        request({
          url: `/api/project/ProductTrace/getEuipmentPatrolContentDetail`,
          method: 'post',
          data: _query
        }).then(res => {
          this.list = res.data
          this.listLoading = false
        })
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
