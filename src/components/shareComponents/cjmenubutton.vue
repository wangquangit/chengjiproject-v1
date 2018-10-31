<template>
    <div>
        <el-row>
            <el-col :span="24">
                <div class="grid-content bg-purple-dark">
                    <el-button 
                        size="small" 
                        v-for="(item, index) in nowButtons" 
                        :key="index"
                        :icon="item.icon"
                        :type="item.color"
                        @click="handleform"
                    >
                        {{item.buttonname}}
                    </el-button>
                    <el-dialog title="新增" :visible.sync="dialogFormVisible">
                    <el-form>
                        <el-form-item label="姓名" :label-width="formLabelWidth">
                            <el-input v-model="form.truename"></el-input>
                        </el-form-item>
                        <el-form-item label="电话" :label-width="formLabelWidth">
                            <el-input v-model="form.phone"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" :label-width="formLabelWidth">
                            <el-input v-model="form.password"></el-input>
                        </el-form-item>
                        <el-form-item label="登陆名" :label-width="formLabelWidth">
                            <el-input v-model="form.loginname"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="cancel">取 消</el-button>
                        <el-button type="primary" @click="submitUserInfo">确 定</el-button>
                    </div>
                </el-dialog>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    data() {
        return {
            formLabelWidth: '120px',
            dialogFormVisible: false,
            form: {
                truename: '',
                phone: '',
                password: '',
                loginname: ''
            }
        }
    },
    computed: {
        ...mapState(['nowButtons'])
    },
    methods: {
        handleform() {
            this.dialogFormVisible = true
        },
        cancel() {
            // 点击取消后的提示
            this.dialogFormVisible = false
            this.$message({
                message: '取消添加'
            })
        },
        submitUserInfo() {
            this.$emit('transmitform',this.form) // 向父组件传递表单信息
            this.dialogFormVisible = false
            this.$message({
                message: '添加成功',
                type: 'success'
            })
        }
    }
}
</script>

<style scoped>
</style>
