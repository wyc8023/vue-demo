<template>
    <div>
        <el-form :inline="true" :model="filters">
              <div class="content">
        <ul class="search-form1 clearfix">
        <li class="clearfix">
          <label>关键字</label>
          <div class="input">
            <el-input v-model="filters.queryName" clearable placeholder="请输入经销商名称、联系人、手机号" ></el-input>
          </div>
        </li>
            <li class="clearfix">
          <label>经销商级别</label>
          <div class="input">
          <el-radio-group v-model="filters.dealerLevel">
                                    <el-radio-button label=null>全部</el-radio-button>
                                    <el-radio-button label="1">A</el-radio-button>
                                    <el-radio-button label="2">B</el-radio-button>
                                    <el-radio-button label="3">C</el-radio-button>
                                </el-radio-group>
          </div>
        </li>
          <li class="clearfix">
          <label>经销商状态</label>
          <div class="input">
            <el-radio-group v-model="filters.dealerStatus">
                                    <el-radio-button label=null>全部</el-radio-button>
                                    <el-radio-button label="0">注销</el-radio-button>
                                    <el-radio-button label="1">在网</el-radio-button>
                                </el-radio-group>
          </div>
        </li>
            <li class="clearfix">
          <label>经销商类型</label>
          <div class="input">
           <el-radio-group v-model="filters.dealerType">
                                    <el-radio-button label=null>全部</el-radio-button>
                                    <el-radio-button :label="1">经销商</el-radio-button>
                                    <el-radio-button :label="2">服务站</el-radio-button>
                                </el-radio-group>
          </div>
        </li>

     <li class="clearfix">
          <el-button type="primary" v-on:click="handleSearch" icon="el-icon-search">查询</el-button>
                        <el-button type="primary" v-on:click="showUploadDialog" icon="el-icon-upload2">上传</el-button>
                        <el-button type="primary" v-on:click="addDealerDialog" icon="el-icon-plus" >新增</el-button>
                        <el-button type="primary" v-on:click="exportDealer" icon="el-icon-download" >导出经销商</el-button>
                        <el-button type="primary" v-on:click="exportInvitation"  icon="el-icon-download"> 导出邀请函</el-button>
        </li>
        </ul>
              </div>
                </el-form>
            <!--列表-->
            <el-table  v-loading="loading"
             element-loading-text="拼命加载中"
            :data="dealerList"
                border
            style="width: 100%" >
                <!--v-loading="loading" element-loading-text="拼命加载中""-->
                <!-- <el-table-column type="selection" width="55"></el-table-column> -->

                <el-table-column   type="index" width="60"  label="序号"></el-table-column>
                <el-table-column  prop="dealerName" label="经销商名称"  ></el-table-column>
                <el-table-column prop="dealerType" label="经销商类型"  :formatter="typeFormat" ></el-table-column>
                <el-table-column prop="dealerLevel" label="经销商级别"  :formatter="levelFormat" ></el-table-column>
                <el-table-column prop="dealerStatus" label="经销商状态" :formatter="statusFormat" ></el-table-column>
                <el-table-column prop="contacts" label="联系人"  ></el-table-column>
                <el-table-column   label="操作" >

                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
                        <!--  <el-button type="danger" @click="delCompany(scope.$index,scope.row)" size="small">删除</el-button> -->
                        <el-button size="small" type="text" @click="showDetailDialog(scope.row)">详情</el-button>
                        <el-button size="small" v-if="!scope.row.hasInvitation" @click="showInvitationDialog(scope.row)" type="text">添加邀请函</el-button>
                        <el-button size="small" v-if="scope.row.hasInvitation" @click="editInvitationDialog(scope.row)" type="text">编辑邀请函</el-button>
                    </template>
                </el-table-column>
            </el-table>
             <div class="page">
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.currentPage"
                :page-sizes="page.pageSize"
                :page-size="page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="page.total">
        </el-pagination>
    </div>

     <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false" width="80%">
                <el-form :model="editForm" label-width="130px" :rules="editFormRules" ref="editForm">
<el-row>
    <el-col :span="8">
                    <el-form-item label="经销商名称" prop="dealerName">
                        <el-input v-model="editForm.dealerName" auto-complete="off"></el-input>
                    </el-form-item>
    </el-col>
    <el-col :span="8">
                    <el-form-item label="经销商全称" prop="fullName">
                        <el-input v-model="editForm.fullName" auto-complete="off"></el-input>
                    </el-form-item>
    </el-col>
                    <el-col :span="8">
                    <el-form-item label="公司简称" prop="dealerCompany">
                        <el-input v-model="editForm.dealerCompany" auto-complete="off"></el-input>
                    </el-form-item>
        </el-col>
</el-row>

<el-row>
    <el-col :span="8">
                   <el-form-item label="经销商代码" prop="dealerCode">
                        <el-input v-model="editForm.dealerCode" auto-complete="off"></el-input>
                    </el-form-item>
    </el-col>
    <el-col :span="8">
                    <el-form-item label="父级经销商代码" prop="pDealerCode">
                        <el-input v-model="editForm.pDealerCode" auto-complete="off"></el-input>
                    </el-form-item>
    </el-col>
