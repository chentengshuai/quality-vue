<template>
  <div class="right-board">
    <el-tabs v-model="currentTab" class="center-tabs">
      <el-tab-pane label="组件属性" name="field" />
      <el-tab-pane label="表单属性" name="form" />
    </el-tabs>
    <div class="field-box">
      <el-scrollbar class="right-scrollbar">
        <!-- 组件属性 -->
        <el-form v-show="currentTab==='field' && showField" size="small" label-width="90px"
          labelPosition="left">
          <template v-if="activeData.__config__">
            <template v-if="$store.getters.hasTable">
              <template v-if="activeData.__config__.jnpfKey==='table'">
                <el-form-item
                  v-if="activeData.__vModel__!==undefined && !noVModelList.includes(activeData.__config__.jnpfKey)"
                  label="控件字段">
                  <el-input v-model="activeData.__vModel__" placeholder="请输入控件字段(v-model)"
                    disabled />
                </el-form-item>
              </template>
              <template v-else>
                <template v-if="!activeData.__config__.isSubTable">
                  <el-form-item
                    v-if="activeData.__vModel__!==undefined && !noVModelList.includes(activeData.__config__.jnpfKey)"
                    label="数据库表">
                    <el-select v-model="activeData.__config__.tableName" placeholder="请选择数据库表"
                      @change="tableChange" filterable>
                      <el-option v-for="item in allTable" :key="item.table" :value="item.table"
                        :label="item.tableName?item.table+'('+item.tableName+')':item.table">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    v-if="activeData.__vModel__!==undefined && !noVModelList.includes(activeData.__config__.jnpfKey)"
                    label="控件字段">
                    <el-select v-model="activeData.__vModel__" placeholder="请选择控件字段(v-model)"
                      clearable @change="fieldChange" filterable>
                      <el-option v-for="item in fieldOptions" :key="item.realField"
                        :value="item.realField"
                        :label="item.fieldName?item.field+'('+item.fieldName+')':item.field">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </template>
                <template v-if="activeData.__config__.isSubTable && subTable.length">
                  <el-form-item
                    v-if="activeData.__vModel__!==undefined && !noVModelList.includes(activeData.__config__.jnpfKey)"
                    label="控件字段">
                    <el-select v-model="activeData.__vModel__" placeholder="请选择控件字段(v-model)"
                      clearable @change="fieldChange1" filterable>
                      <el-option
                        v-for="item in getSubTalebFiled(activeData.__config__.relationTable)"
                        :key="item.field" :value="item.field"
                        :label="item.fieldName?item.field+'('+item.fieldName+')':item.field">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </template>
            </template>
            <template v-else>
              <el-form-item
                v-if="activeData.__vModel__!==undefined  && !noVModelList.includes(activeData.__config__.jnpfKey)"
                label="控件字段">
                <el-input v-model="activeData.__vModel__" placeholder="请输入控件字段(v-model)" disabled />
              </el-form-item>
            </template>
            <JNPFComInput v-if="activeData.__config__.jnpfKey==='comInput'"
              :active-data="activeData" />
            <JNPF-textarea v-if="activeData.__config__.jnpfKey==='textarea'"
              :active-data="activeData" />
            <JNPFText v-if="activeData.__config__.jnpfKey==='JNPFText'" :active-data="activeData" />
            <JNPFNumInput v-if="activeData.__config__.jnpfKey==='numInput'"
              :active-data="activeData" />
            <JNPFAmount v-if="activeData.__config__.jnpfKey==='JNPFAmount'"
              :active-data="activeData" />
            <JNPFPsdInput v-if="activeData.__config__.jnpfKey==='PsdInput'"
              :active-data="activeData" />
            <JNPFRadio v-if="activeData.__config__.jnpfKey==='radio'" :active-data="activeData" />
            <JNPFCheckbox v-if="activeData.__config__.jnpfKey==='checkbox'"
              :active-data="activeData" />
            <JNPFSelect v-if="activeData.__config__.jnpfKey==='select'" :active-data="activeData"
              :key="activeData.__config__.renderKey" :dictionaryOptions="dictionaryOptions"
              :dataInterfaceOptions="dataInterfaceOptions" />
            <JNPFCascader v-if="activeData.__config__.jnpfKey==='cascader'"
              :active-data="activeData" />
            <JNPFTime v-if="activeData.__config__.jnpfKey==='time'" :active-data="activeData" />
            <JNPFTimeRange v-if="activeData.__config__.jnpfKey==='timeRange'"
              :active-data="activeData" />
            <JNPFDate v-if="activeData.__config__.jnpfKey==='date'" :active-data="activeData" />
            <JNPFDateRange v-if="activeData.__config__.jnpfKey==='dateRange'"
              :active-data="activeData" />
            <JNPFColorPicker v-if="activeData.__config__.jnpfKey==='colorPicker'"
              :active-data="activeData" />
            <JNPFRate v-if="activeData.__config__.jnpfKey==='rate'" :active-data="activeData" />
            <JNPFSwitch v-if="activeData.__config__.jnpfKey==='switch'" :active-data="activeData" />
            <JNPFSlider v-if="activeData.__config__.jnpfKey==='slider'" :active-data="activeData" />
            <JNPFDivider v-if="activeData.__config__.jnpfKey==='divider'"
              :active-data="activeData" />
            <JNPFUploadFz v-if="activeData.__config__.jnpfKey==='uploadFz'"
              :active-data="activeData" />
            <JNPFUploadImg v-if="activeData.__config__.jnpfKey==='uploadImg'"
              :active-data="activeData" />
            <JNPFComRight v-if="isCommon" :active-data="activeData" />
            <JNPFAddress v-if="activeData.__config__.jnpfKey==='address'"
              :active-data="activeData" />
            <TreeSelect v-if="activeData.__config__.jnpfKey==='treeSelect'"
              :active-data="activeData" />
            <GroupTitle v-if="activeData.__config__.jnpfKey==='groupTitle'"
              :active-data="activeData" />
            <RelationForm v-if="activeData.__config__.jnpfKey==='relationForm'"
              :active-data="activeData" v-on="$listeners" :key="activeData.__config__.renderKey" />
            <RelationFormAttr v-if="activeData.__config__.jnpfKey==='relationFormAttr'"
              :active-data="activeData" ref="relationFormAttr" />
            <RelationFlow v-if="activeData.__config__.jnpfKey==='relationFlow'"
              :active-data="activeData" v-on="$listeners" />
            <RelationFlowAttr v-if="activeData.__config__.jnpfKey==='relationFlowAttr'"
              :active-data="activeData" ref="relationFlowAttr" />
            <JNPFCalculate v-if="activeData.__config__.jnpfKey==='calculate'"
              :active-data="activeData" ref="calculate" />
            <PopupSelect v-if="activeData.__config__.jnpfKey==='popupSelect'"
              :active-data="activeData" />
            <Tab v-if="activeData.__config__.jnpfKey==='tab'" :active-data="activeData" />
            <Collapse v-if="activeData.__config__.jnpfKey==='collapse'" :active-data="activeData" />
            <template v-if="isSystem">
              <el-form-item label="控件标题">
                <el-input v-model="activeData.__config__.label" placeholder="请输入控件标题" />
              </el-form-item>
              <el-form-item label="控件栅格">
                <el-slider v-model="activeData.__config__.span" :max="24" :min="6" show-stops
                  :step="2" show-tooltip />
              </el-form-item>
              <el-form-item label="标题宽度">
                <el-input-number v-model="activeData.__config__.labelWidth" placeholder="标题宽度"
                  :min="0" :precision="0" controls-position="right" />
              </el-form-item>
              <el-form-item label="选择模板" v-if="activeData.__config__.jnpfKey==='billRule'">
                <BillRule v-model="activeData.__config__.rule" placeholder="选择模板" />
              </el-form-item>
              <el-form-item label="是否隐藏">
                <el-switch v-model="activeData.__config__.noShow" />
              </el-form-item>
            </template>
            <template v-if="activeData.on && (modelType==1||modelType==6)">
              <el-divider>组件事件</el-divider>
              <div v-for="(value,key) in activeData.on" :key="key">
                <el-form-item :label="key">
                  <el-button style="width: 100%;" @click="editFunc(value,key)">
                    {{getTipText(key)}}
                  </el-button>
                </el-form-item>
              </div>
            </template>
            <template v-if="activeData.__config__.jnpfKey==='table'">
              <el-form-item label="控件标题">
                <el-input v-model="activeData.__config__.label" placeholder="请输入控件标题" />
              </el-form-item>
              <el-form-item label="关联子表" v-if="$store.getters.hasTable">
                <el-select v-model="activeData.__config__.tableName" placeholder="请选择关联子表" clearable
                  @change="onTableNameChange">
                  <el-option v-for="item in subTable" :key="item.table"
                    :label="item.tableName?item.table+'('+item.tableName+')':item.table"
                    :value="item.table">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="显示标题">
                <el-switch v-model="activeData.__config__.showTitle" />
              </el-form-item>
              <el-form-item v-if="activeData.actionText !== undefined" label="动作文字">
                <el-input v-model="activeData.actionText" placeholder="请输入动作文字" />
              </el-form-item>
            </template>
            <template v-if="activeData.__config__.jnpfKey==='card'">
              <el-form-item label="控件栅格" label-width="76px">
                <el-slider v-model="activeData.__config__.span" :max="24" :min="6" show-stops
                  :step="2" show-tooltip />
              </el-form-item>
              <el-form-item label="卡片标题" label-width="76px">
                <el-input v-model="activeData.header" placeholder="请输入卡片标题" />
              </el-form-item>
              <el-form-item label="显示阴影" label-width="76px">
                <el-radio-group v-model="activeData.shadow" size="small">
                  <el-radio-button label="always">一直显示</el-radio-button>
                  <el-radio-button label="hover">移入显示</el-radio-button>
                  <el-radio-button label="never">永不显示</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </template>
            <!-- row 布局 -->
            <template v-if="activeData.__config__.jnpfKey==='row'">
              <el-form-item v-if="activeData.__config__.componentName!==undefined" label="组件名">
                {{ activeData.__config__.componentName }}
              </el-form-item>
              <el-form-item label="控件栅格">
                <el-slider v-model="activeData.__config__.span" :max="24" :min="6" show-stops
                  :step="2" show-tooltip />
              </el-form-item>
            </template>
            <el-form-item
              v-if="activeData.__config__.layout==='rowFormItem'&&activeData.gutter!==undefined"
              label="栅格间隔">
              <el-input-number v-model="activeData.gutter" :min="0" placeholder="栅格间隔"
                controls-position="right" />
            </el-form-item>
          </template>
        </el-form>
        <!-- 表单属性 -->
        <el-form v-show="currentTab === 'form'" size="small" label-width="100px"
          labelPosition="left">
          <el-form-item label="表单尺寸">
            <el-radio-group v-model="formConf.size">
              <el-radio-button label="medium">中等</el-radio-button>
              <el-radio-button label="small">较小</el-radio-button>
              <el-radio-button label="mini">迷你</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="标签对齐">
            <el-radio-group v-model="formConf.labelPosition">
              <el-radio-button label="left">左对齐</el-radio-button>
              <el-radio-button label="right">右对齐</el-radio-button>
              <el-radio-button label="top" :disabled="formConf.formStyle==='word-form'">顶部对齐
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="标题宽度">
            <el-input-number v-model="formConf.labelWidth" :min="0" placeholder="标题宽度"
              controls-position="right" />
          </el-form-item>
          <el-form-item label="栅格间隔">
            <el-input-number v-model="formConf.gutter" :min="0" placeholder="栅格间隔"
              controls-position="right" />
          </el-form-item>
          <el-form-item label="弹窗类型" v-if="modelType != 3 && modelType!=6 && webType==2">
            <el-select v-model="formConf.popupType" placeholder="请选择">
              <el-option label="普通弹窗" value="general"></el-option>
              <el-option label="全屏弹窗" value="fullScreen"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="表单样式" v-if="modelType != 3">
            <el-select v-model="formConf.formStyle" placeholder="请选择">
              <el-option label="默认风格" value=""></el-option>
              <el-option label="公文风格" value="word-form"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="表单宽度" v-if="formConf.popupType==='general'">
            <el-select v-model="formConf.generalWidth" placeholder="请选择">
              <el-option v-for="item in generalWidthOptions" :label="item" :value="item"
                :key="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="表单宽度" v-if="formConf.popupType==='fullScreen'">
            <el-select v-model="formConf.fullScreenWidth" placeholder="请选择">
              <el-option v-for="item in fullScreenWidthOptions" :label="item" :value="item"
                :key="item" />
            </el-select>
          </el-form-item>
          <template v-if="modelType!=3 && modelType!=6 && webType!=3">
            <el-divider>表单按钮</el-divider>
            <div class="per-cell">
              <el-checkbox v-model="formConf.hasConfirmBtn" disabled>确定</el-checkbox>
              <el-input v-model="formConf.confirmButtonText" />
            </div>
            <div class="per-cell">
              <el-checkbox v-model="formConf.hasCancelBtn" disabled>取消</el-checkbox>
              <el-input v-model="formConf.cancelButtonText" />
            </div>
            <template v-if="modelType==1 && webType==2">
              <div class="per-cell" :class="{'last':!formConf.hasPrintBtn}">
                <el-checkbox v-model="formConf.hasPrintBtn">打印</el-checkbox>
                <el-input v-model="formConf.printButtonText" />
              </div>
              <el-form-item label="打印设置" v-if="formConf.hasPrintBtn">
                <JNPF-TreeSelect :options="printTplList" v-model="formConf.printId"
                  placeholder="请选择打印模板" lastLevel clearable></JNPF-TreeSelect>
              </el-form-item>
            </template>
          </template>
          <template v-if="formConf.funcs && (modelType==1||modelType==6)">
            <el-divider>表单事件</el-divider>
            <el-form-item label="onLoad">
              <el-button style="width: 100%;"
                @click="editFunc(formConf.funcs.onLoad,'onLoad',true)">表单加载触发
              </el-button>
            </el-form-item>
            <el-form-item label="beforeSubmit">
              <el-button style="width: 100%;"
                @click="editFunc(formConf.funcs.beforeSubmit,'beforeSubmit',true)">提交前置触发
              </el-button>
            </el-form-item>
            <el-form-item label="afterSubmit">
              <el-button style="width: 100%;"
                @click="editFunc(formConf.funcs.afterSubmit,'afterSubmit',true)">提交后置触发</el-button>
            </el-form-item>
          </template>
        </el-form>
      </el-scrollbar>
    </div>
    <form-script :visible.sync="formScriptVisible" :tpl="activeScript" :fields="drawingList"
      @updateScript="updateScript" />
  </div>
