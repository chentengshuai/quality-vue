<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main flow-form-main nohead">
      <div class="btns">
        <template
          v-if="(setting.opType=='-1'&&setting.id)||setting.opType==0||setting.opType==1||setting.opType==2">
          <el-button type="primary" @click="printBrowseVisible=true"
                     v-if="properties.hasPrintBtn && properties.printId">
            {{properties.printBtnText||'打 印'}}
          </el-button>
        </template>
        <template v-if="setting.opType=='-1'">
          <el-button type="primary" @click="eventLancher('submit')">
            {{properties.submitBtnText||'提交审核'}}
          </el-button>
          <el-button type="warning" @click="eventLancher('save')" :loading="btnLoading">
            {{properties.saveBtnText||'保存草稿'}}
          </el-button>
        </template>
        <template v-if="setting.opType == 1">
          <el-button type="warning" @click="openUserBox('transfer')"
                     v-if="properties.hasTransferBtn">{{properties.transferBtnText||'转 办'}}
          </el-button>
          <el-button type="primary" @click="eventLancher('audit')" v-if="properties.hasAuditBtn">
            {{properties.auditBtnText||'通 过'}}
          </el-button>
          <el-button type="danger" @click="eventLancher('reject')" v-if="properties.hasRejectBtn">
            {{properties.rejectBtnText||'拒 绝'}}
          </el-button>
        </template>
        <template v-if="setting.opType == 0 && setting.status == 1">
          <el-button type="primary" @click="press()"
                     v-if="properties.hasPressBtn || properties.hasPressBtn===undefined">
            {{properties.pressBtnText||'催 办'}}
          </el-button>
          <el-button type="danger" @click="revoke()"
                     v-if="properties.hasRevokeBtn || properties.hasRevokeBtn===undefined">
            {{properties.revokeBtnText||'撤 回'}}
          </el-button>
        </template>
        <el-button type="danger" v-if="setting.opType == 2 && properties.hasRevokeBtn"
                   @click="recall()">{{properties.revokeBtnText||'撤 回'}}
        </el-button>
        <template v-if="setting.opType == 4">
          <el-button type="primary" @click="openAssignBox" v-if="setting.status ==1">指 派
          </el-button>
          <el-button type="danger" v-if="setting.status != 2 && setting.status != 5"
                     @click="cancel()">终 止
          </el-button>
        </template>
        <el-button @click="goBack()">{{$t('common.cancelButton')}}</el-button>
      </div>
      <div class="approve-result" v-if="(setting.opType==0||setting.opType==4) && activeTab==='0'">
        <div class="approve-result-img" :class="flowTaskInfo.status | flowStatus()"></div>
      </div>
      <el-tabs class="JNPF-el_tabs" v-model="activeTab">
        <el-tab-pane label="表单信息" v-loading="loading">
          <component :is="currentView" @close="goBack" ref="form" @eventReciver="eventReciver"
                     @setLoad="setLoad" @setPageLoad="setPageLoad"/>
        </el-tab-pane>
        <el-tab-pane label="流程信息" v-loading="loading">
          <Process :conf="flowTemplateJson" v-if="flowTemplateJson.nodeId"/>
        </el-tab-pane>
        <el-tab-pane label="流转记录" v-if="setting.opType!='-1'" v-loading="loading">
          <recordList :list='flowTaskOperatorRecordList' :endTime='endTime'/>
        </el-tab-pane>
      </el-tabs>
      <el-dialog :title="eventType==='audit'?'审批通过':'审批拒绝'" :close-on-click-modal="false"
                 :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll append-to-body
                 width='600px'>
        <el-form label-width="80px">
          <el-form-item label="加签人员" v-if="eventType==='audit'&& properties.hasFreeApprover">
            <user-select v-model="handleId" placeholder="请选择加签人员,不选即该节点审核结束"/>
          </el-form-item>
          <el-form-item label="审批意见">
            <el-input v-model="reason" placeholder="请输入审批意见（选填）" type="textarea" :rows="4"/>
          </el-form-item>
          <el-form-item v-if="properties.hasSign">
            <div class="sign-main">
              <div class="sign-head">
                <div class="sign-tip">请在这里输入你的签名</div>
                <div class="sign-action">
                  <el-button class="clear-btn" size="mini" @click="handleReset">清空</el-button>
                  <el-button class="sure-btn" size="mini" @click="handleGenerate"
                             :disabled="!!signImg">确定签名
                  </el-button>
                </div>
              </div>
              <div class="sign-box">
                <vue-esign ref="esign" :height="330" v-if="!signImg" :lineWidth="5"/>
                <img :src="signImg" alt="" v-if="signImg" class="sign-img">
              </div>
            </div>
          </el-form-item>
          <el-form-item label="抄送人员" v-if="properties.isCustomCopy">
            <user-select v-model="copyIds" placeholder="请选择" multiple/>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="visible = false">{{$t('common.cancelButton')}}</el-button>
          <el-button type="primary" @click="handleApproval()" :loading="approvalBtnLoading">
            {{$t('common.confirmButton')}}
          </el-button>
        </span>
      </el-dialog>
      <el-dialog title="指派" :close-on-click-modal="false" :visible.sync="assignVisible"
                 class="JNPF-dialog JNPF-dialog_center" lock-scroll append-to-body width='600px'>
        <el-form label-width="80px" :model="assignForm" :rules="assignRules" ref="assignForm">
          <el-form-item label="指派节点" prop="nodeCode">
            <el-select v-model="assignForm.nodeCode" placeholder="请选择指派节点">
              <el-option v-for="item in assignNodeList" :key="item.nodeCode" :label="item.nodeName"
                         :value="item.nodeCode"/>
            </el-select>
          </el-form-item>
          <el-form-item label="指派给谁" prop="freeApproverUserId">
            <user-select v-model="assignForm.freeApproverUserId" placeholder="请选择指派给谁"/>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="assignVisible = false">{{$t('common.cancelButton')}}</el-button>
          <el-button type="primary" @click="handleAssign()">{{$t('common.confirmButton')}}
          </el-button>
        </span>
      </el-dialog>
      <UserBox v-if="userBoxVisible" ref="userBox" :title="userBoxTitle" @submit="handleTransfer"/>
      <print-browse :visible.sync="printBrowseVisible" :id="properties.printId" :formId="setting.id"
                    :fullName="setting.fullName"/>
    </div>
  </transition>
