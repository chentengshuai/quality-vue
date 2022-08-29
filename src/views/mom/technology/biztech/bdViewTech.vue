<template>
  <el-dialog
    title="详情"
    :close-on-click-modal="false"
    append-to-body
    :visible.sync="visible"
    class="JNPF-dialog JNPF-dialog_center"
    lock-scroll
    width="1200px"
  >
    <el-row :gutter="15" class="">
      <div class="teachTitle">
        {{ dataForm.techDefineName }}——{{ dataForm.title }}
      </div>
      <el-form
        ref="elForm"
        :model="dataForm"
        :rules="rules"
        size="small"
        label-width="100px"
        label-position="right"
      >
        <template v-if="!loading">
          <el-col :span="24">
            <el-collapse
              :accordion="false"
              v-model="activelemmaf"
              class="mb-20"
            >
              <!-- <el-collapse-item title="明细" name="2"> -->
              <el-col :span="24">
                <el-form-item label-width="0">
                  <div class="JNPF-common-title">
                    <h2></h2>
                  </div>
                  <el-table
                    :data="dataForm.biztechattributeList.attributeValue"
                    size="mini"
                  >
                    <el-table-column
                      v-for="(item, index) in dataForm.biztechattributeList
                        .tableAttributeListOptions"
                      :key="index"
                      :label="item.description"
                    >
                      <template slot-scope="scope">
                        {{ scope.row[index] }}
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </el-col>
              <!-- </el-collapse-item> -->
            </el-collapse>
          </el-col>
        </template>
      </el-form>
    </el-row>
  </el-dialog>
</template>
<script>
import request from "@/utils/request";
import { previewDataInterface } from "@/api/systemData/dataInterface";
import { getDictionaryDataSelector } from "@/api/systemData/dictionary";
export default {
  components: {},
  props: [],
  data() {
    return {
      visible: false,
      loading: false,
      isDetail: false,
      dataForm: {
        techDefineId: "",
        techDefineCode: "",
        techDefineName: "",
        title: "",
        productionProcessId: "",
        productionProcessName: "",
        equipmentId: "",
        equipmentName: "",
        seq: "",
        status: "",
        description: "",
        organizationPersonId: "",
        organizationPersonName: "",
        approvePersonId: "",
        approvePersonName: "",
        examinePersonId: "",
        examinePersonName: "",
        biztechattributeList: {
          tableAttributeListOptions: [], //列名对象
          attributeValue: [], //行值集合
        },
      },
      activelemmaf: ["1", "2"],
      rules: {},
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    init(id, isDetail) {
      this.dataForm.id = id || 0;
      this.visible = true;
      this.isDetail = isDetail || false;
      this.$nextTick(() => {
        this.$refs["elForm"].resetFields();
        if (this.dataForm.id) {
          this.loading = true;
          request({
            //查看页面初始化(同编辑一个方法)
            url: "/api/project/BizTech/getViewInfo/" + this.dataForm.id,
            method: "get",
          }).then((res) => {
            this.dataInfo(res.data);
            this.loading = false;
          });
        }
      });
    },
    dataInfo(dataAll) {
      //查看数据渲染
      let _dataAll = dataAll;
      for (let i = 0; i < _dataAll.biztechattributeList.length; i++) {
        var _list = _dataAll.biztechattributeList[i];
      }
      this.dataForm = _dataAll;
    },
  },
};
</script>
<style>
.teachTitle {
  text-align: center;
  margin-bottom: 20px;
  font-size: 20px;
}
</style>
