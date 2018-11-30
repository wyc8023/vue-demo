<template>
    <section>
        <div class="bread">
            <el-breadcrumb separator="/">
            <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
            <el-breadcrumb-item >公司管理</el-breadcrumb-item>
            <el-breadcrumb-item >公司列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="content">
            <ul class="search-form clearfix">
                <li class="clearfix">
                    <label>公司名称</label>
                    <div class="input">
                        <el-input v-model="filters.name" placeholder="公司名称" ></el-input>
                    </div>
                </li>
                <li class="clearfix" style="margin-left: 20px;">
                    <el-button class="search" size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                    <el-button class="search" size="small" type="primary" icon="el-icon-plus" @click="showAddDialog">新增</el-button>
                </li>
            </ul>
            <div class="table-content">
                <div class="table-title clearfix">
                    <div class="add-btn">
                        <el-button type="primary" size="small" @click="batchDeleteBook" >批量删除</el-button>
                    </div>
                </div>
                <!--列表-->
                <el-table :data="companies" border stripe highlight-current-row @selection-change="selsChange" style="width: 100%;">
                    <!--v-loading="loading" element-loading-text="拼命加载中""-->
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column type="index" width="60"></el-table-column>
                    <el-table-column prop="name" label="公司名称" width="150" :formatter="formatCom" ></el-table-column>
                    <el-table-column prop="contact" label="联系人" width="110" ></el-table-column>
                    <el-table-column prop="contactTel" label="联系人座机" width="150" ></el-table-column>
                    <el-table-column prop="contactPhone" label="联系人手机号"  width="150" ></el-table-column>
                    <el-table-column prop="address" label="公司地址"  ></el-table-column>
                    <el-table-column label="操作" width="150">
                        <template slot-scope="scope">
                            <el-button size="small" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
                            <el-button type="danger" @click="delCompany(scope.$index,scope.row)" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="page">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="page.currentPage"
                        :page-size="page.pageSize"
                        layout="total, prev, pager, next, jumper"
                        :page-count="page.total"
                        :total="page.total">
                    </el-pagination>
                </div>
                <el-dialog title="编辑" :visible.sync ="editFormVisible" :close-on-click-modal="false">
                    <el-form :model="editForm" label-width="130px" :rules="editFormRules" ref="editForm">
                        <el-form-item label="公司名称" prop="name">
                            <el-input v-model="editForm.name" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="联系人" prop="contact">
                            <el-input v-model="editForm.contact" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="联系人座机" prop="contactTel">
                            <el-input v-model="editForm.contactTel" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="联系人手机号" prop="contactPhone">
                            <el-input v-model="editForm.contactPhone" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="公司地址" prop="address">
                            <el-input v-model="editForm.address" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="描述" prop="des">
                            <el-input type="textarea" v-model="editForm.des" :rows="8"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer" style="text-align: center;">
                        <el-button @click.native="editFormVisible = false">取消</el-button>
                        <el-button type="primary" @click.native="editSubmit">提交</el-button>
                    </div>
                </el-dialog>
                <!--新增界面-->
                <el-dialog title="新增" :visible.sync ="addFormVisible" :close-on-click-modal="false">
                    <el-form :model="addForm" label-width="130px" :rules="addFormRules" ref="addForm">
                        <el-form-item label="公司名称" prop="name">
                            <el-input v-model="addForm.name" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="联系人" prop="contact">
                            <el-input v-model="addForm.contact" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="联系人座机" prop="contactTel">
                            <el-input v-model="addForm.contactTel" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="联系人手机号" prop="contactPhone">
                            <el-input v-model="addForm.contactPhone" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="公司地址" prop="address">
                            <el-input v-model="addForm.address" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="简介" prop="des">
                            <el-input type="textarea" v-model="addForm.des" :rows="8"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer" style="text-align: center;">
                        <el-button @click.native="addFormVisible = false">取消</el-button>
                        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
                    </div>
                </el-dialog>
            </div>
        </div>
    </section>
