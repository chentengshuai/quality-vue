<template>
  <div class="app-container JNPF-flex-main systemConfig">
    <el-form ref="baseForm" :model="baseForm" label-width="90px">
      <el-tabs v-model="activeName" type="border-card" class="JNPF-el_tabs">
        <el-tab-pane label="基本设置" name="first">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="系统名称" prop="sysName">
                <el-input v-model="baseForm.sysName" clearable placeholder="系统名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="系统版本" prop="sysVersion">
                <el-input v-model="baseForm.sysVersion" clearable placeholder="系统版本" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司名称" prop="companyName">
                <el-input v-model="baseForm.companyName" clearable placeholder="公司名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="版权信息" prop="copyright">
                <el-input v-model="baseForm.copyright" clearable placeholder="版权信息" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司简称" prop="companyCode">
                <el-input v-model="baseForm.companyCode" clearable placeholder="公司简称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司地址" prop="companyAddress">
                <el-input v-model="baseForm.companyAddress" clearable placeholder="公司地址" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司法人" prop="companyContacts">
                <el-input v-model="baseForm.companyContacts" clearable placeholder="公司法人" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司电话" prop="companyTelePhone">
                <el-input v-model="baseForm.companyTelePhone" clearable placeholder="公司电话" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司邮箱" prop="companyEmail">
                <el-input v-model="baseForm.companyEmail" clearable placeholder="公司邮箱" />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="系统描述" prop="sysDescription">
                <el-input v-model="baseForm.sysDescription" type="textarea"
                  :autosize="{ minRows: 5, maxRows: 10}" placeholder="系统描述" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" :loading="btnLoading" class="saveBtn"
                  @click="submitForm()">保 存</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="安全设置" name="second">
          <el-alert title="注意：系统登录安全、黑名单IP限制" type="warning" :closable="false" show-icon />
          <el-row>
            <el-col :span="18">
              <el-divider content-position="left">登录设置</el-divider>
              <el-form-item label="单一登录">
                <el-select v-model="baseForm.singleLogin" placeholder="请选择">
                  <el-option label="后登录踢出先登录" value="1" />
                </el-select>
              </el-form-item>
              <el-form-item label="超时登出">
                <el-input-number v-model="baseForm.tokenTimeout" :min="1" :precision="0" :step="1"
                  controls-position="right" /> 分钟
              </el-form-item>
              <el-form-item label="上次登录">
                <el-switch v-model="baseForm.lastLoginTimeSwitch" :active-value="1"
                  :inactive-value="0" />
              </el-form-item>
              <el-form-item>
                <el-card class="box-card" shadow="never" style="width: 300px;"
                  :body-style="{ padding: '0px 20px' }">
                  <div slot="header">
                    <span>上次登录信息提示</span>
                    <i style="float: right; padding: 11px 0" class="el-icon-close" />
                  </div>
                  <div class="item">
                    <p>时间：2018-10-17 12:40</p>
                    <p>地点：上海市</p>
                    <p>IP：255.255.0.0</p>
                  </div>
                </el-card>
              </el-form-item>
              <el-divider content-position="left">访问设置</el-divider>
              <el-form-item label="开启验证">
                <el-switch v-model="baseForm.whitelistSwitch" :active-value="1"
                  :inactive-value="0" />
              </el-form-item>
              <el-form-item label="允许访问IP">
                <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 10}"
                  v-model="baseForm.whiteListIp" placeholder="允许访问IP" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" :loading="btnLoading" class="saveBtn"
                  @click="submitForm()">保 存</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="第三方设置" name="third">
          <el-tabs tab-position="left" style="height:100%" v-model="thirdTab" class="thirdTab">
            <el-tab-pane label="短信">
              <el-alert title="注意：请在短信厂家官网网站开通申请" type="warning" :closable="false" show-icon />
              <el-row style="margin-top: 15px">
                <el-col :span="12">
                  <el-form-item label="短信厂家" prop="smsCompany">
                    <el-radio-group v-model="baseForm.smsCompany">
                      <el-radio-button label="1">阿里</el-radio-button>
                      <el-radio-button label="2">腾讯</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="用户编号" prop="smsKeyId">
                    <el-input v-model="baseForm.smsKeyId" clearable placeholder="请输入AccessKeyId" />
                  </el-form-item>
                  <el-form-item label="用户秘钥" prop="smsKeySecret">
                    <el-input v-model="baseForm.smsKeySecret" show-password clearable
                      placeholder="请输入AccessKeySec" />
                  </el-form-item>
                  <el-form-item label="签名内容" prop="smsSignName">
                    <el-input v-model="baseForm.smsSignName" clearable placeholder="请输入SignName" />
                  </el-form-item>
                  <el-form-item label="模板编号" prop="smsTemplateId">
                    <el-input v-model="baseForm.smsTemplateId" clearable
                      placeholder="请输入TemplateId" />
                  </el-form-item>
                  <el-form-item label="应用编号" prop="smsAppId" v-if="baseForm.smsCompany=='2'">
                    <el-input v-model="baseForm.smsAppId" clearable placeholder="请输入AppId" />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" size="small" :loading="btnLoading" class="saveBtn"
                      @click="submitForm()">保 存</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="电子邮箱">
              <el-alert title="注意：系统邮件设置成功后所有邮件会由此邮箱发出" type="warning" :closable="false"
                show-icon />
              <el-row :gutter="20" style="margin-top: 15px">
                <el-col :span="12">
                  <el-form-item label="POP3服务" prop="emailPop3Host">
                    <el-input v-model="baseForm.emailPop3Host" clearable placeholder="POP3服务" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="SMTP服务" prop="emailSmtpHost">
                    <el-input v-model="baseForm.emailSmtpHost" clearable placeholder="SMTP服务" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="POP3端口" prop="emailPop3Port">
                    <el-input-number v-model="baseForm.emailPop3Port" controls-position="right" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="SMTP端口" prop="emailSmtpPort">
                    <el-input-number v-model="baseForm.emailSmtpPort" controls-position="right" />
                  </el-form-item>
                </el-col>
                <el-col :span="12" :offset="6" :pull="6">
                  <el-form-item label="显示名称" prop="emailSenderName">
                    <el-input v-model="baseForm.emailSenderName" clearable placeholder="显示名称" />
                  </el-form-item>
                </el-col>
                <el-col :span="12" :offset="6" :pull="6">
                  <el-form-item label="邮箱账户" prop="emailAccount">
                    <el-input v-model="baseForm.emailAccount" clearable placeholder="邮箱账户" />
                  </el-form-item>
                </el-col>
                <el-col :span="12" :offset="6" :pull="6">
                  <el-form-item label="邮箱密码" prop="emailPassword">
                    <el-input v-model="baseForm.emailPassword" show-password placeholder="邮箱密码">
                      <el-button slot="append" @click="checkEmailStauts" :loading="testLoading">测试连接
                      </el-button>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="SSL登录" prop="emailSsl">
                    <el-switch v-model="baseForm.emailSsl" :active-value="1" :inactive-value="0" />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" size="small" :loading="btnLoading" class="saveBtn"
                      @click="submitForm()">保 存</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="企业微信">
              <el-row :gutter="20" style="margin-top: 15px">
                <el-col :span="12" :offset="6" :pull="6">
                  <el-form-item label="企业号Id" prop="qyhCorpId">
                    <el-input v-model="baseForm.qyhCorpId" clearable placeholder="请输入CorpId" />
                  </el-form-item>
                </el-col>
                <el-col :span="12" :offset="6" :pull="6">
                  <el-form-item label="应用凭证" prop="qyhAgentId">
                    <el-input v-model="baseForm.qyhAgentId" clearable placeholder="请输入AgentId" />
                  </el-form-item>
                </el-col>
                <el-col :span="12" :offset="6" :pull="6">
                  <el-form-item label="凭证密钥" prop="qyhAgentSecret">
                    <el-input v-model="baseForm.qyhAgentSecret" placeholder="请输入AppSecret">
                      <el-button slot="append" @click="checkQy(0)" :loading="testQyLoading">连接测试
                      </el-button>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" :offset="6" :pull="6">
                  <el-form-item label="同步密钥" prop="qyhCorpSecret">
                    <el-input v-model="baseForm.qyhCorpSecret" placeholder="请输入CorpSecret">
                      <el-button slot="append" @click="checkQy(1)" :loading="testSyncLoading">同步测试
                      </el-button>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="触发事件">
                    <el-table :data="wxEvents" border>
                      <el-table-column prop="select" label="" width="50" align="center">
                        <template slot-scope="scope">
                          <el-checkbox v-model='scope.row.select' />
                        </template>
                      </el-table-column>
                      <el-table-column prop="title" label="触发事件" width="200" />
                      <el-table-column prop="desc" label="描述" />
                    </el-table>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="同步反馈">
                    <el-table :data="wxResults" border>
                      <el-table-column prop="synType" label="同步类型" />
                      <el-table-column prop="recordTotal" label="总数" />
                      <el-table-column prop="synSuccessCount" label="同步成功数" />
                      <el-table-column prop="synFailCount" label="同步失败数" />
                      <el-table-column prop="unSynCount" label="未同步数" />
                      <el-table-column prop="synDate" label="同步时间"
                        :formatter="jnpf.tableDateFormat" />
                      <el-table-column label="操作" width="70">
                        <template slot-scope="scope">
                          <el-button size="mini" type="text" @click="syncQy(scope.row)"
                            :loading="scope.row.loading">同步</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item>
                    <el-button type="primary" size="small" :loading="btnLoading" class="saveBtn"
                      @click="submitForm()">保 存</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="阿里钉钉">
              <el-row :gutter="20" style="margin-top: 15px">
                <el-col :span="12" :offset="6" :pull="6">
                  <el-form-item label="企业号Id" prop="dingAgentId">
                    <el-input v-model="baseForm.dingAgentId" clearable placeholder="请输入AgentId" />
                  </el-form-item>
                </el-col>
                <el-col :span="12" :offset="6" :pull="6">
                  <el-form-item label="应用凭证" prop="dingSynAppKey">
                    <el-input v-model="baseForm.dingSynAppKey" clearable placeholder="请输入AppKey" />
                  </el-form-item>
                </el-col>
                <el-col :span="12" :offset="6" :pull="6">
                  <el-form-item label="凭证密钥" prop="dingSynAppSecret">
                    <el-input v-model="baseForm.dingSynAppSecret" placeholder="请输入AppSecret">
                      <el-button slot="append" @click="checkDing" :loading="testDingLoading">连接测试
                      </el-button>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="触发事件">
                    <el-table :data="ddEvents" border>
                      <el-table-column prop="select" label="" width="50" align="center">
                        <template slot-scope="scope">
                          <el-checkbox v-model='scope.row.select' />
                        </template>
                      </el-table-column>
                      <el-table-column prop="title" label="触发事件" width="200" />
                      <el-table-column prop="desc" label="描述" />
                    </el-table>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="同步反馈">
                    <el-table :data="ddResults" border>
                      <el-table-column prop="synType" label="同步类型" />
                      <el-table-column prop="recordTotal" label="总数" />
                      <el-table-column prop="synSuccessCount" label="同步成功数" />
                      <el-table-column prop="synFailCount" label="同步失败数" />
                      <el-table-column prop="unSynCount" label="未同步数" />
                      <el-table-column prop="synDate" label="同步时间"
                        :formatter="jnpf.tableDateFormat" />
                      <el-table-column label="操作" width="70">
                        <template slot-scope="scope">
                          <el-button size="mini" type="text" @click="syncDing(scope.row)"
                            :loading="scope.row.loading">同步</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item>
                    <el-button type="primary" size="small" :loading="btnLoading" class="saveBtn"
                      @click="submitForm()">保 存</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>

