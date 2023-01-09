<template>
  <el-card>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="tabsChange">
      <el-tab-pane label="待我处理" name="0"></el-tab-pane>
      <el-tab-pane
        v-if="checkRole(['QGGBZGY', 'FQGGBZGY'])"
        label="我发起的"
        name="1"
      ></el-tab-pane>
      <el-tab-pane label="我已处理" name="2"></el-tab-pane>
      <el-tab-pane label="全部" name="3"></el-tab-pane>
    </el-tabs>
    <el-form ref="forms" :model="form" :inline="true">
      <el-form-item>
        <el-date-picker
          @change="dateChange"
          clearable
          v-model="form.startEnd"
          type="daterange"
          range-separator="至"
          start-placeholder="年/月/日"
          end-placeholder="年/月/日"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="全部状态">
        <el-select
          v-model="form.status"
          placeholder="全部状态"
          clearable
          size="small"
          style="width: 160px"
          multiple
          collapse-tags
        >
          <el-option
            v-for="(item, key) in applySatus"
            :key="item"
            :label="item"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="单位">
        <el-select
          v-model="form.dw"
          placeholder="单位"
          clearable
          size="small"
          style="width: 160px"
        >
          <el-option
            v-for="dict in sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-input
          v-model="form.content"
          style="width: 300px"
          placeholder="姓名/身份证号/申请编号/出国(境)审批编号"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="handlerQuery"
          >查询</el-button
        >
        <el-button type="" size="small" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="userList">
      <el-table-column
        header-align="center"
        align="center"
        prop="bgNo"
        label="申请编号"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="applyNo"
        width="250"
        label="出国（境）审批编号"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="name"
        label="姓名"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="sfzh"
        width="300"
        label="身份证号"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="deptName"
        label="工作单位"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="zw"
        label="职务"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="spmdd"
        width="200"
        label="所到国家(地区)"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        width="300"
        align="center"
        label="起止日期"
      >
        <template #default="scope">
          {{ scope.row.spkssj + "至" + scope.row.spjssj }}
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="cgsy"
        width="200"
        label="出国(境)事由"
      >
      </el-table-column>
      <el-table-column header-align="center" label="状态" align="center">
        <template #default="scope">
          <span>{{ applySatus[scope.row.bgStatus] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="createBy"
        label="提交人"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="createTime"
        label="提交时间"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="操作"
        fixed="right"
        width="300"
      >
        <template #default="scope">
          <el-button
            size="small"
            type="text"
            @click="getAbroads(scope.row.id, 'view')"
            >详情</el-button
          >
          <el-button
            v-if="
              (scope.row.bgStatus === 0 ||
                scope.row.bgStatus === 1 ||
                scope.row.bgStatus === 2 ||
                scope.row.bgStatus === 3) &&
              checkRole(['FGLD', 'DWLD', 'PZJGW']) &&
              activeName === '0'
            "
            size="small"
            type="text"
            @click="getAbroads(scope.row.id, 'edit', scope.row.taskId)"
            >审批</el-button
          >

          <el-button
            v-if="
              scope.row.bgStatus === 0 &&
              checkRole(['FQGGBZGY']) &&
              activeName === '0'
            "
            size="small"
            type="text"
            @click="handleClickInformation(scope.row.id, scope.row.taskId)"
            >确认信息</el-button
          >
          <el-button
            v-if="
              checkRole(['FQGGBZGY']) &&
              (scope.row.bgStatus === 1 ||
                scope.row.bgStatus === 2 ||
                scope.row.bgStatus === 3) &&
              activeName === '3'
            "
            size="small"
            type="text"
            @click="openDia(scope.row.id)"
            >撤销</el-button
          >
          <el-button
            v-if="scope.row.bgStatus == 4 && activeName === '0'"
            type="text"
            size="small"
            @click="exchangeReport(scope.row.taskId, scope.row.id)"
            >更换证照</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      style="margin-right: 20px"
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
    <el-dialog
      :title="upload.title"
      v-model="upload.open"
      width="400px"
      append-to-body
    >
      <el-link
        type="primary"
        :underline="false"
        style="font-size: 12px; vertical-align: baseline"
        @click="importTemplate"
        >下载模板</el-link
      >
      <span>文件后缀名必须为xls或xlsx（即Excel格式），文件大小不得超过10M</span>
      <el-upload
        ref="uploadRef"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="true"
        drag
      >
        <el-icon class="el-icon--upload">
          <upload-filled />
        </el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
      <el-button
        style="margin-top: 12px; margin-left: 12px"
        @click="upload.open = false"
        >取消</el-button
      >
    </el-dialog>
    <el-dialog
      :title="title"
      v-model="dialogVisible"
      width="800px"
      v-if="dialogVisible"
      @close="changeDialog"
    >
      <el-form
        ref="form"
        label-suffix=":"
        label-position="right"
        label-width="160px"
        :model="abroadForm"
      >
        <el-form-item
          label="姓名"
          prop="leaveCountry.name"
          :rules="{
            required: true,
            message: '请输入姓名',
            trigger: ['change', 'blur']
          }"
        >
          <el-select
            class="w-100"
            v-model="abroadForm.leaveCountry.name"
            placeholder="请输入姓名"
            filterable
            remote
            :remote-method="remoteMethod"
            @change="handleChangeName"
          >
            <el-option
              v-for="item in userInfoOptions"
              :key="`${item.id}-${item.name}-${item.sfzh}`"
              :label="`${item.name}-${item.employer}-${item.deptOfficeName}-${item.zw}-${item.sfzh}`"
              :value="`${item.id}-${item.name}-${item.sfzh}`"
            >
            </el-option>
          </el-select>
          <span style="color: red" v-if="abroadForm.leaveCountry.baType != 30"
            >只有已备案人员能够发起出国（境）审批
          </span>
        </el-form-item>
        <el-row gutter="10">
          <el-col :span="12">
            <el-form-item label="性别">
              <el-select
                placeholder=" "
                v-model="abroadForm.leaveCountry.gender"
                disabled
              >
                <el-option
                  v-for="(value, key) in genderEnum"
                  :key="key"
                  :label="value"
                  :value="key"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="民族">
              <el-select
                placeholder=" "
                v-model="abroadForm.leaveCountry.nation"
                disabled
                style="width: 300px"
              >
                <el-option
                  v-for="dict in lajw_ft_nation"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter="10">
          <el-col :span="12">
            <el-form-item label="籍贯" prop="leaveCountry.namenativePlace">
              <el-input
                v-model="abroadForm.leaveCountry.nativePlace"
                disabled
                style="width: 300px"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生年月" prop="leaveCountry.csrq">
              <el-input
                v-model="abroadForm.leaveCountry.csrq"
                disabled
                style="width: 300px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter="10">
          <el-col :span="12">
            <el-form-item
              label="工作时间"
              prop="leaveCountry.cjgzsj"
              :rules="{
                required: true,
                message: '请选择工作时间',
                trigger: ['change', 'blur']
              }"
            >
              <el-date-picker
                v-model="abroadForm.leaveCountry.cjgzsj"
                type="date"
                placeholder="工作时间"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="学历"
              prop="leaveCountry.xl"
              :rules="{
                required: true,
                message: '请输入学历',
                trigger: ['change', 'blur']
              }"
            >
              <el-input
                maxlength="20"
                v-model="abroadForm.leaveCountry.xl"
                placeholder="请输入学历"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter="10">
          <el-col :span="12">
            <el-form-item
              label="党派"
              prop="leaveCountry.dp"
              :rules="{
                required: true,
                message: '请输入党派',
                trigger: ['change', 'blur']
              }"
            >
              <el-input
                maxlength="20"
                placeholder="请输入党派"
                v-model="abroadForm.leaveCountry.dp"
                style="width: 300px"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="同行人员"
              prop="leaveCountry.txry"
              :rules="{
                required: true,
                message: '请输入同行人员',
                trigger: ['change', 'blur']
              }"
            >
              <el-input
                maxlength="50"
                v-model="abroadForm.leaveCountry.txry"
                placeholder="请输入同行人员"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="工作简历"
              prop="leaveCountry.jl"
              :rules="{
                required: true,
                message: '工作简历',
                trigger: ['change', 'blur']
              }"
            >
              <el-input
                maxlength="1000"
                type="textarea"
                v-model="abroadForm.leaveCountry.jl"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display: flex; justify-content: flex-end" gutter="10">
          <el-col :span="4"> 国内直系亲属及主要社会关系 : </el-col>
          <el-col :span="3">
            <el-input
              maxlength="50"
              v-model="abroadForm.gngx.gx"
              placeholder="关系"
            ></el-input>
          </el-col>
          <el-col :span="3">
            <el-input
              maxlength="50"
              v-model="abroadForm.gngx.xm"
              placeholder="姓名"
            ></el-input>
          </el-col>
          <el-col :span="3">
            <el-input
              maxlength="50"
              v-model="abroadForm.gngx.lxfs"
              placeholder="联系方式"
            ></el-input>
          </el-col>
          <el-col :span="3">
            <el-input
              maxlength="50"
              v-model="abroadForm.gngx.zzmm"
              placeholder="政治面貌"
            ></el-input>
          </el-col>
          <el-col :span="3">
            <el-input
              maxlength="50"
              v-model="abroadForm.gngx.gzdw"
              placeholder="工作单位"
            ></el-input>
          </el-col>
          <el-col :span="3">
            <el-input
              maxlength="50"
              v-model="abroadForm.gngx.zw"
              placeholder="职位"
            ></el-input>
          </el-col>
          <el-col :span="2">
            <el-button type="text" @click="addAbroad">新增</el-button>
          </el-col>
        </el-row>
        <el-row
          style="display: flex; justify-content: flex-end; margin-bottom: 10px"
          gutter="10"
          v-for="(item, index) in abroadForm.gngx.ftFamilyarr"
          :key="index"
        >
          <el-col :span="3"> </el-col>
          <el-col :span="3">
            <el-input
              v-model="item.gx"
              placeholder="关系"
              maxlength="50"
            ></el-input>
          </el-col>
          <el-col :span="3">
            <el-input
              v-model="item.xm"
              placeholder="姓名"
              maxlength="50"
            ></el-input>
          </el-col>
          <el-col :span="3">
            <el-input
              v-model="item.lxfs"
              placeholder="联系方式"
              maxlength="50"
            ></el-input>
          </el-col>
          <el-col :span="3">
            <el-input
              v-model="item.zzmm"
              placeholder="政治面貌"
              maxlength="50"
            ></el-input>
          </el-col>
          <el-col :span="3">
            <el-input
              v-model="item.gzdw"
              placeholder="工作单位"
              maxlength="50"
            ></el-input>
          </el-col>
          <el-col :span="3">
            <el-input
              v-model="item.zw"
              placeholder="职务"
              maxlength="50"
            ></el-input>
          </el-col>
          <el-col :span="1">
            <el-button
              type="text"
              style="color: red"
              @click="delGnAbroad(index)"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1">
            <el-button type="text" @click="addAbroad">新增</el-button>
          </el-col>
        </el-row>
        <el-row
          style="display: flex; justify-content: flex-end; margin-top: 10px"
          gutter="10"
        >
          <el-col :span="4"> 国外直系亲属及主要社会关系 : </el-col>
          <el-col :span="3">
            <el-input
              maxlength="50"
              v-model="abroadForm.gwgx.gx"
              placeholder="关系"
            ></el-input>
          </el-col>
          <el-col :span="3">
            <el-input
              maxlength="50"
              v-model="abroadForm.gwgx.xm"
              placeholder="姓名"
            ></el-input>
          </el-col>
          <el-col :span="3">
            <el-input
              maxlength="50"
              v-model="abroadForm.gwgx.lxfs"
              placeholder="联系方式"
            ></el-input>
          </el-col>
          <el-col :span="3">
            <el-input
              maxlength="50"
              v-model="abroadForm.gwgx.zzmm"
              placeholder="政治面貌"
            ></el-input>
          </el-col>
          <el-col :span="3">
            <el-input
              maxlength="50"
              v-model="abroadForm.gwgx.gzdw"
              placeholder="工作单位"
            ></el-input>
          </el-col>
          <el-col :span="3">
            <el-input
              maxlength="50"
              v-model="abroadForm.gwgx.zw"
              placeholder="职务"
            ></el-input>
          </el-col>

          <el-col :span="2">
            <el-button type="text" @click="addAbroadGw">新增</el-button>
          </el-col>
        </el-row>
        <el-row
          style="display: flex; justify-content: flex-end; margin-bottom: 10px"
          gutter="10"
          v-for="(item, index) in abroadForm.gwgx.ftFamilyarr"
          :key="index"
        >
          <el-col :span="3"> </el-col>
          <el-col :span="3">
            <el-input
              v-model="item.gx"
              placeholder="关系"
              maxlength="50"
            ></el-input>
          </el-col>
          <el-col :span="3">
            <el-input
              v-model="item.xm"
              placeholder="姓名"
              maxlength="50"
            ></el-input>
          </el-col>
          <el-col :span="3">
            <el-input
              v-model="item.lxfs"
              placeholder="联系方式"
              maxlength="50"
            ></el-input>
          </el-col>
          <el-col :span="3">
            <el-input
              v-model="item.zzmm"
              placeholder="政治面貌"
              maxlength="50"
            ></el-input>
          </el-col>
          <el-col :span="3">
            <el-input
              v-model="item.gzdw"
              placeholder="工作单位"
              maxlength="50"
            ></el-input>
          </el-col>
          <el-col :span="3">
            <el-input
              v-model="item.zw"
              placeholder="职务"
              maxlength="50"
            ></el-input>
          </el-col>
          <el-col :span="1">
            <el-button
              type="text"
              style="color: red"
              @click="delGwAbroad(index)"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1">
            <el-button type="text" @click="addAbroad">新增</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="出国(境)目的地"
              prop="leaveCountry.spmdd"
              :rules="{
                required: true,
                message: '请选择目的地',
                trigger: ['change', 'blur']
              }"
            >
              <el-select
                v-model="abroadForm.leaveCountry.spmdd"
                placeholder="出国(境)目的地"
                multiple
                filterable
                remote
                :remote-method="handleSelectMdd"
              >
                <el-option
                  v-for="item in allCountryList"
                  :key="item.country"
                  :label="item.country"
                  :value="item.country"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="起止日期"
              prop="leaveCountry.startEndDate"
              :rules="{
                required: true,
                message: '请选择起止时间',
                trigger: ['change', 'blur']
              }"
            >
              <el-date-picker
                @change="datePickerChange"
                v-model="abroadForm.leaveCountry.startEndDate"
                type="daterange"
                range-separator="至"
                placeholder="date"
                value-format="YYYY-MM-DD"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :disabled-date="disableddate"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          label="使用证照"
          prop="useCertificates"
          :rules="{
            required: true,
            message: '请选择使用证照',
            trigger: ['change', 'blur']
          }"
        >
          <el-checkbox-group v-model="abroadForm.useCertificates">
            <el-checkbox
              :label="item.id"
              v-for="(item, index) in licenseList"
              :key="index"
              >{{ item.zjhm }}({{ zhlxDict[item.hzlx] }})</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="出国(境)事由"
          prop="leaveCountry.cgsy"
          :rules="{
            required: true,
            message: '请输入出国(境)事由',
            trigger: ['change', 'blur']
          }"
        >
          <el-input
            maxlength="1000"
            type="textarea"
            v-model="abroadForm.leaveCountry.cgsy"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="分管领导"
          prop="fgld"
          :rules="{
            required: true,
            message: '请选择分管领导',
            trigger: ['change', 'blur']
          }"
        >
          <el-select v-model="abroadForm.fgld" placeholder="请选择分管领导">
            <el-option
              v-for="item in fgldList"
              :key="item.userName"
              :label="item.nickName"
              :value="item.userName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <div class="flex-center mt-20">
          <el-button type="primary" @click="submit">提交</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog title="办(补)证详情" v-model="detailDialogVisible" width="800px">
      <el-row>
        <el-col :span="8">申请编号: bbz20220224001</el-col>
        <el-col :span="8">姓名: 张三</el-col>
        <el-col :span="8">身份证号: 330999199209091900</el-col>
      </el-row>
      <el-row class="mt-20">
        <el-col :span="8">工作单位: 区纪委</el-col>
        <el-col :span="8">所在科室: 办公室</el-col>
        <el-col :span="8">职务: 主任</el-col>
      </el-row>
      <el-row class="mt-20">
        <el-col :span="2"> 办理证照: </el-col>
        <el-col :span="22">
          <el-table :data="cardList" style="width: 100%">
            <el-table-column prop="zzlx" label="证照类型"> </el-table-column>
            <el-table-column prop="bzlx" label="办证类型"> </el-table-column>
            <el-table-column prop="zzzt" label="制作状态"> </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row class="mt-20">
        <el-col :span="2">单位证明:</el-col>
        <el-col :span="22">
          <el-image
            style="width: 100px; height: 100px"
            :src="url"
            :fit="fit"
          ></el-image>
        </el-col>
      </el-row>
      <el-row class="mt-20">
        证照信息:
        <el-col :span="24">
          <el-table :data="cardInfoList" style="width: 100%">
            <el-table-column prop="prop" label="证照类型"> </el-table-column>
            <el-table-column prop="prop" label="证照编号"> </el-table-column>
            <el-table-column prop="prop" label="签发地点"> </el-table-column>
            <el-table-column prop="prop" label="签发时间"> </el-table-column>
            <el-table-column prop="prop" label="有效期至"> </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row class="mt-20">
        审批记录
        <el-col :span="24" class="mt-10"
          >2022-01-04 12:12 区纪委 李四 证照入库</el-col
        >
      </el-row>
    </el-dialog>
    <el-dialog
      title="行程变更详情"
      v-model="abroadDialogVisible"
      width="1000px"
    >
      <div class="flex-center">
        状态:
        <span style="color: #70b603">{{
          applySatus[changeInfo?.bgStatus]
        }}</span>
      </div>
      <el-row class="mt-20" :gutter="20">
        <el-col :span="6">申请编号：{{ changeInfo?.bgNo }}</el-col>
        <el-col :span="6"
          >出国（境）审批编号：{{ abroadDetail.applyNo }}</el-col
        >
        <el-col :span="6">姓名：{{ abroadDetail.name }}</el-col>
        <el-col :span="6">身份证号：{{ abroadDetail.sfzh }}</el-col>
      </el-row>
      <el-row class="mt-20" :gutter="20">
        <el-col :span="6">工作单位：{{ abroadDetail.zgdw }}</el-col>
        <el-col :span="6">所在科室：{{ abroadDetail.ks }}</el-col>
        <el-col :span="6">职务：{{ abroadDetail.zw }}</el-col>
        <el-col :span="6">性别：{{ genderEnum[abroadDetail.gender] }}</el-col>
      </el-row>
      <el-row class="mt-20" :gutter="20">
        <el-col :span="6"
          >民族:
          {{
            filterType(abroadDetail.nation, lajw_ft_nation, "label", "value")
          }}</el-col
        >
        <el-col :span="6">籍贯：{{ abroadDetail.nativePlace }}</el-col>
        <el-col :span="6">出生年月：{{ abroadDetail.csrq }}</el-col>
        <el-col :span="6"
          >参加工作时间：{{ formDate(abroadDetail.cjgzsj) }}</el-col
        >
      </el-row>
      <el-row class="mt-20" :gutter="20">
        <el-col :span="6">学历：{{ abroadDetail.xl }}</el-col>
        <el-col :span="6">党派：{{ abroadDetail.dp }}</el-col>
        <el-col :span="6">同行人员 ：{{ abroadDetail.txry }}</el-col>
        <el-col :span="6"
          >起止时间:
          {{ abroadDetail.spkssj + "至" + abroadDetail.spjssj }}</el-col
        >
      </el-row>
      <el-row class="mt-20" :gutter="20">
        <el-col :span="6">出国(境)事由：{{ abroadDetail.cgsy }}</el-col>
        <el-col :span="6">出国(境)目的地： {{ abroadDetail.spmdd }}</el-col>
        <el-col :span="12"
          >使用护照：
          <span v-for="(item, index) in usLicense" :key="index"
            >{{ item.zjhm }}
            {{ item.hzlx ? "(" + zhlxDict[item.hzlx] + ")" : "" }}</span
          >
        </el-col>
      </el-row>
      <el-row class="mt-20">
        <el-col :span="24">
          工作简历:
          {{ abroadDetail.jl }}
        </el-col>
      </el-row>
      <el-row class="mt-20">
        <el-col :span="4">国内直系亲属及主要社会关系</el-col>
        <el-col :span="20">
          <el-table :data="gnftFamilyArr" style="width: 100%">
            <el-table-column prop="gx" label="关系"> </el-table-column>
            <el-table-column prop="xm" label="姓名"> </el-table-column>
            <el-table-column prop="lxfs" label="联系方式"> </el-table-column>
            <el-table-column prop="zzmm" label="政治面貌"> </el-table-column>
            <el-table-column prop="gzdw" label="工作单位"> </el-table-column>
            <el-table-column prop="zw" label="职务"> </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row class="mt-20">
        <el-col :span="4">国外直系亲属及主要社会关系</el-col>
        <el-col :span="20">
          <el-table :data="gwftFamilyArr" style="width: 100%">
            <el-table-column prop="gx" label="关系"> </el-table-column>
            <el-table-column prop="xm" label="姓名"> </el-table-column>
            <el-table-column prop="lxfs" label="联系方式"> </el-table-column>
            <el-table-column prop="zzmm" label="政治面貌"> </el-table-column>
            <el-table-column prop="gzdw" label="工作单位"> </el-table-column>
            <el-table-column prop="zw" label="职务"> </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row class="mt-20">
        <el-col :span="4">行程变更记录</el-col>
        <el-col :span="20">
          <el-row
            style="background-color: #f8f8f9; color: #515a6e; height: 40px"
          >
            <el-col :span="8">变更项</el-col>
            <el-col :span="8">变更前</el-col>
            <el-col :span="8">变更后</el-col>
          </el-row>
          <el-row v-if="changeInfo.isTime === 1">
            <el-col :span="8">起止时间</el-col>
            <el-col :span="8"
              >{{ changeInfo.bgqkssj }} 至 {{ changeInfo.bgqjssj }}</el-col
            >
            <el-col :span="8"
              >{{ changeInfo.bghkssj }} 至 {{ changeInfo.bghjssj }}</el-col
            >
          </el-row>
          <el-row v-if="changeInfo.isMdd === 1">
            <el-col :span="8">目的地</el-col>
            <el-col :span="8">{{ changeInfo.bgqmdd }}</el-col>
            <el-col :span="8">{{ changeInfo.bghmdd }}</el-col>
          </el-row>
          <el-row v-if="changeInfo.isZz === 1">
            <el-col :span="8">使用证照</el-col>
            <el-col :span="8">
              <div>{{ changeInfo?.bgqzz }}</div>
            </el-col>
            <el-col v-if="Array.isArray(changeInfo.list)" :span="8">
              <div v-for="(item, index) in changeInfo.list" :key="index">
                {{ item.zjhm }}
                {{ item.hzlx ? "(" + zhlxDict[item.hzlx] + ")" : "" }}
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="mt-20">
        <el-col :span="4">报备记录</el-col>
        <el-col :span="20">
          <el-table :data="reports" style="width: 100%">
            <el-table-column prop="bbrq" label="报备时间"> </el-table-column>
            <el-table-column label="报备类型">
              <template #default="scope">{{
                bblxEnmus[scope.row.bblx]
              }}</template>
            </el-table-column>
            <el-table-column prop="bbnr" label="报备内容"> </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row class="mt-20">
        <el-col :span="24">审批记录</el-col>

        <el-timeline v-if="approve && approve.length" class="mt-20">
          <el-timeline-item
            v-for="(item, index) in approve"
            :key="index"
            :timestamp="
              formDate(item.createTime) +
              '【' +
              item.deptName +
              '】' +
              item.approvalUserName
            "
            placement="top"
          >
            <el-card>
              <h4>
                {{ item.taskName
                }}<span v-show="item.result">：{{ item.result }}</span>
              </h4>
              <el-alert
                v-if="item.result === '不同意'"
                :title="
                  typeof item.remark === 'string'
                    ? '驳回原因：' + item.remark
                    : '驳回原因：无'
                "
                type="info"
                :closable="false"
                class="mt-10"
              />
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-row>
      <el-row
        v-if="abroadDetail.applyStauts >= 4 && abroadDetail.applyStauts <= 8"
      >
        <el-button type="primary" @click="checkApprovalForm"
          >查看电子审批单</el-button
        >
        <el-button type="primary" @click="downloadApprovalForm"
          >下载电子审批单</el-button
        >
      </el-row>

      <template v-if="abroadDialogType === 'edit'">
        审批
        <el-form
          ref="acceptReview"
          :model="acceptReviewForm"
          label-width="150px"
        >
          <el-form-item
            label="审批结果"
            prop="result"
            :rules="{
              required: true,
              message: '请选择审批结果',
              trigger: ['change', 'blur']
            }"
          >
            <el-radio-group v-model="acceptReviewForm.result">
              <el-radio :label="0">通过</el-radio>
              <el-radio :label="1">不通过</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="驳回原因"
            v-if="acceptReviewForm.result === 1"
            prop="remark"
            :rules="{
              required: true,
              message: '请输入驳回原因',
              trigger: ['change', 'blur']
            }"
          >
            <el-input
              maxlength="100"
              v-model="acceptReviewForm.remark"
              type="textarea"
              placeholder="请输入驳回原因"
            ></el-input>
          </el-form-item>
          <div class="flex-center">
            <el-button type="primary" @click="hasReviewSubmit">提交</el-button>
          </div>
        </el-form>
      </template>
    </el-dialog>
    <el-dialog title="领取证照" v-model="receiveDialog" width="800px">
      <el-row>
        <el-form-item>
          <el-col :span="24" v-for="(item, index) in usLicense" :key="index"
            >{{ index + 1 }}、{{ item.zjhm }}({{ zhlxDict[item.hzlx] }})</el-col
          >
        </el-form-item>
      </el-row>
      <div class="flex-center">
        <el-button type="primary" @click="receiveReports">确认领取</el-button>
      </div>
    </el-dialog>
    <el-dialog title="归还证照" v-model="backReportDialog" width="800px">
      <el-row>
        <el-form-item>
          <el-col :span="24" v-for="(item, index) in usLicense" :key="index"
            >{{ index + 1 }}、{{ item.zjhm
            }}{{ item.hzlx ? "(" + zhlxDict[item.hzlx] + ")" : "" }}</el-col
          >
        </el-form-item>
      </el-row>
      <div class="flex-center">
        <el-button type="primary" @click="backReports">确认归还</el-button>
      </div>
    </el-dialog>
    <el-dialog title="报备" v-model="reportedDialog" width="800px">
      <el-form
        ref="reportedRef"
        label-suffix=":"
        :model="reportedForm"
        label-width="150px"
      >
        <el-form-item
          label="报备类型"
          prop="bblx"
          :rules="{
            required: true,
            message: '请选择日常报备',
            trigger: ['change', 'blur']
          }"
        >
          <el-radio-group v-model="reportedForm.bblx">
            <el-radio :label="0">日常报备</el-radio>
            <el-radio :label="1">异常报备</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="报备日期"
          prop="bbrq"
          :rules="{
            required: true,
            message: '请选择报备日期',
            trigger: ['change', 'blur']
          }"
        >
          <el-date-picker
            v-model="reportedForm.bbrq"
            type="date"
            placeholder="请选择报备日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          label="报备内容"
          prop="bbnr"
          :rules="{
            required: true,
            message: '请输入报备内容',
            trigger: ['change', 'blur']
          }"
        >
          <el-input
            maxlength="100"
            type="textarea"
            v-model="reportedForm.bbnr"
            placeholder="请输入报备内容"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="flex-center">
        <el-button type="primary" @click="submitRrported">提交</el-button>
      </div>
    </el-dialog>
    <el-dialog title="确认信息" v-model="tripDialogVisible" width="800px">
      <el-row>
        <el-col :span="4">起止时间:</el-col>
        <el-col :span="20"
          >{{ abroadDetail.spkssj }}至{{ abroadDetail.spjssj }}</el-col
        >
      </el-row>
      <el-row class="mt-20" v-if="abroadDetail.spmdd">
        <el-col :span="4">目的地:</el-col>
        <el-col :span="20">{{ abroadDetail.spmdd }}</el-col>
      </el-row>
      <el-row class="mt-20">
        <el-col :span="4">审批证照:</el-col>
        <el-col :span="20">
          <el-tag v-for="item in usLicense" :key="item.id">
            {{ item.zjhm }}
            {{ item.hzlx ? "(" + zhlxDict[item.hzlx] + ")" : "" }}
          </el-tag>
        </el-col>
      </el-row>
      <div style="color: red">请选择变更项:</div>
      <el-form ref="tripFormref" :model="tripForm">
        <el-form-item>
          <div class="flex-column-start">
            <el-checkbox
              v-model="tripForm.isTime"
              :true-label="1"
              :false-label="0"
              >起止时间</el-checkbox
            >
            <el-form-item v-if="tripForm.isTime == 1">
              <el-date-picker
                v-model="tripForm.startEndTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="YYYY-MM-DD"
              >
              </el-date-picker>
            </el-form-item>
            <el-checkbox
              v-model="tripForm.isMdd"
              :true-label="1"
              :false-label="0"
              >目的地</el-checkbox
            >
            <el-form-item v-if="tripForm.isMdd == 1" style="margin-left: 20px">
              <el-select
                v-model="tripForm.bghmdd"
                placeholder="目的地"
                multiple
                filterable
                remote
                :remote-method="handleSelectMdd"
              >
                <el-option
                  v-for="item in allCountryList"
                  :key="item.country"
                  :label="item.country"
                  :value="item.country"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="tripForm.isMdd">
              <div class="flex-column-start ml-20">
                <el-checkbox
                  v-model="tripForm.isZz"
                  :true-label="1"
                  :false-label="0"
                  >更换证照</el-checkbox
                >
                <!-- 已领取证照 未领取证照 -->
                <el-checkbox-group
                  v-if="tripForm.isZz"
                  @change="changeCheckBox"
                  v-model="tripForm.list"
                >
                  <el-checkbox
                    :label="item"
                    v-for="(item, index) in zzList"
                    :key="index"
                  >
                    {{ item.hzlx ? zhlxDict[item.hzlx] : "" }}
                    ({{ item.zjhm }})
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item
          label="分管领导"
          prop="fgld"
          :rules="{
            required: true,
            message: '请选择分管领导',
            trigger: ['change', 'blur']
          }"
        >
          <el-select v-model="tripForm.fgld" placeholder="请选择分管领导">
            <el-option
              v-for="item in fgldList"
              :key="item.userName"
              :label="item.nickName"
              :value="item.userName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <div class="flex-center">
          <el-button type="primary" @click="tripSubmit">提交审批</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog v-model="isShowPrint" width="700px">
      <Print
        :printObj="abroadDetail"
        @ok="handleDownload"
        :showDownload="showDownload"
        :gnftFamilyArr="gnftFamilyArr"
        :gwftFamilyArr="gwftFamilyArr"
      />
    </el-dialog>
    <el-dialog title="更换证照" v-model="reportDialog" width="800px">
      <el-row :gutter="10">
        <el-col
          :span="24"
          v-for="(item, index) in waitReceiveReport"
          :key="index"
        >
          <span>【{{ item.zjhm }}】</span>
          <span>{{ item.status == 10 ? "归还" : "领取" }}</span>
        </el-col>
      </el-row>
      <div class="flex-center">
        <el-button type="primary" @click="confirmCheck">确认更换</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  ref,
  toRefs
} from "vue";
import { getToken } from "@/utils/auth";
import { ElMessageBox, ElMessage } from "element-plus";
import {
  getCertificate,
  getTripWaitList,
  getUserInfo,
  addUserInfo,
  useLicense,
  TripDetail,
  Fchanges,
  TravelEditInfo,
  getMystartList,
  getAbroadHandleList,
  receiveReport,
  backReportdema,
  callBackProcess,
  reported,
  FchangesTrip,
  getAllReports,
  getAllCountry,
  getCheckld,
  getAllTrips,
  getAbroadDetail
} from "@/api/abroad/index.js";
import { useStore } from "vuex";
import { checkRole } from "@/utils/permission.js";
import Print from "./print2.vue";
import { queryParams2FormData } from "@/utils/ruoyi";
import { zhlxDict } from "@/constant/abroad";
export default defineComponent({
  name: "index",
  props: {},
  components: {
    // ElMessageBox,
    // ElMessage,
    // FileUpload,
    Print
  },
  setup() {
    const reportDialog = ref(false);
    const waitReceiveReport = ref([]);
    const isShowPrint = ref(false);
    const showDownload = ref(false);
    const store = useStore();
    const fileList = ref([]);
    const folderFileList = ref([]);
    const form = reactive({
      type: 2,
      // 待办页面入口 自动条件过滤
      ...queryParams2FormData("status", "content")
    });
    form.status = form.status?.split(",");

    const loading = ref(false);
    const reportedDialog = ref(false);
    const tripDialogVisible = ref(false);
    const userList = ref([]);
    const fgldList = ref([]);
    let userInfoOptions = ref([]);
    const nortanForm = reactive([]);
    const tripForm = reactive({});
    const reports = ref([]);
    const abroadDialogType = ref("sp");
    const acceptReviewForm = reactive({});
    const activeName = ref("0"); // 待办页面入口 自动条件过滤
    activeName.value = queryParams2FormData("activeName").activeName || "0";

    const reportedForm = reactive({ bblx: 0, bbrq: new Date() });
    const allCountryList = ref([]);
    const reportId = ref("");
    const abroadForm = reactive({
      leaveCountry: {},
      gngx: {
        ftFamilyarr: [],
        xm: "",
        gx: "",
        lxfs: "",
        zzmm: "",
        gzdw: "",
        zw: "",
        gxlx: 1
      },
      gwgx: {
        ftFamilyarr: [],
        xm: "",
        gx: "",
        lxfs: "",
        zzmm: "",
        gzdw: "",
        zw: "",
        gxlx: 2
      }
    });
    const genderEnum = { 0: "男", 1: "女", 2: "未知" };
    const applySatus = {
      0: "专管员确认中",
      1: "分管领导审批中",
      2: "待纪检组审批",
      3: "待单位领导审批",
      4: "待更换证照",
      5: "已变更",
      6: "审核驳回",
      7: "已撤销"
    };
    const bblxEnmus = { 0: "日常报备", 1: "异常报备" };
    const reviewForm = reactive({ result: 0 });
    const detailDialogVisible = ref(false);
    const abroadDialogVisible = ref(false);
    const receiveDialog = ref(false);
    const backReportDialog = ref(false);
    const abroadDetail = ref({});
    const cardInfoList = ref([]);
    const reportForm = reactive({});
    const cardList = ref([]);
    const licenseList = ref([]);
    const usLicense = ref([]);
    const zzList = ref([]);
    const changeInfo = ref({});
    const gnftFamilyArr = ref([]);
    const gwftFamilyArr = ref([]);
    const instanceId = ref("");
    const approve = ref([]);
    const timer = ref("");
    const taskIds = ref(0);
    const reportedId = ref("");
    const dynamicValidateForm = reactive({
      xm: "",
      sfzh: "",
      domains: []
    });
    const dialogVisible = ref(false);
    const title = ref("发起出国(境)审批");
    const total = ref(0);
    let active = ref(1);
    const { proxy } = getCurrentInstance();
    const data = reactive({
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      queryForm: {},
      queryFormRules: {}
    });
    const { queryParams, queryForm } = toRefs(data);
    const { lajw_ft_nation } = proxy.useDict("lajw_ft_nation");
    const { country } = proxy.useDict("country");
    const { LSDW } = proxy.useDict("LSDW");
    /*** 用户导入参数 */
    const upload = reactive({
      // 是否显示弹出层（用户导入）
      open: false,
      // 弹出层标题（用户导入）
      title: "",
      // 是否禁用上传
      isUploading: false,
      // 是否更新已经存在的用户数据
      updateSupport: 1,
      // 设置上传的请求头部
      headers: { Authorization: "Bearer " + getToken() },
      // 上传的地址
      url: import.meta.env.VITE_APP_BASE_API + "/data/ft/ry/importData"
    });
    function backOut() {
      active.value = 1;
    }
    function submitRrported() {
      const prams = {
        ...reportedForm,
        bbrq: formDate(reportedForm.bbrq),
        instanceId: reportedId.value
      };
      reported(prams).then(res => {
        proxy.$modal.msgSuccess("报备成功");
        proxy.$tab.refreshPage();
        reportedDialog.value = !reportedDialog.value;
      });
    }
    function openDia(id) {
      ElMessageBox.alert("确认撤销变更?", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        title: "撤销变更",
        callback: action => {
          if (action === "confirm") {
            callBackProcess({ id: id }).then(res => {
              proxy.$modal.msgSuccess("撤销成功");
              proxy.$tab.refreshPage();
            });
          }
        }
      });
    }

    function tripSubmit() {
      if (!tripForm.isMdd && !tripForm.isTime)
        return proxy.$modal.msgError("请至少选择一项变更");
      if (
        tripForm.isMdd &&
        (!Array.isArray(tripForm.bghmdd) || !tripForm.bghmdd.length)
      )
        return proxy.$modal.msgError("请选择目的地");
      if (tripForm.isTime && !Array.isArray(tripForm.startEndTime))
        return proxy.$modal.msgError("请选择起止时间");
      if (tripForm.isZz && !tripForm.list.length)
        return proxy.$modal.msgError("请选择证照");

      TripDetail(tripForm.parentId).then(res => {
        changeInfo.value = res.data.changeInfo;

        if (tripForm.startEndTime) {
          tripForm.bghkssj = formDate(tripForm.startEndTime[0]);
          tripForm.bghjssj = formDate(tripForm.startEndTime[1]);
        }
        const { bghjssj, bghkssj, bghmdd } = tripForm;
        const prams = {
          list: tripForm.list,
          bghjssj: tripForm.isTime ? bghjssj : "",
          bghkssj: tripForm.isTime ? bghkssj : "",
          bghmdd: tripForm.isMdd ? bghmdd.join(",") : "",
          parentId: abroadDetail.value.id,
          id: changeInfo.value.id,
          newInstanceId: changeInfo.value.newInstanceId,
          isMdd: tripForm.isMdd ? 1 : 0,
          isTime: tripForm.isTime ? 1 : 0,
          isZz: tripForm.isZz ? 1 : 0
        };
        TravelEditInfo(prams).then(res => {
          if (res.code === 200) {
            const params = {
              userName: tripForm.fgld,
              taskId: taskIds.value
            };
            Fchanges(params).then(res => {
              proxy.$tab.refreshPage();
              proxy.$modal.msgSuccess("提交审批成功");
              tripDialogVisible.value = !tripDialogVisible.value;
            });
          } else {
            proxy.$modal.msgError("信息保存失败");
          }
        });
      });
    }
    function reportedAction(id) {
      reportedDialog.value = !reportedDialog.value;
      reportedId.value = id;
    }
    // function receivewReport(id, insid) {
    //   receiveDialog.value = !receiveDialog.value;
    //   instanceId.value = insid;
    //   TripDetail(id).then(res => {
    //     usLicense.value = res.data.useCertificates;
    //   });
    // }
    // function backReport(id, insid) {
    //   backReportDialog.value = !backReportDialog.value;
    //   instanceId.value = insid;
    //   TripDetail(id).then(res => {
    //     usLicense.value = res.data.useCertificates;
    //   });
    // }
    function receiveReports() {
      receiveReport(instanceId.value).then(res => {
        receiveDialog.value = !receiveDialog.value;
        proxy.$modal.msgSuccess("领取成功");
        proxy.$tab.refreshPage();
      });
    }
    function backReports() {
      backReportdema(instanceId.value).then(res => {
        proxy.$modal.msgSuccess("归还成功");
        proxy.$tab.refreshPage();
        backReportDialog.value = !backReportDialog.value;
      });
    }
    function handleSelectMdd(query) {
      if (query) {
        clearTimeout(timer.value);
        timer.value = setTimeout(() => {
          getAllCountry(query).then(res => {
            allCountryList.value = res.data;
          });
        }, 500);
      }
    }
    function tabsChange() {
      queryParams.pageNum = 1;
      getList();
    }
    function addForm() {
      dynamicValidateForm.domains.push({
        xm: "",
        sfzh: ""
      });
    }
    function hasReviewSubmit() {
      proxy.$refs["acceptReview"].validate(valid => {
        if (valid) {
          const parmas = {
            ...acceptReviewForm,
            taskId: taskIds.value
          };
          Fchanges(parmas).then(res => {
            proxy.$modal.msgSuccess("审批成功");
            proxy.$tab.refreshPage();
            abroadDialogVisible.value = !abroadDialogVisible.value;
          });
        }
      });
    }
    function getTime(beginTime, endTime) {
      var dateDiff = endTime.getTime() - beginTime.getTime(); //时间差的毫秒数
      var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
      return dayDiff;
    }
    function datePickerChange(e) {
      const date = new Date();
      const startMonth = new Date(e[0]).getMonth() + 1;
      const startTime = new Date(e[0]);
      const endTime = new Date(e[1]);
      const day = getTime(startTime, endTime);
      const threeMonthAfter = date.getMonth() + 4;
      if (startMonth > threeMonthAfter) {
        proxy.$modal.msgError("不支持预约3个月以后的出国(境)审批!");
        abroadForm.leaveCountry.startEndDate = undefined;
        abroadForm.leaveCountry.spkssj = undefined;
        abroadForm.leaveCountry.spjssj = undefined;
        return;
      }
      if (day > 9) {
        proxy.$modal.msgError("出国(境)审批不能超过10天!");
        abroadForm.leaveCountry.startEndDate = undefined;
        abroadForm.leaveCountry.spkssj = undefined;
        abroadForm.leaveCountry.spjssj = undefined;
        return;
      }
    }

    function getAbroads(id, type, taskId) {
      TripDetail(id).then(res => {
        abroadDetail.value = res.data.info;
        usLicense.value = res.data.useCertificates;
        gnftFamilyArr.value = res.data.families.filter(item => {
          return item.gxlx === 1;
        });
        gwftFamilyArr.value = res.data.families.filter(item => {
          return item.gxlx === 2;
        });
        changeInfo.value = res.data.changeInfo;
        approve.value = res.data.approve;
        reports.value = res.data.reports;
        taskIds.value = taskId;
      });
      abroadDialogType.value = type;
      abroadDialogVisible.value = !abroadDialogVisible.value;
    }
    // 确认信息
    const handleClickInformation = (id, taskId) => {
      taskIds.value = taskId;
      TripDetail(id).then(res => {
        abroadDetail.value = res.data.info;
        tripForm.parentId = id;
        usLicense.value = res.data.useCertificates;

        const { isTime, bghjssj, bghkssj, isMdd, bghmdd, isZz, list, fgld } =
          res.data.changeInfo;
        tripForm.isTime = isTime;
        tripForm.startEndTime = [bghkssj, bghjssj];
        tripForm.isMdd = isMdd;
        tripForm.bghmdd = bghmdd ? bghmdd.split(",") : [];
        tripForm.isZz = isZz;
        tripForm.list = list;
        tripForm.fgld = fgld;

        const newUseCertificates = res.data.newUseCertificates;
        getAllReports(abroadDetail.value.id).then(res => {
          zzList.value = res.data;
          tripForm.list = res.data.filter(item => {
            return newUseCertificates.find(k => k.zzId === item.zzId);
          });
        });
      });
      tripDialogVisible.value = !tripDialogVisible.value;
    };
    function changeCheckBox(e) {
      tripForm.list = e;
    }
    function resetForm() {
      form.content = undefined;
      form.spkssj = undefined;
      form.spjssj = undefined;
      form.status = undefined;
      form.startEnd = undefined;
      getList();
    }
    function disableddate(time) {
      return time.getTime() < Date.now() - 8.64e7;
    }
    function filterType(key, enumsType, name, values) {
      let enumsName = {};
      if (key) {
        enumsName = enumsType.find(item => {
          return item[values] == key;
        });
      }
      let label;
      if (enumsName) {
        label = enumsName[name];
      }
      return label;
    }
    function submitReview() {
      proxy.$refs["review"].validate(valid => {
        if (valid) {
          const parmas = {
            ...reviewForm,
            taskId: taskIds.value
          };
          notReviewAbroad(parmas).then(res => {
            proxy.$tab.refreshPage();
            proxy.$modal.msgSuccess("提交成功");
            abroadDialogVisible.value = !abroadDialogVisible.value;
          });
        }
      });
    }
    function getFgLeader() {
      getCheckld().then(res => {
        fgldList.value = res.data;
      });
    }
    getFgLeader();
    function handleAbroad() {
      dialogVisible.value = !dialogVisible.value;
    }
    function remoteMethod(query) {
      if (query) {
        const params = {
          userName: query,
          pageSize: 50
        };
        clearTimeout(timer.value);
        timer.value = setTimeout(() => {
          getUserInfo(params).then(res => {
            userInfoOptions.value = res.data;
          });
        }, 500);
      }
    }
    function exchangeReport(taskId, id) {
      reportDialog.value = !reportDialog.value;
      reportId.value = taskId;
      getCertificate(id).then(res => {
        waitReceiveReport.value = res.data;
      });
    }
    function handleChangeName(stringName) {
      let name = stringName.split("-")?.[1];
      let sfzh = stringName.split("-")?.[2];
      const selectInfo = userInfoOptions.value.find(item => {
        return item.name === name;
      });
      abroadForm.leaveCountry.sfzh = sfzh;
      abroadForm.useCertificates = [];
      abroadForm.leaveCountry.nativePlace = selectInfo.nativePlace;
      abroadForm.leaveCountry.nation = selectInfo.nation.toString();
      abroadForm.leaveCountry.gender = selectInfo.gender.toString();
      abroadForm.leaveCountry.csrq = formDate(selectInfo.csrq);
      abroadForm.leaveCountry.zw = selectInfo.zw;
      abroadForm.leaveCountry.deptId = selectInfo.deptId;
      abroadForm.leaveCountry.ks = selectInfo.deptOfficeName;
      abroadForm.leaveCountry.baType = selectInfo.baType;
      const prams = {
        sfzh: sfzh
      };
      useLicense(prams).then(res => {
        licenseList.value = res.data;
      });
    }
    function addAbroad() {
      abroadForm.gngx.ftFamilyarr.push({
        xm: "",
        gx: "",
        lxfs: "",
        zzmm: "",
        gzdw: "",
        zw: "",
        gxlx: 1
      });
    }
    function addAbroadGw() {
      abroadForm.gwgx.ftFamilyarr.push({
        xm: "",
        gx: "",
        lxfs: "",
        zzmm: "",
        gzdw: "",
        zw: "",
        gxlx: 2
      });
    }
    function saveHandler() {
      proxy.$refs["queryFormRef"].validate(valid => {
        if (valid) {
          // 请求

          active.value = 2;
          proxy.resetForm("queryFormRef");
        }
      });
    }
    function delGnAbroad(index) {
      abroadForm.gngx.ftFamilyarr.splice(index, 1);
    }
    function delGwAbroad(index) {
      abroadForm.gwgx.ftFamilyarr.splice(index, 1);
    }
    function handlerQuery() {
      queryParams.value.pageNum = 1;
      getList();
    }
    function formDate(dates) {
      let date = new Date(dates);
      const year = date.getFullYear();
      const month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      return dates ? year + "-" + month + "-" + day : "";
    }
    function uploadSuccess(e) {
      fileList.value = Object.values(e);
      reviewForm.files = fileList.value.map(item => {
        return { attachName: item.name, attachPath: item.url };
      });
    }
    function removeFile(e) {
      fileList.value = Object.values(e);
      reviewForm.files = fileList.value.map(item => {
        return { attachName: item.name, attachPath: item.url };
      });
    }
    function submit() {
      proxy.$refs.form.validate(valid => {
        if (valid) {
          const { gx, gxlx, gzdw, lxfs, xm, zw, zzmm } = abroadForm.gngx;
          const nGngx = [...abroadForm.gngx.ftFamilyarr];
          nGngx.push({
            gx: gx,
            gxlx: gxlx,
            gzdw: gzdw,
            lxfs: lxfs,
            xm: xm,
            zw: zw,
            zzmm: zzmm
          });
          const nGwgx = [...abroadForm.gwgx.ftFamilyarr];
          nGwgx.push({
            gx: abroadForm.gwgx.gx,
            gxlx: abroadForm.gwgx.gxlx,
            gzdw: abroadForm.gwgx.gzdw,
            lxfs: abroadForm.gwgx.lxfs,
            xm: abroadForm.gwgx.xm,
            zw: abroadForm.gwgx.zw,
            zzmm: abroadForm.gwgx.zzmm
          });
          const newArr = [...nGngx, ...nGwgx];
          abroadForm.ftFamily = newArr;
          abroadForm.leaveCountry.type = 2;
          if (abroadForm.leaveCountry.startEndDate) {
            abroadForm.leaveCountry.spkssj = formDate(
              abroadForm.leaveCountry.startEndDate[0]
            );
            abroadForm.leaveCountry.spjssj = formDate(
              abroadForm.leaveCountry.startEndDate[1]
            );
          }
          if (abroadForm.leaveCountry.spmdd) {
            abroadForm.leaveCountry.spmdd =
              abroadForm.leaveCountry.spmdd.join(",");
          }
          if (abroadForm.leaveCountry.cjgzsj) {
            abroadForm.leaveCountry.cjgzsj = formDate(
              abroadForm.leaveCountry.cjgzsj
            );
          }
          abroadForm.leaveCountry.id = undefined;
          abroadForm.leaveCountry.name =
            abroadForm.leaveCountry.name.split("-")?.[1];
          abroadForm.leaveCountry.startEndDate = undefined;
          abroadForm.leaveCountry.baType = undefined;
          const params = {
            ...abroadForm,
            gwgx: undefined,
            gngx: undefined
          };
          addUserInfo(params).then(res => {
            dialogVisible.value = !dialogVisible.value;
            proxy.$tab.refreshPage();
            proxy.$modal.msgSuccess("发起审批成功");
          });
        }
      });
    }
    function changeDialog() {
      dialogVisible.value = !dialogVisible.value;
    }
    function getList() {
      loading.value = true;

      const params = Object.assign(queryParams.value, form);
      params.startEnd = undefined;
      let getLists;
      if (activeName.value === "0") {
        getLists = getTripWaitList(params);
      } else if (activeName.value === "1") {
        getLists = getMystartList(params);
      } else if (activeName.value === "2") {
        getLists = getAbroadHandleList(params);
      } else {
        getLists = getAllTrips(params);
      }
      getLists.then(res => {
        loading.value = false;
        userList.value = res.rows;
        total.value = res.total;
      });
    }
    function dateChange(e) {
      form.spkssj = formDate(e[0]);
      form.spjssj = formDate(e[1]);
    }
    function jobGroupFormat(row, column) {
      return proxy.selectDictLabel(column, row.jobGroup);
    }
    function handleImport() {
      upload.title = "用户导入";
      upload.open = true;
    }
    function confirmCheck() {
      const params = {
        taskId: reportId.value,
        result: 0
      };
      Fchanges(params).then(() => {
        proxy.$modal.msgSuccess("更换成功");
        reportDialog.value = !reportDialog.value;
        getList();
      });
    }
    // 导出
    function handleExport() {
      proxy.download("data/ft/ry/export");
    }
    /**文件上传中处理 */
    const handleFileUploadProgress = (event, file, fileList) => {
      upload.isUploading = true;
    };
    /** 文件上传成功处理 */
    const handleFileSuccess = (response, file, fileList) => {
      upload.open = false;
      upload.isUploading = false;
      proxy.$refs["uploadRef"].clearFiles();
      proxy.$alert(
        "<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" +
          response.msg +
          "</div>",
        "导入结果",
        { dangerouslyUseHTMLString: true }
      );
    };
    function checkApprovalForm() {
      isShowPrint.value = true;
      showDownload.value = false;
    }
    function downloadApprovalForm() {
      isShowPrint.value = true;
      showDownload.value = true;
    }
    getList();
    return {
      confirmCheck,
      disableddate,
      uploadSuccess,
      removeFile,
      ...toRefs(data),
      store,
      allCountryList,
      fgldList,
      tripForm,
      tripDialogVisible,
      dialogVisible,
      queryParams,
      queryForm,
      userList,
      title,
      total,
      loading,
      form,
      upload,
      dynamicValidateForm,
      active,
      nortanForm,
      abroadForm,
      detailDialogVisible,
      abroadDialogVisible,
      applySatus,
      cardList,
      reviewForm,
      reportForm,
      genderEnum,
      acceptReviewForm,
      cardInfoList,
      reportedDialog,
      receiveDialog,
      userInfoOptions,
      zhlxDict,
      lajw_ft_nation,
      timer,
      licenseList,
      usLicense,
      zzList,
      gnftFamilyArr,
      gwftFamilyArr,
      abroadDetail,
      approve,
      country,
      changeInfo,
      reports,
      abroadDialogType,
      instanceId,
      taskIds,
      activeName,
      backReportDialog,
      reportedForm,
      LSDW,
      fileList,
      reportDialog,
      folderFileList,
      waitReceiveReport,
      reportId,
      exchangeReport,
      getTime,
      datePickerChange,
      filterType,
      resetForm,
      handleSelectMdd,
      tripSubmit,
      changeDialog,
      // changeTrip,
      submitRrported,
      reportedAction,
      openDia,
      backReports,
      // backReport,
      receiveReports,
      // receivewReport,
      submitReview,
      hasReviewSubmit,
      delGnAbroad,
      delGwAbroad,
      submit,
      getAbroads,
      handleClickInformation,
      addAbroadGw,
      jobGroupFormat,
      addAbroad,
      dateChange,
      changeCheckBox,
      handlerQuery,
      remoteMethod,
      handleChangeName,
      backOut,
      addForm,
      handleImport,
      handleExport,
      formDate,
      handleFileUploadProgress,
      handleFileSuccess,
      saveHandler,
      tabsChange,
      handleAbroad,
      checkRole,
      bblxEnmus,
      checkApprovalForm,
      downloadApprovalForm,
      isShowPrint,
      showDownload,
      getList
    };
  }
});
</script>

