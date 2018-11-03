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
                @submitSearch="submitSearch"
                @showInfo="showInfo"
                @restore="restore"
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
                selectionArr: [],
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
            this.$axios({
                method: 'post',
                url: config.serverurl+'/user/addInfo',
                params: {
                    loginname: value[0].value,
                    phone: value[1].value,
                    password: value[2].value
                }
            }).then((res) => {
                this.getInfo()
                this.emptyForms()
            })
        },
        editInfo() {
            // 更新当前forms表单
            if(this.userInfo.selectionArr.length == 1){
                this.userInfo.forms[0].value = this.userInfo.selectionArr[0].loginname
                this.userInfo.forms[1].value = this.userInfo.selectionArr[0].phone
                this.userInfo.forms[2].value = this.userInfo.selectionArr[0].password
            } else {
                this.$message({message:'修改时一次只能选择一个'})
            }
        },
        emptyForms() {
            // 清空表单value值
            for(var item of this.userInfo.selectionArr){
                item.value = ''
            }
        },
        editSubmit(value) {
            // 提交修改请求
            this.$axios({
                method: 'put',
                url: config.serverurl+'/user/editInfo',
                params: {
                    id: this.userInfo.selectionArr[0].id,
                    loginname: value[0].value,
                    phone: value[1].value,
                    password: value[2].value,
                }
            }).then((res) => {
                this.$message({message:'修改成功', type: 'success'})
                this.getInfo()
                this.emptyForms()
            }).catch((err) => {
                alert('修改失败')
            })
        },
        submitSearch(value) {
            // 搜索表单提交
            let searchForm = {
                where: [
                    {
                        name: 'truename|loginname',
                        op: 'like',
                        value: value[0].value
                    },
                    {
                        name: 'phone',
                        op: 'eq',
                        value: value[1].value
                    }
                ]
            }
            this.$axios({
                method: 'post',
                url: config.serverurl+'/user/search',
                data: {
                    where: searchForm.where
                    // ??? 请求时请求数据长度默认为10 ???
                }
            }).then((res) => {
                this.$message({
                    message: '共找到'+res.data.total+'条结果!',
                    type: 'success'
                })
                this.data = res.data.records
                this.page.total = res.data.total
                this.page.currentPage = res.data.current
            }).catch((err) => {
                alert(err)
            })
        },
        showInfo() {
            let arr = this.userInfo.selectionArr
            if(arr.length == 1){
                this.userInfo.forms = [
                    {label: '公司ID', prop: 'companyid', value: arr[0].companyid},
                    {label: '创建时间', prop: 'createtime', value: arr[0].createtime},
                    {label: '部门ID', prop: 'departmentid', value: arr[0].departmentid},
                    {label: '登陆名', prop: 'loginname', value: arr[0].loginname},
                    {label: '最后修改时间', prop: 'modifytime', value: arr[0].modifytime},
                    {label: '密码', prop: 'password', value: arr[0].password},
                    {label: '电话', prop: 'phone', value: arr[0].phone},
                    {label: '用户类型', prop: 'usertype', value: arr[0].usertype},
                ]
            } else {
                this.$message({message: '请选择一个'})
            }
        },
        selectionChange(value) {
            // 多选列表
            this.userInfo.selectionArr = value
        },
        restore() {
            // 还原状态
            this.userInfo.forms = [
                {label: '用户名', prop: 'loginname', value: ''},
                {label: '手机号', prop: 'phone', value: ''},
                {label: '密码', prop: 'password', value: ''},
            ]
            
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
