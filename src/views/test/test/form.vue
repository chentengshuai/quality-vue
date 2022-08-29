<template>
	<div>
		<el-row :gutter="15">
		<el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="right"  :disabled="setting.readonly" >
		<template v-if="!loading">
			<el-col :span="24"   v-if="judgeShow('namee')" >
				<el-form-item  label="名字"   prop="namee" >
					<el-input :disabled="judgeWrite('namee')"   v-model="dataForm.namee" placeholder="请输入"  clearable  :style='{"width":"100%"}'>
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="24"   v-if="judgeShow('description')" >
				<el-form-item  label="描述"   prop="description" >
					<el-input :disabled="judgeWrite('description')"   v-model="dataForm.description" placeholder="请输入"  clearable  :style='{"width":"100%"}'>
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="24"   v-if="judgeShow('datee')" >
				<el-form-item  label="录入日期"   prop="datee" >
					<el-date-picker :disabled="judgeWrite('datee')"   v-model="dataForm.datee" placeholder="请选择"  clearable  :style='{"width":"100%"}' type="datetime"  format="yyyy-MM-dd HH:mm:ss"  value-format="timestamp" >
					</el-date-picker>
				</el-form-item>
			</el-col>
			</template>
		</el-form>
		</el-row>
		<UserBox v-if="userBoxVisible" ref="userBox" @submit="submit" />
	</div>
</template>
<script>
	import request from '@/utils/request'
	import { previewDataInterface } from '@/api/systemData/dataInterface'
	import { getDictionaryDataSelector } from '@/api/systemData/dictionary'
	export default {
		components: {},
		props: [],
		data() {
			return {
				visible: false,
				loading: false,
				setting:{},
				eventType: '',
				userBoxVisible:false,
				dataForm: {
					id:'',
					flowId: '',
					status: 1,
					freeapproveruserid: '',
					namee : '',
					description : '',
					datee : '',
            },
            rules:
            {
            },

			}
		},
		computed: {},
        watch: {},
		created() {
        },
		mounted() {},
		methods: {
			judgeShow(id) {
				if (!this.setting.formOperates || !this.setting.formOperates.length) return true
				let arr = this.setting.formOperates.filter(o => o.id === id) || []
				if (!arr.length) return true
				let item = arr[0]
				return item.read
			},
			judgeWrite(id) {
				if (!this.setting.formOperates || !this.setting.formOperates.length) return false
				let arr = this.setting.formOperates.filter(o => o.id === id) || []
				if (!arr.length) return true
				let item = arr[0]
				return !item.write
			},
                goBack() {
                    this.$emit('refresh')
                },
            init(data) {
                this.dataForm.id = data.id || "";
				this.setting = data;
                this.visible = true;
                this.$nextTick(() => {
                    this.$refs['elForm'].resetFields();
                    if(this.dataForm.id){
                        this.loading = true
                        request({
                            url: '/api/example/Test_test/'+this.dataForm.id,
                            method: 'get'
                        }).then(res => {
                            this.dataInfo(res.data)
                            this.loading = false
                        })
                    }
					this.$emit('setPageLoad')

                })
            },
            // 表单提交
            dataFormSubmit(eventType) {
                this.$refs['elForm'].validate((valid) => {
					if (valid) {
						if (eventType === 'audit' || eventType === 'reject') {
							this.$emit('eventReciver', this.dataForm, eventType)
							return
						}
						this.dataForm.status = eventType === 'submit' ? 0 : 1
						this.eventType = eventType
						if (this.eventType === 'submit') {
							this.$confirm('您确定要提交当前流程吗, 是否继续?', '提示', {
								type: 'warning'
							}).then(() => {
								this.request()
							}).catch(() => { });
						} else {
							this.request()
						}
					}
                })
            },
            request() {
                var _data =this.dataList()
                if (!this.dataForm.id) {
                    request({
                        url: '/api/example/Test_test',
                        method: 'post',
                        data: _data
                    }).then((res) => {
                        this.$message({
                            message: res.msg,
                            type: 'success',
                            duration: 1000,
                            onClose: () => {
                                this.visible = false
								this.$emit('close', true)
                            }
                        })
                    })
                }else{
                    request({
                        url: '/api/example/Test_test/'+this.dataForm.id,
                        method: 'PUT',
                        data: _data
                    }).then((res) => {
                        this.$message({
                            message: res.msg,
                            type: 'success',
                            duration: 1000,
                            onClose: () => {
                                this.visible = false
								this.$emit('close', true)
                            }
                        })
                    })
                }
            },
            dataList(){
                var _data = JSON.parse(JSON.stringify(this.dataForm));
                return _data;
            },
            dataInfo(dataAll){
                let _dataAll =dataAll
                this.dataForm = _dataAll
            },
        },
    }

</script>