<style scoped lang="scss">
/* 页面布局 */
.w-100 {
  width: 100%;
}
:deep(.inner-input) {
  .el-input__inner {
    width: 230px;
  }
}
:deep(.el-step.is-simple .el-step__icon) {
  display: none;
}
:deep(.checkbox-inner.el-checkbox) {
  margin-right: 250px;
}
:deep(.el-select__tags-text) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
}
@for $i from 0 through 200 {
  $item: 2px * $i;
  $index: $i * 2;
  .m-#{$index} {
    margin: $item;
  }
  .mx-#{$index} {
    margin-left: $item;
    margin-right: $item;
  }

  .my-#{$index} {
    margin-top: $item;
    margin-bottom: $item;
  }
  .mt-#{$index} {
    margin-top: $item;
  }
  .mb-#{$index} {
    margin-bottom: $item;
  }
  .mr-#{$index} {
    margin-right: $item;
  }
  .ml-#{$index} {
    margin-left: $item;
  }
}
// flex
@mixin flex() {
  display: flex;
  display: -webkit-box; /*安卓低版本*/
  display: -moz-box; /*火狐低版本*/
  display: -ms-flexbox; /*IE版本*/
  display: -webkit-flex; /*谷歌*/
}
.d-flex {
  @include flex;
}
.flex-center {
  @include flex;
  justify-content: center;
  align-items: center;
}
.flex-start {
  @include flex;
  justify-content: flex-start;
  align-items: flex-start;
}
.flex-between {
  @include flex;
  justify-content: space-between;
  align-items: center;
}
.flex-around {
  @include flex;
  justify-content: space-around;
  align-items: center;
}
.flex-direction-column {
  flex-direction: column;
}
.flex-align-center {
  align-items: center;
}
.flex-align-start {
  align-items: flex-start;
}
.flex-column-center {
  @include flex;
  flex-direction: column;
  align-items: center;
}
.flex-column-end {
  @include flex;
  flex-direction: column;
  align-items: flex-end;
}
.flex-column-start {
  @include flex;
  flex-direction: column;
  align-items: flex-start;
}
.flex-1 {
  flex: 1;
  overflow: hidden;
}
.flex-direction-column {
  flex-direction: column;
}
.text-red {
  color: red;
}
.text-primary {
  color: skyblue;
}
</style>
