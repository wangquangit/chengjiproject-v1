<template>
    <div>
        <el-row type="flex" class="row-bg" justify="space-between">
            <!-- 上部按钮 -->
            <el-col :span="24">
                <div class="grid-content bg-purple">
                    <cj-table-tree-button
                        :info="info"
                        @addSubmit="addSubmit"
                    ></cj-table-tree-button>
                </div>
            </el-col>
        </el-row>

        <avue-tree-table 
            :option="option"
        >
            <el-table-column label="操作" width="220px">
                <template slot-scope="scope">
                    <!-- 右侧按钮 -->
                    <cj-handle-button 
                        :message="scope.row"
                        :info="info"
                        @addSubmit="addSubmit"
                        @delInfo="delInfo"
                        @editInfo="editInfo"
                        @editSubmit="editSubmit"
                    ></cj-handle-button>
                </template>
            </el-table-column>
        </avue-tree-table>
    </div>
</template>

<script>
import config from '../config.js'
import cjTableTreeButton from '../shareComponents/cjtabletablebutton.vue'
import cjHandleButton from '../shareComponents/cjhandlebutton.vue'
import request from '../user_authority.js'
export default {
    data () {
        return {
            option: {
                // 基本配置和信息
                expandAll: true,
                columns: [
                    {
                        text: '部门',
                        value: 'department_name',
                        width: 300
                    },
                    {
                        text: '部门编号',
                        value: 'department_code'
                    },
                    {
                        text: '区域',
                        value: 'area_name_text',
                    },
                    {
                        text: '最后更新时间',
                        value: 'updated_time',
                        width: 155
                    },
                ],
                data: [],
                areaObj: {},
            },
            info: {
                // 传给子组件的表单
                forms: [
                    {label:'选择区域', prop: 'area_id',value: '', name: ''},
                    {label:'部门名称', prop: 'department_name',value: '', name: ''},
                    {label:'部门编号', prop: 'department_code',value: '', name: ''},
                ],
                getAreaCommon: [] // 区域详情
            },
        }
    },
    methods: {
        getInfo() {
            // 请求部门表单接口
            this.loading = true
            request.postRquest(
                [
                    '/sysdepartment/getDepartment',
                    'post',
                    {},
                    (res) => {
                        this.option.data = res.data
                        this.getRegional()
                    },
                ]
            )
        },
        getRegional() {
            // 请求公共接口
            request.postRquest(
                [
                    '/common/getAreaCommon',
                    'post',
                    {},
                    (res) => {
                        this.info.getAreaCommon = res.data
                    }
                ]
            )
        },
        addSubmit(forms, message) {
            var params
            if(message) {
                params = {
                    area_id: forms[0].value, // 区域ID
                    created_by: 'admin', // 创建人
                    department_code: forms[2].name, // 部门编号
                    area_name_text: forms[0].name,
                    department_leavel: message.department_leavel, // 部门等级
                    department_name: forms[1].name, // 部门名称
                    parent_id: message.id, // 父级id
                    updated_by: 'admin', // 修改人
                }
            } else {
                params = {
                    area_id: forms[0].value, // 区域ID
                    created_by: 'admin', // 创建人
                    department_code: forms[2].name, // 部门编号
                    area_name_text: forms[0].name,
                    department_name: forms[1].name, // 部门名称
                    updated_by: 'admin', // 修改人
                }
            }
            request.postRquest(
                [
                    '/sysdepartment/addInfo',
                    'post',
                    params,
                    (res) => {
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        })
                        this.getInfo()
                    },
                    false
                ]
            )
        },
        editInfo(message) {
            this.info.forms[0].value = message.parent_id
            this.info.forms[0].name = message.area_name_text
            this.info.forms[1].name = message.department_name
            this.info.forms[2].name = message.department_code
        },
        editSubmit(info, message) {
            // 修改
            if(info.forms[0]){}
            request.postRquest(
                [
                    '/sysdepartment/editInfo',
                    'put',
                    {
                        id: message.id,
                        area_id: info.forms[0].value,
                        department_name: info.forms[1].name,
                        department_code: info.forms[2].name
                    },
                    (res) => {
                        this.getInfo()
                    },
                    false
                ]
            )
        },
        delInfo(message) {
            request.postRquest(
                [
                    '/sysdepartment/del/'+message.id,
                    'delete',
                    {},
                    (res) => {
                        if(res.data.code == 11){
                            this.getInfo()
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            })
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: 'info'
                            })
                        }
                    }
                ]
            )
        }
    },
    created() {
        this.getInfo()
    },
    components: {
        cjTableTreeButton,
        cjHandleButton
    },
}
</script>

<style scoped>
.grid-content {
    border-radius: 4px;
    min-height: 36px;
    float: left;
}
</style>