</template>

<script>
import { noVModelList } from '@/components/Generator/generator/comConfig'
import { isNumberStr } from '@/components/Generator/utils'
import { saveFormConf, getDrawingList } from '@/components/Generator/utils/db'
import { getDictionaryTypeSelector } from "@/api/systemData/dictionary"
import { getDataInterfaceSelector } from "@/api/systemData/dataInterface"
import FormScript from './FormScript'
import JNPFComInput from './RightComponents/ComInput'
import JNPFTextarea from './RightComponents/Textarea'
import JNPFText from './RightComponents/JNPFText'
import JNPFNumInput from './RightComponents/NumInput'
import JNPFAmount from './RightComponents/JNPFAmount'
import JNPFPsdInput from './RightComponents/PsdInput'
import JNPFRadio from './RightComponents/Radio'
import JNPFCheckbox from './RightComponents/Checkbox'
import JNPFSelect from './RightComponents/Select'
import JNPFCascader from './RightComponents/Cascader/index'
import JNPFTime from './RightComponents/Time'
import JNPFTimeRange from './RightComponents/TimeRange'
import JNPFDate from './RightComponents/Date'
import JNPFDateRange from './RightComponents/DateRange'
import JNPFColorPicker from './RightComponents/ColorPicker'
import JNPFRate from './RightComponents/Rate'
import JNPFSwitch from './RightComponents/Switch'
import JNPFSlider from './RightComponents/Slider'
import JNPFDivider from './RightComponents/Divider'
import JNPFUploadFz from './RightComponents/UploadFz'
import JNPFUploadImg from './RightComponents/UploadImg'
import JNPFComRight from './RightComponents/ComRight'
import JNPFAddress from './RightComponents/Address'
import TreeSelect from './RightComponents/TreeSelect'
import GroupTitle from './RightComponents/GroupTitle'
import RelationForm from './RightComponents/RelationForm'
import RelationFormAttr from './RightComponents/RelationFormAttr'
import RelationFlow from './RightComponents/RelationFlow'
import RelationFlowAttr from './RightComponents/RelationFlowAttr'
import JNPFCalculate from './RightComponents/Calculate'
import PopupSelect from './RightComponents/PopupSelect'
import Tab from './RightComponents/Tab'
import Collapse from './RightComponents/Collapse'

