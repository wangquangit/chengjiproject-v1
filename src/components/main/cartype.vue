<template>
    <div>
        <avue-crud 
            :data="data" 
            :option="option"
            :table-loading="loading"
            :page="page"
            @selection-change="selectionChange"
            @size-change="sizeChange"
            @current-change="currentChange"
            @refresh-change="getInfo"
            @sort-change="sortChange"
        >
            <template slot-scope="scope" slot="menuLeft">
                <cj-main-top-button
                    :buttonList="buttonList"
                    :data="userInfo"
                    @addSubmit="addSubmit"
                    @editSubmit="editSubmit"
                    @deleteForm="deleteForm"
                    @showInfo="showInfo"
                    @submitSearch="submitSearch"
                    @export="exports"
                    @submitImportFile="submitImportFile"
                    @checkCarName="checkCarName"
                    @checkCarId="checkCarId"
                    @closePermit="closePermit"
                ></cj-main-top-button>
            </template>
        </avue-crud>
    </div>
</template>

<script>
import request from '../user_authority.js'
import cjMainTopButton from '../shareComponents/cjmenubutton.vue'
import config from '../config.js'
export default {
    data() {
        return {
            loading: false,
            data: [],
            option: {
                align:'center',
                menuAlign:'center',
                menu: false,
                addBtn: false,
                selection: true,
                column: [
                    {label: '车型名称', prop: 'car_name', sortable:true},
                    {label: '车型编号', prop: 'car_type_id', sortable:true},
                    {label: '备注', prop: 'message', sortable:true},
                    {label: '非工作时限速', prop: 'unwork_speed_limit', sortable:true},
                    {label: '工作时限速', prop: 'work_speed_limit', sortable:true},
                    {label: '最后修改时间', prop: 'updated_time', sortable:true},
                ]
            },
            buttonList: [],
            userInfo: {
                forms: [
                    {label: '车型名称', prop: 'car_name', value: '', prompt: ''},
                    {label: '车型编号', prop: 'car_type_id', value: '', prompt: ''},
                    {label: '备注', prop: 'message', value: ''},
                    {label: '非工作时限速', prop: 'unwork_speed_limit', value: ''},
                    {label: '工作时限速', prop: 'work_speed_limit', value: ''},
                ],
                selectionArr: [],
                formTitle: {
                    idFiled: 'id',
                    titleFiled: 'car_name'
                },
                addPermitSubmit: false, // 添加时允许直接提交
                editPermitSubmit: true, // 修改时允许直接提交
                searchWindowForm: [
                    {label: '车型名称', prop: 'car_name', value: ''},
                    {label: '车型编号', prop: 'car_type_id', value: ''},
                ]
            },
            page: {
                // 分页数据
                currentPage: 1, // 当前页码
                total: 0, // 数据总数
                pageSizes: [10, 20, 30, 40, 50],
                pageSize: 10
            },
            params: {
                // 搜索条件和排序
                orderByField: 'car_type_id',
                isAsc: false,
                where: [{}]
            },
        }
    },
    methods: {
        sizeChange(value) {
            // 每页大小
            this.page.pageSize = value
            this.getInfo()
        },
        currentChange(value) {
            this.page.currentPage = value
            this.getInfo()
        },
        sortChange(value) {
            this.params.orderByField = value.prop
            this.params.isAsc = value.order == 'ascending' ?
                true : false
            this.getInfo()
        },
        getInfo() {
            this.loading = true
            this.getButton()
            let params = config.setParams(this.params, this.page)
            if(this.buttonList) {
                request.postRquest(
                    [
                        '/cartype/search',
                        'post',
                        params,
                        (res) => {
                            this.data = res.data.records
                            this.page.total = res.data.total
                            if(res.data.records.length == 0){
                                // 当请求的数据长度为0时,修改请求参数再重新请求
                                if(res.data.current > 1){
                                    this.page.currentPage = res.data.current - 1
                                    this.getInfo()
                                } else {
                                    this.page.currentPage = res.data.current
                                }
                            } else {
                                this.page.currentPage = res.data.current
                            }
                            this.loading = false
                        }
                    ]
                )
            } else {
                setTimeout(
                    () => {
                        this.getInfo()
                    },
                    2000
                )
            }
        },
        getButton() {
            this.buttonList = this.$store.state.mainButtonInfo['cartype']
        },
        addSubmit(value) {
            let params = config.formJson(value)
            request.postRquest(
                [
                    '/cartype/addInfo',
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
        editSubmit(forms) {
            let params = config.formJson(forms)
            params.id = this.userInfo.selectionArr[0].id
            request.postRquest(
                [
                    '/cartype/editInfo',
                    'put',
                    params,
                    (res) => {
                        res.data.code == 11 ?
                            this.$message({message: res.data.msg, type: 'success'}) :
                            this.$message({message: res.data.msg}) 
                        this.getInfo()
                    },
                    false
                ]
            )
        },
        deleteForm(value) {
            request.postRquest(
                [
                    '/cartype/del/'+value,
                    'delete',
                    {},
                    (res) => {
                        res.data.code == 11 ?
                            this.$message({message: res.data.msg, type: 'success'}) :
                            this.$message({message: res.data.msg})
                        this.getInfo()
                    },
                    false
                ]
            )
        },
        showInfo() {
            let arr = this.userInfo.selectionArr
            if(arr.length > 0) {
                for(var i of this.userInfo.forms) {
                    i.value = arr[0][i.prop]
                }
            }
        },
        submitSearch(value) {
            // 搜索
            this.loading = true
            this.params.where = [
                {
                    name: 'car_name',
                    op: 'like',
                    value: value[0].value
                },
                {
                    name: 'car_type_id',
                    op: 'eq',
                    value: value[1].value
                }
            ]
            this.getInfo()
        },
        exports() {
            // 导出
            request.postRquest(
                [
                    '/cartype/export',
                    'post',
                    this.params,
                    (res) => {
                        let url = window.URL.createObjectURL(res.data)
                        let link = document.createElement('a')
                        link.style.display = 'none'
                        link.href = url
                        link.setAttribute('download', 'excel.xls')
                        document.body.appendChild(link)
                        link.click()
                    },
                    true,
                    'blob'
                ]
            )
        },
        submitImportFile(files) {
            request.postRquest(
                [
                    '/cartype/import',
                    'post',
                    files,
                    (res) => {
                        res.data.code == 11 ?
                            this.$message({message: res.data.msg, type: 'success'}) :
                            this.$message({message: res.data.msg})
                        this.getInfo()
                    },
                    true
                ]
            )
        },
        checkCarName(value) {
            if(value.value == '') {
                this.userInfo.forms[0].prompt = '名称不能为空'
                this.userInfo.addPermitSubmit = false
                this.userInfo.editPermitSubmit = false
                return
            }
            request.postRquest(
                [
                    '/cartype/isExistence',
                    'post',
                    {
                        carTypeName: value.value
                    },
                    (res) => {
                        if(res.data.code == 11){
                            this.$message({message: '名称合法', type: 'success'})
                            this.userInfo.forms[0].prompt = ''
                            this.setPermitSubmit(value)
                        } else {
                            this.userInfo.forms[0].prompt = '名称已经存在'
                            this.userInfo.addPermitSubmit = false
                            this.userInfo.editPermitSubmit = false
                        }
                    },
                    false
                ]
            )
            // this.setPermitSubmit(value)
        },
        checkCarId(value) {
            if(value.value == '') {
                this.userInfo.forms[1].prompt = '车型ID不能为空'
                this.userInfo.addPermitSubmit = false
                return
            }
            request.postRquest(
                [
                    '/cartype/isExistence',
                    'post',
                    {
                        carTypeId: value.value
                    },
                    (res) => {
                        if(res.data.code == 11) {
                            this.$message({message: 'ID合法', type: 'success'})
                            this.userInfo.forms[1].prompt = ''
                            this.setPermitSubmit(value)
                        } else {
                            this.userInfo.forms[1].prompt = 'ID已经存在'
                            this.userInfo.addPermitSubmit = false
                            this.userInfo.editPermitSubmit = false
                        }
                    },
                    false
                ]
            )
            // this.setPermitSubmit(value)
        },
        setPermitSubmit(value) {
            // 校验合格后允许提交
            let f = this.userInfo.forms
            if(f[0].value != '' && f[1].value != '' && f[0].prompt == '' && f[1].prompt == '') {
                this.userInfo.addPermitSubmit = true
                this.userInfo.editPermitSubmit = true
            }
        },
        closePermit() {
            for(var i of this.userInfo.forms) {
                i.prompt = ''
            }
        }
    },
    created() {
        this.getInfo()
    },
    components: {
        cjMainTopButton
    },
}
</script>

<style scoped>

</style>

