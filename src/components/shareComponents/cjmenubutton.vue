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
                        v-if="item.label != 'id'"
                    >
                        <el-input v-if="!item.select && !item.file" v-model="item.value"></el-input>

                        <input 
                            @change="changeFile($event)" 
                            v-if="item.file" 
                            type="file" 
                            accept="image/*"
                            class="btn btn-default"
                        />
                        <!-- 文件上传 -->

                        <el-select @change="handleSelect" v-if="item.select" v-model="selectValue" placeholder="请选择">
                            <!--  下拉选择 -->
                            <el-option 
                                v-for="(item, index) of item.selectArr"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>

                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancel">取消</el-button>
                    <el-button type="primary" @click="addSubmit">确定</el-button>
                </div>
            </el-dialog>

            <el-dialog @close="restore" :title="'修改-'+title" :visible.sync="editTableVisible">
                <!-- 修改表单 -->
                <el-form>
                    <el-form-item
                        v-for="(item, index) of data.forms"
                        :key="index"
                        :label="item.label"
                        :label-width="formLabelWidth"
                        v-if="item.label != 'id'"
                    >
                        <el-input v-if="!item.file && !item.select" v-model="item.value"></el-input>

                        <!-- 文件上传 -->
                        <input 
                            @change="changeFile($event)" 
                            v-if="item.file" 
                            type="file" 
                            accept="image/*"
                            class="btn btn-default"
                        />

                        <el-select @change="handleSelect" v-if="item.select" v-model="selectValue" placeholder="请选择">
                            <!--  下拉选择 -->
                            <el-option 
                                v-for="(item, index) of item.selectArr"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>

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
                        :label="item.label+':'"
                        :label-width="showLabelWidth"
                    >
                        <div style="float: left;">
                            {{item.value}}
                        </div>
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
            formLabelWidth: '120px',
            showLabelWidth: '250px',
            title: '',
            selectionArr: [],
            selectValue: '',
            file: '',
            src: ''
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
        },
        addSubmit() {
            // 提交表单传给子组件
            this.$emit('addSubmit',this.data.forms)
            this.addTableVisible = false
        },
        editInfo() {
            // 向父组件发起请求
            this.$emit('editInfo')
            if(this.data.selectionArr.length > 0){
                this.title = this.data.selectionArr[0][this.data.formTitle.titleFiled]
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
            this.title = ''
            var itemList = this.data.selectionArr
            var str = ''
            for(var item of itemList){
                this.title += ' '+item[this.data.formTitle.titleFiled]+','
                str += item[this.data.formTitle.idFiled]+','
            }
            if(this.title.length > 0){
                this.title = this.title.substring(0,this.title.length-1)
            }
            this.data.selectionArr.length >= 1 ?
                this.deleteVisible = true :
                this.deleteVisible = false
            if(this.deleteVisible){
                this.$confirm('是否删除 '+this.title,'提示!', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$emit('deleteForm', str)
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
            var arr = this.data.forms
            // 过滤掉id和密码
            for(var item in arr){
                if(arr[item].prop == 'id' || arr[item].prop == 'password'){
                    arr.splice(item,1)
                }
            }
            this.searchTableVisible = true
        },
        submitSearch() {
            // 提交搜索
            this.$emit('submitSearch',this.data.forms)
            this.searchTableVisible = false
        },
        showInfo() {
            this.$emit('showInfo')
            if(this.data.selectionArr.length > 0){
                this.showVisible = true
            }
        },
        restore() {
            this.$emit('restore')
        },
        handleSelect(value) {
            // 选择下拉列表后赋值
            for(var i of this.data.forms) {
                if(i.select) {
                    i.value = value
                }
            }
        },
        changeFile(event) {
            // 文件上传
            for(var i of this.data.forms) {
                if(i.file) {
                    i.value = event.target.files[0]
                }
            }
        }
    },
}
</script>

<style scoped>

</style>
