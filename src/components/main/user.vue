<template>
    <div>
        <avue-crud :data="data" :option="option">
            <template 
                slot-scope="scope" 
                slot="menuLeft"
            >
                <!-- 按钮循环 -->
                <el-button 
                    class="cjbuttin"
                    v-for="(item, index) in nowButtons"
                    :key="index"
                    size="small"
                    :type="item.color"
                    @click="clickfunction(item.functionname)"
                    v-if="item.buttonname != '搜索'"
                >
                    <i :class="item.icon"></i>
                    {{item.buttonname}}
                </el-button>

                <!-- 弹出框 -->
                <el-dialog title="新增" :visible.sync="dialogFormVisible">
                    <el-form>
                        <el-form-item label="姓名" :label-width="formLabelWidth">
                            <el-input v-model="form.truename"></el-input>
                        </el-form-item>
                        <el-form-item label="电话" :label-width="formLabelWidth">
                            <el-input v-model="form.phone"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" :label-width="formLabelWidth">
                            <el-input v-model="form.password"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="cancel()">取 消</el-button>
                        <el-button type="primary" @click="submitUserInfo()">确 定</el-button>
                    </div>
                </el-dialog>
            </template>
        </avue-crud>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import config from '../config.js'

export default {
    data() {
        return {
            params: {},
            data:[],
            dialogFormVisible: false,
            formLabelWidth: '70px', // 弹出层宽度
            form: {
                // 弹出层表单
                truename: '',
                phone: '',
                password: '',
            },
            option: {
                page: false,
                align:'center',
                menuAlign:'center',
                selection: true,
                addBtn: false,
                delBtn: false,
                menu: false,
                column:[
                    {
                        label: '登陆名',
                        prop: 'loginname',
                        search: true
                    },
                    {
                        label: '姓名',
                        prop: 'truename',
                        search: true
                    },
                    {
                        label: '创建时间',
                        prop: 'createtime'
                    },
                    {
                        label: '部门ID',
                        prop: 'departmentid'
                    },
                    {
                        label: '修改时间',
                        prop: 'modifytime'
                    },
                    {
                        label: '用户类型',
                        prop: 'usertype'
                    }
                ]
            }
        }    
    },
    created() {
        this.$axios({
            method: 'get',
            url: config.serverurl+'/user/search',
            headers: {
                authorization: sessionStorage.getItem('token')
            },
            params: {
                params: this.params
            }
        }).then((res) => {
            console.log(res)
            this.data = res.data.records
        }).catch((err) => {
            console.log(err)
        })
    },
    computed: {
        ...mapState(['nowButtons'])
    },
    methods: {
        clickfunction(func){
            this[func]()
        },
        addInfo() {
            // 点击添加后显示弹出框
            this.dialogFormVisible = true
        },
        editInfo() {
            console.log('editInfo方法执行')
        },
        del() {
            console.log('del方法执行')
        },
        showInfo() {
            console.log('showInfo方法执行')
        },
        // 提交添加信息
        submitUserInfo() {
            this.$axios({
                method: 'post',
                url: config.serverurl+'/user/addInfo',
                headers: {
                    authorization: sessionStorage.getItem('token')
                },
                query: {
                    truename: this.form.truename,
                    phone: this.form.phone,
                    password: this.form.password
                }
            }).then((res) => {
                let msg = res.data.msg
                if(msg === '添加成功'){
                    this.$message({
                        // 成功后的提示信息
                        message: '添加成功',
                        type: 'success'
                    })
                    this.form.truename = ''
                    this.form.phone = ''
                    this.form.password = ''
                    this.dialogFormVisible = false
                } else {
                    this.$message({
                        message: '添加失败'
                    })
                }
            }).catch((err) => {
                console.log('请求失败')
            })
        },
        // 取消添加
        cancel() {
            this.dialogFormVisible = false
            this.$message({
                message: '取消添加',
            })
        }
    }
}
</script>

<style scoped>
.cjbuttin{
    margin: 0 .5rem;
}
</style>
