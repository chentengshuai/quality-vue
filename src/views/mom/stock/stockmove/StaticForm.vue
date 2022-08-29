<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main">
      <div class="JNPF-common-page-header">
        <el-page-header @back="goBack"
                        :content="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'"/>
        <div class="options">
          <el-button type="primary" @click="dataFormSubmit()" v-if="!isDetail"> 保 存</el-button>
          <el-button @click="goBack"> 取 消</el-button>
        </div>
      </div>
      <el-row :gutter="15" class=" main" :style="{margin: '0 auto',width: '${context.fullScreenWidth}'}">
        <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="right">
          <template v-if="!loading">
            <el-col :span="12" v-if="dataForm.id">
              <el-form-item label="库存移动编号" prop="stockMoveCode">
                <el-input v-model="dataForm.stockMoveCode" placeholder="请输入" clearable
                          :style='{"width":"100%"}'>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="dataForm.id">
              <el-form-item label="库存移动名称" prop="stockMoveName">
                <el-input v-model="dataForm.stockMoveName" placeholder="请输入" clearable
                          :style='{"width":"100%"}'>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="库存移动分类" prop="stockMoveCategory">
                <el-select v-model="dataForm.stockMoveCategory" placeholder="请选择"
                           clearable :style='{"width":"100%"}' :multiple="false"
                           @change="moveCategoryChange(dataForm.stockMoveCategory)">
                  <el-option v-for="(item, index) in moveCategoryOptions" :key="index" :label="item.fullName"
                             :value="item.id" :disabled="item.disabled"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="库存移动类型" prop="stockMoveType">
                <el-select v-model="dataForm.stockMoveType" placeholder="请选择" clearable
                           :style='{"width":"100%"}' :multiple="false">
                  <el-option v-for="(item, index) in moveTypeOptions" :key="index" :label="item.fullName"
                             :value="item.id"
                             :disabled="item.disabled"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="库存移动日期" prop="stockMoveDate">
                <el-date-picker v-model="dataForm.stockMoveDate" placeholder="请选择" clearable
                                :style='{"width":"100%"}' type="datetime" format="yyyy-MM-dd HH:mm:ss"
                                value-format="timestamp">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="产品单位ID" prop="uomId">
                <el-input v-model="dataForm.uomId" placeholder="请输入" clearable
                          :style='{"width":"100%"}'>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="产品数量" prop="qty">
                <el-input v-model="dataForm.qty" placeholder="请输入" clearable
                          :style='{"width":"100%"}'>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="仓库ID" prop="warehouseId">
                <el-input v-model="dataForm.warehouseId" placeholder="请输入" clearable
                          :style='{"width":"100%"}'>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="产品ID" prop="productId">
                <relationForm v-model="dataForm.productId" placeholder="请选择" clearable
                              modelId="261505750549923077" :columnOptions="productIdcolumnOptions"
                              relationField="product_name" @change="productChange">
                </relationForm>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="chargeLoc()">
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
            <el-col :span="12" v-if="chargeDestLoc()">
              <el-form-item label="目的位置" prop="dest_location_id">
                <el-input v-model="dataForm.destLocationName" placeholder="请选择目的位置"
                          readonly clearable
                          :style="{width: '80%'}"></el-input>
                <el-button type="primary" @click="chooseDestLocation()" :style="{width: '20%'}">
                  选择位置
                </el-button>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label-width="0">
                <div class="JNPF-common-title">
                  <h2>设计子表</h2>
                </div>
                <el-table :data="dataForm.stockmovedetailList" size='mini'>
                  <el-table-column type="index" width="50" label="序号" align="center"/>
                  <el-table-column prop="lotNumber" label="批号/序列号" v-if="trackType!=='noTrace'">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.lotNumber" placeholder="请输入" clearable :style='{"width":"100%"}'>
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
                  <el-table-column prop="qty" label="产品数量">
                    <template slot-scope="scope">
                      <el-input-number v-model="scope.row.qty" placeholder="数字文本" :step="1"
                                       :disabled="trackType==='byUniqueNo'">
                      </el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="50">
                    <template slot-scope="scope">
                      <el-button size="mini" type="text" class="JNPF-table-delBtn"
                                 @click="delstock_move_detailList(scope.$index)">删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="table-actions" @click="addstock_move_detailList()">
                  <el-button type="text" icon="el-icon-plus">添加</el-button>
                </div>
              </el-form-item>
            </el-col>
          </template>
        </el-form>
      </el-row>
      <el-dialog title="选择位置" :append-to-body="true" :visible.sync="flag_chooseLocation">
        <locationChoose v-if="flag_chooseLocation" @onChange="dialogLocationChange"></locationChoose>
      </el-dialog>
    </div>
  </transition>
</template>
<script>
  import request from '@/utils/request'
  import {previewDataInterface} from '@/api/systemData/dataInterface'
  import {getDictionaryDataSelector} from '@/api/systemData/dictionary'
  import locationChoose from "@/views/mom/stock/common/locationChoose";

  export default {
    components: {locationChoose},
    props: ["moveCategory"],
    data() {
      return {
        visible: false,
        loading: false,
        isDetail: false,
        dataForm: {
          stockMoveCode: '',
          stockMoveName: '',
          stockMoveCategory: "",
          stockMoveType: "",
          stockMoveDate: '',
          uomId: '',
          qty: '',
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
      this.getmoveCategoryOptions();
      this.getmoveTypeOptions();
    },
    mounted() {
    },
    methods: {
      chargeLoc() {
        return this.moveTypeMap[this.dataForm.stockMoveType] && this.originLocs.includes(this.moveTypeMap[this.dataForm.stockMoveType].enCode);
      },
      chargeDestLoc() {
        return this.moveTypeMap[this.dataForm.stockMoveType] && this.destLocs.includes(this.moveTypeMap[this.dataForm.stockMoveType].enCode);
      },
      moveCategoryChange(moveCategory) {
        this.dataForm.moveType = null;
        this.buildMoveTypeOptions(moveCategory);
      },
      productChange(id, obj) {
        this.getProductTrackType(obj.product_template_id);
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
      goBack() {
        this.$emit('refresh')
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
              url: '/api/project/StockMove/' + this.dataForm.id,
              method: 'get'
            }).then(res => {
              this.dataInfo(res.data)
              console.log(this.dataForm)
              this.loading = false
            })
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
                this.$emit('refresh', true)
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
                this.$emit('refresh', true)
              }
            })
          })
        }
      },
      addstock_move_detailList() {
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
      delstock_move_detailList(index) {
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