const commonRightList = ['comSelect', 'depSelect', 'posSelect', 'userSelect', 'dicSelect', 'editor']
const systemList = ['createUser', 'createTime', 'modifyUser', 'modifyTime', 'currOrganize', 'currDept', 'currPosition', 'billRule']

export default {
  components: {
    FormScript,
    JNPFComInput,
    JNPFTextarea,
    JNPFText,
    JNPFNumInput,
    JNPFAmount,
    JNPFPsdInput,
    JNPFRadio,
    JNPFCheckbox,
    JNPFSelect,
    JNPFCascader,
    JNPFTime,
    JNPFTimeRange,
    JNPFDate,
    JNPFDateRange,
    JNPFColorPicker,
    JNPFRate,
    JNPFSwitch,
    JNPFSlider,
    JNPFDivider,
    JNPFUploadFz,
    JNPFUploadImg,
    JNPFComRight,
    JNPFAddress,
    TreeSelect,
    GroupTitle,
    RelationForm,
    RelationFormAttr,
    RelationFlow,
    RelationFlowAttr,
    JNPFCalculate,
    PopupSelect,
    Tab,
    Collapse
  },
  props: ['showField', 'activeData', 'formConf', 'modelType', 'webType', 'drawingList'],
  data() {
    return {
      currentTab: 'field',
      currentNode: null,
      dialogVisible: false,
      iconsVisible: false,
      formScriptVisible: false,
      comScriptVisible: false,
      currentIconModel: null,
      activeScript: '',
      activeFunc: '',
      isConf: false,
      noVModelList,
      printTplList: [],
      fieldOptions: [],
      dictionaryOptions: [],
      dataInterfaceOptions: [],
      justifyOptions: [
        {
          label: 'start',
          value: 'start'
        },
        {
          label: 'end',
          value: 'end'
        },
        {
          label: 'center',
          value: 'center'
        },
        {
          label: 'space-around',
          value: 'space-around'
        },
        {
          label: 'space-between',
          value: 'space-between'
        }
      ],
      generalWidthOptions: ['600px', '800px', '1000px', '40%', '50%', '60%', '70%', '80%'],
      fullScreenWidthOptions: ['800px', '1000px', '1200px', '1400px', '50%', '60%', '70%', '80%', '90%', '100%'],
      layoutTreeProps: {
        label(data, node) {
          const config = data.__config__
          return data.componentName || `${config.label}: ${data.__vModel__}`
        }
      }
    }
  },
  computed: {
    activeTag() {
      return this.activeData.__config__.tag
    },
    formItemList() {
      return this.$store.state.generator.formItemList
    },
    subTable() {
      return this.$store.state.generator.subTable || []
    },
    allTable() {
      return this.$store.state.generator.allTable || []
    },
    mainTable() {
      let allTable = this.$store.state.generator.allTable
      let item = allTable.filter(o => o.typeId == '1')[0]
      if (!item || !item.table) return ''
      return item.table
    },
    isCommon() {
      return commonRightList.indexOf(this.activeData.__config__.jnpfKey) > -1
    },
    isSystem() {
      return systemList.indexOf(this.activeData.__config__.jnpfKey) > -1
    },
  },
  watch: {
    formConf: {
      handler(val) {
        // saveFormConf(val)
        if (val.formStyle === 'word-form' && val.labelPosition === 'top') {
          val.labelPosition = 'left'
        }
      },
      deep: true
    },
    activeData(val) {
      if (val.__config__.jnpfKey === 'relationFormAttr') {
        this.$nextTick(() => {
          this.$refs.relationFormAttr && this.$refs.relationFormAttr.getOptions()
        })
      }
      if (val.__config__.jnpfKey === 'relationFlowAttr') {
        this.$nextTick(() => {
          this.$refs.relationFlowAttr && this.$refs.relationFlowAttr.getOptions()
        })
      }
      if (val.__config__.jnpfKey !== 'calculate') {
        this.$nextTick(() => {
          this.$refs.calculate && this.$refs.calculate.reloadExpressionTemp()
        })
      }
      if (!val.__config__.tableName && val.__config__.jnpfKey !== 'table') {
        val.__config__.tableName = this.mainTable
      }
      this.setDefaultOptions()
    }
  },
  created() {
    this.getDictionaryType()
    this.getDataInterfaceSelector()
    this.getPringTplList()
    if (!this.activeData || !this.activeData.__config__) return
    if (!this.activeData.__config__.tableName && this.activeData.__config__.jnpfKey !== 'table') {
      this.activeData.__config__.tableName = this.mainTable
    }
    this.setDefaultOptions()
  },
  methods: {
    addReg() {
      this.activeData.__config__.regList.push({
        pattern: '',
        message: ''
      })
    },
    setDefaultValue(val) {
      if (Array.isArray(val)) {
        return val.join(',')
      }
      // if (['string', 'number'].indexOf(typeof val) > -1) {
      //   return val
      // }
      if (typeof val === 'boolean') {
        return `${val}`
      }
      return val
    },
    onDefaultValueInput(str) {
      if (Array.isArray(this.activeData.__config__.defaultValue)) {
        // 数组
        this.$set(
          this.activeData.__config__,
          'defaultValue',
          str.split(',').map(val => (isNumberStr(val) ? +val : val))
        )
      } else if (['true', 'false'].indexOf(str) > -1) {
        // 布尔
        this.$set(this.activeData.__config__, 'defaultValue', JSON.parse(str))
      } else {
        // 字符串和数字
        this.$set(
          this.activeData.__config__,
          'defaultValue',
          isNumberStr(str) ? +str : str
        )
      }
    },
    getSubTalebFiled(key) {
      let item = {}
      let list = this.subTable.filter(o => o.table === key)
      if (list.length) {
        item = list[0]
      }
      let arr = []
      if (item && item.fields) arr = item.fields.filter(o => o.primaryKey != 1)
      return arr
    },
    fieldChange1(val) {
      if (!val) return
      const drawingList = getDrawingList() || []
      let boo = false
      const loop = list => {
        for (let i = 0; i < list.length; i++) {
          const e = list[i]
          const config = e.__config__
          if (config.jnpfKey === 'table' && config.tableName === this.activeData.__config__.relationTable) {
            for (let j = 0; j < config.children.length; j++) {
              const child = config.children[j]
              if (child.__vModel__ === val) {
                boo = true
                break
              }
            }
          }
          if (config && config.jnpfKey != 'table' && config.children && Array.isArray(config.children)) {
            loop(config.children)
          }
        }
      }
      loop(drawingList)
      if (boo) {
        this.$message.warning(`子表字段【${val}】已存在,请重新选择!`)
        this.activeData.__vModel__ = ''
        return
      }
      let options = this.getSubTalebFiled(this.activeData.__config__.relationTable)
      let item = options.filter(o => o.field == val)[0]
      if (!item || !item.fieldName) return
      this.activeData.__config__.label = item.fieldName
    },
    fieldChange(val) {
      if (!val) return
      const drawingList = getDrawingList() || []
      let boo = false
      const loop = list => {
        for (let i = 0; i < list.length; i++) {
          const e = list[i]
          const config = e.__config__
          if (e.__vModel__ === val) {
            boo = true
            break
          }
          if (config && config.jnpfKey != 'table' && config.children && Array.isArray(config.children)) {
            loop(config.children)
          }
        }
      }
      loop(drawingList)
      if (boo) {
        this.$message.warning(`字段【${val}】已存在,请重新选择!`)
        this.activeData.__vModel__ = ''
        return
      }
      let item = this.fieldOptions.filter(o => o.realField == val)[0]
      if (!item || !item.fieldName) return
      this.activeData.__config__.label = item.fieldName
    },
    tableChange() {
      this.activeData.__vModel__ = ''
      this.setDefaultOptions()
    },
    setDefaultOptions() {
      if (!this.$store.getters.hasTable) return
      if (this.activeData.__vModel__ === undefined || this.activeData.__config__.jnpfKey === 'table') return
      if (!this.activeData.__config__.tableName || this.activeData.__config__.tableName === this.mainTable) {
        let fieldOptions = this.formItemList.map(o => ({ ...o, realField: o.field }))
        this.fieldOptions = fieldOptions.filter(o => o.primaryKey != 1)
      } else {
        let list = this.allTable.filter(o => o.table === this.activeData.__config__.tableName)
        if (!list.length) {
          this.activeData.__config__.tableName = this.mainTable
          let fieldOptions = this.formItemList.map(o => ({ ...o, realField: o.field }))
          this.fieldOptions = fieldOptions.filter(o => o.primaryKey != 1)
          this.activeData.__vModel__ = ''
        } else {
          let item = list[0]
          let options = item.fields.map(o => ({
            ...o,
            realField: 'jnpf_' + this.activeData.__config__.tableName + '_jnpf_' + o.field,
          }))
          this.fieldOptions = options.filter(o => o.primaryKey != 1)
        }
      }
    },
    spanChange(val) {
      this.formConf.span = val
    },
    onTableNameChange(tableName) {
      if (!tableName) return
      const drawingList = getDrawingList() || []
      let boo = false
      const loop = list => {
        for (let i = 0; i < list.length; i++) {
          const e = list[i]
          const config = e.__config__
          if (config.jnpfKey === 'table' && config.tableName === tableName) {
            boo = true
            break
          }
          if (config && config.jnpfKey != 'table' && config.children && Array.isArray(config.children)) {
            loop(config.children)
          }
        }
      }
      loop(drawingList)
      if (boo) {
        this.$message.warning(`子表【${tableName}】已存在,请重新选择!`)
        this.activeData.__config__.tableName = ''
        return
      }
      for (let i = 0; i < this.activeData.__config__.children.length; i++) {
        this.$set(this.activeData.__config__.children[i].__config__, 'relationTable', tableName)
        this.$set(this.activeData.__config__.children[i], '__vModel__', '')
      }
    },
    getDictionaryType() {
      getDictionaryTypeSelector().then(res => {
        this.dictionaryOptions = res.data.list
      })
    },
    getDataInterfaceSelector() {
      getDataInterfaceSelector().then(res => {
        this.dataInterfaceOptions = res.data
      })
    },
    getPringTplList() {
      this.$store.dispatch('base/getPrintFormTree').then(res => {
        let list = res.filter(o => o.children && o.children.length)
        this.printTplList = list.map(o => ({
          ...o,
          hasChildren: true
        }))
      })
    },
    getTipText(key) {
      let text = ''
      switch (key) {
        case 'change':
          text = '发生变化时触发'
          break;
        case 'blur':
          text = '失去焦点时触发'
          break;
        case 'tab-click':
          text = '面板点击时触发'
          break;
        default:
          text = ''
          break;
      }
      return text
    },
    updateScript(data) {
      if (this.isConf) {
        this.formConf.funcs[this.activeFunc] = data
      } else {
        this.activeData.on[this.activeFunc] = data
      }
    },
    editFunc(str, funcName, isConf) {
      this.activeScript = str
      this.activeFunc = funcName
      this.isConf = isConf || false
      this.formScriptVisible = true
    },
  }
}
</script>

