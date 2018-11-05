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

            <el-dialog @close="restore" title="添加" :visible.sync="addTableVisible">
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

            <el-dialog @close="restore" title="修改" :visible.sync="editTableVisible">
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

            <el-dialog @close="restore" title="搜索" :visible.sync="searchTableVisible">
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

            <el-dialog @close="restore" title="详情" :visible.sync="showVisible">
                <el-form>
                    <el-form-item
                        v-for="(item, index) of data.forms"
                        :key="index"
                        :label="item.label"
                        :label-width="formLabelWidth"
                    >
                        <el-input :disabled="true" v-model="item.value"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancel">关闭</el-button>
                </div>
            </el-dialog>

    </el-col>
</template>

<script>
import config from '../config';
import request from '../user_authority.js'
export default {
    data() {
        return {
            addTableVisible: false,
            editTableVisible: false,
            deleteVisible: false,
            searchTableVisible: false,
            showVisible: false,
            formLabelWidth: '120px'
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
            this[functionname]()
        },
        addInfo() {
            // 添加表单开启
            for(var item of this.data.forms){
                item.value = ''
            }
            this.addTableVisible = true
        },
        cancel() {
            // 提示取消
            this.addTableVisible = false
            this.editTableVisible = false
            this.searchTableVisible = false
            this.showVisible = false
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
            if(this.data.selectionArr.length == 1){
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
            var itemList = this.data.selectionArr
            var str = ''
            for(var item of itemList){
                str += item.id+','
            }
            this.data.selectionArr.length >= 1 ?
                this.deleteVisible = true :
                this.deleteVisible = false
            if(this.deleteVisible){
                this.$confirm('此操作将永久删除选中信息, 是否继续','提示!', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    request.postRquest(
                        [
                            '/user/del/'+str,
                            {},
                            (res) => {
                                this.$message(
                                    {
                                        message: '删除成功',
                                        type: 'success'
                                    }
                                ),
                                this.$emit('deleteOk')
                            },
                            'delete'
                        ]
                    )
                }).catch(() => {
                    this.$message({
                        message: '已取消删除',
                        type:'info'
                    })
                })
            } else {
                this.$message({
                    message: '请选择一个',
                    type: 'info'
                })
            }
        },
        search() {
            // 激活搜索弹窗
            this.searchTableVisible = true
        },
        submitSearch() {
            // 提交搜索
            this.$emit('submitSearch',this.data.forms)
            this.searchTableVisible = false
        },
        showInfo() {
            this.$emit('showInfo')
            if(this.data.selectionArr.length == 1){
                this.showVisible = true
            }
        },
        restore() {
            this.$emit('restore')
        }
    }
}
</script>

<style scoped>

</style>
