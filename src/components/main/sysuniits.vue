<template>
    <avue-crud 
        :option="option" 
        :data="data"
        :table-loading="loading"
        @selection-change="selectionChange"
    >
        <template slot-scope="scope" slot="menuLeft">
            <cj-main-top-button
                :buttonList="buttonList"
                :data="userInfo"
                @addSubmit="addSubmit"
                @editInfo="editInfo"
                @editSubmit="editSubmit"
                @deleteForm="deleteForm"
            />
        </template>

    </avue-crud>
</template>

<script>
import request from '../user_authority.js'
import cjMainTopButton from '../shareComponents/cjmenubutton.vue'
import config from '../config.js';
export default {
    data() {
        return {
            loading: true,
            option:{
                selection: true,
                page:false,
                align:'center',
                menuAlign:'center',
                menu: false,
                addBtn: false,
                column:[
                    {label: '单位名称', prop: 'units_name', sortable:true},
                    {label: '单位编号', prop: 'units_code', sortable:true},
                    {label: '单位信息', prop: 'units_info', sortable:true},
                    {label: '更新时间', prop: 'updated_time', sortable:true},
                ]
            },
            data: [],
            buttonList: [],
            userInfo: {
                forms: [
                    {label: '单位名称', prop: 'units_name', value: ''},
                    {label: '单位编号', prop: 'units_code', value: ''},
                    {label: '单位描述', prop: 'units_info', value: ''},
                    {label: '考核方式', prop: 'evaluation_mode', value: '', select: true, selectArr: [
                        {label: '按人考核', value: 0},
                        {label: '按单位考核', value: 1},
                    ]},
                    {label: '单位logo', prop: 'file', value: '', file: true},
                ],
                selectionArr: [],
                formTitle: {
                    titleFiled: 'units_name'
                }
            }
        }
    },
    methods: {
        getInfo() {
            // 获取数据
            this.getButton()
            if(this.buttonList) {
                request.postRquest(
                    [
                        '/sysuniits/search',
                        'post',
                        {},
                        (res) => {
                            this.data = res.data.records
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
            // 获取按钮
            this.buttonList = this.$store.state.mainButtonInfo['sysuniits']
        },
        addSubmit(forms) {
            // 添加,文件上传
            var params = config.formJson(forms)
            request.postRquest(
                [
                    '/sysuniits/addInfo',
                    'post',
                    params,
                    (res) => {
                        console.log("res:",res)
                    },
                    false
                ]
            )
            this.getInfo()
        },
        selectionChange(value) {
            this.userInfo.selectionArr = value
        },
        editInfo() {
            this.userInfo.forms[0].value = this.userInfo.selectionArr[0].units_name
            this.userInfo.forms[1].value = this.userInfo.selectionArr[0].units_code
            this.userInfo.forms[2].value = this.userInfo.selectionArr[0].units_info
            this.userInfo.forms[3].value = this.userInfo.selectionArr[0].evaluation_mode
            this.userInfo.forms[4].value = this.userInfo.selectionArr[0].file
        },
        editSubmit(value) {
            console.log(value)
            console.log(this.userInfo.selectionArr[0])
            request.postRquest(
                [
                    '/sysuniits/editInfo',
                    'put',
                    {
                        id: this.userInfo.selectionArr[0].id,
                        units_name: value[0].value,
                        units_code: value[1].value,
                        units_info: value[2].value,
                        evaluation_mode: value[3].value,
                        file: value[4].value,
                    },
                    (res) => {
                        console.log(res)
                        this.getInfo()
                    },
                    false
                ]
            )
        },
        deleteForm(value) {
            console.log(this.userInfo.selectionArr)
            var str = ''
            for(var i of this.userInfo.selectionArr){
                str += String(i.id)+','
            }
            request.postRquest(
                [
                    '/sysuniits/del/'+str,
                    'delete',
                    {},
                    (res) => {
                        console.log(res)
                        this.getInfo()
                    }
                ]
            )
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