</template>

<script>
  import {FlowEngineInfo} from '@/api/workFlow/FlowEngine'
  import {FlowBeforeInfo, Audit, Reject, Transfer, Recall, Cancel, Assign} from '@/api/workFlow/FlowBefore'
  import {Revoke, Press} from '@/api/workFlow/FlowLaunch'
  import {Create, Update, DynamicCreate, DynamicUpdate} from '@/api/workFlow/workFlowForm'
  import recordList from './RecordList'
  import Process from '@/components/Process/Preview'
  import PrintBrowse from '@/components/PrintBrowse'
  import vueEsign from 'vue-esign'

  export default {
    components: {recordList, Process, vueEsign, PrintBrowse},
    data() {
      return {
        userBoxVisible: false,
        userBoxTitle: '审批人',
        assignVisible: false,
        assignForm: {
          nodeCode: '',
          freeApproverUserId: ''
        },
        assignRules: {
          nodeCode: [
            {required: true, message: '请选择指派节点', trigger: 'change'}
          ],
          freeApproverUserId: [
            {required: true, message: '请选择指派给谁', trigger: 'click'}
          ]
        },
        assignNodeList: [],
        currentView: '',
        formData: {},
        setting: {},
        flowFormInfo: {},
        flowTaskInfo: {},
        flowTaskNodeList: [],
        flowTemplateJson: {},
        flowTaskOperatorRecordList: [],
        properties: {},
        endTime: 0,
        visible: false,
        reason: '',
        handleId: '',
        activeTab: '0',
        loading: false,
        btnLoading: false,
        approvalBtnLoading: false,
        printBrowseVisible: false,
        eventType: '',
        signImg: '',
        copyIds: ''
      }
    },
    methods: {
      goBack(isRefresh) {
        this.$emit('close', isRefresh)
      },
      init(data) {
        this.loading = true
        this.activeTab = '0'
        this.setting = data
        /**
         * opType
         * -1 - 我发起的新建/编辑
         * 0 - 我发起的详情
         * 1 - 待办事宜
         * 2 - 已办事宜
         * 3 - 抄送事宜
         * 4 - 流程监控
         */
        if (this.setting.opType == '-1') {
          this.getEngineInfo(data)
        } else {
          this.getBeforeInfo(data)
        }
      },
      getEngineInfo(data) {
        FlowEngineInfo(data.flowId).then(res => {
          data.type = res.data.type
          data.fullName = res.data.fullName
          if (data.formType == 1) {
            if (res.data.formUrl) {
              this.currentView = (resolve) => require([`@/views/${res.data.formUrl}`], resolve)
            } else {
              this.currentView = (resolve) => require([`@/views/workFlow/workFlowForm/${data.enCode}`], resolve)
            }
          } else {
            this.currentView = (resolve) => require([`@/views/workFlow/workFlowForm/dynamicForm`], resolve)
          }
          data.formConf = res.data.formData
          this.flowTemplateJson = res.data.flowTemplateJson ? JSON.parse(res.data.flowTemplateJson) : null
          this.flowTemplateJson.state = 'state-curr'
          data.formOperates = []
          this.properties = this.flowTemplateJson && this.flowTemplateJson.properties || {}
          if (this.flowTemplateJson && this.flowTemplateJson.properties && this.flowTemplateJson.properties.formOperates) {
            data.formOperates = this.flowTemplateJson.properties.formOperates || []
          }
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.form && this.$refs.form.init(data)
            })
          }, 500)
        }).catch(() => {
          this.loading = false
        })
      },
      getBeforeInfo(data) {
        FlowBeforeInfo(data.id, {taskNodeId: data.taskNodeId}).then(res => {
          this.flowFormInfo = res.data.flowFormInfo
          this.flowTaskInfo = res.data.flowTaskInfo
          data.fullName = this.flowTaskInfo.fullName
          data.type = this.flowTaskInfo.type
          if (data.formType == 1) {
            if (this.flowTaskInfo.formUrl) {
              this.currentView = (resolve) => require([`@/views/${this.flowTaskInfo.formUrl}`], resolve)
            } else {
              this.currentView = (resolve) => require([`@/views/workFlow/workFlowForm/${data.enCode}`], resolve)
            }
          } else {
            this.currentView = (resolve) => require([`@/views/workFlow/workFlowForm/dynamicForm`], resolve)
          }
          this.flowTaskNodeList = res.data.flowTaskNodeList
          this.flowTemplateJson = this.flowTaskInfo.flowTemplateJson ? JSON.parse(this.flowTaskInfo.flowTemplateJson) : null
          this.flowTaskOperatorRecordList = res.data.flowTaskOperatorRecordList
          this.properties = res.data.approversProperties || {}
          this.endTime = this.flowTaskInfo.completion == 100 ? this.flowTaskInfo.endTime : 0
          data.formConf = res.data.flowFormInfo
          if (data.opType != 1) data.readonly = true
          data.formOperates = []
          if (data.opType == 0) {
            this.properties = this.flowTemplateJson && this.flowTemplateJson.properties || {}
            if (this.flowTemplateJson && this.flowTemplateJson.properties && this.flowTemplateJson.properties.formOperates) {
              data.formOperates = this.flowTemplateJson.properties.formOperates || []
            }
          } else {
            data.formOperates = res.data.formOperates || []
          }
          if (this.flowTaskNodeList.length) {
            let assignNodeList = []
            for (let i = 0; i < this.flowTaskNodeList.length; i++) {
              const nodeItem = this.flowTaskNodeList[i]
              data.opType == 4 && nodeItem.type == 1 && assignNodeList.push(nodeItem)
              const loop = data => {
                if (Array.isArray(data)) data.forEach(d => loop(d))
                if (data.nodeId === nodeItem.nodeCode) {
                  if (nodeItem.type == 0) data.state = 'state-past'
                  if (nodeItem.type == 1) data.state = 'state-curr'
                  if (nodeItem.nodeType === 'approver' || nodeItem.nodeType === 'start' || nodeItem.nodeType === 'subFlow') data.content = nodeItem.userName
                  return
                }
                if (data.conditionNodes && Array.isArray(data.conditionNodes)) loop(data.conditionNodes)
                if (data.childNode) loop(data.childNode)
              }
              loop(this.flowTemplateJson)
            }
            this.assignNodeList = assignNodeList
          }
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.form && this.$refs.form.init(data)
            })
          }, 500)
        }).catch(() => {
          this.loading = false
        })
      },
      eventLancher(eventType) {
        this.$refs.form && this.$refs.form.dataFormSubmit(eventType)
      },
      eventReciver(formData, eventType) {
        this.formData = formData
        this.eventType = eventType
        if (eventType === 'save' || eventType === 'submit') {
          return this.submitOrSave()
        }
        if (eventType === 'audit' || eventType === 'reject') {
          this.handleId = ''
          this.reason = ''
          this.copyIds = ''
          this.handleReset()
          this.visible = true
        }
      },
      submitOrSave() {
        this.formData.status = this.eventType === 'submit' ? 0 : 1
        if (this.eventType === 'save') return this.handleRequest()
        this.$confirm('您确定要提交当前流程吗, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          this.handleRequest()
        }).catch(() => {
        });
      },
      handleRequest() {
        if (!this.formData.id) delete (this.formData.id)
        if (this.eventType === 'save') this.btnLoading = true
        let formMethod = null
        if (this.setting.formType == 1) {
          formMethod = this.formData.id ? Update : Create
        } else {
          formMethod = this.formData.id ? DynamicUpdate : DynamicCreate
        }
        formMethod(this.setting.enCode, this.formData).then(res => {
          this.$message({
            message: res.msg,
            type: 'success',
            duration: 1500,
            onClose: () => {
              if (this.eventType === 'save') this.btnLoading = false
              this.$emit('close', true)
            }
          })
        }).catch(() => {
          if (this.eventType === 'save') this.btnLoading = false
        })
      },
      revoke() {
        this.$prompt('', "撤回流程", {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入撤回原因（选填）',
          inputType: 'textarea',
          inputValue: "",
          closeOnClickModal: false
        }).then(({value}) => {
          Revoke(this.setting.id, {handleOpinion: value}).then(res => {
            this.$message({
              type: 'success',
              message: res.msg,
              duration: 1000,
              onClose: () => {
                this.$emit('close', true)
              }
            })
          })
        }).catch(() => {
        })
      },
      press() {
        this.$confirm('此操作将提示该节点尽快处理，是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          Press(this.setting.id).then(res => {
            this.$message({
              type: 'success',
              message: res.msg,
              duration: 1000
            })
          })
        }).catch(() => {
        })
      },
      recall() {
        this.$prompt('', "撤回审核", {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入撤回原因（选填）',
          inputType: 'textarea',
          inputValue: "",
          closeOnClickModal: false
        }).then(({value}) => {
          Recall(this.setting.taskId, {handleOpinion: value}).then(res => {
            this.$message({
              type: 'success',
              message: res.msg,
              duration: 1000,
              onClose: () => {
                this.$emit('close', true)
              }
            })
          })
        }).catch(() => {
        })
      },
      cancel() {
        this.$prompt('', "终止审核不可恢复", {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入终止原因（选填）',
          inputType: 'textarea',
          inputValue: "",
          closeOnClickModal: false
        }).then(({value}) => {
          Cancel(this.setting.taskId, {handleOpinion: value}).then(res => {
            this.$message({
              type: 'success',
              message: res.msg,
              duration: 1000,
              onClose: () => {
                this.$emit('close', true)
              }
            })
          })
        }).catch(() => {
        })
      },
      openUserBox(type) {
        this.userBoxVisible = true
        this.$nextTick(() => {
          this.$refs.userBox.init()
        })
      },
      handleTransfer(freeApproverUserId) {
        Transfer(this.setting.taskId, {freeApproverUserId}).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1000,
            onClose: () => {
              this.$emit('close', true)
            }
          })
        })
      },
      openAssignBox() {
        this.assignVisible = true
        this.$nextTick(() => {
          this.$refs['assignForm'].resetFields()
        })
      },
      handleAssign() {
        this.$refs['assignForm'].validate((valid) => {
          if (!valid) return
          Assign(this.setting.taskId, this.assignForm).then(res => {
            this.$message({
              type: 'success',
              message: res.msg,
              duration: 1000,
              onClose: () => {
                this.$emit('close', true)
              }
            })
          })
        })
      },
      handleApproval() {
        if (this.properties.hasSign && !this.signImg) {
          this.$message({
            message: '请签名',
            type: 'error'
          })
          return
        }
        let query = {
          handleOpinion: this.reason,
          formData: this.formData,
          enCode: this.setting.enCode,
          signImg: this.signImg,
          copyIds: this.copyIds
        }
        if (this.eventType === 'audit' && this.properties.hasFreeApprover) {
          query = {freeApproverUserId: this.handleId, ...query}
        }
        const approvalMethod = this.eventType === 'audit' ? Audit : Reject
        this.approvalBtnLoading = true
        approvalMethod(this.setting.taskId, query).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1000,
            onClose: () => {
              this.approvalBtnLoading = false
              this.visible = false
              this.$emit('close', true)
            }
          })
        }).catch(() => {
          this.approvalBtnLoading = false
        })
      },
      handleReset() {
        this.signImg = ''
        this.$nextTick(() => {
          this.$refs.esign && this.$refs.esign.reset()
        })
      },
      handleGenerate() {
        this.$refs.esign.generate().then(res => {
          if (res) this.signImg = res
        }).catch(err => {
          this.$message({
            message: '请签名',
            type: 'warning'
          })
        })
      },
      setPageLoad(val) {
        this.loading = !!val
      },
      setLoad(val) {
        this.btnLoading = !!val
      }
    }
  }
</script>
<style lang="scss" scoped>
  .radio-audit {
    display: block;
    margin-bottom: 20px;
  }

  .sign-main {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    overflow: hidden;

    .sign-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px;
      border-bottom: 1px solid #dcdfe6;

      .sign-tip {
        color: #606266;
        font-size: 12px;
      }

      .sign-action {
        display: flex;
        align-items: center;

        .clear-btn,
        .sure-btn {
          margin-left: 5px;
        }
      }
    }

    .sign-box {
      border-top: 0;
      height: 100px;
    }

    .sign-img {
      width: 100%;
    }
  }
</style>
