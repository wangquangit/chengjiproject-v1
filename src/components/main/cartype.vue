<template>
    <div>
        <avue-crud 
            :data="data" 
            :option="option"
            :table-loading="loading"
            @selection-change="selectionChange"
        >
            <template slot-scope="scope" slot="menuLeft">
                <cj-main-top-button
                    :buttonList="buttonList"
                    :data="userInfo"
                    @addSubmit="addSubmit"
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
                    {label: '车型名称', prop: 'car_name'},
                    {label: '车型编号', prop: 'car_type_id'},
                    {label: '备注', prop: 'message'},
                    {label: '非工作时限速', prop: 'unwork_speed_limit'},
                    {label: '工作时限速', prop: 'work_speed_limit'},
                    {label: '最后修改时间', prop: 'updated_time'},
                ]
            },
            params: {}, // 搜索条件
            buttonList: [],
            userInfo: {
                forms: [
                    {label: '车型名称', prop: 'car_name', value: ''},
                    {label: '车型编号', prop: 'car_type_id', value: ''},
                    {label: '备注', prop: 'message', value: ''},
                ],
                selectionArr: [],
                formTitle: {
                    titleFiled: 'car_name'
                },
                permitSubmit: true,
                searchWindowForm: [
                    {label: '车型名称', prop: 'car_name', value: ''},
                    {label: '车型信息', prop: 'message', value: ''},
                ]
            }
        }
    },
    methods: {
        getInfo() {
            this.loading = true
            this.getButton()
            if(this.buttonList) {
                request.postRquest(
                    [
                        '/cartype/search',
                        'post',
                        this.params,
                        (res) => {
                            this.data = res.data.records
                            this.loading = false
                            console.log(res)
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
            console.log(this.buttonList)
        },
        getButton() {
            this.buttonList = this.$store.state.mainButtonInfo['cartype']
        },
        addSubmit(value) {
            let params = config.formJson(value)
            console.log(params)
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