</el-row>
<el-row>
    <el-col :span="8">
                    <el-form-item label="经销商类型" prop="dealerType">
                        <el-radio-group v-model.number="editForm.dealerType">
                            <el-radio-button :label=1>经销商</el-radio-button>
                            <el-radio-button :label=2>服务站</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
       </el-col>
        <el-col :span="8">
                    <el-form-item label="经销商级别" prop="dealerLevel">
                        <el-radio-group v-model.number="editForm.dealerLevel">
                            <el-radio-button label=1>A</el-radio-button>
                            <el-radio-button label=2>B</el-radio-button>
                            <el-radio-button label=3>C</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
        </el-col>
         <el-col :span="8">
                          <el-form-item label="经销商状态" prop="dealerStatus">
                        <el-radio-group v-model.number="editForm.dealerStatus">
                            <el-radio-button label=0>注销</el-radio-button>
                            <el-radio-button label=1>在网</el-radio-button>
                        </el-radio-group>

                    </el-form-item>
 </el-col>
</el-row>
<el-row>
    <el-col :span="8">
                     <el-form-item label="是否允许订车" prop="isVhOrder">
                        <el-radio-group v-model.number="editForm.isVhOrder">
                            <el-radio-button label=0>否</el-radio-button>
                            <el-radio-button label=1>是</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
    </el-col>
     <el-col :span="8">
                    <el-form-item label="是否允许索赔" prop="isWrOrder">
                        <el-radio-group v-model.number="editForm.isWrOrder">
                            <el-radio-button label=0>否</el-radio-button>
                            <el-radio-button label=1>是</el-radio-button>
                        </el-radio-group>

                    </el-form-item>
      </el-col>
                     <el-col :span="8">
                    <el-form-item label="是否允许试驾" isOpenTestdrive>
                        <el-radio-group v-model.number="editForm.isOpenTestdrive">
                            <el-radio-button label=0>否</el-radio-button>
                            <el-radio-button label=1>是</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                     </el-col>
       </el-row>
       <el-row>
    <el-col :span="8">
                    <el-form-item label="省份" prop="provinceId">
                        <!-- <el-input v-model="editForm.provinceId" auto-complete="off"></el-input> -->
                        <el-select v-model="editForm.provinceId" placeholder="" @change="provinceIdChange">
                            <el-option v-for="item in provinceIdList" :key="item.areaId" :label="item.areaName" :value="item.areaId">
                            </el-option>
                        </el-select>
                    </el-form-item>
   </el-col>
      <el-col :span="8">
              <el-form-item label="城市" prop="cityId">
                        <!--    <el-input v-model="editForm.cityId" auto-complete="off"></el-input> -->
                        <el-select v-model="editForm.cityId" placeholder="请优先选择省份" @change="cityIdChange">
                            <el-option v-for="item in cityIdList" :key="item.areaId" :label="item.areaName" :value="item.areaId">
                            </el-option>
                        </el-select>
                    </el-form-item>
   </el-col>
      <el-col :span="8">
                    <el-form-item label="区" prop="areaId">
                        <!--  <el-input v-model="editForm.areaId" auto-complete="off"></el-input> -->
                        <el-select v-model="editForm.areaId" placeholder="请优先选择城市" @change="areaIdChange">
                            <el-option v-for="item in areaIdList" :key="item.areaId" :label="item.areaName" :value="item.areaId">
                            </el-option>
                        </el-select>
                    </el-form-item>
   </el-col>
</el-row>

<el-row>
   <el-col :span="8">
                    <el-form-item label="联系地址" prop="linkAddr">
                        <el-input v-model="editForm.linkAddr" auto-complete="off"></el-input>
                        <!-- <el-button type="primary" >查询</el-button> -->
                    </el-form-item>
   </el-col>
      <el-col :span="8">
             <el-form-item label="纬度坐标" prop="latitude">
                        <el-input v-model="editForm.latitude" auto-complete="off"></el-input>
                    </el-form-item>
   </el-col>
      <el-col :span="8">
                    <el-form-item label="经度坐标" prop="longitude">
                        <el-input v-model="editForm.longitude" auto-complete="off"></el-input>
                    </el-form-item>
   </el-col>
