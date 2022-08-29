<template>
  <el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'"
             :close-on-click-modal="false" append-to-body
             :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
             width="1400px">
    <el-row :gutter="15" class="">
      <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="right">
        <template v-if="!loading">
          <el-col :span="8">
            <el-form-item label="箱号" prop="boxNum">
              <el-input v-model="dataForm.boxNum" placeholder="自动生成或手工填写" clearable :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户名称" prop="clientName">
              <el-input v-model="dataForm.clientName" placeholder="请选择客户" readonly clearable :style='{"width":"100%"}'
                        @click.native="chooseClient()">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="false">
            <el-form-item label="供应商ID" prop="clientId">
              <el-input v-model="dataForm.clientId" readonly clearable :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="padding-bottom:28px;float:left">
            <el-button type="primary" @click="chooseProduct">选择产品</el-button>
          </el-col>
          <el-col :span="8" v-if="false">
            <el-form-item label="产品ID" prop="productId">
              <el-input v-model="dataForm.productId" readonly clearable :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="尺寸" prop="size">
              <el-input v-model="dataForm.size" placeholder="请选择产品" readonly clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="规格" prop="specification">
              <el-input v-model="dataForm.specification" placeholder="请选择产品" readonly clearable
                        :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="false">
            <el-form-item label="单位ID" prop="uomId">
              <el-input v-model="dataForm.uomId" readonly clearable :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单位" prop="uomUnit">
              <el-input v-model="dataForm.uomUnit" placeholder="请选择产品" readonly clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="装箱时间" prop="packingTime">
              <el-date-picker v-model="dataForm.packingTime" placeholder="请选择" clearable :style='{"width":"100%"}'
                              type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="timestamp">

              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="箱重" prop="boxWeight">
              <el-input v-model="dataForm.boxWeight" placeholder="请输入" clearable :style='{"width":"100%"}'
                        @change="totalNumber()">

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="纸管重量合计" prop="paperTubeWeight">
              <el-input v-model="dataForm.paperTubeWeight" placeholder="请输入" readonly clearable
                        :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="称重合计" prop="weighTotal">
              <el-input v-model="dataForm.weighTotal" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="净重合计" prop="totalNetWeight">
              <el-input v-model="dataForm.totalNetWeight" readonly clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="毛重合计" prop="totalGrossWeight">
              <el-input v-model="dataForm.totalGrossWeight" readonly clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="装箱人" prop="producerId">
              <user-search v-model="dataForm.producerId" :name="dataForm.producerName" :defaultLogin="true"
                           @name="value => { dataForm.producerName = value }">
              </user-search>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="FRP管重量合计" prop="frp" label-width="130px">
              <el-input v-model="dataForm.frp" clearable readonly :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生产车间" prop="workShopName">
              <el-select v-model="dataForm.workShopCode" clearable :style='{"width":"100%"}' :multiple="false"
                         @change="workShopNameChange">
                <el-option v-for="(item, index) in workShopNameOptions" :key="index"
                           :label="item.name" :value="item.code" :disabled="item.disabled">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户物料编码" prop="customerProductCode" label-width="130px">
              <el-input v-model="dataForm.customerProductCode" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户订单号" prop="customerOrderNum">
              <el-input v-model="dataForm.customerOrderNum" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="dataForm.remark" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label-width="0">
              <div class="JNPF-common-title">
                <h2>明细</h2>
                <el-form-item label="扫描卷号" prop="titleRollNum">
                  <el-input v-model="titleRollNum" placeholder="请扫描子卷号" clearable :style='{"width":"100%"}'
                            @keyup.enter.native="scanningDivide()">
                  </el-input>
                </el-form-item>
              </div>
              <el-table :data="dataForm.bdboxlineList" size='large'>
                <el-table-column type="index" width="50" label="序号" align="center"/>
                <el-table-column prop="rollId" label="卷号ID" v-if="false">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.rollId" readonly clearable :style='{"width":"100%"}'>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="rollNum" label="卷号" width="200">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.rollNum" placeholder="请输入" readonly clearable
                              :style='{"width":"100%"}'>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="materialId" label="物料ID" v-if="false">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.materialId" readonly clearable :style='{"width":"100%"}'>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="materialCode" label="物料编码" width="200">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.materialCode" placeholder="请输入" readonly clearable
                              :style='{"width":"100%"}'>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="materialName" label="物料名称" width="200">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.materialName" placeholder="请输入" readonly clearable
                              :style='{"width":"100%"}'>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="specification" label="规格型号" width="200">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.specification" placeholder="请输入" readonly clearable
                              :style='{"width":"100%"}'>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="productGradeName" label="产品等级" width="200">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.productGradeName" placeholder="请输入" readonly clearable
                              :style='{"width":"100%"}'>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="productGrade" label="产品等级编码" width="200" v-if="false">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.productGrade" placeholder="请输入" readonly clearable
                              :style='{"width":"100%"}'>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="uomUnit" label="单位" width="200">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.uomUnit" placeholder="请输入" readonly clearable
                              :style='{"width":"100%"}'>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="netWeight" label="净重" width="200">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.netWeight" placeholder="请输入" clearable
                              :style='{"width":"100%"}' @change="totalNumber()">
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="grossWeight" label="毛重" width="200">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.grossWeight" placeholder="请输入" clearable
                              :style='{"width":"100%"}'>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="paperTubeWeight" label="纸管重量" width="200">
                  <template slot-scope="scope">
                    <el-input-number v-model="scope.row.paperTubeWeight" placeholder="数字文本" :step="1"
                                     @change="totalNumber()">
                    </el-input-number>
                  </template>
                </el-table-column>
                <el-table-column prop="frp" label="Frp管重量" width="200">
                  <template slot-scope="scope">
                    <el-input-number v-model="scope.row.frp" placeholder="数字文本" :step="1" @change="totalNumber()">
                    </el-input-number>
                  </template>
                </el-table-column>
                <el-table-column prop="unitArea" label="单位面积" width="200">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.unitArea" placeholder="请输入" clearable
                              :style='{"width":"100%"}'>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="machineNumber" label="机台号" width="200">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.machineNumber" placeholder="请输入" readonly clearable
                              :style='{"width":"100%"}'>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="meters" label="米数" width="200">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.meters" placeholder="请输入" readonly clearable :style='{"width":"100%"}'>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="contractNo" label="合同号" width="200">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.contractNo" placeholder="请输入" readonly clearable
                              :style='{"width":"100%"}'>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="divideId" label="分切人" width="200">
                  <template slot-scope="scope">
                    <user-search v-model="scope.row.divideId" :name="scope.row.divideName"
                                 @name="value => { scope.row.divideName = value }">
                    </user-search>
                  </template>
                </el-table-column>
                <el-table-column prop="weighId" label="称重人" width="200">
                  <template slot-scope="scope">
                    <user-search v-model="scope.row.weighId" :name="scope.row.weighName"
                                 @name="value => { scope.row.weighName = value }">
                    </user-search>
                  </template>
                </el-table-column>
                <el-table-column prop="inspectorId" label="检验人" width="200">
                  <template slot-scope="scope">
                    <user-search v-model="scope.row.inspectorId" :name="scope.row.inspectorName"
                                 @name="value => { scope.row.inspectorName = value }">
                    </user-search>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="50" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" class="JNPF-table-delBtn"
                               @click="delbdboxlineList(scope.$index)">删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="table-actions" @click="chooseRoll()">
                <el-button type="text" icon="el-icon-plus">添加</el-button>
              </div>
            </el-form-item>
          </el-col>
          <el-dialog title="客户列表"
                     :close-on-click-modal="false" append-to-body
                     :visible.sync="clientChooseShow" class="JNPF-dialog JNPF-dialog_center" lock-scroll
                     v-if="clientChooseShow" width="1000px">
            <client-choose ref="ClientChoose" @onChange="dialogClientChange"></client-choose>
          </el-dialog>
          <el-dialog title="产品列表"
                     :close-on-click-modal="false" append-to-body
                     :visible.sync="productChooseShow" class="JNPF-dialog JNPF-dialog_center" lock-scroll
                     width="1000px">
            <product-choose ref="ProductChoose" @onChange="dialogProductChange"></product-choose>
          </el-dialog>
          <el-dialog title="分切记录列表"
                     :close-on-click-modal="false" append-to-body
                     :visible.sync="divideChooseShow" class="JNPF-dialog JNPF-dialog_center" lock-scroll
                     width="1000px">
            <divide-choose ref="DivideChoose" @onChange="dialogDivideChange"></divide-choose>
          </el-dialog>
        </template>
      </el-form>
    </el-row>
    <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false"> 取 消</el-button>
        <el-button type="primary" @click="dataFormSubmit()" v-if="!isDetail"> 确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import request from '@/utils/request'
  import {printProcessFlowChart} from '@/api/systemData/dataTeam'
  import ClientChoose from './clientChoose'
  import ProductChoose from './productChoose'
  import DivideChoose from './divideChoose'

  export default {
    components: {ClientChoose, ProductChoose, DivideChoose},
    props: [],
    data() {
      return {
        visible: false,
        loading: false,
        isDetail: false,
        clientChooseShow: false,
        productChooseShow: false,
        divideChooseShow: false,
        isFrp: false,
        dataForm: {
          boxNum: '',
          clientCode: '',
          clientName: '',
          clientId: '',
          size: '',
          productId: '',
          productName: '',
          productCode: '',
          contractNo: '',
          uomUnit: '',
          uomId: '',
          specification: '',
          packingTime: new Date().getTime(),
          boxWeight: '',
          paperTubeWeight: 0,
          weighTotal: '',
          totalNetWeight: 0,
          totalGrossWeight: 0,
          producerId: '',
          producerName: '',
          frp: 0,
          workShopCode: '',
          workShopName: '',
          customerProductCode: '',
          customerOrderNum: '',
          remark: '',
          productGrade: '',
          productGradeName: '',
          printTemplate: '',
          bdboxlineList: [],
        },
        titleRollNum: '',
        workShopNameOptions: [],
        rules:
          {
            boxWeight: [
              {
                required: true,
                message: '请选择',
                trigger: 'click'
              },
              {
                pattern: /^(\d+)(\.\d+)?$/,
                message: '请输入正确的数字',
                trigger: 'blur'
              },
            ],
            paperTubeWeight: [
              {
                pattern: /^(\d+)(\.\d+)?$/,
                message: '请输入正确的数字',
                trigger: 'blur'
              },
            ],
            weighTotal: [
              {
                required: true,
                message: '请选择',
                trigger: 'click'
              },
              {
                pattern: /^(\d+)(\.\d+)?$/,
                message: '请输入正确的数字',
                trigger: 'blur'
              },
            ],
            // customerProductCode: [
            //   {
            //     required: true,
            //     message: '请输入',
            //     trigger: 'blur'
            //   }
            // ],
            // customerOrderNum: [
            //   {
            //     required: true,
            //     message: '请输入',
            //     trigger: 'blur'
            //   }
            // ]
          },
        printTemplateTypeOptions: [],

      }
    },
    computed: {},
    watch: {},
    created() {

    },
    mounted() {
      this.getWorkShopNameOptions();
    },
    methods: {
      chooseClient() {
        this.clientChooseShow = true;
        this.$nextTick(() => {
          this.$refs.ClientChoose.initData();
        })
      },
      dialogClientChange(client) {
        this.dataForm.clientName = client.partnerName;
        this.dataForm.clientCode = client.partnerCode;
        this.dataForm.clientId = client.id;
        //查询打印模板类型下拉框
        request({
          url: `/api/project/PartnerPrintTemplate/${client.id}/Items/box`,
          method: 'get'
        }).then(res => {
          this.printTemplateTypeOptions = res.data;
        })
        this.clientChooseShow = false;
      },
      chooseProduct() {
        this.productChooseShow = true;
        this.$nextTick(() => {
          this.$refs.ProductChoose.initData();
        })
      },
      dialogProductChange(product) {
        this.dataForm.productId = product.id;
        this.dataForm.productCode = product.productCode;
        this.dataForm.productName = product.productName;
        this.dataForm.specification = product.specification;
        this.dataForm.size = product.size;
        this.dataForm.uomUnit = product.uomName;
        this.dataForm.uomId = product.uomId;
        this.productChooseShow = false;
      },
      printTemplate() {
        //TODO 设置打印参数
        var param = "roll_num:'" + this.dataForm.productId + "'";
        printProcessFlowChart(this.dataForm.printTemplate, param);
      },
      getWorkShopNameOptions() {
        let _query = {
          code: "BM000019"
        };
        request({
          url: `/api/project/stockApi/getDepartmentListNoPaging`,
          method: 'post',
          data: _query
        }).then(res => {
          this.workShopNameOptions = res.data
          this.dataForm.workShopName = res.data[0].name;
          this.dataForm.workShopCode = res.data[0].code;
        });
      },
      workShopNameChange(value) {
        if (value === "" || value === null) {
          this.dataForm.workShopCode = "";
          this.dataForm.workShopName = "";
        } else {
          let obj = this.workShopNameOptions.find(function (item) {
            return item.code === value;
          });
          this.dataForm.workShopCode = obj.code;
          this.dataForm.workShopName = obj.name;
        }
      },
      init(id, isDetail) {
        this.dataForm.id = id || 0;
        this.visible = true;
        this.isDetail = isDetail || false;
        this.$nextTick(() => {
          this.$refs['elForm'].resetFields();
          if (this.dataForm.id) {
            this.loading = true
            request({
              url: '/api/project/BdBox/' + this.dataForm.id,
              method: 'get'
            }).then(res => {
              this.dataInfo(res.data);
              this.loading = false;

            })
          } else {
            this.reset();
            this.getWorkShopNameOptions();
          }

        })
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['elForm'].validate((valid) => {
          if (valid) {
            this.request()
          }
        })
      },
      request() {
        let _data = this.dataList()
        if (!this.dataForm.id) {
          request({
            url: '/api/project/BdBox',
            method: 'post',
            data: _data
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
        } else {
          request({
            url: '/api/project/BdBox/' + this.dataForm.id,
            method: 'PUT',
            data: _data
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
        }
      },
      delbdboxlineList(index) {
        this.dataForm.totalNetWeight = (parseFloat(this.dataForm.totalNetWeight) - this.dataForm.bdboxlineList[index].netWeight).toFixed(2);
        this.dataForm.bdboxlineList.splice(index, 1);
        this.totalNumber();
        if (this.dataForm.bdboxlineList.length === 0)
          this.reset();
      },
      dataList() {
        return JSON.parse(JSON.stringify(this.dataForm));
      },
      dataInfo(dataAll) {
        this.dataForm = dataAll
      },
      chooseRoll() {
        if (!this.dataForm.productId) {
          this.$message({
            message: '请先选择产品!',
            type: 'info'
          })
          return;
        }
        if (!this.dataForm.clientId) {
          this.$message({
            message: '请先选择客户!',
            type: 'info'
          })
          return;
        }
        this.divideChooseShow = true;
        this.$nextTick(() => {
          this.$refs.DivideChoose.query.size = this.dataForm.size;
          this.$refs.DivideChoose.query.customerName = this.dataForm.clientName;
          this.$refs.DivideChoose.initData();
        })
      },

      dialogDivideChange(data) {
        debugger
        for (let i = 0; i < data.length; i++) {
          let query = {
            rollNum: data[i],
            specification: this.dataForm.size,
            customerCode: this.dataForm.clientCode,
            productGrade: this.dataForm.productGrade,
            contractNo: this.dataForm.contractNo,
          }
          this.commonScanningDivide(query);
          this.divideChooseShow = false;
        }
      },
      scanningDivide() {
        let titleRollNum = this.titleRollNum.trim().toUpperCase();
        if (titleRollNum === ''
          || titleRollNum === undefined) {
          this.$message({
            message: "扫描卷号不能为空!",
            type: 'error',
            duration: 2000,
          })
          return;
        }
        let query = {
          rollNum: titleRollNum,
          specification: this.dataForm.size,
          customerCode: this.dataForm.clientCode,
          productGrade: this.dataForm.productGrade,
          contractNo: this.dataForm.contractNo,
        }
        this.commonScanningDivide(query);
        this.titleRollNum = '';
      },
      commonScanningDivide(query) {
        let exist = this.dataForm.bdboxlineList.some(o => o.rollNum === query.rollNum); //去重复
        if (exist) {
          this.$message({
            message: "卷号" + query.rollNum + "重复!",
            type: 'error',
            duration: 2000,
          })
          this.titleRollNum = '';
          return;
        }
        let detailCount = this.dataForm.bdboxlineList.length;
        if (detailCount === 0) {
          query.firstRoll = true;
          request({
            url: '/api/project/stockApi/getRollInfo',
            method: 'post',
            data: query
          }).then((res) => {
            let data = res.data;
            this.dataForm.clientName = data.customerName;
            this.dataForm.clientCode = data.customerCode;
            this.dataForm.clientId = data.customerId;

            this.dataForm.customerProductCode = data.customerProductCode;

            this.dataForm.customerOrderNum = data.customerOrderNum;

            this.dataForm.productGrade = data.productGrade;
            this.dataForm.productGradeName = data.productGradeName;

            //扫描卷号时自动添加产品信息
            this.dataForm.productId = data.materialId;
            this.dataForm.productCode = data.materialCode;
            this.dataForm.productName = data.materialName;
            this.dataForm.specification = data.spec;
            this.dataForm.size = data.specification;
            this.dataForm.uomUnit = data.uomUnit;
            this.dataForm.uomId = data.uomId;
            this.dataForm.contractNo = data.contractNo;
            this.isFrp = data.isFrp;
            this.transferLineData(data);
          })
        } else {
          query.firstRoll = false;
          query.isFrp = this.isFrp;
          request({
            url: '/api/project/stockApi/getRollInfo',
            method: 'post',
            data: query
          }).then((res) => {
            let data = res.data;
            this.transferLineData(data);
          })
        }
      },
      transferLineData(data) {
        this.dataForm.totalNetWeight = (parseFloat(this.dataForm.totalNetWeight) + data.netWeight).toFixed(3);
        this.dataForm.paperTubeWeight = (parseFloat(this.dataForm.paperTubeWeight) + data.paperTubeWeight).toFixed(3);
        this.dataForm.frp = (parseFloat(this.dataForm.frp) + data.frp).toFixed(3);
        this.dataForm.totalGrossWeight = (parseFloat(this.dataForm.totalGrossWeight) + data.paperTubeWeight + data.frp + data.netWeight).toFixed(3);

        let detail = {
          rollId: data.id,
          rollNum: data.rollNum,
          materialId: data.materialId,
          materialCode: data.materialCode,
          materialName: data.materialName,
          specification: data.specification,
          productGrade: data.productGrade,
          productGradeName: data.productGradeName,
          uomId: data.uomId,
          uomUnit: data.uomUnit,
          netWeight: data.netWeight,
          grossWeight: data.grossWeight,
          paperTubeWeight: data.paperTubeWeight,
          frp: data.frp,
          unitArea: data.unitArea,
          machineNumber: data.machineNumber,
          meters: data.meters,
          contractNo: data.contractNo,
          divideId: data.divideId,
          divideName: data.divideName,
          weighId: data.weighId,
          weighName: data.weighName,
          inspectorId: data.inspectorId,
          inspectorName: data.inspectorName,
          warehouseCode: data.warehouseCode,
          warehouseName: data.warehouseName,
          stockLocationCode: data.stockLocationCode,
          stockLocationName: data.stockLocationName
        }
        this.dataForm.bdboxlineList.push(detail)
      },
      totalNumber() {
        let _frp = 0;
        let _paperTubeWeight = 0;
        let _netWeight = 0;
        for (let i = 0; i < this.dataForm.bdboxlineList.length; i++) {
          let frp = this.dataForm.bdboxlineList[i].frp;
          let paperTubeWeight = this.dataForm.bdboxlineList[i].paperTubeWeight;
          let netWeight = this.dataForm.bdboxlineList[i].netWeight;
          if (this.isNumber(frp))
            _frp = _frp + parseFloat(frp);
          if (this.isNumber(paperTubeWeight))
            _paperTubeWeight = _paperTubeWeight + parseFloat(paperTubeWeight);
          if (this.isNumber(netWeight))
            _netWeight = _netWeight + parseFloat(netWeight);
        }
        this.dataForm.totalNetWeight = _netWeight.toFixed(3);
        this.dataForm.paperTubeWeight = _paperTubeWeight.toFixed(3);
        this.dataForm.frp = _frp.toFixed(3);
        if (this.isNumber(this.dataForm.boxWeight))
          this.dataForm.totalGrossWeight = (parseFloat(this.dataForm.totalNetWeight) + _paperTubeWeight + _frp + parseFloat(this.dataForm.boxWeight)).toFixed(3);
        else
          this.dataForm.totalGrossWeight = (parseFloat(this.dataForm.totalNetWeight) + _paperTubeWeight + _frp).toFixed(3);
      },
      reset() {
        for (let key in this.dataForm) {
          if (key === "packingTime") {
            this.dataForm[key] = new Date().getTime();
            continue;
          } else if (key === "bdboxlineList") {
            this.dataForm[key] = [];
            continue;
          } else if (key === "totalNetWeight"
            || key === "totalGrossWeight"
            || key === "paperTubeWeight"
            || key === "frp") {
            this.dataForm[key] = 0;
            continue;
          }
          this.dataForm[key] = ''
        }
        this.titleRollNum = ''
        this.isFrp = false;
      },
      isNumber(num) {
        let numReg = /^(\d+)(\.\d+)?$/
        let numRe = new RegExp(numReg)
        return numRe.test(num);
      }
    }
  }

</script>
