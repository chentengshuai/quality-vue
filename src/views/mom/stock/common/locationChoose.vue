<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="位置名称">
              <el-input v-model="query.locationName" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="位置编码">
              <el-input v-model="query.locationCode" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="位置类型">
              <el-select v-model="query.locationType" placeholder="请选择"
                         clearable>
                <el-option v-for="(item, index) in locationTypeOptions" :key="index"
                           :label="item.fullName" :value="item.id"
                           :disabled="item.disabled"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="上级位置ID">
              <el-input v-model="query.locationParentId" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
              <el-button icon="el-icon-refresh-right" @click="reset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <JNPF-table v-loading="listLoading" :data="list" lazy row-key="id"
                    @current-change="handleSelectionChange"
                    :load="treeLoad" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column prop="locationName" label="位置名称" width="200" align="left"
          />
          <el-table-column prop="locationCode" label="位置编码" width="0" align="left"
          />
          <el-table-column prop="locationType" label="位置类型" width="0" align="left"
          />
          <el-table-column prop="locationParentId" label="上级位置ID" width="0" align="left"
          />
          <el-table-column prop="isStockLocation" label="存放位置" width="0" align="left">
            <template slot-scope="scope">
              <el-switch
                disabled
                v-model="scope.row.isStockLocation"
                :active-value="1"
                :inactive-value="0">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="isConsumeLocation" label="消耗位置" width="0" align="left">
            <template slot-scope="scope">
              <el-switch
                disabled
                v-model="scope.row.isConsumeLocation"
                :active-value="1"
                :inactive-value="0">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="isScrapLocation" label="报废位置" width="0" align="left">
            <template slot-scope="scope">
              <el-switch
                disabled
                v-model="scope.row.isScrapLocation"
                :active-value="1"
                :inactive-value="0">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="row" label="排" width="0" align="left"
          />
          <el-table-column prop="column" label="列" width="0" align="left"
          />
          <el-table-column prop="layer" label="层" width="0" align="left"
          />
          <el-table-column prop="statusMom" label="是否启用" width="0" align="left">
            <template slot-scope="scope">
              <el-switch
                disabled
                v-model="scope.row.statusMom"
                :active-value="1"
                :inactive-value="0">
              </el-switch>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
                    @pagination="initData"/>
      </div>
    </div>
  </div>
  <!--    <div class="custom-form">-->

  <!--        <div slot="search">-->
  <!--            &lt;!&ndash; 在此处放置搜索内容 &ndash;&gt;-->
  <!--            <div class="search-box">-->
  <!--                <el-input v-model="searchParam_location.location_name" size="small" placeholder="请输入要查询的产品名称"-->
  <!--                          style="width: 200px; margin-right: 20px"></el-input>-->
  <!--                <el-button type="primary" icon="el-icon-search" size="small" @click="searchClick">搜索</el-button>-->
  <!--                <el-button icon="el-icon-refresh" size="small" @click="searchReset">重置</el-button>-->
  <!--            </div>-->
  <!--        </div>-->


  <!--        <el-table-->
  <!--                ref="multipleTable"-->
  <!--                :data="tableData"-->
  <!--                tooltip-effect="dark"-->
  <!--                :header-cell-style="{background:'#F5F7FA',color:'#606266',fontWeight:'bold'}"-->
  <!--                @select="onSelect"-->
  <!--                @select-all="onSelectAll"-->
  <!--                style="width: 100%"-->
  <!--        >-->
  <!--            <el-table-column type="selection" width="55"></el-table-column>-->
  <!--            <el-table-column width="15">-->
  <!--            </el-table-column>-->
  <!--            <el-table-column-->
  <!--                    label="位置名称"-->
  <!--                    prop="location_name">-->
  <!--            </el-table-column>-->
  <!--            <el-table-column-->
  <!--                    prop="location_code"-->
  <!--                    label="位置编码">-->
  <!--            </el-table-column>-->
  <!--            <el-table-column-->
  <!--                    prop="location_type"-->
  <!--                    label="位置类型">-->
  <!--            </el-table-column>-->
  <!--        </el-table>-->
  <!--        <el-pagination-->
  <!--                v-show="total_fib>0"-->
  <!--                :total="total_fib"-->
  <!--                :autoScroll=false-->
  <!--                @current-change="handleCurrentChange"-->
  <!--                :current-page.sync="locationLimit"-->
  <!--                :page-size.sync="locationSize"-->
  <!--                @pagination="getLocationList"-->
  <!--        />-->

  <!--    </div>-->
</template>
<script>

  import request from '@/utils/request'
  import {getDictionaryDataSelector} from "@/api/systemData/dictionary";

  export default {

    components: {},
    data() {
      return {
        showForm: true,
        autoCompleteDialogVisible: false,
        autoCompleteConf: {},
        searchParam_location: {},
        total_fib: 0,
        locationLimit: 1,
        locationSize: 10,
        selections: [],
        query: {
          locationName: undefined,
          locationCode: undefined,
          locationType: undefined,
          locationParentId: undefined,
        },
        listLoading: true,
        tableData: [],
        locationTypeOptions: [],
        list: [],
        total: 0,
        listQuery: {
          currentPage: 1,
          pageSize: 20,
          sort: "desc",
          sidx: "",
        },
      };
    },
    computed: {},
    watch: {},
    created() {
    },
    mounted() {
      this.initData();
      this.getlocationTypeOptions();
    },
    methods: {
      getlocationTypeOptions() {
        getDictionaryDataSelector('261038518426404101').then(res => {
          this.locationTypeOptions = res.data.list
        })
      },
      initData() {
        this.listLoading = true;
        let _query = {
          ...this.listQuery,
          ...this.query
        };
        request({
          url: `/api/project/StockLocation/getList`,
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
          this.listLoading = false
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
      treeLoad(tree, treeNode, resolve) {
        setTimeout(() => {
          request({
            url: `/api/project/StockLocation/getLazyChildren/${tree.id}`,
            method: "get"
          }).then((res) => {
            resolve(res.data)
          });

        }, 0)
      },

      handleSelectionChange(selection, preRow) {
        this.$emit("onChange", selection);
      }

    }
  };

</script>
<style>
</style>
