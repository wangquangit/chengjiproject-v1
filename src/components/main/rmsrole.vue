<template>
    <avue-crud 
        :data="data" 
        :option="option"
        :table-loading="loading"
        :page="page"
        @selection-change="selectionChange"
    >
        <!-- <template slot-scope="scope" slot="menu">
            右侧按钮
            <cj-main-top-button
                :buttonList="tabelButtonList"
                :data="userInfo"
            ></cj-main-top-button>
        </template> -->

        <template slot-scope="scope" slot="menuLeft">
            <!-- 顶部按钮 -->
            <cj-main-top-button
                :buttonList="buttonList"
                :data="userInfo"
                @addSubmit="addSubmit"
                @editInfo="editInfo"
                @editSubmit="editSubmit"
                @deleteForm="deleteForm"
                @getPermission="getPermission"
                @submitAddPermission="submitAddPermission"
            ></cj-main-top-button>
        </template>

    </avue-crud>
</template>

<script>
import request from '../user_authority.js'
import cjMainTopButton from '../shareComponents/cjmenubutton.vue'
import config from '../config.js'
export default {
    data() {
        return {
            loading: true,
            data: [],
            page: {
                pageSizes: [10, 20, 30, 40],
                total: 0,
                currentPage: 1,
                pageSize: 10,
            },
            params: {
                // 搜索条件和排序
                orderByField: 'projectid',
                isAsc: false,
                where: [{}]
            },
            option:{
                title:'权限管理',
                selection: true,
                page:true,
                align:'center',
                menuAlign:'center',
                addBtn: false,
                delBtn: false,
                editBtn: false,
                menu: false,
                stripe: true,
                menuWidth: '300px',
                column:[
                    {label: '项目id', prop: 'projectid', sortable:true},
                    {label: '角色名称', prop: 'rolename', sortable:true},
                    {label: '角色类型', prop: 'roletypes', sortable:true},
                    {label: '公司id', prop: 'companyid', sortable:true},
                    {label: '修改时间', prop: 'modifytime', sortable:true},
                    {label: '备注', prop: 'remarks', sortable:true},
                ]
            },
            buttonList:[],
            userInfo: {
                forms: [
                    {label: '角色名称', prop: 'rolename', value: ''},
                    {label: '备注', prop: 'remarks', value: ''},
                ],
                searchWindowForm: [],
                formTitle: {
                    titleFiled: 'rolename'
                },
                permitSubmit: true,
                selectionArr: [],
                Permissions: {
                    allPermissions: [],
                    nowPermissions: [],
                }
            }
        }
    },
    methods: {
        getInfo() {
            this.getButton()
            if(this.buttonList) {
                request.postRquest(
                    [
                        '/rmsrolesss/search',
                        'post',
                        config.setParams(this.params,this.page),
                        (res) => {
                            console.log("res:",res)
                            this.data = res.data.records
                            if(config.setPage(res)){
                                this.page = config.setPage(res)
                            } else {
                                this.getInfo()
                            }
                            this.loading = false
                        }
                    ]
                )
            } else {
                setTimeout(
                    () => {this.getInfo()},
                    2000
                )
            }
        },
        getButton() {
            this.buttonList = this.$store.state.mainButtonInfo['rmsrole']
        },
        addSubmit(forms) {
            var params = config.formJson(forms)
            request.postRquest(
                [
                    '/rmsrolesss/addInfo',
                    'post',
                    params,
                    (res) => {
                        if(res.data.code == 11) {
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            })
                        } else {
                            this.$message({
                                message: res.data.msg
                            })
                        }
                        this.getInfo()
                    },
                    false
                ]
            )
        },
        selectionChange(value) {
            this.userInfo.selectionArr = value
        },
        editInfo() {
            if(this.userInfo.selectionArr.length > 0) {
                this.userInfo.forms[0].value = this.userInfo.selectionArr[0].rolename
                this.userInfo.forms[1].value = this.userInfo.selectionArr[0].remarks
            }
        },
        editSubmit(forms) {
            var params = config.formJson(forms);
            params.id = this.userInfo.selectionArr[0].id
            request.postRquest(
                [
                    '/rmsrolesss/editInfo',
                    'put',
                    params,
                    (res) => {
                        this.getInfo()
                        if(res.data.code == 11) {
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            })
                        } else {
                            this.$message({
                                message: res.data.msg
                            })
                        }
                    },
                    false
                ]
            )
        },
        deleteForm(str) {
            var str = ''
            for(var i of this.userInfo.selectionArr) {
                str += String(i.id)+','
            }
            request.postRquest(
                [
                    '/rmsrolesss/del/'+str,
                    'delete',
                    {},
                    (res) => {
                        this.getInfo()
                        if(res.data.code == 11) {
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            })
                        } else {
                            this.$message({
                                message: res.data.msg
                            })
                        }
                    }
                ]
            )
        },
        getPermission() {
            request.postRquest(
                [
                    '/rmsrolesss/getPermissions',
                    'post',
                    {
                        roleId: this.userInfo.selectionArr[0].id
                    },
                    (res) => {
                        this.userInfo.Permissions.allPermissions = res.data
                    },
                    false
                ]
            )
        },
        submitAddPermission(value) {
            console.log('接收到子组件传来的数组!!', value)
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

<style lang="scss" scoped>

</style>