</el-row>

      <el-row>
      <el-col :span="8">
                    <el-form-item label="联系人手机号" prop="linkPhone">
                        <el-input v-model="editForm.linkPhone" auto-complete="off"></el-input>
                    </el-form-item>
       </el-col>
      <el-col :span="8">
               <el-form-item label="联系电话" prop="linkMobile">
                        <el-input v-model="editForm.linkMobile" auto-complete="off"></el-input>
                    </el-form-item>
       </el-col>
      <el-col :span="8">
                   <el-form-item label="联系人" prop="contacts">
                        <el-input v-model="editForm.contacts" auto-complete="off"></el-input>
                    </el-form-item>
        </el-col>
         </el-row>

            <el-row>
        <el-col :span="8">
                      <el-form-item label="邮政编码" prop="zipCode">
                        <el-input v-model="editForm.zipCode" auto-complete="off"></el-input>
                    </el-form-item>
    </el-col>
      <el-col :span="8">
              <el-form-item label="传真" prop="faxNo">
                        <el-input v-model="editForm.faxNo" auto-complete="off"></el-input>
                    </el-form-item>
        </el-col>
          <el-col :span="8">
                    <el-form-item label="开户行" prop="accBank">
                        <el-input v-model="editForm.accBank" auto-complete="off"></el-input>
                    </el-form-item>
             </el-col>
               </el-row>
                    <el-row>
    <el-col :span="8">
                     <el-form-item label="账号" prop="accNo">
                        <el-input v-model="editForm.accNo" auto-complete="off"></el-input>
                    </el-form-item>
    </el-col>
       <el-col :span="8">
            <el-form-item label="税号" prop="taxNo">
                        <el-input v-model="editForm.taxNo" auto-complete="off"></el-input>
                     </el-form-item>
         </el-col>

             </el-row>
         <el-row>
                      <el-form-item label="经销商介绍" prop="dealerIntroduce">
                        <el-input  type="textarea"  :rows="3" v-model="editForm.dealerIntroduce" auto-complete="off"></el-input>
                    </el-form-item>
               </el-row>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="editFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="editSubmit">提交</el-button>
                </div>
            </el-dialog>

            <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false" width="80%">
                <el-form :model="addForm" label-width="130px" :rules="editFormRules" ref="addForm">

                  <el-row>
             <el-col :span="8">
                    <el-form-item label="经销商名称" prop="dealerName">
                        <el-input v-model="addForm.dealerName" auto-complete="off"></el-input>
                    </el-form-item>
           </el-col>
             <el-col :span="8">
                    <el-form-item label="经销商全称" prop="fullName">
                        <el-input v-model="addForm.fullName" auto-complete="off"></el-input>
                    </el-form-item>
              </el-col>
                    <el-col :span="8">
                    <el-form-item label="公司简称" prop="dealerCompany">
                        <el-input v-model="addForm.dealerCompany" auto-complete="off"></el-input>
                    </el-form-item>
          </el-col>
          </el-row>

         <el-row>
          <el-col :span="8">
                   <el-form-item label="经销商代码" prop="dealerCode">
                        <el-input v-model="addForm.dealerCode" auto-complete="off"></el-input>
                    </el-form-item>
         </el-col>
         <el-col :span="8">
                    <el-form-item label="父级经销商代码" prop="pDealerCode">
                        <el-input v-model="addForm.pDealerCode" auto-complete="off"></el-input>
                    </el-form-item>
        </el-col>
          </el-row>
        <el-row>
          <el-col :span="8">
                    <el-form-item label="经销商类型" prop="dealerType">
                        <el-radio-group v-model.number="addForm.dealerType">
                            <el-radio-button :label=1>经销商</el-radio-button>
                            <el-radio-button :label=2>服务站</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
           </el-col>
          <el-col :span="8">
                    <el-form-item label="经销商级别" prop="dealerLevel">
                        <el-radio-group v-model.number="addForm.dealerLevel">
                            <el-radio-button label=1>A</el-radio-button>
                            <el-radio-button label=2>B</el-radio-button>
                            <el-radio-button label=3>C</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
          </el-col>
         <el-col :span="8">
                          <el-form-item label="经销商状态" prop="dealerStatus">
                        <el-radio-group v-model.number="addForm.dealerStatus">
                            <el-radio-button label=0>注销</el-radio-button>
                            <el-radio-button label=1>在网</el-radio-button>
                        </el-radio-group>

                    </el-form-item>
              </el-col>
             </el-row>
        <el-row>
            <el-col :span="8">
                     <el-form-item label="是否允许订车" prop="isVhOrder">
                        <el-radio-group v-model.number="addForm.isVhOrder">
                            <el-radio-button label=0>否</el-radio-button>
                            <el-radio-button label=1>是</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
            </el-col>
             <el-col :span="8">
                    <el-form-item label="是否允许索赔" prop="isWrOrder">
                        <el-radio-group v-model.number="addForm.isWrOrder">
                            <el-radio-button label=0>否</el-radio-button>
                            <el-radio-button label=1>是</el-radio-button>
                        </el-radio-group>

                    </el-form-item>
               </el-col>
                     <el-col :span="8">
                    <el-form-item label="是否允许试驾" isOpenTestdrive>
                        <el-radio-group v-model.number="addForm.isOpenTestdrive">
                            <el-radio-button label=0>否</el-radio-button>
                            <el-radio-button label=1>是</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                     </el-col>
             </el-row>
             <el-row>
       <el-col :span="8">
                    <el-form-item label="省份" prop="provinceId">
                        <!-- <el-input v-model="editForm.provinceId" auto-complete="off"></el-input> -->
                        <el-select v-model="addForm.provinceId" placeholder="" @change="provinceIdChange">
                            <el-option v-for="item in provinceIdList" :key="item.areaId" :label="item.areaName" :value="item.areaId">
                            </el-option>
                        </el-select>
                    </el-form-item>
         </el-col>
          <el-col :span="8">
              <el-form-item label="城市" prop="cityId">
                        <!--    <el-input v-model="editForm.cityId" auto-complete="off"></el-input> -->
                        <el-select v-model="addForm.cityId" placeholder="请优先选择省份" @change="cityIdChange">
                            <el-option v-for="item in cityIdList" :key="item.areaId" :label="item.areaName" :value="item.areaId">
                            </el-option>
                        </el-select>
                    </el-form-item>
               </el-col>
          <el-col :span="8">
                    <el-form-item label="区" prop="areaId">
                        <!--  <el-input v-model="editForm.areaId" auto-complete="off"></el-input> -->
                        <el-select v-model="addForm.areaId" placeholder="请优先选择城市" @change="areaIdChange">
                            <el-option v-for="item in areaIdList" :key="item.areaId" :label="item.areaName" :value="item.areaId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
             </el-row>

          <el-row>
           <el-col :span="8">
                    <el-form-item label="联系地址" prop="linkAddr">
                        <el-input v-model="addForm.linkAddr" auto-complete="off"></el-input>
                        <!-- <el-button type="primary" >查询</el-button> -->
                    </el-form-item>
             </el-col>
              <el-col :span="8">
             <el-form-item label="纬度坐标" prop="latitude">
                        <el-input v-model="addForm.latitude" auto-complete="off"></el-input>
                    </el-form-item>
              </el-col>
                <el-col :span="8">
                    <el-form-item label="经度坐标" prop="longitude">
                        <el-input v-model="addForm.longitude" auto-complete="off"></el-input>
                    </el-form-item>
                  </el-col>
         </el-row>

     <el-row>
   <el-col :span="8">
                    <el-form-item label="联系人手机号" prop="linkPhone">
                        <el-input v-model="addForm.linkPhone" auto-complete="off"></el-input>
                    </el-form-item>
         </el-col>
       <el-col :span="8">
               <el-form-item label="联系电话" prop="linkMobile">
                        <el-input v-model="addForm.linkMobile" auto-complete="off"></el-input>
                    </el-form-item>
        </el-col>
       <el-col :span="8">
                   <el-form-item label="联系人" prop="contacts">
                        <el-input v-model="addForm.contacts" auto-complete="off"></el-input>
                    </el-form-item>
         </el-col>
       </el-row>

           <el-row>
            <el-col :span="8">
                      <el-form-item label="邮政编码" prop="zipCode">
                        <el-input v-model="addForm.zipCode" auto-complete="off"></el-input>
                    </el-form-item>
           </el-col>
             <el-col :span="8">
              <el-form-item label="传真" prop="faxNo">
                        <el-input v-model="addForm.faxNo" auto-complete="off"></el-input>
                    </el-form-item>
             </el-col>
                 <el-col :span="8">
                    <el-form-item label="开户行" prop="accBank">
                        <el-input v-model="addForm.accBank" auto-complete="off"></el-input>
                    </el-form-item>
                 </el-col>
             </el-row>

               <el-row>
                   <el-col :span="8">
                     <el-form-item label="账号" prop="accNo">
                        <el-input v-model="addForm.accNo" auto-complete="off"></el-input>
                    </el-form-item>
                   </el-col>
                   <el-col :span="8">
            <el-form-item label="税号" prop="taxNo">
                        <el-input v-model="addForm.taxNo" auto-complete="off"></el-input>
                    </el-form-item>
                  </el-col>
               </el-row>
              <el-row>
                      <el-form-item label="经销商介绍" prop="dealerIntroduce">
                        <el-input  type="textarea"  :rows="3" v-model="addForm.dealerIntroduce" auto-complete="off"></el-input>
                    </el-form-item>
               </el-row>
                </el-form>
              <div slot="footer" class="dialog-footer" >
                    <el-button @click.native="addFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="addSubmit">提交</el-button>
                </div>
            </el-dialog>

            <el-dialog title="经销商详情" :visible.sync="detailtFormVisible" :close-on-click-modal="false" width="90%">
               <div>
            <el-form ref="detailForm" :model="detailForm" label-width="120px">
                 <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span class="title">基本信息</span>
                    </div>
                    <div  class="text item">
                        <el-row>
                            <el-col :span="8">
                                经销商名称:{{detailForm.dealerName}}
                            </el-col>
                            <el-col :span="8">
                                经销商全称:{{detailForm.fullName}}
                            </el-col>
                            <el-col :span="8">
                                经销商简称:{{detailForm.dealerCompany}}
                            </el-col>
                        </el-row>
                    </div>
                    <div  class="text item">
                        <el-row>
                            <el-col :span="8">
                                经销商类型:{{typeFormat(detailForm,0)}}
                            </el-col>
                            <el-col :span="8">
                                经销商代码: {{detailForm.dealerCode}}
                            </el-col>
                            <el-col :span="8">
                                父级经销商代码: {{detailForm.pDealerCode}}
                            </el-col>
                        </el-row>
                    </div>
                    <div  class="text item">
                        <el-row>
                            <el-col :span="8">
                               经销商级别: {{levelFormat(detailForm,0)}}
                            </el-col>
                            <el-col :span="8">
                                经销商状态:{{statusFormat(detailForm,0)}}
                            </el-col>
                            <el-col :span="8">
                                是否允许订车: {{ifFormat(detailForm.isVhOrder)}}
                            </el-col>
                        </el-row>
                    </div>
                    <div  class="text item">
                        <el-row>
                            <el-col :span="8">
                               是否允许索赔: {{ifFormat(detailForm.isWrOrder)}}
                            </el-col>
                            <el-col :span="8">
                                是否允许试驾: {{ifFormat(detailForm.isOpenTestdrive)}}
                            </el-col>
                        </el-row>
                    </div>
                </el-card>

                <!--联系信息-->
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span class="title">联系信息</span>
                    </div>
                    <div  class="text item">
                        <el-row>
                            <el-col :span="8">
                               省份: {{detailForm.provinceName}}
                            </el-col>
                            <el-col :span="8">
                               城市: {{detailForm.cityName}}
                            </el-col>
                            <el-col :span="8">
                                区: {{detailForm.areaName}}
                            </el-col>
                        </el-row>
                    </div>
                             <div  class="text item">
                        <el-row>
                                 <el-col :span="8">
                              邮政编码:{{detailForm.zipCode}}
                            </el-col>
                            <el-col :span="8">
                               经度坐标:{{detailForm.longitude}}
                            </el-col>
                            <el-col :span="8">
                               纬度地址:{{detailForm.latitude}}
                            </el-col>
                        </el-row>
                    </div>
                             <div  class="text item">
                        <el-row>
                            <el-col :span="8">
                               联系人手机号: {{detailForm.linkPhone}}
                            </el-col>
                            <el-col :span="8">
                               联系电话:{{detailForm.linkMobile}}
                            </el-col>
                            <el-col :span="8">
                               联系人:{{detailForm.contacts}}
                            </el-col>
                        </el-row>
                    </div>
                              <div  class="text item">
                        <el-row>

                            <el-col :span="8">
                               传真: {{detailForm.faxNo}}
                            </el-col>
                             <el-col :span="16">
                             联系地址:{{detailForm.linkAddr}}
                            </el-col>
                        </el-row>
                    </div>
                </el-card>

                <!--账户信息-->
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span class="title">账户信息</span>
                    </div>
                    <div  class="text item">
                        <el-row>
                            <el-col :span="8">
                                开户行:{{detailForm.accBank}}
                            </el-col>
                            <el-col :span="8" >
                               账号:{{detailForm.accNo}}
                            </el-col>
                             <el-col :span="8" >
                              <p>税号:{{detailForm.taxNo}} </p>
                            </el-col>
                        </el-row>
                    </div>

                </el-card>

                 <!--经销商介绍-->
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span class="title">经销商介绍</span>
                    </div>
                    <div  class="text item">
                        <el-row>
                            <el-col :aria-rowspan="3">
                               {{detailForm.dealerIntroduce}}
                            </el-col>
                        </el-row>
                    </div>

                </el-card>
            </el-form>
        </div>
            </el-dialog>

            <el-dialog title="导入经销商信息" :visible.sync="uploadFormVisible" :close-on-click-modal="false">
                <el-upload class="upload-demo" ref="upload" action="http://dmis-api.xtev.cn/dms/v1/mis/importDealerExcel" :on-preview="handlePreview" :on-remove="handleRemove" :on-success="handleSuccess" :before-remove="beforeRemove" :file-list="fileList" :with-credentials="true" :on-error="uploadError" :limit="1" accept=".xls" :auto-upload="false">
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传.xls文件，且不超过500kb</div>
                </el-upload>

            </el-dialog>

            <el-dialog :title="InvitationDialog.title" :visible.sync="InvitationDialog.dialogVisible" :before-close="handleInvitationDialogClose" width="80%">
                <el-form :model="invitationForm" label-width="130px" :rules="invitationFormRules" ref="invitationForm">

                    <el-row>
                        <el-col :span="9">
                            <el-form-item label="活动地点" prop="activityArea">
                                <el-input v-model="invitationForm.activityArea" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="9">
                            <el-form-item label="上市时间" prop="listTime">
                                <el-date-picker v-model="invitationForm.listTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="9">
                            <el-form-item label="活动地址经度坐标" prop="">
                                <el-input v-model="invitationForm.activityLongitude" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="9">
                            <el-form-item label="活动地址纬度坐标" prop="processList">
                                <el-input v-model="invitationForm.activityLatitude" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <h1 class="title">添加会议流程时，请严格按照顺序添加</h1>
                    <el-row>
                        <el-col :span="9">
                            <el-form-item label="会议时间" prop="processList">
                                <el-input v-model="invitationForm.processList[0].meetTime" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="9">
                            <el-form-item label="会议内容" prop="processList">
                                <el-input v-model="invitationForm.processList[0].meetContent" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="9">
                            <el-form-item label="会议时间" prop="conferenceProcess">
                                <el-input v-model="invitationForm.processList[1].meetTime" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="9">
                            <el-form-item label="会议内容" prop="conferenceProcess">
                                <el-input v-model="invitationForm.processList[1].meetContent" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="9">
                            <el-form-item label="会议时间" prop="conferenceProcess">
                                <el-input v-model="invitationForm.processList[2].meetTime" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="9">
                            <el-form-item label="会议内容" prop="processList">
                                <el-input v-model="invitationForm.processList[2].meetContent" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="9">
                            <el-form-item label="会议时间" prop="processList">
                                <el-input v-model="invitationForm.processList[3].meetTime" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="9">
                            <el-form-item label="会议内容" prop="processList">
                                <el-input v-model="invitationForm.processList[3].meetContent" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="9">
                            <el-form-item label="会议时间" prop="processList">
                                <el-input v-model="invitationForm.processList[4].meetTime" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="9">
                            <el-form-item label="会议内容" prop="processList">
                                <el-input v-model="invitationForm.processList[4].meetContent" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="9">
                            <el-form-item label="会议时间" prop="processList">
                                <el-input v-model="invitationForm.processList[5].meetTime" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="9">
                            <el-form-item label="会议内容" prop="processList">
                                <el-input v-model="invitationForm.processList[5].meetContent" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="9">
                            <el-form-item label="会议时间" prop="processList">
                                <el-input v-model="invitationForm.processList[6].meetTime" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="9">
                            <el-form-item label="会议内容" prop="processList">
                                <el-input v-model="invitationForm.processList[6].meetContent" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="9">
                            <el-form-item label="会议时间" prop="processList">
                                <el-input v-model="invitationForm.processList[7].meetTime" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="9">
                            <el-form-item label="会议内容" prop="processList">
                                <el-input v-model="invitationForm.processList[7].meetContent" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="9">
                            <el-form-item label="会议时间" prop="processList">
                                <el-input v-model="invitationForm.processList[8].meetTime" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="9">
                            <el-form-item label="会议内容" prop="processList">
                                <el-input v-model="invitationForm.processList[8].meetContent" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="16" v-if="invitationForm.qrCode!=''">
                            <el-form-item label="二维码" prop="">
                                <img style="width: 100px;height: 100px" :src="invitationForm.qrCode">
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="chuan">
                        <el-col :span="16">
                            <el-upload class="upload-demo" ref="upload" action="http://dmis-api.xtev.cn/dms/v1/upload" :on-preview="handlePreview" :on-remove="handleRemove" :on-success="handleInvitationSuccess" :before-remove="beforeRemove" :file-list="fileList" :with-credentials="true" :on-error="uploadError" :limit="1" list-type="picture" accept=".png,.jpg" :auto-upload="false">
                                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                                <div slot="tip" class="el-upload__tip">只能上传jpg、png文件，且不超过500kb</div>
                            </el-upload>
                        </el-col>
                    </el-row>
                    <el-button size="small" @click="submitInvitationDialog" class="save">保存</el-button>
                </el-form>
            </el-dialog>

    </div>
