<template>
  <div>
    <el-row :gutter="15">
      <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="right"
               :disabled="setting.readonly">
        <template v-if="!loading">
          <el-col :span="12" v-if="judgeShow('moveNo') && dataForm.id">
            <el-form-item label="库存移动编号" prop="moveNo">
              <el-input :disabled="judgeWrite('moveNo')" v-model="dataForm.moveNo" placeholder="请输入" clearable
                        :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="judgeShow('moveName') && dataForm.id">
            <el-form-item label="库存移动名称" prop="moveName">
              <el-input :disabled="judgeWrite('moveName')" v-model="dataForm.moveName" placeholder="请输入" clearable
                        :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="judgeShow('moveCategory')">
            <el-form-item label="库存移动分类" prop="moveCategory">
              <el-select :disabled="judgeWrite('moveCategory')" v-model="dataForm.moveCategory" placeholder="请选择"
                         clearable :style='{"width":"100%"}' :multiple="false"
                         @change="moveCategoryChange(dataForm.moveCategory)">
                <el-option v-for="(item, index) in moveCategoryOptions" :key="index" :label="item.fullName"
                           :value="item.id" :disabled="item.disabled"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="judgeShow('moveType')">
            <el-form-item label="库存移动类型" prop="moveType">
              <el-select :disabled="judgeWrite('moveType')" v-model="dataForm.moveType" placeholder="请选择" clearable
                         :style='{"width":"100%"}' :multiple="false">
                <el-option v-for="(item, index) in moveTypeOptions" :key="index" :label="item.fullName" :value="item.id"
                           :disabled="item.disabled"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="judgeShow('moveDate')">
            <el-form-item label="库存移动日期" prop="moveDate">
              <el-date-picker :disabled="judgeWrite('moveDate')" v-model="dataForm.moveDate" placeholder="请选择" clearable
                              :style='{"width":"100%"}' type="datetime" format="yyyy-MM-dd HH:mm:ss"
                              value-format="timestamp">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="judgeShow('productUom')">
            <el-form-item label="产品单位ID" prop="productUom">
              <el-input :disabled="judgeWrite('productUom')" v-model="dataForm.productUom" placeholder="请输入" clearable
                        :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="judgeShow('productQty')">
            <el-form-item label="产品数量" prop="productQty">
              <el-input :disabled="judgeWrite('productQty')" v-model="dataForm.productQty" placeholder="请输入" clearable
                        :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="judgeShow('warehouseId')">
            <el-form-item label="仓库ID" prop="warehouseId">
              <el-input :disabled="judgeWrite('warehouseId')" v-model="dataForm.warehouseId" placeholder="请输入" clearable
                        :style='{"width":"100%"}'>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="judgeShow('productId')">
            <el-form-item label="产品ID" prop="productId">
              <relationForm :disabled="judgeWrite('productId')" v-model="dataForm.productId" placeholder="请选择" clearable
                            modelId="261505750549923077" :columnOptions="productIdcolumnOptions"
                            relationField="product_name" @change="productChange">
              </relationForm>
            </el-form-item>
          </el-col>
          <el-col :span="12"
                  v-if="judgeShow('locationId') && chargeLoc()">
            <el-form-item label="位置" prop="locationId">
              <el-input v-model="dataForm.locationName" placeholder="请选择位置"
                        readonly clearable
                        :style="{width: '80%'}">
              </el-input>
              <el-button type="primary" @click="chooseLocation()" :style="{width: '20%'}">
                选择位置
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="12"
                  v-if="judgeShow('destLocationId') && chargeDestLoc()">
            <el-form-item label="目的位置" prop="dest_location_id">
              <el-input v-model="dataForm.destLocationName" placeholder="请选择目的位置"
                        readonly clearable
                        :style="{width: '80%'}"></el-input>
              <el-button type="primary" @click="chooseDestLocation()" :style="{width: '20%'}">
                选择位置
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="judgeShow('stockmovedetailList')">
            <el-form-item label-width="0">
              <div class="JNPF-common-title">
                <h2>设计子表</h2>
              </div>
              <el-table :data="dataForm.stockmovedetailList" size='mini'>
                <el-table-column type="index" width="50" label="序号" align="center"/>
                <el-table-column prop="lotNumber" label="批号/序列号" v-if="trackType!=='noTrace'">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.lotNumber" placeholder="请输入" clearable :style='{"width":"100%"}'
                              :disabled="setting.readonly||judgeWrite('stockmovedetailList')"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="locationId" label="位置ID"
                                 v-if="chargeLoc()">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.locationName" readonly placeholder="请选择位置"
                              :style="{width: '80%'}"></el-input>
                    <el-button type="primary" @click="chooseSubLocation(scope.$index)"
                               :style="{width: '20%',padding: '7px'}">
                      选择位置
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="destLocationId" label="目的位置ID"
                                 v-if="chargeDestLoc()">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.destLocationName" readonly placeholder="请选择目的位置"
                              :style="{width: '80%'}"></el-input>
                    <el-button type="primary" @click="chooseSubDestLocation(scope.$index)"
                               :style="{width: '20%',padding: '7px'}">
                      选择位置
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="productQty" label="产品数量">
                  <template slot-scope="scope">
                    <el-input-number v-model="scope.row.productQty" placeholder="数字文本" :step="1"
                                     :disabled="setting.readonly||judgeWrite('stockmovedetailList') || trackType==='byUniqueNo'"
                    >
                    </el-input-number>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="50" v-if="!setting.readonly && !judgeWrite('stockmovedetailList')">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" class="JNPF-table-delBtn"
                               @click="delstockmovedetailList(scope.$index)">删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="table-actions" @click="addstockmovedetailList()"
                   v-if="!setting.readonly && !judgeWrite('stockmovedetailList')">
                <el-button type="text" icon="el-icon-plus">添加</el-button>
              </div>
            </el-form-item>
          </el-col>
        </template>
      </el-form>
    </el-row>
    <UserBox v-if="userBoxVisible" ref="userBox" @submit="submit"/>
    <el-dialog title="选择位置" :append-to-body="true" :visible.sync="flag_chooseLocation">
      <locationChoose v-if="flag_chooseLocation" @onChange="dialogLocationChange"></locationChoose>
    </el-dialog>
  </div>
