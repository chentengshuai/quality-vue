<template>
  <el-dialog
    :title="'选择客户'"
    width="80%"
    @close="closeDialog"
    :close-on-click-modal="false"
    :visible.sync="customerShow"
    append-to-body
  >
    <div class="JNPF-common-layout">
      <div class="JNPF-common-layout-center">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="6">
              <el-form-item label="业务伙伴名称">
                <el-input
                  v-model="query.partnerName"
                  placeholder="请输入"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="业务伙伴编码">
                <el-input
                  v-model="query.partnerCode"
                  placeholder="请输入"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
<!--            <el-col :span="6">-->
<!--              <el-form-item label="业务伙伴类型">-->
<!--                <el-input-->
<!--                  v-model="query.partnerType"-->
<!--                  placeholder="请输入"-->
<!--                  clearable-->
<!--                ></el-input>-->
<!--              </el-form-item>-->
<!--            </el-col>-->

            <template v-if="showAll">
              <el-col :span="6">
                <el-form-item label="业务伙伴简称">
                  <el-input
                    v-model="query.partnerShortName"
                    placeholder="请输入"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
            </template>
            <el-col :span="6">
              <el-form-item>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  @click="search()"
                  >查询</el-button
                >
                <el-button icon="el-icon-refresh-right" @click="reset()"
                  >重置</el-button
                >
                <el-button
                  type="text"
                  icon="el-icon-arrow-down"
                  @click="showAll = true"
                  v-if="!showAll"
                >
                  展开
                </el-button>
                <el-button
                  type="text"
                  icon="el-icon-arrow-up"
                  @click="showAll = false"
                  v-else
                >
                  收起
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>

        <div class="JNPF-common-layout-main JNPF-flex-main myTable">

          <JNPF-table
            v-loading="listLoading"
            :data="list"
            @sort-change="sortChange"
            @select="select"
            :max-height="'600px'"
            @selection-change="selectionChange"
            ref="multipleTable"
          >
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="partnerCode"
              label="业务伙伴编码"
              width="90"
              align="left"
            />
            <el-table-column
              prop="partnerType"
              label="业务伙伴类型"
               width="100"
              align="left"
            />
            <el-table-column
              prop="partnerName"
              label="业务伙伴名称"
              width="120"
              align="left"
            />
            <el-table-column
              prop="partnerShortName"
              label="业务伙伴简称"
              width="0"
              align="left"
            />
            <el-table-column
              prop="tel"
              label="联系电话"
              width="0"
              align="left"
            />
            <el-table-column prop="fax" label="传真" width="0" align="left" />
            <el-table-column
              prop="country"
              label="国家/地区"
              width="0"
              align="left"
            />
            <el-table-column
              prop="province"
              label="省/州"
              width="0"
              align="left"
            />
            <el-table-column prop="city" label="城市" width="0" align="left" />
            <el-table-column
              prop="regional"
              label="区"
              width="0"
              align="left"
            />
            <el-table-column prop="addr" label="地址" width="0" align="left" />
            <el-table-column
              prop="taxCode"
              label="统一社会信用代码"
              width="120"
              align="left"
            />
            <el-table-column
              prop="invoiceTitle"
              label="发票抬头"
               width="120"
              align="left"
            />
            <el-table-column
              prop="bankName"
              label="开户银行"
              width="0"
              align="left"
            />
            <el-table-column
              prop="bankAccountName"
              label="银行户名"
              width="0"
              align="left"
            />
            <el-table-column
              prop="bankAccountNumber"
              label="银行账号"
              width="0"
              align="left"
            />

          </JNPF-table>
          <pagination
            :total="total"
            :page.sync="listQuery.currentPage"
            :limit.sync="listQuery.pageSize"
            :current-change='handleCurrentChange'
            @pagination="initData"
          />
        </div>
      </div>

    </div>
    <div> <el-button type="primary" size="medium" @click="selectHandle" round>确 定</el-button><el-button plain size="medium" @click="selectHandle" round>取 消</el-button></div>
  </el-dialog>
</template>

<script>
import request from "@/utils/request";

