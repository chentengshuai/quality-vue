<template>
  <div>
    <template v-if="formData.popupType==='general'">
      <el-dialog title="详情" :close-on-click-modal="false" :visible.sync="visible"
        class="JNPF-dialog JNPF-dialog_center" lock-scroll :width="formData.generalWidth"
        append-to-body>
        <div class="dynamicDetail" v-loading="loading || mainLoading"
          :element-loading-text="$t('common.loadingText')">
          <Parser :formConf="formData" :relationData="relationData" @toDetail="toDetail"
            v-if="!loading" />
        </div>
        <span slot="footer" class="dialog-footer">
          <template v-if="formData.hasPrintBtn && formData.printId">
            <el-button type="primary" @click="printBrowseVisible=true">
              {{formData.printButtonText||'打 印'}}
            </el-button>
          </template>
          <el-button @click="visible = false">{{$t('common.cancelButton')}}</el-button>
        </span>
      </el-dialog>
    </template>
    <template v-if="formData.popupType==='fullScreen'">
      <transition name="el-zoom-in-center">
        <div class="JNPF-preview-main">
          <div class="JNPF-common-page-header">
            <el-page-header @back="goBack" content="详情" />
            <div class="options">
              <template v-if="formData.hasPrintBtn && formData.printId">
                <el-button type="primary" @click="printBrowseVisible=true">
                  {{formData.printButtonText||'打 印'}}
                </el-button>
              </template>
              <el-button @click="goBack">{{$t('common.cancelButton')}}</el-button>
            </div>
          </div>
          <div class="dynamic-form-main dynamicDetail"
            :style="{margin: '0 auto',width:formData.fullScreenWidth}"
            v-loading="loading || mainLoading" :element-loading-text="$t('common.loadingText')">
            <Parser :formConf="formData" :relationData="relationData" @toDetail="toDetail"
              v-if="!loading" />
          </div>
        </div>
      </transition>
    </template>
    <Detail v-if="detailVisible" ref="Detail" @close="detailVisible = false" />
    <print-browse :visible.sync="printBrowseVisible" :id="formData.printId" :formId="dataForm.id" />
  </div>
</template>

<script>
import { getDataChange, getConfigData } from '@/api/onlineDev/visualDev'
import { deepClone } from '@/utils'
import Parser from './Parser'
import PrintBrowse from '@/components/PrintBrowse'
export default {
  name: 'Detail',
  components: { Parser, PrintBrowse },
  data() {
    return {
      visible: false,
      dataForm: {
        id: '',
        data: ''
      },
      modelId: '',
      formData: {},
      formValue: {},
      loading: true,
      mainLoading: false,
      detailVisible: false,
      relationData: {},
      useFormPermission: false,
      printBrowseVisible: false,
      formOperates: []
    }
  },
  methods: {
    goBack() {
      this.$emit('close')
    },
    init(formData, modelId, id, useFormPermission) {
      this.formData = deepClone(formData)
      this.modelId = modelId
      this.useFormPermission = useFormPermission
      this.dataForm.id = id || ''
      this.getFormOperates()
      this.loading = true
      this.relationData = {}
      this.$nextTick(() => {
        if (this.dataForm.id) {
          getDataChange(modelId, this.dataForm.id).then(res => {
            this.dataForm = res.data
            if (!this.dataForm.data) return
            this.formValue = JSON.parse(this.dataForm.data)
            this.fillFormData(this.formData, this.formValue)
            this.visible = true
          })
        } else {
          this.formValue = {}
          this.loading = false
          this.visible = false
          this.$emit('close')
        }
      })
    },
    unique(arr, attrName) {
      const res = new Map()
      return arr.filter(o => !res.has(o[attrName]) && res.set(o[attrName], 1))
    },
    handleAttrList(list) {
      let realList = this.unique(list, 'relationField')
      for (let i = 0; i < realList.length; i++) {
        const item = realList[i];
        let modelId = '', id = "", field = ""
        const loop = list => {
          for (let i = 0; i < list.length; i++) {
            if (item.relationField === list[i].__vModel__) {
              modelId = list[i].modelId
              id = list[i].__config__.defaultValue
              field = list[i].__vModel__
              break
            }
            if (list[i].__config__ && list[i].__config__.jnpfKey !== 'table' && list[i].__config__.children && Array.isArray(list[i].__config__.children)) {
              loop(list[i].__config__.children)
            }
          }
        }
        loop(this.formData.fields)
        if (!id) {
          this.$set(this.relationData, field, "")
          continue
        }
        getDataChange(modelId, id).then(res => {
          if (!res.data || !res.data.data) {
            this.$set(this.relationData, field, "")
            return
          }
          let data = JSON.parse(res.data.data)
          this.$set(this.relationData, field, data)
        }).catch(() => { this.$set(this.relationData, field, "") })
      }
    },
    toDetail(item) {
      if (!item.__config__.defaultValue) return
      this.mainLoading = true
      getConfigData(item.modelId).then(res => {
        this.mainLoading = false
        if (!res.data) return
        if (!res.data.formData) return
        let formData = JSON.parse(res.data.formData)
        formData.popupType = this.formData.popupType
        this.detailVisible = true
        this.$nextTick(() => {
          this.$refs.Detail.init(formData, item.modelId, item.__config__.defaultValue)
        })
      }).catch(() => { this.mainLoading = false })
    },
    getFormOperates() {
      if (!this.useFormPermission) return
      const permissionList = this.$store.getters.permissionList
      const modelId = this.$route.meta.modelId
      const list = permissionList.filter(o => o.modelId === modelId)
      this.formOperates = list[0] && list[0].form ? list[0].form : []
    },
    fillFormData(form, data) {
      let relationFormAttrList = []
      const loop = list => {
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          if (item.__vModel__) {
            if (item.__config__.jnpfKey === 'relationForm') {
              let id = data[item.__vModel__ + '_id']
              if (id) item.__config__.defaultValue = id
              this.$set(item, 'name', data[item.__vModel__] || '')
            } else {
              const val = data[item.__vModel__]
              if (val) item.__config__.defaultValue = val
            }
            if (this.useFormPermission) {
              let noShow = true
              if (this.formOperates && this.formOperates.length) {
                noShow = !this.formOperates.some(o => o.enCode === item.__vModel__)
              }
              noShow = item.__config__.noShow ? item.__config__.noShow : noShow
              this.$set(item.__config__, 'noShow', noShow)
            }
          }
          if (item.__config__.jnpfKey === 'relationFormAttr') relationFormAttrList.push(item)
          if (item.__config__ && item.__config__.jnpfKey !== 'table' && item.__config__.children && Array.isArray(item.__config__.children)) {
            loop(item.__config__.children)
          }
        }
      }
      loop(form.fields)
      this.handleAttrList(relationFormAttrList)
      this.loading = false
    }
  }
}
</script>