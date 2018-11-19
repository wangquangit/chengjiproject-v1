<template>
    <div>
        <avue-crud :data="data" :option="option">
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
import config from '../config.js'
import cjMainTopButton from '../shareComponents/cjmenubutton.vue'
export default {
    data() {
        return {
            data: [],
            option: {
                page:false,
                align:'center',
                menuAlign:'center',
                menu: false,
                addBtn: false,
                column:[
                    {label: '车牌号',prop: 'car_no', sortable:true},
                    {label: '车载设备ID',prop: 'mobile_unit_id', sortable:true},
                    {label: '区域',prop: 'area_name_text', sortable:true},
                    {label: '车辆品牌',prop: 'car_brand', sortable:true},
                    {label: '车辆颜色',prop: 'car_color', sortable:true},
                    {label: '车辆编号',prop: 'car_id', sortable:true},
                    {label: '司机',prop: 'driver', sortable:true},
                    {label: '物联卡号',prop: 'instrumented_id', sortable:true},
                    {label: '所属部门',prop: 'department_name_text', sortable:true},
                ]
            },
            buttonList: null,
            page: {
                // 分页数据
                currentPage: 1, // 当前页码
                total: 0, // 数据总数
                pageSizes: [10, 20, 30, 40, 50],
                pageSize: 10
            },
            params: {
                // 搜索条件和排序
                orderByField: 'car_no',
                isAsc: false,
                where: [{}]
            },
            userInfo: {
                forms: [
                    {label: '车牌号', prop: 'car_no', value: '', prompt: ''},
                    {label: '车载设备ID', prop: 'mobile_unit_id', value: '', prompt: ''},
                    {label: '车辆品牌', prop: 'car_brand', value: '',select: true, selectArr: [/* 下拉车型列表 */]},
                    {label: '车辆颜色', prop: 'car_color', value: ''},
                    {label: '车辆排量', prop: 'car_displacement', value: ''},
                    {label: '车辆编号', prop: 'car_id', value: ''},
                    {label: '已行驶里程', prop: 'already_km', value: ''},
                    {label: '年检到期日期', prop: 'annual_end_date', value: '',},
                    {label: '区域', prop: 'area_id', value: '', selectArea: true},
                ],
                selectionArr: [],
                formTitle: {
                    idFiled: 'id',
                    titleFiled: 'car_no'
                },
                addPermitSubmit: true, // 添加时允许直接提交
                editPermitSubmit: true, // 修改时允许直接提交
                searchWindowForm: [],
                getAreaCommon: [], // 区域选择
            },
        }
    },
    methods: {
        getInfo() {
            this.getButton()
            if(typeof this.buttonList == 'object') {
                let params = config.setParams(this.params, this.page)
                request.postRquest(
                    [
                        '/carinfo/search',
                        'post',
                        params,
                        (res) => {
                            this.data = res.data.records
                            console.log("res:",res)
                        },
                    ]
                )
            } else {
                setTimeout(() => {
                    this.getInfo()
                }, 2000)
            }
        },
        getButton() {
            // 获取按钮
            this.buttonList = this.$store.state.mainButtonInfo['carinfo']
        },
        getAreaCommon() {
            // 请求区域接口
            request.postRquest(
                [
                    '/common/getAreaCommon',
                    'post',
                    {},
                    (res) => {
                        this.userInfo.getAreaCommon = res.data
                    }
                ]
            )
        },
        getCarTypeCommon() {
            // 获取下拉车型
            request.postRquest(
                [
                    '/common/getCarTypeCommon',
                    'post',
                    {},
                    (res) => {
                        for(var i of this.userInfo.forms) {
                            if(i.select) {
                                i.selectArr = res.data
                            }
                        }
                    }
                ]
            )
        },
    },
    created() {
        this.getInfo()
        this.getAreaCommon()
        this.getCarTypeCommon()
    },
    components: {
        cjMainTopButton
    }
}
</script>

<style lang="scss" scoped>

</style>