</template>

<script>
export default {
  data () {
    return {
      uploadFormVisible: false,
      fileList: [],
      provinceIdList: [],
      cityIdList: [],
      areaIdList: [],
      filters: {
        queryName: '',
        dealerLevel: null,
        dealerStatus: null,
        dealerType: null
      },
      dealerList: [],
      node: [],
      lazy: true,
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      },
      loading: false,
      sels: [], // 列表选中列
      // 邀请函
      InvitationDialog: {
        title: '制作邀请函',
        dialogVisible: false
      },
      invitationForm: {
        listTime: '',
        activityArea: '',
        processList: [{ meetTime: '', meetContent: '' },
          { meetTime: '', meetContent: '' },
          { meetTime: '', meetContent: '' },
          { meetTime: '', meetContent: '' },
          { meetTime: '', meetContent: '' },
          { meetTime: '', meetContent: '' },
          { meetTime: '', meetContent: '' },
          { meetTime: '', meetContent: '' },
          { meetTime: '', meetContent: '' }
        ],
        qrCode: '',
        dealerCode: '',
        activityLatitude: '',
        activityLongitude: ''
      },
      invitationFormRules: {},

      // 详情相关数据
      detailtFormVisible: false,

      // 地图
      mapFormVisible: false,
      detailForm: {
      },

      // 编辑相关数据
      editFormVisible: false, // 编辑界面是否显示

      editFormRules: {
        dealerName: [
          { required: true, message: '经销商名称', trigger: 'blur' }
        ],
        dealerCode: [
          { required: true, message: '经销商代码', trigger: 'blur' }
        ],
        fullName: [
          { required: true, message: '经销商全称', trigger: 'blur' }
        ],
        dealerCompany: [
          { required: true, message: '经销商简称', trigger: 'blur' }
        ],
        linkAddr: [
          { required: true, message: '联系地址', trigger: 'blur' }
        ],
        longitude: [
          { required: true, message: '经度坐标', trigger: 'blur' }
        ],
        latitude: [
          { required: true, message: '纬度坐标', trigger: 'blur' }
        ],
        /*          linkPhone: [
                                {required: true,  trigger: 'blur',validator: checkPhone}
                            ], */
        contacts: [
          { required: true, message: '联系人', trigger: 'blur' }
        ],
        /*           dealerIntroduce: [
                                {required: true, message: '经销商介绍', trigger: 'blur'}
                            ], */
        dealerType: [
          { required: true, type: 'number', message: '经销商类型', trigger: 'blur' }
        ],
        dealerStatus: [
          { required: true, type: 'number', message: '经销商状态', trigger: 'blur' }
        ],
        isVhOrder: [
          { required: true, type: 'number', message: '是否允许订车', trigger: 'blur' }
        ],
        isWrOrder: [
          { required: true, type: 'number', message: '是否允许索赔', trigger: 'blur' }
        ],
        provinceId: [
          { required: true, message: '省份', trigger: 'blur' }
        ],
        cityId: [
          { required: true, message: '城市', trigger: 'blur' }
        ],
        areaId: [
          { required: true, message: '区', trigger: 'blur' }
        ],
        dealerLevel: [
          { required: true, type: 'number', message: '经销商级别', trigger: 'blur' }
        ],
        pDealerCode: [
          { required: true, message: '父级经销商代码', trigger: 'blur' }
        ]

      },
      editForm: {
        longitude: '',
        latitude: ''
      },

      // 编辑相关数据
      addFormVisible: false, // 编辑界面是否显示
      addForm: {
        longitude: '',
        latitude: ''
      },
      headers: {
        'Content-Type': 'application/json'
      },

      uploadPic: ''

    }
  },
  methods: {
    submitUpload () {
      this.$refs.upload.submit()
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleSuccess (data, file, fileList) {
      this.$alert(data.succsessIntrMsg + '.' +
                data.errorIntrMsg + '.' +
                data.succsessMsg + '.' +
                data.errorMsg + '.'
        , '上传回调', {
        confirmButtonText: '确定',
        callback: action => {
          window.location.reload()
        }
      })
    },

    handleInvitationSuccess (data, file, fileList) {
      this.invitationForm.qrCode = data.data
      this.uploadPic = data.data
    },

    uploadError (data, file, fileList) {
      this.$alert('请检查文档格式，是否为导入经销商的统一模板', '上传回调', {
        confirmButtonText: '确定',
        callback: action => {

        }
      })
    },

    dateFormat: function (row, column) {
      var date = row[column.property]
      if (date === undefined) {
        return ''
      }
      return this.$utils.timestampToTime(date)
    },

    handleCurrentChange (currentPage) {
      this.page.currentPage = currentPage
      console.log(currentPage)
      this.search()
    },
    handleSizeChange (pageSize) {
      this.page.pageSize = pageSize
      console.log(`每页 ${pageSize} 条`)
    },

    levelFormat: function (row, column) {
      return parseInt(row.dealerLevel) === 1 ? 'A' : parseInt(row.dealerLevel) === 2 ? 'B' : parseInt(row.dealerLevel) === 3 ? 'C' : '未知'
    },

    typeFormat: function (row, column) {
      return parseInt(row.dealerType) === 1 ? '经销商' : '服务站'
    },

    statusFormat: function (row, column) {
      return parseInt(row.dealerStatus) === 1 ? '在网' : '注销'
    },

    ifFormat: function (is) {
      return parseInt(is) === 1 ? '是' : '否'
    },

    handleSearch () {
      this.search()
    },
    queryArea (id, type) {
      if (id === '') {
        return
      }
      var _this = this
      this.$services.dms.selectAreaByid({'pid': id}).then((res) => {
        if (res.status === 200) {
          var data = res.result.data
          if (type === 1) {
            _this.provinceIdList = data
          }
          if (type === 2) {
            _this.cityIdList = data
          }
          if (type === 3) {
            _this.areaIdList = data
          }
        } else {
          console.log('请求失败：' + res.status + ',' + res.statusText)
        }
      })
    },
    provinceIdChange: function (provinceId) {
      this.queryArea(provinceId, 2)
      let obj = {}
      if (this.provinceIdList !== '') {
        obj = this.provinceIdList.find((item) => { // this.ruleForm
          return item.areaId === provinceId// 筛选出匹配数据
        })
        if (this.editForm.provinceName !== obj.areaName) {
          this.editForm.cityId = ''
          this.editForm.areaId = ''
          this.areaIdList = ''
        }
        this.editForm.provinceName = obj.areaName
        this.addForm.provinceName = obj.areaName
      }
    },
    cityIdChange: function (cityId) {
      this.queryArea(cityId, 3)
      let obj = {}
      if (this.cityIdList !== '') {
        obj = this.cityIdList.find((item) => { // this.ruleForm
          return item.areaId === cityId// 筛选出匹配数据
        })
        this.editForm.cityName = obj.areaName
        this.addForm.cityName = obj.areaName
      }
    },

    areaIdChange: function (areaId) {
      let obj = {}
      if (this.cityIdList !== '') {
        obj = this.areaIdList.find((item) => { // this.ruleForm
          return item.areaId === areaId// 筛选出匹配数据
        })
        this.editForm.areaName = obj.areaName
        this.addForm.areaName = obj.areaName
      }
    },
    async search () {
      let that = this
      let params = {}
      this.loading = true
      var queryName = that.filters.queryName
      if (queryName !== '') {
        params.queryName = queryName
      }

      var dealerType = that.filters.dealerType
      if (dealerType !== '') {
        params.dealerType = dealerType
      }
      var dealerLevel = that.filters.dealerLevel
      if (dealerLevel !== '') {
        params.dealerLevel = dealerLevel
      }
      var dealerStatus = that.filters.dealerStatus
      if (dealerStatus !== '') {
        params.dealerStatus = dealerStatus
      }
      params.page = that.page.currentPage
      params.perpage = that.page.pageSize

      let response = await this.$services.dms.menuInit(params, this.headers)
      if (response.status === 200) {
        let data = response.result.data
        if (data.resCount === 0) {
          that.$message({
            showClose: true,
            message: '很抱歉，没有查询到您需要的数据',
            type: 'warning'
          })
          that.dealerList = ''
          that.page.total = 0
        } else {
          that.dealerList = data.resList
          that.page.total = data.resCount
        }
      } else {
        this.$message({
          showClose: true,
          message: '查询失败,稍后再试',
          type: 'error'
        })
      }
      this.loading = false
    },
    selsChange: function (sels) {
      this.sels = sels
    },

    // 显示新增界面
    addDealerDialog: function () {
      this.addFormVisible = true
      this.provinceIdList = ''
      this.cityIdList = ''
      this.areaIdList = ''
      this.queryArea(0, 1)
    },

    // 显示导入界面
    showUploadDialog: function () {
      this.uploadFormVisible = true
    },
    // 显示编辑界面
    showEditDialog  (index, row) {
      this.editFormVisible = true
      this.provinceIdList = ''
      this.cityIdList = ''
      this.areaIdList = ''
      var _this = this
      this.$services.dms.getDealerDetail({'dealerId': row.dealerId}).then((res) => {
        if (res.status === 200) {
          var data = res.result.data
          _this.editForm = data
          _this.queryArea(0, 1)
          _this.queryArea(data.provinceId, 2)
          _this.queryArea(data.cityId, 3)
        } else {
          console.log('请求失败：' + res.status + ',' + res.statusText)
        }
      })
    },
    async showDetailDialog (row) {
      this.detailtFormVisible = true
      var _this = this
      let response = await this.$services.dms.getDealerDetail({'dealerId': row.dealerId})
      if (response.status === 200) {
        _this.detailForm = response.result.data
      } else {
        console.log('请求失败：' + response.status + ',' + response.statusText)
      }
    },

    // 添加邀请函
    showInvitationDialog: function (row) {
      this.InvitationDialog.dialogVisible = true
      this.fileList = []
      this.invitationForm.dealerCode = row.dealerCode
    },

    // 编辑邀请函
    async editInvitationDialog (row) {
      this.InvitationDialog.dialogVisible = true
      this.invitationForm.dealerCode = row.dealerCode
      this.InvitationDialog.title = '编辑邀请函'
      var _this = this
      let response = await this.$services.dms.selectDealerInvitation({'dealerCode': row.dealerCode})
      if (response.status === 200) {
        var invitationDate = response.result.data
        _this.invitationForm.dealerCode = invitationDate.dealerCode
        _this.invitationForm.processList = invitationDate.processList
        _this.invitationForm.listTime = this.$utils.timestampToTime(invitationDate.marketTime)
        _this.invitationForm.activityArea = invitationDate.activityArea
        _this.invitationForm.qrCode = invitationDate.qrcode
        _this.uploadPic = invitationDate.qrcode
        _this.invitationForm.activityLongitude = invitationDate.activityLongitude
        _this.invitationForm.activityLatitude = invitationDate.activityLatitude
      } else {
        console.log('请求失败：' + response.status + ',' + response.statusText)
      }
    },
    // 编辑邀请函
    submitInvitationDialog () {
      let that = this
      this.$refs.invitationForm.validate((valid) => {
        if (valid) {
          let para = Object.assign({}, this.invitationForm)
          para.qrCode = that.uploadPic
          this.$services.dms.addOrUpdateDealerInvitation(para, this.headers).then((res) => {
            if (res.status === 200) {
              that.$message({
                showClose: true,
                message: '编辑成功',
                type: 'success'
              })
              this.handleInvitationDialogClose()
              this.search()
            } else {
              that.$message({
                showClose: true,
                message: '编辑失败,稍后再试',
                type: 'error'
              })
            }
          })
        }
      })
    },

    // 新增
    addSubmit () {
      let that = this
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.loading = true
          let para = Object.assign({}, this.addForm)
          this.$services.dms.addDealerMisdetail(para, this.headers).then((res) => {
            if (res.status === 200) {
              that.$message({
                showClose: true,
                message: '新增成功',
                type: 'success'
              })
              that.addFormVisible = false
              this.search()
            } else {
              that.$message({
                showClose: true,
                message: '新增失败,稍后再试',
                type: 'error'
              })
            }
          })
        }
      })
    },
    // 编辑
    editSubmit: function () {
      let that = this
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.loading = true
          let para = Object.assign({}, this.editForm)
          this.$services.dms.editDealerMisdetail(para, this.headers).then((res) => {
            if (res.status === 200) {
              that.$message({
                showClose: true,
                message: '更新成功',
                type: 'success'
              })
              that.editFormVisible = false
              this.search()
            } else {
              console.log(res)
              that.$message({
                showClose: true,
                message: '更新失败,稍后再试',
                type: 'error'
              })
            }
          })
        }
      })
    },
    handleInvitationDialogClose: function () {
      this.InvitationDialog.dialogVisible = false
      this.invitationForm.listTime = ''
      this.invitationForm.activityArea = ''
      this.invitationForm.qrCode = ''
      this.invitationForm.dealerCode = ''
      this.invitationForm.activityLongitude = ''
      this.invitationForm.activityLatitude = ''
      this.uploadPic = ''
      var myArray = []
      for (var i = 0; i < 9; i++) {
        myArray.push({ meetTime: '', meetContent: '' })
      }
      this.invitationForm.processList = myArray
    },

    exportDealer () {
      let that = this
      let params = new URLSearchParams()
      var queryName = that.filters.queryName
      if (queryName !== '' && queryName != null) {
        params.append('queryName', queryName)
      }
      var dealerType = that.filters.dealerType
      if (dealerType !== '' && dealerType != null) {
        params.append('dealerType', dealerType)
      }
      var dealerLevel = that.filters.dealerLevel
      if (dealerLevel !== '' && dealerLevel != null) {
        params.append('dealerLevel', dealerLevel)
      }
      var dealerStatus = that.filters.dealerStatus
      if (dealerStatus !== '' && dealerStatus != null) {
        params.append('dealerStatus', dealerStatus)
      }
      window.location.href = 'http://dmis-api.xtev.cn/dms/v1/mis/exportDealer?' + params
    },
    exportInvitation () {
      window.location.href = 'http://dmis-api.xtev.cn/dms/v1/mis/exportInvitation'
    }
  },
  components: {

  },
  mounted () {
    this.search()
  }
}
</script>

