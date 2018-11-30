<template>
    <section>
    <div class="bread">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
        <el-breadcrumb-item >ota</el-breadcrumb-item>
        <el-breadcrumb-item >升级包管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <ul class="search-form clearfix">
        <li class="clearfix">
          <label width="180px">升级包类型</label>
          <div class="input">
            <el-select v-model="queryForm.category"  placeholder="请选择包类型">
                <el-option
                        v-for="item in cateList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>
          </div>
        </li>
        <li class="clearfix">
          <label width="180px">状态</label>
          <div class="input">
            <el-select v-model="queryForm.status" placeholder="请选择状态">
                <el-option
                        v-for="item in statusTextList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>
          </div>
        </li>
        <li class="clearfix" style="margin-left: 20px;">
          <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        </li>
      </ul>
      <div class="table-content">
        <div class="table-title clearfix">
          <p>升级包信息</p>
          <div class="add-btn">
            <el-button type="primary"  size="small" @click="addClick()" >上传升级包</el-button>
          </div>
        </div>
        <el-table :data="tableData" border stripe style="width: 100%">
          <el-table-column prop="title" label="应用标题" width="80" fixed></el-table-column>
          <el-table-column prop="descriptions" label="升级内容" fixed width="180"></el-table-column>
          <el-table-column prop="appCode" label="App Code" fixed></el-table-column>
          <el-table-column prop="size" label="应用大小" width="150">
            <template slot-scope="scope">
              {{scope.row.size}}M
            </template>
          </el-table-column>
          <el-table-column prop="versionCode" label="版本号" width="200"></el-table-column>
          <el-table-column prop="sha256" label="Sha256" width="150"></el-table-column>
          <el-table-column prop="createTime" label="上传时间" width="100">
            <template slot-scope="scope">
              {{formatDate(scope.row.createTime)}}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="上传状态" width="150">
            <template slot-scope="scope">
              {{getStatusText(scope.row.status)}}
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="218">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="detailClick(scope.row)" >查看</el-button>
              <el-button  v-show="scope.row.status === 0" size="mini" type="primary" @click="editClick(scope.row)" >编辑</el-button>
              <el-button  v-show="scope.row.status === 0"  size="mini" type="primary" @click="finishClick(scope.row.publishId)" >结束</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page">
        <el-pagination
          background
          @current-change='handleCurrentChange'
          @size-change='handleSizeChange'
          :current-page.sync="page.currentPage"
          :page-sizes="[10, 20, 30, 40]"
          layout="sizes, prev, pager, next, total, jumper"
          :total="page.total"
          prev-text="上一页"
          next-text="下一页">
        </el-pagination>
      </div>
      <el-dialog :title="editDialog.title" center :visible.sync ="editDialog.editFormVisible" :before-close="handleEditDialogClose">
          <el-form :model="editForm" :rules="rules" ref="editForm" label-width="120px" class="demo-ruleForm clearfix">
                <el-form-item label="升级标题" prop="title">
                    <el-input v-model="editForm.title"></el-input>
                </el-form-item>
                <el-form-item label="应用类型" prop="category">
                    <el-select v-model="editForm.category" placeholder="请选择应用类型">
                        <el-option
                                v-for="item in cateList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="版本号" prop="versionCode">
                    <el-input v-model="editForm.versionCode"></el-input>
                </el-form-item>
                <el-form-item label="原版本号" prop="originalVersionCode" v-show="editForm.category === 21">
                    <el-input v-model="editForm.originalVersionCode"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="descriptions">
                    <el-input type="textarea" :rows="2" v-model="editForm.descriptions"></el-input>
                </el-form-item>
                <el-form-item label="sha256" prop="sha256">
                    <el-input  v-model="editForm.sha256"></el-input>
                </el-form-item>
                <el-form-item label="md5" prop="md5">
                    <el-input  v-model="editForm.md5"></el-input>
                </el-form-item>
                <el-form-item label="升级包地址" prop="linkUrl">
                    <el-input  v-model="editForm.linkUrl"></el-input>
                </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button v-show="editDialog.type === 'detail'" @click="editDialog.editFormVisible = false">关闭</el-button>
              <el-button v-show="editDialog.type !== 'detail'" @click="editDialog.editFormVisible = false">取消</el-button>
              <el-button v-show="editDialog.type !== 'detail'" type="primary" @click="editSubmit('editForm')">提交</el-button>
          </div>
      </el-dialog>
    </div>
  </section>
</template>
<style lang="scss" scoped>
@import "~@/assets/scss/search.scss";
@import "~@/assets/scss/table.scss";
</style>
<style>
.search-form li label {
    width: 80px;
}
</style>

