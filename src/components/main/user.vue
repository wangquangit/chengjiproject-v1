<template>
    <div>
        <avue-crud 
            @current-change="currentChange" 
            @size-change="sizeChange"
            @refresh-change="refresh" 
            :data="data" 
            :table-loading="loading" 
            :option="option" 
            :page="page"
        >
            <template 
                slot-scope="scope" 
                slot="menuLeft"
            >
                <!-- 按钮循环 -->
                <!-- <el-button 
                    class="cjbuttin"
                    v-for="(item, index) in nowButtons"
                    :key="index"
                    size="small"
                    :type="item.color"
                    @click="clickfunction(item.functionname)"
                >
                    <i :class="item.icon"></i>
                    {{item.buttonname}}
                </el-button> -->

                <!-- 自定义按钮组件 -->
                <cj-menu-button @transmitform="transmitform"></cj-menu-button>

                <!-- 弹出框 -->
                <!-- <el-dialog title="新增" :visible.sync="dialogFormVisible">
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
                        <el-form-item label="登陆名" :label-width="formLabelWidth">
                            <el-input v-model="form.loginname"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="cancel">取 消</el-button>
                        <el-button type="primary" @click="submitUserInfo">确 定</el-button>
                    </div>
                </el-dialog> -->
            </template>
        </avue-crud>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import config from '../config.js'
import cjMenuButton from '../shareComponents/cjmenubutton.vue'
export default {
    data() {
        return {
            page: {/* 分页 */pageSizes: [10, 20, 30, 40, 50],total: 0,currentPage: 1},
            data:[],
            dialogFormVisible: false,
            formLabelWidth: '70px', // 弹出层宽度
            loading: true, // 加载
            form: {/* 新增弹出层表单 */truename: '',phone: '',password: '',loginname: ''},
            option: {
                align:'center',
                menuAlign:'center',
                selection: true,
                addBtn: false,
                delBtn: false,
                menu: false,
                column:[
                    {label: '登陆名',prop: 'loginname'},
                    {label: '姓名',prop: 'truename'},
                    {label: '创建时间',prop: 'createtime'},
                    {label: '部门ID',prop: 'departmentid'},
                    {label: '修改时间',prop: 'modifytime'},
                    {label: '用户类型',prop: 'usertype'}
                ]
            }
        }    
    },
    created() {
        this.getuserinfo()
    },
    computed: {
        ...mapState(['nowButtons'])
    },
    components: {
        cjMenuButton
    },
    methods: {
        getuserinfo() {
            this.loading = true
            this.$axios({
                method: 'get',
                url: config.serverurl+'/user/search',
                params: {
                    params: {page: this.page.currentPage,limit: this.page.pageSize}
                }
            }).then((res) => {
                // 请求成功后
                this.loading = false // 取消加载状态
                this.data = res.data.records // 赋值数据
                this.page.total = res.data.total // 赋值总数据大小
                this.page.pageSize = res.data.size // 赋值当前页面大小 // 有问题
                this.page.currentPage = res.data.current // 赋值当前页码
            }).catch((err) => {
                console.log(err)
            })
        },
        currentChange() {
            // 点击页码更新
            this.getuserinfo()
        },
        sizeChange(value) {
            this.page.pageSize = value
            this.getuserinfo()
        },
        refresh() {
            // 刷新按钮
            this.getuserinfo()
        },
        clickfunction(func){
            // 按钮栏点击事件调用对应函数
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
        transmitform(value) {
            // 接收子组件传递的值
            console.log('子组件传递过来的值为:',value)
        },
        // 提交添加信息
        // submitUserInfo() {
        //     this.$axios({
        //         method: 'post',
        //         url: config.serverurl+'/user/addInfo',
        //         query: {truename: this.form.truename,phone: this.form.phone,password: this.form.password,loginname: this.form.loginname}
        //     }).then((res) => {
        //         let msg = res.data.msg
        //         if(msg === '添加成功'){
        //             this.$message({
        //                 // 成功后的提示信息
        //                 message: '添加成功',
        //                 type: 'success'
        //             });
        //             this.form.truename = ''
        //             this.form.phone = ''
        //             this.form.password = ''
        //             this.dialogFormVisible = false // 添加成功后的提示消息关闭
        //         } else {
        //             this.$message({
        //                 message: '添加失败'
        //             })
        //         }
        //     }).catch((err) => {
        //         console.log('请求失败')
        //     })
        // },
        // // 取消添加
        // cancel() {
        //     this.dialogFormVisible = false
        //     this.$message({
        //         message: '取消添加',
        //     })
        // }
    }
}
</script>

<style scoped>
.cjbuttin{
    margin: 0 .5rem;
}
</style>
