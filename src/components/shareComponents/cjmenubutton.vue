<template>
    <el-col :span="24">
            <el-button
                size="small"
                v-for="(item, index) in buttonList"
                :key="index"
                :type="item.color"
                :icon="item.icon"
                @click="execute(item.functionname,data)"
            >
                {{item.buttonname}}
            </el-button>

            <el-dialog title="添加" :visible.sync="addTableVisible">
                <el-form>
                    <el-form-item
                        v-for="(item, index) of data.forms"
                        :key="index"
                        :label="item.label"
                        :label-width="formLabelWidth"
                    >
                        <el-input v-model="item.value"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancel">取消</el-button>
                    <el-button type="primary" @click="addSubmit">确定</el-button>
                </div>
            </el-dialog>

            <el-dialog title="修改" :visible.sync="editTableVisible">
                <el-form>
                    <el-form-item
                        v-for="(item, index) of data.forms"
                        :key="index"
                        :label="item.label"
                        :label-width="formLabelWidth"
                    >
                        <el-input v-model="item.value"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancel">取消</el-button>
                    <el-button type="primary" @click="editSubmit">确定</el-button>
                </div>
            </el-dialog>

            <el-dialog title="搜索" :visible.sync="searchTableVisible">
                <el-form>
                    <el-form-item
                        v-for="(item, index) of data.forms"
                        v-if="item.prop != 'password'"
                        :key="index"
                        :label="item.label"
                        :label-width="formLabelWidth"
                    >
                        <el-input v-model="item.value"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancel">取消</el-button>
                    <el-button @click="submitSearch">确定</el-button>
                </div>
            </el-dialog>

    </el-col>
</template>

<script>
import config from '../config';
export default {
    data() {
        return {
            addTableVisible: false,
            editTableVisible: false,
            deleteVisible: false,
            searchTableVisible: false,
            formLabelWidth: '80px'
        }
    },
    props: {
        buttonList: Array,
        data: Object,
    },
    methods: {
        execute(functionname,data) {
            // BOSS
            this.data = data
            console.log(functionname)
            this[functionname]()
        },
        addInfo() {
            // 添加表单开启
            this.addTableVisible = true
        },
        cancel() {
            // 提示取消
            this.addTableVisible = false
            this.editTableVisible = false
            this.searchTableVisible = false
            this.$message({message:'取消'})
        },
        addSubmit() {
            // 提交表单传给子组件
            this.$emit('addSubmit',this.data.forms)
            this.addTableVisible = false
        },
        editInfo() {
            // 向父组件发起请求
            this.$emit('editInfo')
            if(this.$store.state.selectionArr.length == 1){
                this.editTableVisible = true
            }
        },
        editSubmit() {
            // 提交修改
            this.$emit('editSubmit', this.data.forms)
            this.editTableVisible = false
        },
        del() {
            // 删除方法
            var itemList = this.$store.state.selectionArr
            var str = ''
            for(var item of itemList){
                str += item.id+','
            }
            this.$store.state.selectionArr.length >= 1 ?
                this.deleteVisible = true :
                this.deleteVisible = false
            if(this.deleteVisible){
                this.$confirm('此操作将永久删除选中信息, 是否继续','提示!', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        method: 'delete',
                        url: config.serverurl+'/user/del/'+str
                    }).then((res) => {
                        this.$message({
                            message: '删除成功',
                        })
                        this.$emit('deleteOk')
                    }).catch((err) => {
                        alert('失败')
                    })
                }).catch(() => {
                    this.$message({
                        message: '已取消删除',
                        type:'info'
                    })
                })
            }
        },
        search() {
            // 激活搜索弹窗
            this.searchTableVisible = true
            console.log(this.data.forms)
        },
        submitSearch() {
            console.log(this.data.forms)
        }
    }
}
</script>

<style scoped>

</style>
