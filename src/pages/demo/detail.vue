<template>
  <section class="container">
    <div class="bread">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">设计家</el-breadcrumb-item>
        <el-breadcrumb-item>论坛管理</el-breadcrumb-item>
        <el-breadcrumb-item>版块管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <ul class="search-form clearfix" style="padding: 0">
      </ul>
      <div class="table-content1 clearfix">
        <div class="table-title clearfix">
          <p>
            {{$route.params.id?'编辑版块':'添加版块'}}
          </p>
        </div>
        <el-form :model="category" :rules="rules" ref="categoryForm" label-width="120px" class="demo-ruleForm clearfix">
          <el-form-item label="版块名称" prop="name">
            <el-input v-model="category.name"></el-input>
          </el-form-item>
          <el-form-item label="简介" prop="description">
            <el-input type="textarea" :rows="2" v-model="category.description"></el-input>
          </el-form-item>
          <!--<el-form-item label="顶级版块" prop="parent_cid">-->
            <!--<el-select v-model="category.parent_cid" placeholder="请选择顶级版块">-->
              <!--<el-option label="请选择顶级版块" :value="0"></el-option>-->
              <!--<el-option v-for="(_category, index) in categories" :key="index" :label="_category.name"-->
                         <!--:value="_category.cid"></el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <el-form-item label="背景颜色" prop="bg_color">
            <el-color-picker v-model="category.bg_color" show-alpha></el-color-picker>
          </el-form-item>
          <el-form-item label="文字颜色" prop="color">
            <el-color-picker v-model="category.color"></el-color-picker>
          </el-form-item>
          <el-form-item label="自定义class" prop="class">
            <el-input type="text"></el-input>
          </el-form-item>
          <el-form-item label="版块图片" prop="color">
            <el-upload class="image-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              list-type="picture-card" :on-success="uploadSuccess" :show-file-list="false" :limit="1">
              <!-- <img class="image-upload"> -->
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="版块图片大小" prop="image_size">
            <el-select v-model="category.image_size" placeholder="请选择版块图片大小">
              <el-option value="auto"></el-option>
              <el-option value="cover"></el-option>
              <el-option value="contain"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="版块页标题图片" prop="color">
            <el-upload class="image-uploader2"
              action="https://jsonplaceholder.typicode.com/posts/"
              list-type="picture-card" :on-success="uploadSuccess2" :show-file-list="false" :limit="1">
              <img v-if="category.background_image" :src="category.background_image" class="image-upload">
              <i  v-else="" class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="外部链接" prop="link">
            <el-input type="text" v-model="category.link"></el-input>
          </el-form-item>
          <el-form-item label="是否禁用">
            <el-switch on-text="" off-text="" v-model="category.disabled"></el-switch>
          </el-form-item>
          <el-form-item label="排序" prop="order">
            <el-tooltip content="数值越小排序越靠前" placement="right">
              <el-input type="text" v-model="category.order"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="版块公告" prop="content">
            <el-input type="textarea" :rows="6"  v-model="category.content"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('categoryForm')">保存</el-button>
            <el-button @click="resetForm('categoryForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  head () {
    return {
      title: `版块详情`
    }
  },
  data () {
    return {
      category: {},
      rules: {
        name: [
          {required: true, message: '请输入版块名称', trigger: 'blur'},
          {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    showChildren (cid) {
      let _this = this
      _this.categories.forEach(category => {
        if (category.cid === cid) {
          category.children.filter(child => {
            child.parent_name = category.name
            return child
          })
          _this.setChildren(category.children)
          _this.setCategory(category)
        }
      })
    },
    uploadSuccess (res) {
      this.category.image = res.url
    },
    uploadSuccess2 (res) {
      this.category.background_image = res.url
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  },
  created () {
  }
}
</script>
<style >
  .image-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .image-uploader .image-upload {
    width: 145px;
    height: 145px;
    display: block;
  }
  .image-uploader .el-upload:hover {
    border-color: #409EFF;
  }
   .image-uploader2 .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 840px;
  }
  .image-uploader2 .el-upload--picture-card {
    width: 848px;
  }
  .image-uploader2 .el-upload:hover {
    border-color: #409EFF;
  }
 .image-uploader2 .image-upload {
    width: 844px;
    height: 145px;
    display: block;
  }

  .title {
    margin: 50px 0;
  }

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .search-form {
    background: #EEF1F6;
    margin-bottom: 30px;
    padding: 20px 0 0 20px;
  }

  .search-form li {
    float: left;
    list-style: none;
    margin-bottom: 20px;
    margin-right: 20px;
  }

  .search-form li label {
    float: left;
    line-height: 40px;
    text-align: right;
    /*width: 80px;*/
    margin-right: 16px;
  }

  .search-form li .input {
    float: left;
  }

  .search-form li .input .el-input {
    width: 204px;
  }

  .table-content1 {
    width: 40%;
  }

  .table-content1 .table-title {
    height: 40px;
    margin-bottom: 20px;
  }

  .table-content1 .table-title p {
    float: left;
    margin: 0;
    height: 40px;
    line-height: 40px;
  }

  .table-content1 .table-title .add-btn {
    float: right;
    margin-left: 20px;
  }

  .table-content1 .line {
    text-align: center;
  }
</style>
