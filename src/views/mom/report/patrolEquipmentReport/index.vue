<template>
    <div class="JNPF-common-layout">

        <div class="JNPF-common-layout-center">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                            <el-col :span="6">
                                <el-form-item label="检验计划编码">
                                        <el-input v-model="query.patrolPlanCode" placeholder="请输入" clearable>  </el-input>
                                </el-form-item>
                            </el-col>
                            <template v-if="showAll">
                            </template>
                    <el-col :span="6">
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                            <el-button icon="el-icon-refresh-right" @click="reset()">重置</el-button>
                                <el-button type="text" icon="el-icon-arrow-down" @click="showAll=true" v-if="!showAll">
                                    展开
                                </el-button>
                                <el-button type="text" icon="el-icon-arrow-up" @click="showAll=false" v-else>
                                    收起
                                </el-button>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-col :span="12">
                    <div class="border-box" style="height:39.5vh;">
                        <h4>设备不合格占比</h4>
                        <div class="box-chart" style="height:94%">
                            <LeftChar  :chartData="equipmentFaultNumberData" :style="{'height':'100%'}"></LeftChar>
                        </div>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="border-box" style="height:39.5vh;">
                        <h4>设备故障率</h4>
                        <div class="box-chart" style="height:94%">
                            <RightChar :chartData="equipmentFaultRateData" :style="{'height':'100%'}"></RightChar>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import request from '@/utils/request'
    import RightChar from './rightChar.vue'
    import LeftChar from './leftChar.vue'

    export default {
        components: {RightChar,LeftChar},
        data() {
            return {
                showAll: false,
                query: {
                    patrolPlanCode:undefined,
                },
                equipmentFaultRateData:{},
                equipmentFaultNumberData:{},
            }
        },
        computed: {
           
        },
        mounted(){
            this.initData();
        },
        created() {
             
        },
        methods: {
            initData(){
                //设备不合格占比数据获取
                this.equipmentFaultNumber();
                // 设备故障率数据获取
                this.equipmentFaultRate();
            },
            equipmentFaultRate(){
                let _query = this.query;
                request({
                    url: `/api/project/XjrPatrolplanBase/getPatrolEquipmentFaultRate`,
                    method: 'post',
                    data: _query
                }).then(res => {
                    this.equipmentFaultRateData=res;
                });
            }, equipmentFaultNumber(){
                let _query =this.query;
                request({
                    url: `/api/project/XjrPatrolplanBase/getPatrolEquipmentFaultNumber`,
                    method: 'post',
                    data: _query
                }).then(res => {
                    this.equipmentFaultNumberData=res;
                });
            }
        }
    }
</script>