</template>
<script>
  import request from '@/utils/request'
  import {previewDataInterface} from '@/api/systemData/dataInterface'
  import {getDictionaryDataSelector} from '@/api/systemData/dictionary'
  import locationChoose from '@/views/mom/stock/common/locationChoose'

  export default {
    components: {locationChoose},
    props: ["moveCategory"],
    data() {
      return {
        visible: false,
        loading: false,
        setting: {},
        eventType: '',
        userBoxVisible: false,
        dataForm: {
          id: '',
          flowId: '',
          status: 1,
          freeapproveruserid: '',
          moveNo: '',
          moveName: '',
          moveCategory: "",
          moveType: "",
          moveDate: '',
          productUom: '',
          productQty: '',
          warehouseId: '',
          productId: "",
          locationId: "",
          destLocationId: "",
          stockmovedetailList: [],
        },
        flag_chooseLocation: false,
        locationMark: -10,
        subLocationMark: 0,
        trackType: null,
        rules:
          {},
        moveCategoryOptions: [],
        moveCategoryMap: {},
        moveTypeOptions: [],
        moveTypeMap: {},
        allMoveTypeOptions: [],
        originLocs: ["sale_out", "purchase_return_out", "product_receive_out", "inventory_loss_out", "scrap_out", "product_return_in", "shifting_move"],
        destLocs: ["purchase_in", "sale_return_in", "product_return_in", "inventory_profit_in", "product_receive_out", "scrap_out", "shifting_move"],
        optionCategory: {
          stockIn: ["purchase_in", "sale_return_in", "product_return_in", "inventory_profit_in"],
          stockOut: ["sale_out", "purchase_return_out", "product_receive_out", "inventory_loss_out", "scrap_out"],
          stockMove: ["shifting_move"]
        },
        productIdcolumnOptions: [{"label": "产品名称", "value": "product_name"},
          {"label": "产品编码", "value": "product_code"},
          {"label": "产品模板编码", "value": "product_template_code"},
          {"label": "产品模板Id", "value": "product_template_id"}],
      }
    },
    computed: {},
    watch: {},
    created() {
      this.getmoveCategoryOptions().then(() => this.getmoveTypeOptions());
    },
    mounted() {
    },
    methods: {
      chargeLoc() {
        return this.moveTypeMap[this.dataForm.moveType] && this.originLocs.includes(this.moveTypeMap[this.dataForm.moveType].enCode);
      },
      chargeDestLoc() {
        return this.moveTypeMap[this.dataForm.moveType] && this.destLocs.includes(this.moveTypeMap[this.dataForm.moveType].enCode);
      },
      moveCategoryChange(moveCategory) {
        this.dataForm.moveType = null;
        this.buildMoveTypeOptions(moveCategory);
      },
      productChange(id, obj) {
        this.getProductTrackType(obj.product_template_id);
      },
      judgeShow(id) {
        if (!this.setting.formOperates || !this.setting.formOperates.length) return true
        let arr = this.setting.formOperates.filter(o => o.id === id) || []
        if (!arr.length) return true
        let item = arr[0]
        return item.read
      },
      judgeWrite(id) {
        if (!this.setting.formOperates || !this.setting.formOperates.length) return false
        let arr = this.setting.formOperates.filter(o => o.id === id) || []
        if (!arr.length) return true
        let item = arr[0]
        return !item.write
      },
      getmoveCategoryOptions() {
        return getDictionaryDataSelector('261038753961739525').then(res => {
          this.moveCategoryOptions = res.data.list;
          this.moveCategoryOptions.forEach(option => {
            this.moveCategoryMap[option.id] = option;
          });
        })
      },
      getmoveTypeOptions() {
        getDictionaryDataSelector('261038851022128389').then(res => {
          this.allMoveTypeOptions = res.data.list;
          this.allMoveTypeOptions.forEach(option => {
            this.moveTypeMap[option.id] = option;
          });
          this.buildMoveTypeOptions(this.moveCategory);
        })
      },
      buildMoveTypeOptions(moveCategory) {
        if (!moveCategory) {
          this.moveTypeOptions = this.allMoveTypeOptions;
        } else {
          this.moveTypeOptions = [];
          this.allMoveTypeOptions.forEach(option => {
            if (this.optionCategory[this.moveCategoryMap[moveCategory].enCode].includes(option.enCode))
              this.moveTypeOptions.push(option);
          })
        }
      },
      getProductTrackType(productId) {
        request({
          url: '/api/project/ProductTemplate/trackingType/' + productId,
          method: "get"
        }).then((res) => {
          this.trackType = res.data.enCode;
          if (this.trackType === "noTrace") {
            this.dataForm.stockmovedetailList = [];
          } else if (this.trackType === "byUniqueNo") {
            this.dataForm.stockmovedetailList.forEach(row => {
              row.productQty = 1;
            });
          }
        });
      },
      getProductUom(productId) {
        // TODO
        request({
          url: baseUrl + "/product/getProductUom/" + productId,
          method: "get"
        }).then((res) => {
          this.$set(this.formData, "product_uom", res.data.data.id);
          this.$set(this.formData, "product_uom_name", res.data.data.uom_name);
        });
      },
      goBack() {
        this.$emit('refresh')
      },
      init(data) {
        this.dataForm.id = data.id || "";
        this.setting = data;
        this.visible = true;
        this.$nextTick(() => {
          this.$refs['elForm'].resetFields();
          if (this.dataForm.id) {
            this.loading = true
            request({
              url: '/api/project/StockMove/' + this.dataForm.id,
              method: 'get'
            }).then(res => {
              this.dataInfo(res.data);
              this.loading = false
            })
          }
          this.$emit('setPageLoad')

        })
      },
      // 表单提交
      dataFormSubmit(eventType) {
        this.$refs['elForm'].validate((valid) => {
          if (valid) {
            if (eventType === 'audit' || eventType === 'reject') {
              this.$emit('eventReciver', this.dataForm, eventType)
              return
            }
            this.dataForm.status = eventType === 'submit' ? 0 : 1
            this.eventType = eventType
            if (this.eventType === 'submit') {
              this.$confirm('您确定要提交当前流程吗, 是否继续?', '提示', {
                type: 'warning'
              }).then(() => {
                this.request()
              }).catch(() => {
              });
            } else {
              this.request()
            }
          }
        })
      },
      request() {
        var _data = this.dataList()
        if (!this.dataForm.id) {
          request({
            url: '/api/project/StockMove',
            method: 'post',
            data: _data
          }).then((res) => {
            this.$message({
              message: res.msg,
              type: 'success',
              duration: 1000,
              onClose: () => {
                this.visible = false
                this.$emit('close', true)
              }
            })
          })
        } else {
          request({
            url: '/api/project/StockMove/' + this.dataForm.id,
            method: 'PUT',
            data: _data
          }).then((res) => {
            this.$message({
              message: res.msg,
              type: 'success',
              duration: 1000,
              onClose: () => {
                this.visible = false
                this.$emit('close', true)
              }
            })
          })
        }
      },
      addstockmovedetailList() {
        console.log(this.dataForm);
        let obj = {
          lotNumber: undefined,
          productQty: undefined,
          locationId: this.dataForm.locationId,
          locationName: this.dataForm.locationName,
          destLocationId: this.dataForm.destLocationId,
          destLocationName: this.dataForm.destLocationName
        };
        if (this.trackType === "byUniqueNo") {
          obj.productQty = 1;
        }
        this.dataForm.stockmovedetailList.push(obj);
      },
      delstockmovedetailList(index) {
        this.dataForm.stockmovedetailList.splice(index, 1);
      },
      dataList() {
        var _data = JSON.parse(JSON.stringify(this.dataForm));
        for (let i = 0; i < _data.stockmovedetailList.length; i++) {
          var _list = _data.stockmovedetailList[i];
        }
        return _data;
      },
      dataInfo(dataAll) {
        let _dataAll = dataAll
        for (let i = 0; i < _dataAll.stockmovedetailList.length; i++) {
          var _list = _dataAll.stockmovedetailList[i];
        }
        this.dataForm = _dataAll
      },
      chooseLocation() {
        this.flag_chooseLocation = true;
        this.locationMark = -2;
      },
      chooseDestLocation() {
        this.flag_chooseLocation = true;
        this.locationMark = -1;
      },
      chooseSubLocation(index) {
        this.flag_chooseLocation = true;
        this.locationMark = index;
        this.subLocationMark = -1;
      },
      chooseSubDestLocation(index) {
        this.flag_chooseLocation = true;
        this.locationMark = index;
        this.subLocationMark = 1;
      },
      /* 弹窗回调 */
      dialogLocationChange(location) {
        this.flag_chooseLocation = false;
        if (this.locationMark === -2) {
          // 主表选择位置
          this.dataForm.locationId = location.id;
          this.dataForm.locationName = location.locationName;
          this.dataForm.stockmovedetailList.forEach(row => {
            // if (!row.locationId) {
            row.locationId = location.id;
            this.$set(row, 'locationName', location.locationName);
            // }
          });
        } else if (this.locationMark === -1) {
          // 主表选择目的位置
          this.dataForm.destLocationId = location.id;
          this.dataForm.destLocationName = location.locationName;
          this.dataForm.stockmovedetailList.forEach(row => {
            console.log(row);
            // if (!row.destLocationId) {
            row.destLocationId = location.id;
            this.$set(row, 'destLocationName', location.locationName);
            // }
          });
        } else if (this.locationMark !== -10) {
          console.log("locationMark", this.locationMark);
          console.log("subLocationMark", this.subLocationMark);
          if (this.subLocationMark === -1) {
            this.dataForm.stockmovedetailList[this.locationMark].locationId = location.id;
            this.dataForm.stockmovedetailList[this.locationMark].locationName = location.locationName;
          } else if (this.subLocationMark === 1) {
            console.log(this.dataForm.stockmovedetailList)
            console.log(this.dataForm.stockmovedetailList[this.locationMark]);
            this.dataForm.stockmovedetailList[this.locationMark].destLocationId = location.id;
            this.dataForm.stockmovedetailList[this.locationMark].destLocationName = location.locationName;
          }
        }
        this.locationMark = -10;
        this.subLocationMark = 0;
      },
    },
  }

</script>
