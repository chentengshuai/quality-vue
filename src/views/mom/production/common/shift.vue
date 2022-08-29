<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-button type="primary" @click="submit">保存</el-button>
      </el-row>
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-descriptions class="margin-top" title="基础信息" :column="2" border>
          <!--          <template slot="extra">-->
          <!--            <el-button type="primary" size="small">操作</el-button>-->
          <!--          </template>-->
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              卷号
            </template>
            {{basicInfo.rollNum}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-mobile-phone"></i>
              规格
            </template>
            {{basicInfo.spec}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-location-outline"></i>
              机台
            </template>
            {{basicInfo.stationName}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-tickets"></i>
              工序
            </template>
            {{basicInfo.processName}}
          </el-descriptions-item>
        </el-descriptions>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table :data="basicInfo.shiftChangeList" size='mini'>
            <el-table-column type="index" width="50" label="序号" align="center"/>
            <el-table-column prop="teamName" label="班组" >
              <template slot-scope="scope">
                <el-select v-model="scope.row.teamId" placeholder="请选择" clearable filterable
                           :style='{"width":"100%"}' @change="teamChange($event, scope.row)">
                  <el-option v-for="item in teamSelector" :value="item.id" :key="item.id" :label="item.teamName">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="shiftName" label="班次" >
              <template slot-scope="scope">
                <el-select v-model="scope.row.shiftId" placeholder="请选择" clearable filterable
                           :style='{"width":"100%"}' @change="shiftChange($event, scope.row)">
                  <el-option v-for="item in shiftSelector" :value="item.id" :key="item.id"
                             :label="item.classesName">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="producerId" label="操作人" width="170">
              <template slot-scope="scope">
                <user-search v-model="scope.row.producerId" :name="scope.row.producerName" :defaultLogin="true"
                             @name="value => { scope.row.producerName = value }"></user-search>
              </template>
            </el-table-column>
            <el-table-column prop="finishedLength" label="收卷米数" >
              <template slot-scope="scope">
                <el-input v-model="scope.row.finishedLength" placeholder="请输入" clearable :style='{"width":"100%"}'>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column prop="finishedWeight" label="产量KG" >
              <template slot-scope="scope">
                <el-input v-model="scope.row.finishedWeight" placeholder="请输入" clearable :style='{"width":"100%"}'>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column prop="defectiveReason" label="废品原因" width="250">
              <template slot-scope="scope">
                <el-input v-model="scope.row.defectiveReason" placeholder="请输入" clearable :style='{"width":"100%"}'>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column prop="defectiveWeight" label="废品重量KG">
              <template slot-scope="scope">
                <el-input v-model="scope.row.defectiveWeight" placeholder="请输入" clearable :style='{"width":"100%"}'>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column prop="recordTime" label="记录时间" width="220">
              <template slot-scope="scope">
                <el-date-picker v-model="scope.row.recordTime" placeholder="请选择" clearable
                                :style='{"width":"100%"}' type="datetime" format="yyyy-MM-dd HH:mm:ss"
                                value-format="timestamp">
                </el-date-picker>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="50">
              <template slot-scope="scope">
                <el-button size="mini" type="text" class="JNPF-table-delBtn"
                           @click="delShiftList(scope.$index)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="table-actions" @click="addList()">
            <el-button type="text" icon="el-icon-plus">添加</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import request from '@/utils/request'

  export default {
    name: 'shift',
    components: {},
    props: ["processId", "processName"],
    data() {
      return {
        basicInfo: {
          rollNum: null,
          spec: null,
          stationId: null,
          stationName: null,
          processName: null,
          shiftChangeList: [],
        },
        teamSelector: [],
        shiftSelector: [],
        listLoading: true,
        total: 0,
      }
    },
    computed: {},
    created() {
      this.initTeamSelector();
      this.initShiftSelector();
    },
    methods: {
      sortChange({column, prop, order}) {
        this.listQuery.sort = order == 'ascending' ? 'asc' : 'desc'
        this.listQuery.sidx = !order ? '' : prop
        this.initData()
      },
      initTeamSelector() {
        request({
          url: '/api/project/BizBaseDataTeam/Data/Selector',
          method: 'get'
        }).then(res => {
          this.teamSelector = res.data;
        })
      },
      initShiftSelector() {
        request({
          url: '/api/project/BizBaseDataClasses/Data/Selector',
          method: 'get'
        }).then(res => {
          this.shiftSelector = res.data;
        })
      },
      teamChange(teamId, row) {
        this.teamSelector.forEach(x => {
          if (x.id === teamId) {
            row.teamName = x.teamName;
          }
        });
      },
      shiftChange(shiftId, row) {
        this.shiftSelector.forEach(x => {
          if (x.id === shiftId) {
            row.shiftName = x.classesName;
          }
        });
      },
      initData() {
        this.listLoading = true;
        request({
          url: `/api/project/ShiftChange/byProcessId`,
          method: 'post',
          params: {
            processId: this.processId,
            processName: this.processName,
          }
        }).then(res => {
          this.basicInfo = res.data;
          this.listLoading = false;
        })
      },
      submit() {
        this.
        request({
          url: '/api/project/ShiftChange/batch',
          method: 'POST',
          data: this.basicInfo
        }).then((res) => {
          this.$message({
            message: res.msg,
            type: 'success',
            duration: 1000,
            onClose: () => {
              this.visible = false
              this.$emit('refresh', true)
            }
          })
        })
      },
      reset() {
      },
      addList() {
        let item = {}
        this.basicInfo.shiftChangeList.push(item)
        // this.$set(this.basicInfo.shiftChangeList[0], "producerId", this.basicInfo.shiftChangeList.length);
        // this.$set(this.basicInfo.shiftChangeList[0], "producerName", this.basicInfo.shiftChangeList.length + 'xxx');
        // console.log(this.basicInfo.shiftChangeList);
      },
      delShiftList(index) {
        this.basicInfo.shiftChangeList.splice(index, 1);
      },
    }
  }
</script>