<script>
export default {
  data () {
    let checkOriginalVCode = (rule, value, callback) => {
      if (this.editForm.category === 21) {
        console.log('bbbb')
        if (!value) {
          return callback(new Error('原版本号不能为空'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      cateList: [{id: 10, name: '应用程序'}, {id: 20, name: '车机系统'}, {id: 21, name: '拆分包'}, {id: 30, name: '车机MCU'}, {id: -10, name: '地图APK'}],
      appCodeList: [{id: -10, name: 'title.navi'}, {id: 10, name: 'com.hazens'}],
      queryForm: {},
      tableData: [],
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      },
      statusTextList: [{id: 0, name: '待发布'}, {id: 1, name: '已发布'}, {id: 2, name: '已结束'}],
      editDialog: {
        title: '',
        editFormVisible: false,
        type: ''// 值为 add or edit or detail
      },
      editForm: {},
      rules: {
        title: [
          { required: true, message: '请输入升级标题', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择升级包类型', trigger: 'blur' }
        ],
        versionCode: [
          { required: true, message: '请输入版本号', trigger: 'blur' }
        ],
        originalVersionCode: [
          { validator: checkOriginalVCode, trigger: 'blur' }
        ],
        descriptions: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ],
        sha256: [
          { required: true, message: '请输入sha256', trigger: 'blur' }
        ],
        linkUrl: [
          { required: true, message: '请上传包文件', trigger: 'blur' }
        ],
        md5: [
          { required: true, message: '请输入md5', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    search () {
      let param = Object.assign(this.queryForm)
      if (param.category === 10) {
        param.appCode = 'com.hazens'
      } else if (param.category === -10) {
        param.appCode = 'title.navi'
        param.category = 10
      } else {
        param.appCode = ''
      }
      param.pageIndex = this.page.currentPage - 1
      param.pageSize = this.page.pageSize
      this.getRpmList(param)
    },
    formatDate (time) {
      return this.$utils.formatDate(time)
    },
    getStatusText (status) {
      let statusObj = this.statusTextList.find((val) => {
        return ((val.id - status) === 0)
      })
      if (statusObj) {
        return statusObj.name
      } else {
        return '未知'
      }
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.search()
    },
    handleSizeChange (val) {
      this.page.pageSize = val
      this.search()
    },
    async getRpmList (params) {
      let adminToken = await this.getAdminToken()
      let headers = {
        Authorization: 'ADMIN ' + adminToken
      }
      let resp = await this.$services.ota.getRpmList(params, headers)
      if (resp.status === 200) {
        let total = resp.result.data.totalRecord
        let tableData = resp.result.data.records
        this.page.total = total
        this.tableData = tableData
      }
    },
    async getAdminToken () {
      let resp = await this.$services.ota.getAdminToken(this.$utils.cloudConfig)
      if (resp.status === 200) {
        return resp.result.data.adminToken
      } else {
        this.$message({
          showClose: true,
          message: '获取adminToken异常,稍后再试',
          type: 'error'
        })
        return ''
      }
    },
    editClick (row) {
      this.editDialog.title = '升级包编辑'
      this.editForm = this.createEditForm(row)
      this.editForm.publishId = row.publishId
      this.editDialog.editFormVisible = true
      this.editDialog.type = 'edit'
    },
    createEditForm (row) {
      let editForm = {
        title: row.title,
        category: row.category,
        versionCode: row.versionCode,
        sha256: row.sha256,
        md5: row.md5,
        linkUrl: row.link
      }
      let desc = ''
      if (row.descriptions instanceof Array) {
        row.descriptions.forEach((val) => {
          desc += val
        })
        editForm.descriptions = desc
      } else {
        editForm.descriptions = row.descriptions
      }

      return editForm
    },
    detailClick (row) {
      this.editDialog.title = '升级包详情'
      this.editForm = this.createEditForm(row)
      this.editDialog.editFormVisible = true
      this.editDialog.type = 'detail'
    },
    addClick () {
      this.editDialog.title = '新增上传升级包'
      this.editForm = {}
      this.editDialog.editFormVisible = true
      this.editDialog.type = 'add'
    },
    uploadSuccess () {},
    handleEditDialogClose () {
      this.editDialog.editFormVisible = false
    },
    finishClick (publishId) {
      this.$confirm('确认结束吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let adminToken = await this.getAdminToken()
        let headers = {
          Authorization: 'ADMIN ' + adminToken
        }
        let resp = await this.$services.ota.finishRpm({publishId: publishId}, headers)
        if (resp.status === 200) {
          this.$message({
            showClose: true,
            message: '结束成功！',
            type: 'success'
          })
        } else {
          this.$message({
            showClose: true,
            message: '结束失败，稍后再试！',
            type: 'error'
          })
        }
        this.search()
      })
    },
    editSubmit (formName) {
      this.$refs.editForm.validate(async (valid) => {
        if (valid) {
          let param = {
            title: this.editForm.title,
            versionCode: this.editForm.versionCode,
            sha256: this.editForm.sha256,
            link: this.editForm.linkUrl,
            category: this.editForm.category,
            md5: this.editForm.md5
          }
          let descriptions = this.editForm.descriptions
          let descArray = descriptions.replace(';', '；').split('；')
          if (descArray[descArray.length - 1] === '') {
            descArray.pop()
          }
          for (let i = 0; i < descArray.length; i++) {
            descArray[i] = descArray[i] + '；'
          }
          param.descriptions = descArray
          let category = this.editForm.category
          if (category !== 21) {
            param.originalVersionCode = 1
          }
          let adminToken = await this.getAdminToken()
          let headers = {
            Authorization: 'ADMIN ' + adminToken
          }

          if (this.editDialog.type === 'edit') {
            // 编辑
            param.publishId = this.editForm.publishId
            let resp = await this.$services.ota.updateRpm(param, headers)
            console.log(resp)
          } else if (this.editDialog.type === 'add') {
            // 新增
            if (category === 10 || category === -10) {
              let appcodeInfo = this.appCodeList.find((val) => {
                return val.id === category
              })
              param.appCode = appcodeInfo.name
            }
            param.size = 467

            let resp = this.$services.ota.addRpm(param, headers)
            console.log(resp)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  mounted () {
    this.search()
  }
}
</script>
