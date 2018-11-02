<template>
    <div>
        <avue-crud 
            @current-change="currentChange" 
            @size-change="sizeChange"
            @refresh-change="refresh"
            @selection-change="selectionChange"
            :data="data" 
            :table-loading="loading" 
            :option="option" 
            :page="page"
        >
            <template slot-scope="scope" slot="menuLeft">
                <cj-menu-button 
                    :addInfoForms="addInfoForms"
                    @deleteOk="deleteOk"
                    @searchOk="searchOk"
                ></cj-menu-button>
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
            addInfoForms: {
                // 按钮事件表单
                // truename: {label: '登陆名', prop: 'truename',value: ''},
                phone: {label: '手机号',prop: 'phone',value: ''},
                password: {label: '登陆密码',prop: 'password',value: ''},
                loginname: {label: '用户名',prop: 'loginname',value: ''},
            },
            option: {
                align:'center',
                menuAlign:'center',
                selection: true,
                addBtn: false,
                delBtn: false,
                menu: false,
                column:[
                    {label: '用户名',prop: 'loginname'},
                    {label: '创建时间',prop: 'createtime'},
                    {label: '最后修改时间',prop: 'modifytime'},
                    {label: '手机号',prop: 'phone'},
                ]
            }
        }    
    },
    created() {
        // 组件加载自动获取数据
        this.getuserinfo()
    },
    computed: {
        ...mapState(['nowButtons'])
    },
    components: {
        // 子组件
        cjMenuButton, // 表单头部按钮组件
    },
    methods: {
        getuserinfo() {
            // 请求数据
            this.loading = true
            this.$axios({
                method: 'post',
                url: config.serverurl+'/user/search',
                data: {
                    page: this.page.currentPage,
                    limit: this.page.pageSize,
                }
            }).then((res) => {
                console.log('user响应:',res)
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
        selectionChange(val) {
            // 多选
            this.$store.state.selectionArr = val
        },
        currentChange() {
            // 点击页码更新
            this.getuserinfo()
        },
        sizeChange(value) {
            // 页码相关
            this.page.pageSize = value
            this.getuserinfo()
        },
        refresh() {
            // 刷新按钮
            this.getuserinfo()
        },
        deleteOk() {
            this.getuserinfo()
        },
        searchOk(res) {
            console.log(res.data)
            this.data = res.data.records // 赋值数据
            this.page.total = res.data.total // 赋值总数据大小
            this.page.pageSize = res.data.size // 赋值当前页面大小 // 有问题
            this.page.currentPage = res.data.current // 赋值当前页码
        }
    }
}
</script>

<style scoped>
.cjbuttin{
    margin: 0 .5rem;
}
</style>
