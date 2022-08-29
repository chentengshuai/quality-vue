<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="箱号">
              <el-input v-model="query.boxNum" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户名称">
              <el-input v-model="query.clientName" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="子卷号">
              <el-input v-model="query.rollNum" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <template v-if="showAll">
            <el-col :span="6">
              <el-form-item label="规格">
                <el-input v-model="query.specification" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="装箱时间">
                <el-date-picker v-model="query.packingTime" type="daterange"
                                value-format="timestamp" format="yyyy-MM-dd" start-placeholder="开始日期"
                                end-placeholder="结束日期">
                </el-date-picker>
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
        <JNPF-table v-loading="listLoading" :data="list" @expand-change="expandChange" @sort-change='sortChange'
                    @selection-change="selectionChange" hasC>
          <el-table-column type="expand" width="40">
            <template slot-scope="props">
              <el-tabs v-model="props.row.activeName">
                <el-tab-pane label="产品明细">
                  <el-table :data="props.row.childTable" stripe size='mini'
                            :element-loading-text="$t('common.loadingText')">
                    <el-table-column type="index" width="50" label="序号" align="center"/>
                    <el-table-column prop="rollNum" label="卷号"/>
                    <el-table-column prop="materialCode" label="物料编码"/>
                    <el-table-column prop="materialName" label="物料名称"/>
                    <el-table-column prop="specification" label="规格型号"/>
                    <el-table-column prop="productGradeName" label="产品等级"/>
                    <el-table-column prop="uomUnit" label="单位"/>
                    <el-table-column prop="netWeight" label="净重"/>
                    <el-table-column prop="grossWeight" label="毛重"/>
                    <el-table-column prop="unitArea" label="单位面积"/>
                    <el-table-column prop="machineNumber" label="机台号"/>
                    <el-table-column prop="meters" label="米数"/>
                    <el-table-column prop="divideName" label="分切人"/>
                    <el-table-column prop="weighName" label="称重人"/>
                    <el-table-column prop="inspectorName" label="检验人"/>
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </template>
          </el-table-column>
          <el-table-column prop="boxNum" label="箱号" width="0" align="left"/>
          <el-table-column prop="oldBoxNum" label="原箱号" width="0" align="left"/>
          <el-table-column prop="boeStatus" label="单据状态" width="0" algin="left">
            <template slot-scope="scope">
              {{ scope.row.boeStatus | dynamicTextByCode(boxStatusOptions) }}
            </template>
          </el-table-column>
          <el-table-column prop="clientName" label="客户名称" width="0" align="left"/>
          <el-table-column prop="size" label="尺寸" width="0" align="left"/>
          <el-table-column prop="specification" label="规格" width="0" align="left"/>
          <el-table-column prop="packingTime" label="装箱时间" width="0" align="left"/>
          <el-table-column prop="boxWeight" label="箱重" width="0" align="left"/>
          <el-table-column prop="paperTubeWeight" label="纸管重量" width="0" align="left"/>
          <el-table-column prop="weighTotal" label="称重合计" width="0" align="left"/>
          <el-table-column prop="totalNetWeight" label="净重合计" width="0" align="left"/>
          <el-table-column prop="totalGrossWeight" label="毛重合计" width="0" align="left"/>
          <el-table-column prop="producerId" label="装箱人" width="0" align="left"/>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button type="text" v-if="scope.row.boeStatus == 0"
                         @click="submitBoe(scope.row.id,'submit')">提交
              </el-button>
              <el-button type="text" v-if="scope.row.boeStatus == 0"
                         @click="addOrUpdateHandle(scope.row.id)">编辑
              </el-button>
              <el-button type="text" v-if="scope.row.boeStatus == 1"
                         @click="submitBoe(scope.row.id,'revoke')">撤销
              </el-button>
              <el-button type="text" v-if="scope.row.boeStatus == 1 || scope.row.boeStatus == 2"
                         @click="printBoxLabel(scope.row.boxNum,'look')">打印箱号
              </el-button>
              <el-button type="text" v-if="scope.row.boeStatus == 1 || scope.row.boeStatus == 2"
                         @click="addOrUpdateHandle(scope.row.id,'look')">详情
              </el-button>
              <el-button type="text" class="JNPF-table-delBtn" v-if="scope.row.boeStatus == 0"
                         @click="handleDel(scope.row.id)">删除
              </el-button>
              <el-button type="text" class="JNPF-table-delBtn" v-if="scope.row.boeStatus == 0"
                         @click="updateBoxNumHandle(scope.row.id)">修改箱号
              </el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
                    @pagination="initData"/>
      </div>
    </div>
    <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh"/>
    <BOXNUM-Form v-if="boxVisible" ref="BOXNUMForm" @refresh="refresh"/>
    <ExportBox v-if="exportBoxVisible" ref="ExportBox" @download="download"/>
    <div id="printBox" v-show="false">
      <table border="1" width="100%" style="border:solid 1px black;border-collapse:collapse;font-size: 14px;text-align: center;
            font-family: 'HarmonyOS Sans SC Medium', 'Microsoft YaHei UI', Arial, serif;"><tr>
        <td width="100" height="27"  style="border:solid 1px black"><b>箱号：</b></td>
        <td width="210" height="27"  colspan=3 style="border:solid 1px black;"><b>{{ commonPrint.boxNum }}</b></td>