export default {

  props: {
    customerVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showAll: false,
      customerShow:true,
      query: {
        partnerCode: undefined,
        partnerType: undefined,
        partnerName: undefined,
        partnerShortName: undefined,
        isCustomer: true,
      },
      treeProps: {
        children: "children",
        label: "fullName",
        value: "id",
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
      selectData:[],
      customerNoInput: null,
      formVisible: false,
      exportBoxVisible: false,
      importFormVisible: false,
      columnList: [
        { prop: "partnerCode", label: "业务伙伴编码" },
        { prop: "partnerType", label: "业务伙伴类型" },
        { prop: "partnerName", label: "业务伙伴名称" },
        { prop: "partnerShortName", label: "业务伙伴简称" },
        { prop: "isSupplier", label: "是否供应商" },
        { prop: "isCustomer", label: "是否客户" },
        { prop: "isPersonal", label: "是否个人" },
        { prop: "tel", label: "联系电话" },
        { prop: "fax", label: "传真" },
        { prop: "country", label: "国家/地区" },
        { prop: "province", label: "省/州" },
        { prop: "city", label: "城市" },
        { prop: "regional", label: "区" },
        { prop: "addr", label: "地址" },
        { prop: "taxCode", label: "统一社会信用代码" },
        { prop: "invoiceTitle", label: "发票抬头" },
        { prop: "bankName", label: "开户银行" },
        { prop: "bankAccountName", label: "银行户名" },
        { prop: "bankAccountNumber", label: "银行账号" },
      ],
    };
  },
  computed: {},
  watch: {
      customerVisible(newVal, oldVal){
        this.customerShow = newVal
      },
      immediate : true
  },
  created() {
    this.initData();
  },
  methods: {
    sortChange({ column, prop, order }) {
      this.listQuery.sort = order == "ascending" ? "asc" : "desc";
      this.listQuery.sidx = !order ? "" : prop;
      this.initData();
    },
    selectHandle(){
      this.$emit("closeDialog", this.selectData[0]);
    },
    select(selection, row) {
        // 清除 所有勾选项
        this.$nextTick(() => {
            for(var i=0;i<this.$refs.multipleTable.$children.length;i++){
                this.$refs.multipleTable.$children[i].clearSelection();
            }
        })
        // 当表格数据都没有被勾选的时候 就返回
        // 主要用于将当前勾选的表格状态清除
        if(selection.length == 0) return
         this.$nextTick(() => {
             for(var i=0;i<this.$refs.multipleTable.$children.length;i++){
               this.$refs.multipleTable.$children[i].toggleRowSelection(row, true);
            }
        })
    },
    // 表格的选中 可以获得当前选中的数据
    selectionChange(val) {
        // 将选中的数据存储起来
        this.selectData = val
    },
    closeDialog(){
       this.$emit("closeDialog", this.selectData[0]);
    },
    initData() {
      this.listLoading = true;
      let _query = {
        ...this.listQuery,
        ...this.query,
      };
      request({
        url: `/api/project/Partner/getList`,
        method: "post",
        data: _query,
      }).then((res) => {
        var _list = [];
        for (let i = 0; i < res.data.list.length; i++) {
          let _data = res.data.list[i];
          _list.push(_data);
        }
        this.list = _list;
        this.total = res.data.pagination.total;

        this.listLoading = false;
      });
    },
    handleCurrentChange(val){
        this.listQuery.currentPage = val
        this.initData();
    },
    addOrUpdateHandle(id, isDetail) {
      this.formVisible = true;
      this.$nextTick(() => {
        this.$refs.JNPFForm.init(id, isDetail);
      });
    },

    search() {
      this.listQuery = {
        currentPage: 1,
        pageSize: 10,
        sort: "desc",
        sidx: "",
      };
      this.initData();
    },

    reset() {
      for (let key in this.query) {
        this.query[key] = undefined;
      }
      this.listQuery = {
        currentPage: 1,
        pageSize: 20,
        sort: "desc",
        sidx: "",
      };
      this.initData();
    },
    uploadForm() {
      this.importFormVisible = true;
      this.$nextTick(() => {
        this.$refs.importForm.init();
      });
    },
  },
};
</script>

<style scoped>
  .myTable >>> .el-table__header .el-checkbox {
    display: none !important;
  }
</style>
