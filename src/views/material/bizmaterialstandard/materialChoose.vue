<template>
  <div class="JNPF-common-layout" style="height:650px;">
    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="8">
            <el-form-item label="物料编码">
              <el-input
                v-model="listQuery.productCode"
                placeholder="请输入物料编码查询"
                clearable
                @keyup.enter.native="search()"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物料名称">
              <el-input
                v-model="listQuery.productName"
                placeholder="请输入物料名称查询"
                clearable
                @keyup.enter.native="search()"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()">
                {{ $t("common.search") }}
              </el-button>
              <el-button icon="el-icon-refresh-right" @click="reset()"
                >{{ $t("common.reset") }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
        <div class="JNPF-common-search-box-right">
          <el-tooltip
            effect="dark"
            :content="$t('common.refresh')"
            placement="top"
          >
            <el-link
              icon="icon-ym icon-ym-Refresh JNPF-common-head-icon"
              :underline="false"
              @click="reset()"
            />
          </el-tooltip>
        </div>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <JNPF-table
          v-loading="listLoading"
          :data="list"
          @sort-change="sortChange"
          @row-click="rowClick"
        >
          <el-table-column width="35">
            <template slot-scope="scope">
              <el-radio :label="scope.row.id" v-model="checked"
                >&nbsp;</el-radio
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="productCode"
            label="物料编码"
            width="0"
            align="left"
          />
          <el-table-column
            prop="productName"
            label="物料名称"
            width="0"
            align="left"
          />
          <el-table-column
            prop="specification"
            label="规格型号"
            width="0"
            align="left"
          />
        </JNPF-table>
        <pagination
          :total="total"
          :page.sync="listQuery.currentPage"
          :limit.sync="listQuery.pageSize"
          @pagination="initData"
        />
      </div>
      <span slot="footer" class="dialog-footer" style="background: #ffffff">
      </span>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import { getDictionaryDataSelector } from "@/api/systemData/dictionary";
import ExportBox from "./ExportBox";
import { previewDataInterface } from "@/api/systemData/dataInterface";

export default {
  components: { ExportBox },
  data() {
    return {
      showAll: false,
      query: {
        productCode: undefined,
        productName: undefined,
      },
      treeProps: {
        children: "children",
        label: "fullName",
        value: "id",
      },
      list: [],
      listLoading: true,
      total: 0,
      checked: "",
      checkedTxt: "",
      checkedRow: {},
      listQuery: {
        productCode: "",
        productName: "",
        currentPage: 1,
        pageSize: 20,
        sort: "desc",
        sidx: "",
      },
      formVisible: false,
      exportBoxVisible: false,
      columnList: [
        { prop: "productName", label: "物料名称" },
        { prop: "productCode", label: "物料编码" },
        { prop: "specification", label: "规格型号" },
      ],
    };
  },
  computed: {},
  created() {
    this.checked = this.value;
    this.visible = true;
  },
  mounted() {
    this.initData();
  },
  methods: {
    sortChange({ column, prop, order }) {
      this.listQuery.sort = order == "ascending" ? "asc" : "desc";
      this.listQuery.sidx = !order ? "" : prop;
      this.initData();
    },
    initData() {
      this.listLoading = true;
      let _query = {
        ...this.listQuery,
      };
      request({
        url: `/api/project/ProductProduct/materialsProductList`,
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
        //this.setDefault()
        this.listLoading = false;
      });
    },
    search() {
      this.initData();
      this.listQuery.currentPage = 1;
      this.listQuery.pageSize = this.hasPage ? this.pageSize : 20;
    },
    reset() {
      this.listQuery.productName = "";
      this.listQuery.productCode = "";
      this.listQuery.currentPage = 1;
      this.listQuery.pageSize = this.hasPage ? this.pageSize : 20;
      this.initData();
    },
    clear() {
      this.checked = "";
      this.innerValue = "";
      this.checkedRow = {};
      this.$emit("input", this.checked);
      this.$emit("change", this.checked, this.checkedRow);
    },
    rowClick(row, preRow) {
      this.$emit("onChange", row);
    },
    select() {
      //console.warn("this:"+this);
      //this.innerValue = this.checkedTxt
      this.$emit("onChange", this.checked);
      //this.$emit('change', this.checked, this.checkedRow)
      //this.visible = false
    },
  },
};
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