<script>
import {
  getSystemConfig,
  updateSystemConfig,
  testEmail,
  testQy,
  testDing,
  getSynThirdTotal,
  synAllOrganizeSysToDing,
  synAllUserSysToDing,
  synAllOrganizeSysToQy,
  synAllUserSysToQy
} from '@/api/system/sysConfig'

export default {
  name: 'system-sysConfig',
  data() {
    return {
      activeName: 'first',
      listLoading: false,
      btnLoading: false,
      testLoading: false,
      testQyLoading: false,
      testSyncLoading: false,
      testDingLoading: false,
      thirdTab: '0',
      baseForm: {
        sysName: '',
        sysDescription: '',
        sysVersion: '',
        copyright: '',
        companyName: '',
        companyCode: '',
        companyAddress: '',
        companyContacts: '',
        companyTelePhone: '',
        companyEmail: '',
        singleLogin: '1',
        tokenTimeout: '1',
        lastLoginTimeSwitch: 1,
        whitelistSwitch: 1,
        whiteListIp: '',
        emailPop3Host: '',
        emailPop3Port: '110',
        emailSmtpHost: '',
        emailSmtpPort: '25',
        emailSenderName: '',
        emailAccount: '',
        emailPassword: '',
        emailSsl: 0,
        smsCompany: '1',
        smsKeyId: '',
        smsKeySecret: '',
        smsSignName: '',
        qyhCorpId: '',
        qyhAgentId: '',
        qyhAgentSecret: '',
        qyhCorpSecret: '',
        qyhIsSynOrg: 0,
        qyhIsSynUser: 0,
        dingSynAppKey: '',
        dingSynAppSecret: '',
        dingAgentId: '',
        dingSynIsSynOrg: 0,
        dingSynIsSynUser: 0
      },
      wxEvents: [{
        select: false,
        title: '启用同步组织',
        desc: '新增、删除、修改组织信息触发同步组织事件'
      }, {
        select: false,
        title: '启用同步用户',
        desc: '新增、删除、修改用户信息触发同步用户事件'
      }],
      wxResults: [{
        recordTotal: '',
        synDate: '',
        synFailCount: '',
        synSuccessCount: '',
        synType: '组织',
        unSynCount: '',
      }, {
        recordTotal: '',
        synDate: '',
        synFailCount: '',
        synSuccessCount: '',
        synType: '用户',
        unSynCount: '',
      }],
      ddEvents: [{
        select: false,
        title: '启用同步组织',
        desc: '新增、删除、修改组织信息触发同步组织事件'
      }, {
        select: false,
        title: '启用同步用户',
        desc: '新增、删除、修改用户信息触发同步用户事件'
      }],
      ddResults: [{
        recordTotal: '',
        synDate: '',
        synFailCount: '',
        synSuccessCount: '',
        synType: '组织',
        unSynCount: '',
      }, {
        recordTotal: '',
        synDate: '',
        synFailCount: '',
        synSuccessCount: '',
        synType: '用户',
        unSynCount: '',
      }]
    }
  },
  watch: {
    thirdTab(val) {
      if (val == 2 || val == 3) {
        const type = val == 2 ? 1 : 2
        this.getSynThirdTotal(type)
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      this.listLoading = true
      this.$nextTick(() => {
        getSystemConfig().then(res => {
          this.baseForm = res.data
          this.wxEvents[0].select = this.baseForm.qyhIsSynOrg ? true : false
          this.wxEvents[1].select = this.baseForm.qyhIsSynUser ? true : false
          this.ddEvents[0].select = this.baseForm.dingSynIsSynOrg ? true : false
          this.ddEvents[1].select = this.baseForm.dingSynIsSynUser ? true : false
          this.baseForm.smsCompany = this.baseForm.smsCompany ? this.baseForm.smsCompany : '1'
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      })
    },
    checkEmailStauts() {
      this.testLoading = true
      const data = {
        account: this.baseForm.emailAccount,
        password: this.baseForm.emailPassword,
        pop3Host: this.baseForm.emailPop3Host,
        pop3Port: this.baseForm.emailPop3Port,
        smtpHost: this.baseForm.emailSmtpHost,
        smtpPort: this.baseForm.emailSmtpPort,
        ssl: this.baseForm.emailSsl
      }
      testEmail(data).then(res => {
        this.$message({
          message: res.msg,
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.testLoading = false
          }
        })
      }).catch(() => {
        this.testLoading = false
      })
    },
    checkQy(type) {
      type === 1 ? this.testSyncLoading = true : this.testQyLoading = true
      const data = {
        qyhAgentId: this.baseForm.qyhAgentId,
        qyhAgentSecret: this.baseForm.qyhAgentSecret,
        qyhCorpId: this.baseForm.qyhCorpId,
        qyhCorpSecret: this.baseForm.qyhCorpSecret
      }
      testQy(data, type).then(res => {
        this.$message({
          message: res.msg,
          type: 'success',
          duration: 1500,
          onClose: () => {
            type === 1 ? this.testSyncLoading = false : this.testQyLoading = false
          }
        })
      }).catch(() => {
        type === 1 ? this.testSyncLoading = false : this.testQyLoading = false
      })
    },
    checkDing() {
      this.testDingLoading = true
      const data = {
        dingAgentId: this.baseForm.dingAgentId,
        dingSynAppKey: this.baseForm.dingSynAppKey,
        dingSynAppSecret: this.baseForm.dingSynAppSecret
      }
      testDing(data).then(res => {
        this.$message({
          message: res.msg,
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.testDingLoading = false
          }
        })
      }).catch(() => {
        this.testDingLoading = false
      })
    },
    getSynThirdTotal(type) {
      getSynThirdTotal(type).then(res => {
        let list = res.data.map(o => ({ loading: false, ...o }))
        type == 1 ? this.wxResults = list : this.ddResults = list
      })
    },
    syncQy(row) {
      row.loading = true
      const method = row.synType == '组织' ? synAllOrganizeSysToQy : synAllUserSysToQy
      method().then(res => {
        row.recordTotal = res.data.recordTotal
        row.synDate = res.data.synDate
        row.synFailCount = res.data.synFailCount
        row.synSuccessCount = res.data.synSuccessCount
        row.synType = res.data.synType
        row.unSynCount = res.data.unSynCount
        row.loading = false
        this.$message({
          message: '同步成功',
          type: 'success',
          duration: 1500,
        })
      }).catch(() => {
        row.loading = false
      })
    },
    syncDing(row) {
      row.loading = true
      const method = row.synType == '组织' ? synAllOrganizeSysToDing : synAllUserSysToDing
      method().then(res => {
        row.recordTotal = res.data.recordTotal
        row.synDate = res.data.synDate
        row.synFailCount = res.data.synFailCount
        row.synSuccessCount = res.data.synSuccessCount
        row.synType = res.data.synType
        row.unSynCount = res.data.unSynCount
        row.loading = false
        this.$message({
          message: '同步成功',
          type: 'success',
          duration: 1500,
        })
      }).catch(() => {
        row.loading = false
      })
    },
    submitForm() {
      this.btnLoading = true
      this.baseForm.qyhIsSynOrg = this.wxEvents[0].select ? 1 : 0
      this.baseForm.qyhIsSynUser = this.wxEvents[1].select ? 1 : 0
      this.baseForm.dingSynIsSynOrg = this.ddEvents[0].select ? 1 : 0
      this.baseForm.dingSynIsSynUser = this.ddEvents[1].select ? 1 : 0
      updateSystemConfig(this.baseForm).then(res => {
        this.$message({
          message: res.msg,
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.btnLoading = false
            this.initData()
          }
        })
      }).catch(() => {
        this.btnLoading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.systemConfig {
  padding: 0;
  >>> .el-card__header {
    padding: 6px 20px;
  }
  >>> .el-tabs--border-card {
    box-shadow: none;
    height: calc(100vh - 120px);
  }
  >>> .el-tabs--border-card > .el-tabs__content {
    padding: 30px 36px 10px 36px;
  }
  .saveBtn {
    width: 100px;
  }
  .el-table >>> th {
    line-height: 23px;
  }
  .thirdTab >>> .el-tabs__content {
    height: 100%;
    .el-tab-pane {
      height: auto;
    }
  }
}
</style>