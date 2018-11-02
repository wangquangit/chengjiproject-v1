<template>
    <div>
        <el-row>
            <el-col :span="24">
                <div class="grid-content bg-purple-dark">
                    <el-button 
                        size="small" 
                        v-for="(item, index) in nowButtons" 
                        :key="index"
                        :icon="item.icon"
                        :type="item.color"
                        @click="handleform(item.functionname)"
                    >
                        {{item.buttonname}}
                    </el-button>

                    <el-dialog title="新增" :visible.sync="dialogFormVisible">
                        <!-- 新增弹出层表单 -->
                        <el-form>
                            <el-form-item 
                                :label-width="formLabelWidth"
                                v-for="(formitem, formindex) in addInfoForms" 
                                :label="formitem.label"
                                :key="String(formindex)"
                            >
                                <el-input v-model="formitem.value"></el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="cancel">取 消</el-button>
                            <el-button type="primary" @click="submitUserInfo(addInfoForms)">确 定</el-button>
                        </div>
                    </el-dialog>

                    <el-dialog 
                        title="修改" 
                        :visible.sync="selectionArrVisible"
                    >
                        <!-- 修改弹出层表单 -->
                        <el-form>
                            <!-- <el-form-item
                                :label-width="formLabelWidth"
                                label="用户名"
                            >
                                <el-input v-model="userInfo.truename"></el-input>
                            </el-form-item> -->
                            <el-form-item
                                :label-width="formLabelWidth"
                                label="手机号"
                            >
                                <el-input v-model="userInfo.phone"></el-input>
                            </el-form-item>
                            <el-form-item
                                :label-width="formLabelWidth"
                                label="登陆密码"
                            >
                                <el-input v-model="userInfo.password"></el-input>
                            </el-form-item>
                            <el-form-item
                                :label-width="formLabelWidth"
                                label="登陆名"
                            >
                                <el-input v-model="userInfo.loginname"></el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="cancel">取 消</el-button>
                            <el-button type="primary" @click="changeUserInfo">确定</el-button>
                        </div>
                        <!-- {{userInfo}} -->
                    </el-dialog>

                    <el-dialog title="查询" :visible.sync="searchVisible">
                        <el-form>
                            <el-form-item :label-width="formLabelWidth" label="关键字">
                                <el-input v-model="searchForm.where[0].value"></el-input>
                            </el-form-item>
                        </el-form>
                        <el-form>
                            <el-form-item :label-width="formLabelWidth" label="手机号">
                                <el-input v-model="searchForm.where[1].value"></el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="cancel">取消</el-button>
                            <el-button type="primary" @click="getsearch">确定</el-button>
                        </div>
                    </el-dialog>

                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import config from '../config.js'
export default {
    data() {
        return {
            formLabelWidth: '120px',
            dialogFormVisible: false,
            selectionArrVisible: false,
            getArrVisible: false,
            searchVisible: false,
            form: {},
            addForms: [],
            userInfo: {},
            searchForm: {
                where: [
                    {
                        name: 'truename|loginname',
                        op: 'like',
                        value: ''
                    },
                    {
                        name: 'phone',
                        op: 'eq',
                        value: ''
                    }
                ]
            },
        }
    },
    computed: {
        ...mapState(['nowButtons','selectionArr'])
    },
    methods: {
        handleform(value) {
            // 点击按钮执行对应的方法
            this[value]()
        },
        cancel() {
            // 点击取消后的提示
            this.dialogFormVisible = false
            this.selectionArrVisible = false
            this.searchVisible = false
            this.$message({
                message: '取消',
            })
        },
        addInfo() {
            // 添加功能
            this.dialogFormVisible = true
        },
        editInfo() {
            // 修改时只能选择一个
            this.$store.state.selectionArr.length == 1 ? 
                this.selectionArrVisible = true :
                this.$message({message:'请选择一个'})
            if(this.selectionArrVisible){
                this.$axios({
                    method: 'get',
                    url: config.serverurl+'/user/getInfo/'+this.$store.state.selectionArr[0].id
                }).then((res) => {
                    console.log(res.data.data)
                    this.userInfo = res.data.data
                    console.log('修改前的用户信息:',this.userInfo)
                }).catch((err) => {
                    console.log(err)
                })
            }

        },
        changeUserInfo() {
            // 提交修改信息
            console.log('修改后的用户信息:',this.userInfo)
            this.$axios({
                method: 'put',
                url: config.serverurl+'/user/editInfo',
                params: {
                    id: this.userInfo.id,
                    // truename: this.userInfo.truename,
                    loginname: this.userInfo.loginname,
                    password: this.userInfo.password,
                    phone: this.userInfo.phone
                }
                // params: this.userInfo
            }
            ).then((res) => {
                console.log(res)
            }).catch((err) => {
                console.log(err)
            })
            this.selectionArrVisible = false
            this.$emit('deleteOk')
        },
        del() {
            // 删除功能
            this.$store.state.selectionArr.length >= 1 ? this.deleteArrVisible = true : this.deleteArrVisible = false
            if(this.deleteArrVisible){
                this.$confirm('此操作将永久删除选中信息, 是否继续', '提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // 将数组拼接成字符串
                    var deleteArr = this.$store.state.selectionArr
                    var arr = []
                    for(let i of deleteArr){
                        arr.push(i.id)
                    }
                    var newarr = arr.join(',')
                    // 发起请求删除数据
                    this.$axios({
                        url: config.serverurl+'/user/del/'+newarr,
                        method: 'delete',
                    }).then((res) => {
                        this.$emit('deleteOk')
                    }).catch((err) => {
                        console.log(err)
                    })
    
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    })
                }).catch(() => {
                    this.$message({
                        message: '已取消删除',
                        type: 'info'
                    })
                })
            }
        },
        search() {
            console.log('查询方法被执行')
            this.searchVisible = true
        },
        getsearch() {
            // 查询提交
            console.log('执行查询方法')
            this.$axios({
                method: 'post',
                url: config.serverurl+'/user/search',
                data: {
                        // page: 1,
                        limit: 20,
                        where: this.searchForm.where,
                }
            }).then((res) => {
                this.searchVisible = false
                this.$emit('searchOk',res)
            }).catch((err) => {
                console.log(err)
            })
        },
        showInfo() {
            this.getArrVisible = true
            console.log('查看方法被执行')
        },
        submitUserInfo(forms) {
            // 提交添加请求
            this.form = forms
            // console.log('添加form:',this.form.truename.value)
            this.$axios({
                method: 'post',
                url: config.serverurl+'/user/addInfo',
                params: {
                    // truename: this.form.truename.value,
                    phone: this.form.phone.value,
                    password: this.form.password.value,
                    loginname: this.form.loginname.value,
                }
            }).then((res) => {
                this.$emit('deleteOk')
                this.$message({
                    message: '添加成功',
                    type: 'success'
                })
            }).catch((err) => {
                console.log(err)
                this.$message({
                    message: '添加失败'
                })
            })
            this.dialogFormVisible = false
        },
    },
    props: (['addInfoForms']),
}
</script>

<style scoped>
</style>
