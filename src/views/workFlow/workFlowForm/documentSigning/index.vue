<template>
  <div class="flow-form" v-loading="loading">
    <div class="com-title">
      <h1>文件签阅表</h1>
      <span class="number">流程编码：{{dataForm.billNo}}</span>
    </div>
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="100px"
      :disabled="setting.readonly">
      <el-row>
        <el-col :span="12" v-if="judgeShow('flowTitle')">
          <el-form-item label="流程标题" prop="flowTitle">
            <el-input v-model="dataForm.flowTitle" placeholder="流程标题"
              :disabled="judgeWrite('flowTitle')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('flowUrgent')">
          <el-form-item label="紧急程度" prop="flowUrgent">
            <el-select v-model="dataForm.flowUrgent" placeholder="选择紧急程度"
              :disabled="judgeWrite('flowUrgent')">
              <el-option :key="item.value" :label="item.label" :value="item.value"
                v-for="item in flowUrgentOptions" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('fileName')">
          <el-form-item label="文件名称" prop="fileName">
            <el-input v-model="dataForm.fileName" placeholder="文件名称"
              :disabled="judgeWrite('fileName')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('fillNum')">
          <el-form-item label="文件编码" prop="fillNum">
            <el-input v-model="dataForm.fillNum" placeholder="文件编码"
              :disabled="judgeWrite('fillNum')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('draftedPerson')">
          <el-form-item label="拟稿人" prop="draftedPerson">
            <el-input v-model="dataForm.draftedPerson" placeholder="拟稿人"
              :disabled="judgeWrite('draftedPerson')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('reader')">
          <el-form-item label="签阅人" prop="reader">
            <el-input v-model="dataForm.reader" placeholder="签阅人" :disabled="judgeWrite('reader')">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('fillPreparation')">
          <el-form-item label="文件拟办" prop="fillPreparation">
            <el-input v-model="dataForm.fillPreparation" placeholder="文件拟办"
              :disabled="judgeWrite('fillPreparation')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('checkDate')">
          <el-form-item label="签阅时间" prop="checkDate">
            <el-date-picker v-model="dataForm.checkDate" type="datetime" placeholder="选择日期"
              value-format="timestamp" format="yyyy-MM-dd HH:mm" :editable='false'
              :disabled="judgeWrite('checkDate')">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('publicationDate')">
          <el-form-item label="发稿日期" prop="publicationDate">
            <el-date-picker v-model="dataForm.publicationDate" type="datetime" placeholder="选择日期"
              value-format="timestamp" format="yyyy-MM-dd HH:mm" :editable='false'
              :disabled="judgeWrite('publicationDate')">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="judgeShow('fileJson')">
          <el-form-item label="相关附件" prop="fileJson">
            <JNPF-UploadFz v-model="fileList" type="workFlow" :disabled="judgeWrite('fileJson')" />
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="judgeShow('documentContent')">
          <el-form-item label="文件内容" prop="documentContent">
            <JNPF-Quill v-model="dataForm.documentContent"
              :disabled="judgeWrite('documentContent')" />
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="judgeShow('adviceColumn')">
          <el-form-item label="建议栏" prop="adviceColumn">
            <el-input v-model="dataForm.adviceColumn" placeholder="建议栏" type="textarea" :rows="3"
              :disabled="judgeWrite('adviceColumn')" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import comMixin from '../mixin';
export default {
  mixins: [comMixin],
  name: 'DocumentSigning',
  data() {
    return {
      billEnCode: 'WF_DocumentSigningNo',
      dataForm: {
        flowId: '',
        id: '',
        billNo: '',
        flowTitle: '',
        flowUrgent: 1,
        reader: '',
        draftedPerson: '',
        fillPreparation: '',
        fillNum: '',
        fileName: '',
        documentContent: '',
        checkDate: '',
        publicationDate: '',
        adviceColumn: '',
        fileJson: '',
      },
      dataRule: {
        flowTitle: [
          { required: true, message: '流程标题不能为空', trigger: 'blur' },
        ],
        flowUrgent: [
          { required: true, message: '紧急程度不能为空', trigger: 'change' },
        ],
        checkDate: [
          { required: true, message: '签阅时间不能为空', trigger: 'change' },
        ],
        publicationDate: [
          { required: true, message: '发稿日期不能为空', trigger: 'change' },
        ],
      }
    }
  },
  methods: {
    selfInit(data) {
      this.dataForm.flowTitle = this.userInfo.userName + "的文件签阅表"
    }
  }
}
</script>