<style lang="scss" scoped>
.right-board {
  width: 340px;
  position: absolute;
  right: 0;
  top: 0;
  padding-top: 3px;
  height: 100%;
  background: #fff;
  border-radius: 4px;
  .field-box {
    position: relative;
    height: calc(100% - 42px);
    box-sizing: border-box;
    overflow: hidden;
  }
  .el-scrollbar {
    height: 100%;
  }
}

.select-item {
  display: flex;
  border: 1px dashed #fff;
  box-sizing: border-box;
  & .close-btn {
    cursor: pointer;
    color: #f56c6c;
  }
  & .el-input + .el-input {
    margin-left: 4px;
  }
}
.select-item + .select-item {
  margin-top: 4px;
}
.select-item.sortable-chosen {
  border: 1px dashed #409eff;
}
.select-line-icon {
  line-height: 32px;
  font-size: 22px;
  padding: 0 4px;
  color: #777;
}
.option-drag {
  cursor: move;
}
.time-range {
  .el-date-editor {
    width: 227px;
  }
  ::v-deep .el-icon-time {
    display: none;
  }
}
.document-link {
  position: absolute;
  display: block;
  width: 26px;
  height: 26px;
  top: 0;
  left: 0;
  cursor: pointer;
  background: #409eff;
  z-index: 1;
  border-radius: 0 0 6px 0;
  text-align: center;
  line-height: 26px;
  color: #fff;
  font-size: 18px;
}
.node-label {
  font-size: 14px;
}
.node-icon {
  color: #bebfc3;
}
.right-scrollbar {
  .el-form {
    >>> .el-date-editor,
    >>> .el-cascader,
    >>> .el-select {
      width: 100%;
    }
  }
}
.per-cell {
  display: flex;
  align-items: center;
  margin-bottom: 18px;
  .el-checkbox {
    width: 146px;
  }
  &.last {
    margin-bottom: 0;
  }
}
</style>