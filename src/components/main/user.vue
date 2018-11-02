<template>
    <avue-crud
        :data="data"
        :option="option"
        :table-loading="loading"
        :page="page"
        @size-change="sizeChange"
        @current-change="currentChange" 
        @refresh-change="refresh"
        @selection-change="selectionChange"
    >
        <template slot-scope="scope" slot="menuLeft">
            <cj-main-top-button
                :buttonList="buttonList"
                :data="userInfo"
                @addSubmit="addInfo"
                @editInfo="editInfo"
                @editSubmit="editSubmit"
                @deleteOk="getInfo"
            ></cj-main-top-button>
        </template>
    </avue-crud>
</template>

<script>
import config from '../config.js'
import cjMainTopButton from '../shareComponents/cjmenubutton.vue'
export default {
    data() {
        return {
            userInfo: {
                forms: [
                    {label: '用户名', prop: 'loginname', value: ''},
                    {label: '手机号', prop: 'phone', value: ''},
                    {label: '密码', prop: 'password', value: ''},
                ],
            },
            buttonList: [],
            data: [],
            option: {
                align: 'center',
                menuAlign: 'center',
                selection: true,
                addBtn: false,
                delBtn: false,
                menu: false,
                column: [
                    {label: '用户名', prop: 'loginname'},
                    {label: '手机号', prop: 'phone'},
                    // {label: 'ID', prop: 'id'},
                    {label: '最后修改时间', prop: 'createtime'},
                ]
            },
            loading: false,
            page: {
                // 分页数据
                currentPage: 1, // 当前页码
                total: 0, // 数据总数
                pageSizes: [10, 20, 30, 40, 50],
            }
        }
    },
    methods: {
        getInfo() {
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
                this.getButton()
                this.loading = false
                this.data = res.data.records
                this.page.total = res.data.total
                this.page.currentPage = res.data.current
            }).catch((error) => {
                alert('请求失败')
            })
        },
        getButton() {
            this.buttonList = this.$store.state.mainButtonInfo['user']
        },
        sizeChange(value) {
            // 修改页面数据大小
            this.page.pageSize = value
            this.getInfo()
        },
        currentChange(value) {
            this.page.current = value
            this.getInfo()
        },
        refresh() {
            // 数据刷新
            this.getInfo()
        },
        addInfo(value) {
            // 获取子组件传递的表单信息
            console.log('收到子组件发来的信息:',value[0].value)
            this.$axios({
                method: 'post',
                url: config.serverurl+'/user/addInfo',
                params: {
                    loginname: value[0].value,
                    phone: value[1].value,
                    password: value[2].value
                }
            }).then((res) => {
                console.log(res)
                this.getInfo()
                this.userInfo.forms[0].value = ''
                this.userInfo.forms[1].value = ''
                this.userInfo.forms[2].value = ''
            }).catch((err) => {
                console.log(err)
            })
        },
        editInfo() {
            // 更新当前forms表单
            if(this.$store.state.selectionArr.length == 1){
                console.log(this.userInfo.forms)
                console.log(this.$store.state.selectionArr[0])
                this.userInfo.forms[0].value = this.$store.state.selectionArr[0].loginname
                this.userInfo.forms[1].value = this.$store.state.selectionArr[0].phone
                this.userInfo.forms[2].value = this.$store.state.selectionArr[0].password
            } else {
                this.$message({message:'修改时一次只能选择一个'})
            }
        },
        editSubmit(value) {
            // 提交修改请求
            console.log('收到修改请求',value)
            this.$axios({
                method: 'put',
                url: config.serverurl+'/user/editInfo',
                params: {
                    id: this.$store.state.selectionArr[0].id,
                    loginname: value[0].value,
                    phone: value[1].value,
                    password: value[2].value,
                }
            }).then((res) => {
                this.$message({message:'修改成功', type: 'success'})
                this.getInfo()
            }).catch((err) => {
                alert('修改失败')
            })
        },
        selectionChange(value) {
            // 多选列表
            this.$store.state.selectionArr = value
        }
    },
    created() {
        this.getInfo()
    },
    components: {
        cjMainTopButton
    }
}
</script>

<style scoped>

</style>
