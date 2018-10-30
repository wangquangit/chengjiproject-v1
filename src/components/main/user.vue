<template>
    <avue-crud :data="data" :option="option">
        <template slot-scope="scope" slot="menuLeft">
            <el-button size="small" @click="dialogFormVisible = true">添加</el-button>

            <el-dialog title="添加个人信息" :visible.sync="dialogFormVisible">
                <el-form :model="form">
                    <el-form-item label="姓名" :label-width="formLabelWidth">
                        <el-input v-model="form.name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" :label-width="formLabelWidth">
                        <el-select v-model="form.region" placeholder="请选择性别">
                            <el-option label="男" value="0"></el-option>
                            <el-option label="女" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="年龄" :label-width="formLabelWidth">
                        <el-input></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
                </div>
            </el-dialog>
        </template>
    </avue-crud>
</template>

<script>
export default {
    data() {
        return {
            dialogTableVisible: false,
            dialogFormVisible: false,
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
            formLabelWidth: '120px',
            data: [
                {
                    name: '小芳',
                    sex: 1,
                    age: 18
                }
            ],
            option: {
                page: true,
                align:'center',
                menuAlign:'center',
                addBtn: false,
                menuBtn: true,
                menuWidth: this.$store.state.menuWidth,
                selection: true,
                column: [
                    {
                        sortable: true,
                        label: '姓名',
                        prop: 'name',
                        search: true,
                    },
                    {
                        sortable: true,
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
                            }
                        ]
                    },
                    {
                        label: '年龄',
                        prop: 'age',
                        sortable: true,
                    }
                ]
            }
        }
    }
}
</script>


<style scoped>

</style>