<style>
.title{
    padding-bottom:2%;
    font-size:16px;
}
.save{
    margin: 0 auto;
    width:100px;
    text-align: center;
    display: flex;
    justify-content: center;
    margin-top: 3%;
}
.chuan{
margin: 0 auto;
display: flex;
 justify-content: center;
}

.select_muli_hidden{
  overflow: hidden;
text-overflow:ellipsis;
white-space: nowrap;
}
.search-form1 {
    background: #EEF1F6;
    margin-bottom: 30px;
    padding: 20px 0 0 20px;
    border-radius: 3px;
    font-size: 14px;
  }
  .search-form1 li {
    float: left;
    list-style: none;
    margin-bottom: 20px;
    margin-right: 20px;
  }
  .search-form1 li label {
    float: left;
    line-height: 40px;
    text-align: left;
    width: auto;
    margin-right: 0;
  }
  .search-form1 li .input {
    float: left;
    margin-left: 28px
  }
  .search-form1 li .input .el-input {
    width: 300px;
  }
  .dialog-footer {
   text-align: center
  }
   .text {
        font-size: 14px;
    }
.title{
    font-size: 14px;
    font-weight:bold;
}

.item {
    margin-bottom: 18px;
}
.box-card{
    margin-top: 5px;
}
.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}
.clearfix:after {
    clear: both
}
</style>
