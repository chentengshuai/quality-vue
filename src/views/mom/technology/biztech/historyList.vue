<template>
  <el-dialog
    title="历史版本"
    :close-on-click-modal="false"
    append-to-body
    :visible.sync="visible"
    class="JNPF-dialog JNPF-dialog_center"
    lock-scroll
    width="1200px"
  >
        <JNPF-table
          :data="list"
          @sort-change="sortChange"
        >
          <el-table-column
            prop="techDefineName"
            label="工艺卡名称"
            width="200"
            align="left"
          />
          <el-table-column
            prop="productionProcessName"
            label="生产工序"
            width="150"
            align="left"
          />
          <el-table-column
            prop="title"
            label="版本号"
            width="150"
            align="left"
          />
          <el-table-column
            prop="equipmentName"
            label="设备"
            width="100"
            align="left"
          />
          <el-table-column
            prop="effectTime"
            label="生效时间"
            width="100"
            align="left"
          />
          <el-table-column
            prop="invalidTime"
            label="失效时间"
            width="100"
            align="left"
          />
          <el-table-column
            prop="description"
            label="标准/重要事项"
            align="left"
          />
          <el-table-column label="操作" fixed="right" width="150">
            <template slot-scope="scope">
              <el-button type="text" @click="viewHandle(scope.row.id, 'look')"
                      >查看
                    </el-button>
            </template>
          </el-table-column>
        </JNPF-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false"> 确 定</el-button>
    </span>
    <ViewTeachForm v-if="viewVisible" ref="ViewTeachForm"> </ViewTeachForm>
  </el-dialog>
</template>

<script>
import request from "@/utils/request";
import { getDictionaryDataSelector } from "@/api/systemData/dictionary";
import { previewDataInterface } from "@/api/systemData/dataInterface";
import ViewTeachForm from "./bdViewTech";

export default {
  components: { ViewTeachForm },
  data() {
    return {
      showAll: false,
      visible: false,
      viewVisible: false,
      query: {
        techDefineName: undefined,
      },
      list: [],
      formVisible: false,
      exportBoxVisible: false,
    };
  },
  computed: {},
  created() {
    this.visible = true;
  },
  mounted() {
    this.initData();
  },
  methods: {
    sortChange({ column, prop, order }) {
      this.initData();
    },
    initData() {
      let _query = {
        ...this.query,
        ...this.listQuery,
      };
      request({
        url: `/api/project/BizTech/getHistoryList`,
        method: "post",
        data: _query,
      }).then((res) => {
        var _list = [];
        for (let i = 0; i < res.data.length; i++) {
          let _data = res.data[i];
          _list.push(_data);
        }
        this.list = _list;
        //this.total = res.data.pagination.total;
      });
    },
    init(techDefineName) {
      this.visible = true;
      this.query.techDefineName = techDefineName;
      this.initData();
    },
    viewHandle(id, isDetail) {
      //查看页面
      this.viewVisible = true;
      this.$nextTick(() => {
        this.$refs.ViewTeachForm.init(id, isDetail);
      });
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
  height: 35vh;
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
