<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <el-table v-loading="listLoading"  :data="list" size='mini' >
          <el-table-column prop="inspectionItems" label="管理项目" width="0" align="left" />
          <el-table-column prop="standardValue" label="标准值" width="0" align="left" />
          <el-table-column prop="unit" label="单位" width="0" align="left" />
          <el-table-column prop="inspectionMethod" label="检查方法" width="0" align="left" />
          <el-table-column prop="inspectionFrequency" label="检查频率" width="0" align="left" />
          <el-table-column prop="patrolRecordContent" label="检验记录结果" width="0" align="left" >
            <template slot-scope="scope">
              <el-input v-if="!isEdit"   v-model="scope.row.patrolRecordContent" placeholder="请填写检验结果"   :style='{"width":"100%"}' >
              </el-input>
              <span v-if="isEdit" >{{scope.row.patrolRecordContent}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer"  v-if="!isEdit" class="dialog-footer" style="background:#ffffff">
          <el-button style="float: right;"  @click="closeDialog">取消</el-button>
          <el-button style="float: right;margin-right: 15px;" type="primary" @click="updateXjrPatrolplanDeviceContent()">保存</el-button>
      </span>
    </div>

  </div>
</template>

<script>
  import request from '@/utils/request'

  export default {
    components: {},
    props:['patrolPlanContentId','isEdit'],
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
      initData() {
        this.listLoading = true;
        let contentId=this.patrolPlanContentId;
        request({
          url: `/api/project/XjrPatrolplanBase/patrolplanDeviceContentListByContentId/`+contentId,
          method: 'get',
        }).then(res => {
          this.list = res.data
          this.listLoading = false
        })
      },
      updateXjrPatrolplanDeviceContent(){
        var _data =JSON.parse(JSON.stringify(this.list));
          request({
              url: '/api/project/XjrPatrolplanBase/updatePatrolplanDeviceContent',
              method: 'post',
              data: _data
          }).then((res) => {
              if(res.code==200){
                this.$message({
                    message: "填写成功",
                    type: 'success',
                    duration: 1000,
                    onClose: () => {
                        this.$emit('clickDeviceContentDataDisplay');
                    }
                })
              }else{
                this.$message({
                    message: "填写失败",
                    type: 'success',
                    duration: 1000,
                    onClose: () => {
                    }
                });
              }
          });
      },
      closeDialog() {
        this.$emit('clickDeviceContentDataDisplay');
      },
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