</template>
<style lang="scss">
@import "~@/assets/scss/detail.scss";
@import "~@/assets/scss/search.scss";
@import "~@/assets/scss/table.scss";
</style>
<script>
export default {
  data () {
    return {
      filters: {
        name: ''
      },
      companies: [],
      comVO: [],
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      },
      loading: false,
      sels: [], // 列表选中列

      // 编辑相关数据
      editFormVisible: false, // 编辑界面是否显示
      editFormRules: {
        name: [
          {required: true, message: '公司名称', trigger: 'blur'}
        ],
        contact: [
          {required: true, message: '联系人', trigger: 'blur'}
        ],
        address: [
          {required: true, message: '地址', trigger: 'blur'}
        ]
        // status: [
        //     {required: true, message: '公司状态', trigger: 'blur'}
        // ]
      },
      editForm: {
        id: 0,
        name: '',
        contact: '',
        contactTel: '',
        contactPhone: '',
        address: '',
        // status: '',
        des: ''
      },

      // 新增相关数据
      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [
          {required: true, message: '公司名称', trigger: 'blur'}
        ],
        contact: [
          {required: true, message: '联系人', trigger: 'blur'}
        ],
        contactTel: [
          {required: true, message: '座机', trigger: 'blur'}
        ],
        contactPhone: [
          {required: true, message: '手机号', trigger: 'blur'}
        ],
        address: [
          {required: true, message: '员工地址', trigger: 'blur'}
        ]
        // status: [
        //     {required: true, message: '公司状态', trigger: 'blur'}
        // ]
      },
      addForm: {
        name: '',
        contact: '',
        contactTel: '',
        contactPhone: '',
        address: '',
        // status: '',
        des: ''
      }
    }
  },
  methods: {
    formatCom (row) {
      let com = this.comVO
      for (var i = 0; i < com.length; i++) {
        if (row.id === com[i].id) {
          return com[i].name
        }
      }
      return '未知'
    },
    handleCurrentChange (currentPage) {
      this.page.currentPage = currentPage
      this.search()
    },
    handleSizeChange (pageSize) {
      this.page.pageSize = pageSize
    },
    async search () {
      let that = this
      let params = {}
      var name = that.filters.name
      if (name !== '') {
        params.name = name
      }
      let pages = {}
      pages.currentPage = that.page.currentPage
      pages.pageSize = that.page.pageSize
      params.page = pages
      let resp = await this.$services.dmis.getCompanyList(params)
      if (resp.status === 200) {
        let data = resp.result.data
        let total = data.total
        let comList = data.comList
        that.companies = comList
        that.comVO = data.comVO
        that.page.total = total
      } else {
        this.$message({
          showClose: true,
          message: '查询失败,稍后再试',
          type: 'error'
        })
      }
    },
    selsChange: function (sels) {
      this.sels = sels
    },
    delCompany (index, row) {
      let _this = this
      this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
        let param = {}
        param.id = row.id
        _this.$services.dmis.deleteCompany(param).then((resp) => {
          if (resp.status === 200) {
            _this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            })
            _this.search()
          } else {
            _this.$message({
              showClose: true,
              message: '删除失败,稍后再试',
              type: 'error'
            })
          }
        })
      })
    },
    // 显示编辑界面
    showEditDialog: function (index, row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
    },
    editSubmit () {
      let _this = this
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          let param = Object.assign({}, this.editForm)
          _this.$services.dmis.updateCompany(param).then((resp) => {
            if (resp.status === 200) {
              _this.$message({
                showClose: true,
                message: '更新成功',
                type: 'success'
              })
              _this.editFormVisible = false
              _this.search()
            } else {
              _this.$message({
                showClose: true,
                message: '更新失败,稍后再试',
                type: 'error'
              })
            }
          })
        }
      })
    },
    showAddDialog () {
      this.addFormVisible = true
      this.addForm = {
        name: '',
        des: '',
        contact: '',
        contactTel: '',
        contactPhone: '',
        address: ''
        // status: ''
      }
    },
    addSubmit () {
      let _this = this
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          let form = this.addForm
          let param = {}
          param.name = form.name
          param.contact = form.contact
          param.contactTel = form.contactTel
          param.contactPhone = form.contactPhone
          param.address = form.address
          param.des = form.des
          _this.$services.dmis.addCompany(param).then((resp) => {
            if (resp.status === 200) {
              _this.$message({
                showClose: true,
                message: '保存成功',
                type: 'success'
              })
              _this.addFormVisible = false
              _this.search()
            } else {
              _this.$message({
                showClose: true,
                message: '保存失败,稍后再试',
                type: 'error'
              })
            }
          })
        }
      })
    },

    batchDeleteBook () {
      if (this.sels.length === 0) {
        this.$message({
          showClose: true,
          message: '请至少选择一条记录',
          type: 'warning'
        })
        return
      }
      let ids = this.sels.map(item => item.id).toString()
      let param = {}
      param.id = ids
      let _this = this
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        _this.$services.dmis.deleteCompany(param).then((resp) => {
          if (resp.status === 200) {
            _this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            })
            _this.search()
          } else {
            _this.$message({
              showClose: true,
              message: '删除失败,稍后再试',
              type: 'error'
            })
          }
        })
      })
    }
  },
  mounted () {
    this.search()
  }
}
</script>