<!--        <td width="85" height="22"  style="border:solid 1px black"><b>客户订单号：</b></td>-->
<!--        <td width="85" height="22" style="border:solid 1px black"><b>{{ commonPrint.customerOrderNum }}</b></td>-->
<!--        <tr>-->
<!--          <td width="100" height="22"  style="border:solid 1px black"><b>客户：</b></td>-->
<!--          <td width="210" height="22" colspan=3 style="border:solid 1px black;text-align:left;"><b>{{ commonPrint.customerName }}</b></td>-->
<!--        </tr>-->
        <tr>
          <td width="100" height="27"  style="border:solid 1px black"><b>净重：</b></td>
          <td width="80" height="27" style="border:solid 1px black;"><b>{{ commonPrint.netWeight }}</b></td>
          <td width="50" height="27"  style="border:solid 1px black"><b>毛重：</b></td>
          <td width="80" height="27" style="border:solid 1px black"><b>{{ commonPrint.grossWeight }}</b></td>
        </tr>
        <tr>
          <td width="100" height="25"  style="border:solid 1px black"><b>尺寸：</b></td>
          <td width="80" height="25" colspan="3" style="border:solid 1px black;"><b>{{ commonPrint.size }}</b></td>
<!--          <td width="100" height="22"  style="border:solid 1px black"><b>客户物料编码：</b></td>-->
<!--          <td width="210" height="22" colspan=3 style="border:solid 1px black;text-align:left;"><b>{{ commonPrint.customerProductCode }}</b></td>-->
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  import request from '@/utils/request'
  import JNPFForm from './Form'
  import ExportBox from './ExportBox'
  import BOXNUMForm from './boxForm'
  import {getDictionaryDataByTypeCode} from '@/api/systemData/dictionary'
  import {printProcessFlowChart} from "@/api/systemData/dataTeam";
  import ReconnectingWebSocket from "reconnecting-websocket";

  export default {
    components: {JNPFForm, ExportBox, BOXNUMForm},
    data() {
      return {
        showAll: false,

        query: {
          boxNum: undefined,
          clientName: undefined,
          specification: undefined,
          packingTime: undefined,
          rollNum: undefined
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
        boxVisible: false,
        columnList: [
          {prop: 'boxNum', label: '箱号'},
          {prop: 'clientName', label: '客户名称'},
          {prop: 'size', label: '尺寸'},
          {prop: 'specification', label: '规格'},
          {prop: 'packingTime', label: '装箱时间'},
          {prop: 'boxWeight', label: '箱重'},
          {prop: 'paperTubeWeight', label: '纸管重量'},
          {prop: 'weighTotal', label: '称重合计'},
          {prop: 'totalNetWeight', label: '净重合计'},
          {prop: 'totalGrossWeight', label: '毛重合计'},
          {prop: 'producerId', label: '装箱人'},
        ],
        boxStatusOptions: [],
        commonPrint: {},
        lodopUrl: {
          boxLable: '/api/project/BdBox/commonBoxPrint',
        },
        lodopTable: {
          boxLable: 'commonPrint',
        }
      }
    },
    computed: {},
    created() {
      this.initData()
      this.getBoxStatusList();
      this.getPrintTemplate();
      this.initWebSocket();
    },
    methods: {
      getPrintTemplate() {
        //查询打印模板类型下拉框
        request({
          url: `/api/project/LabelTemplate/Items/box`,
          method: 'get'
        }).then(res => {
            this.printTemplate = res.data[0];
        })
      },
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
          url: `/api/project/BdBox/getList`,
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
      handleDel(id) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          request({
            url: `/api/project/BdBox/${id}`,
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
      addOrUpdateHandle(id, isDetail) {
        this.formVisible = true
        this.$nextTick(() => {
          this.$refs.JNPFForm.init(id, isDetail)
        })
      },
      updateBoxNumHandle(id, isDetail) {
        this.boxVisible = true
        this.$nextTick(() => {
          this.$refs.BOXNUMForm.init(id, isDetail)
        })
      },
      submitBoe(id, action) {
        var msg = "";
        if (action == 'submit') {
          msg = "是否确认提交？";
        } else if (action == 'revoke') {
          msg = "是否确认撤销？";
        }
        this.$confirm(msg, '提示', {
          type: 'warning'
        }).then(() => {
          request({
            url: `/api/project/BdBox/submitBoe/${id}/${action}`,
            method: 'PUT'
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
      exportData() {
        this.exportBoxVisible = true
        this.$nextTick(() => {
          this.$refs.ExportBox.init(this.columnList)
        })
      },
      download(data) {
        let query = {...data, ...this.listQuery, ...this.query}
        request({
          url: `/api/project/BdBox/Actions/Export`,
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
      },
      selectionChange(list) {
        this.ids = list.map((x) => x.id).join(',')
      },
      expandChange(rows) {
        rows.isExpanded = !rows.isExpanded
        if (!rows.isExpanded) return
        if (rows.childTable.length) return
        request({
          url: `/api/project/BdBox/${rows.id}/Items`,
          method: 'get'
        }).then(res => {
          rows.childTable = res.data
        })
      },
      getBoxStatusList() {
        getDictionaryDataByTypeCode('boxStatus').then(res => {
          this.boxStatusOptions = res.data
        }).catch(() => {
        })
      },
      printBoxLabel(boxNum) {
        const templateObj = this.printTemplate;
        if (templateObj.remark === 'lodop') {
          this.printTemplateLodop(templateObj, boxNum);
        } else {
          this.printFRTemplate(templateObj, boxNum);
        }
      },
      printTemplateLodop(templateObj, boxNum) {
        debugger
        let LODOP = window.LODOP;
        request({
          url: this.lodopUrl[templateObj.name],
          method: 'post',
          params: {
            boxNum: boxNum,
            templateName: templateObj.name
          }
        }).then((res) => {
          this[this.lodopTable[templateObj.name]] = res.data;
          setTimeout(() => {
            eval(res.data.template);
          })
        })
      },
      printFRTemplate(templateObj, boxNum) {
        //TODO 设置打印参数
        var param = "roll_num:'" + boxNum + "'";
        printProcessFlowChart(templateObj.templatePath, param);
      },
      initWebSocket() {
        if ('WebSocket' in window) {
          this.socket = new ReconnectingWebSocket(this.define.WebSocketUrl)
          //添加事件监听
          let socket = this.socket
          socket.onopen = () => {
            let onConnection = {
              "method": "OnBoxPrintRegister"
            }
            socket.send(JSON.stringify(onConnection))
          }
          socket.onmessage = (event) => {
            let data = JSON.parse(event.data)
            this.printTemplateLodop(data.templateName, data.boxNum);
            console.log(data);
          }
        }
      },
    }
  }
</script>
