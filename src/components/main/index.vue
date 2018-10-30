<template>
    <avue-crud :data="data" :option="option">
        <template slot-scope="scope" slot="menuLeft">
            <el-button v-for="(item, index) in jsondata.index.havebuttonsD" :key="index">
                {{item.buttonname}}
            </el-button>
        </template>
    </avue-crud>
</template>

<script>
    import {mapState} from 'vuex'
    export default{
        data() {
            return {
                data: [
                    {
                        name: '张三',
                        age: 18,
                        sex: '男',
                        zhiye: 'web前端工程师',
                    },
                    {
                        name: '张三',
                        age: 18,
                        sex: '男',
                        zhiye: 'web前端工程师',
                    },
                ],
                option: {
                    page: true,
                    align:'center',
                    menuAlign:'center',
                    addBtn: false,
                    menuWidth: this.$store.state.menuWidth,
                    menuBtn: true,
                    selection: true,
                    column: [
                        {
                            sortable:true,
                            label:'姓名',
                            prop:'name',
                            search:true
                        },
                        {
                            sortable:true,
                            label: '年龄',
                            prop: 'age',
                        },
                        {
                            sortable:true,
                            label: '性别',
                            prop: 'sex',
                            search: true,
                            type: 'select',
                            dicData: [
                                {
                                    label: '男',
                                    value: 0
                                },
                                {
                                    label: '女',
                                    value: 1
                                },
                            ]
                        },
                        {
                            sortable:true,
                            label: '职业',
                            prop: 'zhiye',
                            search: true,
                        }
                    ]
                }
            }
        },
        computed: {
            ...mapState(['jsondata'])
        }
    }
    
</script>

<style scoped>

</style>
