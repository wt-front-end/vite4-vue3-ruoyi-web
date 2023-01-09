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
          v-model="form.startEnd"
          value-format="YYYY-MM-DD"
          clearable
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
      <el-form-item
        label="工作单位"
        v-if="checkRole(['QGGBZGY', 'admin', 'LSY'])"
      >
        <el-select
          v-model="form.deptId"
          placeholder="工作单位"
          size="small"
          style="width: 200px"
        >
          <el-option
            v-for="item in roleList"
            :key="item.deptId"
            :label="item.deptName"
            :value="item.deptId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="form.content"
          style="width: 300px"
          placeholder="姓名/身份证号/申请编号"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="activeName === '3'">
        <el-checkbox
          v-model="form.isBb"
          label="今日待报备"
          true-label="1"
          false-label="0"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="handlerQuery"
          >查询</el-button
        >
        <el-button type="" size="small" @click="resetForm">重置</el-button>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item>
            <el-button
              v-if="checkRole(['QGGBZGY'])"
              type="primary"
              size="small"
              @click="handleAbroad"
              >发起出国(境)审批</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table v-loading="loading" :data="userList">
      <el-table-column
        header-align="center"
        align="center"
        prop="applyNo"
        label="申请编号"
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
        prop="zgdw"
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
        label="出国(境)目的地"
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
          <span>{{ applySatus[scope.row.applyStauts] }}</span>
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
            @click="getAbroads(scope.row.id, 0)"
            >详情</el-button
          >
          <el-button
            v-if="scope.row.applyStauts === 0 && activeName === '0'"
            size="small"
            type="text"
            @click="handleAbroad(1, scope.row.id, scope.row.taskId)"
            >确认信息</el-button
          >
          <el-button
            v-if="
              scope.row.applyStauts === 2 &&
              activeName === '0' &&
              checkRole(['LSY'])
            "
            size="small"
            type="text"
            @click="getAbroads(scope.row.id, 1, scope.row.taskId)"
            >联审</el-button
          >
          <el-button
            v-if="
              (scope.row.applyStauts == 8 || scope.row.applyStauts == 9) &&
              checkRole(['QGGBZGY']) &&
              activeName === '3'
            "
            size="small"
            type="text"
            @click="reportedAction(scope.row)"
            >报备</el-button
          >
          <el-button
            v-if="
              (scope.row.applyStauts === 3 || scope.row.applyStauts === 5) &&
              activeName === '0' &&
              checkRole(['QGGBZGY'])
            "
            size="small"
            type="text"
            @click="getAbroads(scope.row.id, 2, scope.row.taskId)"
            >审批</el-button
          >
          <el-button
            v-if="
              scope.row.applyStauts >= 2 &&
              scope.row.applyStauts <= 7 &&
              activeName === '3' &&
              checkRole(['QGGBZGY'])
            "
            size="small"
            type="text"
            @click="openDia(scope.row)"
            >撤销</el-button
          >
          <el-button
            v-if="
              scope.row.applyStauts >= 2 &&
              scope.row.applyStauts <= 9 &&
              checkRole(['QGGBZGY']) &&
              activeName === '3'
            "
            type="text"
            size="small"
            @click="changeTrip(scope.row.id)"
            >变更行程</el-button
          >
          <el-button
            v-if="
              scope.row.applyStauts === 6 &&
              checkRole(['QGGBZGY']) &&
              activeName === '0'
            "
            size="small"
            type="text"
            @click="receivewReport(scope.row.id, scope.row.taskId)"
            >领取证照</el-button
          >
          <el-button
            v-if="
              scope.row.applyStauts === 9 &&
              checkRole(['QGGBZGY']) &&
              activeName === '0'
            "
            size="small"
            type="text"
            @click="backReport(scope.row.id, scope.row.taskId)"
            >归还证照</el-button
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
            :disabled="isAdd === 1"
            :remote-method="remoteMethod"
            @change="handleChangeName"
          >
            <el-option
              v-for="item in userInfoOptions"
              :key="`${item.id}-${item.name}-${item.sfzh}`"
              :label="`${item.name}-${item.employer}-${item.sfzh}`"
              :value="`${item.id}-${item.name}-${item.sfzh}`"
            >
            </el-option>
          </el-select>
          <span
            style="color: red"
            v-if="abroadForm.leaveCountry.baType != 30 && isAdd != 1"
            >只有已备案人员能够发起出国（境）审批
          </span>
        </el-form-item>
        <el-row gutter="10">
          <el-col :span="12">
            <el-form-item label="性别">
              <el-select
                placeholder=" "
                v-model="abroadForm.leaveCountry.gender"
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
                v-model="abroadForm.leaveCountry.nation"
                placeholder=" "
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
                style="width: 300px"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生年月" prop="leaveCountry.csrq">
              <el-date-picker
                v-model="abroadForm.leaveCountry.csrq"
                type="date"
                placeholder="出生年月"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter="10">
          <el-col :span="12">
            <el-form-item label="入党时间" prop="leaveCountry.rdsj">
              <el-date-picker
                v-model="abroadForm.leaveCountry.rdsj"
                type="date"
                placeholder="入党时间"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="参加工作时间"
              prop="leaveCountry.cjgzsj"
              :rules="{
                required: true,
                message: '请输入参加工作时间',
                trigger: ['change', 'blur']
              }"
            >
              <el-date-picker
                v-model="abroadForm.leaveCountry.cjgzsj"
                type="date"
                placeholder="参加工作时间"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter="10">
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
                style="width: 300px"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="毕业院校"
              prop="leaveCountry.byyx"
              :rules="{
                required: true,
                message: '请输入毕业院校',
                trigger: ['change', 'blur']
              }"
            >
              <el-input
                maxlength="50"
                v-model="abroadForm.leaveCountry.byyx"
                style="width: 300px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter="10">
          <el-col :span="12">
            <el-form-item
              label="健康状况"
              prop="leaveCountry.jkzk"
              :rules="{
                required: true,
                message: '请输入健康状况',
                trigger: ['change', 'blur']
              }"
            >
              <el-input
                maxlength="20"
                v-model="abroadForm.leaveCountry.jkzk"
                style="width: 300px"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="国外通讯处（中文）"
              prop="leaveCountry.gwtxcChina"
              :rules="{
                required: true,
                message: '请输入国外通讯处（中文）',
                trigger: ['change', 'blur']
              }"
            >
              <el-input
                maxlength="100"
                v-model="abroadForm.leaveCountry.gwtxcChina"
                style="width: 300px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="国外通讯处（外文）"
              prop="leaveCountry.gwtxcEnglish"
              :rules="{
                required: true,
                message: '请输入国外通讯处（外文）',
                trigger: ['change', 'blur']
              }"
            >
              <el-input
                maxlength="100"
                v-model="abroadForm.leaveCountry.gwtxcEnglish"
                style="width: 300px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="简历"
              prop="leaveCountry.jl"
              :rules="{
                required: true,
                message: '请输入简历',
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
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="政治表现"
              prop="leaveCountry.zzbx"
              :rules="{
                required: true,
                message: '请输入政治表现',
                trigger: ['change', 'blur']
              }"
            >
              <el-input
                maxlength="1000"
                type="textarea"
                v-model="abroadForm.leaveCountry.zzbx"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          style="display: flex; justify-content: flex-end; margin-bottom: 10px"
          gutter="10"
          v-for="(item, index) in abroadForm.gngx.ftFamilyarr"
          :key="index"
        >
          <el-col :span="4"> 国内直系亲属及主要社会关系 : </el-col>
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
              v-if="index !== 0"
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
          style="display: flex; justify-content: flex-end; margin-bottom: 10px"
          gutter="10"
          v-for="(item, index) in abroadForm.gwgx.ftFamilyarr"
          :key="index"
        >
          <el-col :span="4"> 国外直系亲属及主要社会关系 : </el-col>
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
              v-if="index !== 0"
              type="text"
              style="color: red"
              @click="delGwAbroad(index)"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1">
            <el-button type="text" @click="addAbroadGw">新增</el-button>
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
                v-model="abroadForm.leaveCountry.startEndDate"
                type="daterange"
                range-separator="至"
                value-format="YYYY-MM-DD"
                placeholder="date"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :disabled-date="disableddate"
                @change="datePickerChange"
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
        <div class="flex-center mt-20">
          <el-button type="primary" @click="submit">提交</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog title="办(补)证详情" v-model="detailDialogVisible" width="800px">
      <el-row :gutter="20">
        <el-col :span="8">申请编号: bbz20220224001</el-col>
        <el-col :span="8">姓名: 张三</el-col>
        <el-col :span="8">身份证号: 330999199209091900</el-col>
      </el-row>
      <el-row class="mt-20" :gutter="20">
        <el-col :span="8">工作单位: 区纪委</el-col>
        <el-col :span="8">所在科室: 办公室</el-col>
        <el-col :span="8">职务: 主任</el-col>
      </el-row>
      <el-row class="mt-20">
        <el-col :span="2"> 办理证照: </el-col>
        <el-col :span="22">
          <el-table :data="cardList" style="width: 100%">
            <el-table-column prop="zzlx" label="证照类型" width="width">
            </el-table-column>
            <el-table-column prop="bzlx" label="办证类型" width="width">
            </el-table-column>
            <el-table-column prop="zzzt" label="制作状态" width="width">
            </el-table-column>
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
        <el-col :span="24" class="mt-20">
          <el-table :data="cardInfoList" style="width: 100%">
            <el-table-column prop="prop" label="证照类型" width="width">
            </el-table-column>
            <el-table-column prop="prop" label="证照编号" width="width">
            </el-table-column>
            <el-table-column prop="prop" label="签发地点" width="width">
            </el-table-column>
            <el-table-column prop="prop" label="签发时间" width="width">
            </el-table-column>
            <el-table-column prop="prop" label="有效期至" width="width">
            </el-table-column>
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
      title="出国(境)详情"
      v-model="abroadDialogVisible"
      width="1000px"
    >
      <div class="flex-center">
        状态:
        <span style="color: #70b603">{{
          applySatus[abroadDetail.applyStauts]
        }}</span>
      </div>
      <el-row class="mt-20" :gutter="20">
        <el-col :span="6">申请编号: {{ abroadDetail.applyNo }}</el-col>
        <el-col :span="6">姓名: {{ abroadDetail.name }}</el-col>
        <el-col :span="6">身份证号: {{ abroadDetail.sfzh }}</el-col>
        <el-col :span="6">工作单位: {{ abroadDetail.zgdw }}</el-col>
      </el-row>
      <el-row class="mt-20" :gutter="20">
        <el-col :span="6">所在科室: {{ abroadDetail.ks }}</el-col>
        <el-col :span="6">职务: {{ abroadDetail.zw }}</el-col>
        <el-col :span="6">性别: {{ genderEnum[abroadDetail.gender] }}</el-col>
        <el-col :span="6"
          >民族:
          {{
            filterType(abroadDetail.nation, lajw_ft_nation, "label", "value")
          }}</el-col
        >
      </el-row>
      <el-row class="mt-20" :gutter="20">
        <el-col :span="6">籍贯: {{ abroadDetail.nativePlace }}</el-col>
        <el-col :span="6">出生年月: {{ abroadDetail.csrq }}</el-col>
        <el-col :span="6">入党时间 : {{ formDate(abroadDetail.rdsj) }}</el-col>
        <el-col :span="6"
          >参加工作时间: {{ formDate(abroadDetail.cjgzsj) }}</el-col
        >
      </el-row>
      <el-row class="mt-20" :gutter="20">
        <el-col :span="6">学历: {{ abroadDetail.xl }}</el-col>
        <el-col :span="6">毕业院校: {{ abroadDetail.byyx }}</el-col>
        <el-col :span="6">健康状况 : {{ abroadDetail.jkzk }}</el-col>
        <el-col :span="6"
          >国外通讯处（中文）: {{ abroadDetail.gwtxcChina }}</el-col
        >
      </el-row>
      <el-row class="mt-20" :gutter="20">
        <el-col :span="6"
          >国外通讯处 （外文）: {{ abroadDetail.gwtxcEnglish }}</el-col
        >
        <el-col :span="6"
          >起止时间:
          {{ abroadDetail.spkssj + "至" + abroadDetail.spjssj }}</el-col
        >
        <el-col :span="6">出国(境)事由 : {{ abroadDetail.cgsy }}</el-col>
        <el-col :span="6">出国(境)目的地: {{ abroadDetail.spmdd }}</el-col>
      </el-row>
      <el-row class="mt-20" :gutter="20">
        <el-col>
          使用护照:
          <span
            style="margin-left: 20px"
            v-for="(item, index) in usLicense"
            :key="index"
            >{{ item.zjhm }}
            {{ item.hzlx ? "(" + zhlxDict[item.hzlx] + ")" : "" }}</span
          >
        </el-col>
      </el-row>
      <el-row class="mt-20">
        <el-col :span="24">
          简历:
          {{ abroadDetail.jl }}
        </el-col>
        <el-col :span="24" class="mt-20">
          政治表现: {{ abroadDetail.zzbx }}
        </el-col>
      </el-row>
      <el-row class="mt-20" v-if="gnftFamilyArr && gnftFamilyArr.length">
        <el-col :span="4">国内直系亲属及主要社会关系</el-col>
        <el-col :span="20">
          <el-table :data="gnftFamilyArr" style="width: 100%">
            <el-table-column prop="gx" label="关系" width="width">
            </el-table-column>
            <el-table-column prop="xm" label="姓名" width="width">
            </el-table-column>
            <el-table-column prop="lxfs" label="联系方式" width="width">
            </el-table-column>
            <el-table-column prop="zzmm" label="政治面貌" width="width">
            </el-table-column>
            <el-table-column prop="gzdw" label="工作单位" width="width">
            </el-table-column>
            <el-table-column prop="zw" label="职务" width="width">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row class="mt-20" v-if="gwftFamilyArr && gwftFamilyArr.length">
        <el-col :span="4">国外直系亲属及主要社会关系</el-col>
        <el-col :span="20">
          <el-table :data="gwftFamilyArr" style="width: 100%">
            <el-table-column prop="gx" label="关系" width="width">
            </el-table-column>
            <el-table-column prop="xm" label="姓名" width="width">
            </el-table-column>
            <el-table-column prop="lxfs" label="联系方式" width="width">
            </el-table-column>
            <el-table-column prop="zzmm" label="政治面貌" width="width">
            </el-table-column>
            <el-table-column prop="gzdw" label="工作单位" width="width">
            </el-table-column>
            <el-table-column prop="zw" label="职务" width="width">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <template v-if="activeStats === 0">
        <el-row class="mt-20" v-if="changeTravels && changeTravels.length">
          <el-col :span="4">行程变更记录</el-col>
          <el-col :span="20">
            <el-table :data="changeTravels" style="width: 100%">
              <el-table-column label="变更时间" width="width">
                <template #default="scope">
                  <span>{{ formDate(scope.row.createTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="变更内容" width="width">
                <template #default="scope">
                  <span v-if="scope.row.bghmdd"
                    >目的地变更为{{ scope.row.bghmdd }};</span
                  >
                  <span v-if="scope.row.bghkssj && scope.row.bghjssj"
                    >起止时间变更为{{ scope.row.bghkssj }}至{{
                      scope.row.bghjssj
                    }}</span
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row v-if="reports && reports.length">
          <el-col :span="4">报备记录</el-col>
          <el-col :span="20">
            <el-table :data="reports" style="width: 100%">
              <el-table-column prop="bbrq" label="报备时间" width="width">
              </el-table-column>
              <el-table-column label="报备类型" width="width">
                <template #default="scope">
                  <span>{{ bblxEnmus[scope.row.bblx] }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="bbnr" label="报备内容" width="width">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row class="mt-20">
          <el-col :span="24" class="font-weight">{{
            checkRole(["LSY"]) ? "联审记录" : "审批记录"
          }}</el-col>
          <el-timeline v-if="approve && approve.length" class="mt-20">
            <el-timeline-item
              v-for="(item, index) in approve"
              :key="index"
              :timestamp="
                item.createTime +
                '【' +
                item.deptName +
                '】' +
                item.approvalUserName
              "
              placement="top"
            >
              <el-card>
                <h4>
                  {{ item.taskName }}
                  <span v-show="item.result">：{{ item.result }}</span>
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
                <div>
                  <div v-if="item.bdcg" class="mt-20">
                    不得出国（境）情形：
                    <p v-for="(val, i) in item.bdcg" :key="i">
                      {{ i + 1 }}、{{
                        cantReview[val.value]?.text
                      }}
                      （详细说明：{{ val.describe }}）;
                    </p>
                  </div>

                  <div v-if="item.bycg" class="mt-20">
                    不宜出国（境）情形：
                    <p v-for="(val, i) in item.bycg" :key="i">
                      {{ i + 1 }}、{{
                        uncantReview[val.value]?.text
                      }}
                      （详细说明：{{ val.describe }}）;
                    </p>
                  </div>

                  <p v-if="item.bdby" class="mt-20">
                    联审建议：{{
                      bdbyEnum.find(k => k.label === item.bdby)?.text
                    }}
                  </p>

                  <ul v-if="item.files && item.files.length" class="mt-20">
                    <p>联审审批单：</p>
                    <li
                      v-for="(file, id) in item.files"
                      :key="id"
                      class="flex-between text-red mb-10"
                      style="width: 300px"
                    >
                      <span class="el-icon-document">
                        {{ file.attachName }}</span
                      >
                      <el-link
                        :href="file.attachPath"
                        target="_blank"
                        :underline="false"
                      >
                        <span class="text-primary">下载</span>
                      </el-link>
                    </li>
                  </ul>
                </div>
                <p v-if="item.taskName === '联审'">
                  <el-alert
                    :title="
                      typeof item.remark === 'string'
                        ? '备注：' + item.remark
                        : '备注：无'
                    "
                    type="info"
                    :closable="false"
                  />
                </p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-row>

        <el-row v-if="abroadDetail.applyStauts >= 5">
          <el-button type="primary" @click="checkApprovalForm"
            >查看电子审批单</el-button
          >
          <el-button type="primary" @click="downloadApprovalForm"
            >下载电子审批单</el-button
          >
        </el-row>
      </template>
      <template v-else-if="activeStats === 1">
        <h1 class="font-weight">联审</h1>
        <el-form ref="review" :model="reviewForm" label-width="170px">
          <div>
            <div class="mt-20 mb-20">
              审批内容: #{{
                filterType(
                  store.state.user.user.dept.deptName,
                  LSDW,
                  "remark",
                  "label"
                )
              }}#
            </div>
            <el-form-item
              label="不得出国（境）情形"
              prop="bdcj"
              :rules="{
                required: true,
                message: '请选择不得出国（境）情形',
                trigger: ['change', 'blur']
              }"
            >
              <el-radio-group v-model="reviewForm.bdcj">
                <el-radio :label="1">有</el-radio>
                <el-radio :label="2">无</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="reviewForm.bdcj === 1"
              prop="bdcjnrs"
              :rules="{
                required: true,
                message: '请选择不得出境内容',
                trigger: ['change', 'blur']
              }"
            >
              <el-checkbox-group v-model="reviewForm.bdcjnrs">
                <div v-for="(item, key) in cantReview" :key="key" class="mb-10">
                  <el-checkbox
                    class="checkbox-inner"
                    :label="key"
                    @change="changeCantReviewCheckbox(key, 'bdcjnrs')"
                    >{{ item.text }}
                  </el-checkbox>
                  <el-form
                    v-if="
                      reviewForm.bdcjnrs &&
                      reviewForm.bdcjnrs.indexOf(key) !== -1
                    "
                    :model="item"
                    ref="bdcjnrsForm"
                  >
                    <el-form-item
                      prop="describe"
                      :rules="{
                        required: true,
                        message: '请输入详细说明',
                        trigger: ['change', 'blur']
                      }"
                      class="mb-20"
                    >
                      <el-input
                        v-model="item.describe"
                        placeholder="详细说明"
                        type="textarea"
                        style="width: 90%"
                        maxlength="1000"
                        show-word-limit
                      ></el-input>
                    </el-form-item>
                  </el-form>
                </div>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item
              label="不宜出国（境）情形"
              prop="bycj"
              :rules="{
                required: true,
                message: '请选择不宜出国（境）情形',
                trigger: ['change', 'blur']
              }"
            >
              <el-radio-group v-model="reviewForm.bycj">
                <el-radio :label="1">有</el-radio>
                <el-radio :label="2">无</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              prop="bycjnrs"
              :rules="{
                required: true,
                message: '请选择不宜出境内容',
                trigger: ['change', 'blur']
              }"
              v-if="reviewForm.bycj === 1"
            >
              <el-checkbox-group v-model="reviewForm.bycjnrs">
                <div
                  v-for="(item, key) in uncantReview"
                  :key="key"
                  class="mb-10"
                >
                  <el-checkbox
                    class="checkbox-inner"
                    :label="key"
                    @change="changeCantReviewCheckbox(key, 'bycjnrs')"
                    >{{ item.text }}</el-checkbox
                  >
                  <el-form
                    v-if="
                      reviewForm.bycjnrs &&
                      reviewForm.bycjnrs.indexOf(key) !== -1
                    "
                    :model="item"
                    ref="bycjnrsForm"
                  >
                    <el-form-item
                      prop="describe"
                      :rules="{
                        required: true,
                        message: '请输入详细说明',
                        trigger: ['change', 'blur']
                      }"
                      class="mb-20"
                    >
                      <el-input
                        v-model="item.describe"
                        placeholder="详细说明"
                        type="textarea"
                        style="width: 90%"
                        maxlength="1000"
                        show-word-limit
                      ></el-input>
                    </el-form-item>
                  </el-form>
                </div>
              </el-checkbox-group>
            </el-form-item>
          </div>

          <el-form-item
            label="联审建议"
            prop="bdby"
            :rules="{
              required: true,
              message: '请选择联审建议',
              trigger: ['change', 'blur']
            }"
          >
            <el-radio-group v-model="reviewForm.bdby">
              <el-radio
                v-for="item in bdbyEnum"
                :key="item.label"
                :label="item.label"
                >{{ item.text }}</el-radio
              >
            </el-radio-group>
          </el-form-item>

          <el-form-item label="联审审批单" required>
            <wt-upload
              :fileList="fileList"
              @success="uploadSuccess"
              @remove="removeFile"
            >
              <template #download>
                <el-link
                  type="primary"
                  class="ml-20"
                  @click="handleDownloadTemplate"
                  >下载模板</el-link
                >
              </template>
            </wt-upload>
          </el-form-item>

          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              v-model="reviewForm.remark"
              maxlength="1000"
            ></el-input>
          </el-form-item>

          <div class="flex-center">
            <el-button type="primary" @click="submitReview">提交</el-button>
          </div>
        </el-form>
      </template>
      <template v-else-if="activeStats === 2">
        <el-row :gutter="10">
          <el-col :span="24" class="font-weight">{{
            checkRole(["LSY"]) ? "联审记录" : "审批记录"
          }}</el-col>
          <el-timeline v-if="approve && approve.length" class="mt-20">
            <el-timeline-item
              v-for="(item, index) in approve"
              :key="index"
              :timestamp="
                item.createTime +
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
                <div>
                  <div v-if="item.bdcg">
                    不得出国（境）情形：
                    <span v-for="(val, i) in item.bdcg" :key="i"
                      >{{ i + 1 }}、{{ cantReview[val.value]?.text }};</span
                    >
                  </div>

                  <div v-if="item.bycg">
                    不宜出国（境）情形：
                    <span v-for="(val, i) in item.bycg" :key="i"
                      >{{ i + 1 }}、{{ uncantReview[val.value]?.text }};</span
                    >
                  </div>

                  <p v-if="item.bdby" class="mt-20">
                    联审建议：{{
                      bdbyEnum.find(k => k.label === item.bdby)?.text
                    }}
                  </p>

                  <ul v-if="item.files && item.files.length" class="mt-20">
                    <p>联审审批单：</p>
                    <li
                      v-for="(file, id) in item.files"
                      :key="id"
                      class="flex-between text-red mb-10"
                      style="width: 300px"
                    >
                      <span class="el-icon-document">
                        {{ file.attachName }}</span
                      >
                      <el-link
                        :href="file.attachPath"
                        target="_blank"
                        :underline="false"
                      >
                        <span class="text-primary">下载</span>
                      </el-link>
                    </li>
                  </ul>
                </div>
                <p v-if="item.taskName === '联审'">
                  <el-alert
                    :title="
                      typeof item.remark === 'string'
                        ? '备注：' + item.remark
                        : '备注：无'
                    "
                    type="info"
                    :closable="false"
                  />
                </p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-row>
        <el-row class="mt-20">
          <el-col :span="24">审批</el-col>
        </el-row>
        <el-row v-if="abroadDetail.applyStauts >= 6">
          <el-button type="primary" @click="checkApprovalForm"
            >查看电子审批单</el-button
          >
          <el-button type="primary" @click="downloadApprovalForm"
            >下载电子审批单</el-button
          >
        </el-row>
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
            prop="files"
            :rules="{
              required: true,
              message: '请选择审批单',
              trigger: ['change', 'blur']
            }"
            label="审批单"
            v-if="acceptReviewForm.result === 0"
          >
            <wt-upload
              :fileList="fileList"
              @success="approveUploadSuccess"
              @remove="approveremoveFile"
            ></wt-upload>
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
      <el-form ref="approveFormRef" :model="approveForm">
        <el-form-item label="待领取的证照:">
          <el-col :span="24" v-for="(item, index) in usLicense" :key="index"
            >{{ index + 1 }}、{{ item.zjhm }}({{ zhlxDict[item.hzlx] }})</el-col
          >
        </el-form-item>
        <el-form-item
          label="请假审批单:"
          prop="file"
          :rules="{
            required: true,
            message: '请选择请假审批单',
            trigger: ['change', 'blur']
          }"
        >
          <wt-upload
            :fileList="approveFile"
            @success="approveSuccess"
            @remove="approveFail"
          ></wt-upload>
        </el-form-item>
      </el-form>
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
        <el-form-item label="申请编号" prop="spbb" required>
          <el-input v-model="reportedForm.spbb" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="userName" required>
          <el-input v-model="reportedForm.userName" disabled></el-input>
        </el-form-item>
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
            :default-value="new Date()"
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
    <el-dialog title="变更行程" v-model="tripDialogVisible" width="800px">
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
          <span v-for="item in usLicense" :key="item.id"
            >{{ item.zjhm
            }}{{ item.hzlx ? "(" + zhlxDict[item.hzlx] + ")" : "" }}</span
          >
        </el-col>
      </el-row>
      <div style="color: red">请选择变更项:</div>
      <el-form ref="tripFormref" :model="tripForm">
        <el-checkbox v-model="tripForm.isTime" label="1">起止时间</el-checkbox>
        <div class="flex-column-start">
          <el-form-item
            v-if="tripForm.isTime == 1"
            prop="startEndTime"
            :rules="{
              required: true,
              message: '请选择起止时间',
              trigger: ['change', 'blur']
            }"
          >
            <el-date-picker
              v-model="tripForm.startEndTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :disabled-date="disableddate"
              @change="dateStartChange"
            >
            </el-date-picker>
          </el-form-item>
          <el-checkbox v-model="tripForm.isMdd" label="1">目的地</el-checkbox>
          <el-form-item
            v-if="tripForm.isMdd == 1"
            style="margin-left: 20px"
            prop="bghmdd"
            :rules="{
              required: true,
              message: '请选择变更后目的地',
              trigger: ['change', 'blur']
            }"
          >
            <el-select
              v-model="tripForm.bghmdd"
              placeholder="目的地"
              filterable
              multiple
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
              <el-checkbox v-model="tripForm.isZz" label="1"
                >更换证照</el-checkbox
              >
              <span
                v-if="tripForm.isZz && zzList.length === 0"
                style="color: red"
                >暂无可更换证照</span
              >
              <template v-else>
                <el-row v-if="abroadDetail.applyStauts > 6 && tripForm.isZz">
                  <el-col
                    :span="24"
                    v-for="(item, index) in zzList"
                    :key="index"
                  >
                    <span
                      >{{ item.hzlx ? zhlxDict[item.hzlx] : ""
                      }}{{ item.zjhm }}</span
                    >
                    <el-button
                      @click="handleZz(item, index)"
                      type="text"
                      class="ml-10"
                      >{{ item.status === 10 ? "归还" : "领取" }}</el-button
                    >
                  </el-col>
                </el-row>
                <el-checkbox-group
                  @change="changeCheckBox"
                  v-model="tripForm.list"
                  v-else-if="abroadDetail.applyStauts < 7 && tripForm.isZz"
                >
                  <el-checkbox
                    :label="item"
                    v-for="(item, index) in zzList"
                    :key="index"
                  >
                    {{ item.hzlx ? zhlxDict[item.hzlx] : "" }}({{
                      item.zjhm
                    }})</el-checkbox
                  >
                </el-checkbox-group>
              </template>
            </div>
          </el-form-item>
        </div>
        <div class="flex-center">
          <el-button type="primary" @click="tripSubmit">提交申请</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog v-model="isShowPrint" width="700px">
      <Print
        :printObj="abroadDetail"
        :showDownload="showDownload"
        :gnftFamilyArr="gnftFamilyArr"
        :gwftFamilyArr="gwftFamilyArr"
      />
    </el-dialog>
    <el-dialog v-model="delVisable" width="700px" title="撤销审批">
      <div>确认撤销审批并归还以下证照?</div>
      <div v-for="(item, index) in usLicense" :key="index">
        {{ index + 1 }}、{{ item.zjhm }} {{ "(" + zhlxDict[item.hzlx] + ")" }}
      </div>
      <div class="flex-center">
        <el-button type="default" @click="delVisable = !delVisable"
          >取消</el-button
        >
        <el-button type="primary" @click="delLicense">归还证照并撤销</el-button>
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
// import FileUpload from '@/components/FileUpload/index.vue';
import { getToken } from "@/utils/auth";
import { ElMessageBox, ElMessage } from "element-plus";
// import ImageUpload from '@/components/ImageUpload/index.vue';
import { useStore } from "vuex";
import { checkRole } from "@/utils/permission.js";
import {
  qgAbbrove,
  getAbroadWaitList,
  getUserInfo,
  addUserInfo,
  useLicense,
  getPersonInfoData,
  getPersonJianLi,
  getAbroadDetail,
  editInfo,
  reviewAbroad,
  getCreateByme,
  getHasCreate,
  receiveReport,
  backReportdema,
  leavecallBackProcess,
  reported,
  changesTrip,
  getAllReports,
  getAllCountry,
  getAllListByQg,
  listDept,
  downloadQgTemplate
} from "@/api/abroad/index.js";
import Print from "./print.vue";
import { downloadFile } from "@/utils/download";
import { queryParams2FormData } from "@/utils/ruoyi";
import { zhlxDict } from "@/constant/abroad";
export default defineComponent({
  name: "index",
  props: {},
  components: {
    // FileUpload,
    // ImageUpload,
    // ElMessageBox,
    // ElMessage,
    Print
  },
  setup() {
    const isShowPrint = ref(false);
    const showDownload = ref(false);
    const store = useStore();
    const form = reactive({
      type: 1,
      // 待办页面入口 自动条件过滤
      ...queryParams2FormData("status", "isBb", "content")
    });
    form.status = form.status?.split(",");

    const loading = ref(false);
    const reportedDialog = ref(false);
    const tripDialogVisible = ref(false);
    const userList = ref([]);
    let userInfoOptions = ref([]);
    const nortanForm = reactive([]);
    const tripForm = reactive({ bgx: [] });
    const reports = ref([]);
    let activeStats = ref(0);
    const acceptReviewForm = reactive({});
    const activeName = ref("0");
    // 待办页面入口 自动条件过滤
    activeName.value = queryParams2FormData("activeName").activeName || "0";

    const reportedForm = reactive({ bblx: 0, bbrq: new Date() });
    const zzList = ref([]);
    const allCountryList = ref([]);
    const fileList = ref([]);
    const folderFileList = ref([]);
    const ftFamilyItems = {
      xm: "",
      gx: "",
      lxfs: "",
      zzmm: "",
      gzdw: "",
      zw: ""
    };
    const abroadForm = reactive({
      leaveCountry: {},
      gngx: {
        ftFamilyarr: [{ ...ftFamilyItems, gxlx: 1 }]
      },
      gwgx: {
        ftFamilyarr: [{ ...ftFamilyItems, gxlx: 2 }]
      }
    });
    const genderEnum = { 0: "男", 1: "女", 2: "未知" };
    const bblxEnmus = { 0: "日常报备", 1: "异常报备" };
    const applySatus = {
      0: "专管员确认中",
      2: "联审中",
      5: "单位审批中",
      6: "待领用证照",
      7: "待出国(境)",
      8: "待回国",
      9: "待归还证照",
      10: "已结束",
      11: "已撤销",
      12: "不通过"
    };
    const cantReview = reactive({
      1: {
        text: "被判处刑罚尚未执行完毕或者属于刑事案件被告人、犯罪嫌疑人的",
        value: 1,
        describe: ""
      },
      2: {
        text: "有未了结的民事案件，人民法院决定不准出境的",
        value: 2,
        describe: ""
      },
      3: {
        text: "可能逃往境外的被审查调查人以及涉案人员等相关人员",
        value: 3,
        describe: ""
      },
      4: {
        text: "因妨害国（边）境管理受到刑事处罚或被其他国家或者地区遣返，未满不准出境规定年限的",
        value: 4,
        describe: ""
      },
      5: {
        text: "认为涉密人员出境将对国家安全造成危害或对国家利益造成重大损失的",
        value: 5,
        describe: ""
      }
    });
    const uncantReview = reactive({
      1: {
        text: "本人、配偶和直系亲属涉及重大民事诉讼案件情况，相关案件侦办尚未结案的",
        value: 1,
        describe: ""
      },
      2: {
        text: "本人、配偶和直系亲属涉及重大民事诉讼案件或被列为失信被执行人的",
        value: 2,
        describe: ""
      },
      3: {
        text: "本人、配偶和直系亲属近期发生大额资金、资产异动的",
        value: 3,
        describe: ""
      },
      4: {
        text: "近1年内存在违规出国（境）情形的",
        value: 4,
        describe: ""
      },
      5: {
        text: "因疫情防控等政策要求不宜出国（境）的",
        value: 5,
        describe: ""
      },
      6: {
        text: "联审单位认为不宜出国（境）的其他情形",
        value: 6,
        describe: ""
      }
    });
    const bdbyEnum = [
      {
        label: 1,
        text: "未发现不得/不宜出国（境）情形"
      },
      {
        label: 2,
        text: "建议不得出国（境）"
      },
      {
        label: 3,
        text: "建议不宜出国（境）"
      }
    ];
    const changeCantReviewCheckbox = (key, type) => {
      if (type === "bdcjnrs") {
        cantReview[key].describe = "";
      } else {
        uncantReview[key].describe = "";
      }
    };
    const reviewForm = reactive({
      result: 0,
      bdcj: 1,
      bycj: 1
    });
    const detailDialogVisible = ref(false);
    const abroadDialogVisible = ref(false);
    const approveForm = reactive({});
    const receiveDialog = ref(false);
    const backReportDialog = ref(false);
    const delVisable = ref(false);
    const abroadDetail = ref({});
    const cardInfoList = ref([]);
    const isAdd = ref("");
    const abroadId = ref("");
    const reportForm = reactive({});
    const roleList = ref([]);
    const cardList = ref([]);
    const licenseList = ref([]);
    const usLicense = ref([]);
    const changeTravels = ref([]);
    const gnftFamilyArr = ref([]);
    const gwftFamilyArr = ref([]);
    const instanceId = ref("");
    const approve = ref([]);
    const approveFile = ref([]);
    const timer = ref("");
    const taskIds = ref(0);
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
    const { LSDW } = proxy.useDict("LSDW");
    const { country } = proxy.useDict("country");
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
    // proxy.$nextTick(() => {
    //   proxy.$refs.form.resetFields();
    // });

    function getRemark() {
      const deptName = store.state.user.user.dept.deptName;
      const lsy = LSDW.value.find(item => {
        return item.label == deptName;
      });
      return lsy;
    }

    getRemark();
    function backOut() {
      active.value = 1;
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
    function approveSuccess(e) {
      approveFile.value = Object.values(e);
      approveForm.file = approveFile.value.map(item => {
        return { attachName: item.name, attachPath: item.url };
      });
      proxy.$refs["approveFormRef"].clearValidate("file");
    }
    function approveFail(e) {
      approveFile.value = Object.values(e);
      approveForm.file = approveFile.value.map(item => {
        return { attachName: item.name, attachPath: item.url };
      });
    }
    function approveUploadSuccess(e) {
      fileList.value = Object.values(e);
      acceptReviewForm.files = fileList.value.map(item => {
        return { attachName: item.name, attachPath: item.url };
      });
      proxy.$refs["acceptReview"].clearValidate("files");
    }
    function approveremoveFile(e) {
      fileList.value = Object.values(e);
      acceptReviewForm.files = fileList.value.map(item => {
        return { attachName: item.name, attachPath: item.url };
      });
    }
    function delLicense() {
      leavecallBackProcess({ id: abroadId.value }).then(res => {
        proxy.$modal.msgSuccess("撤销成功");
        proxy.$tab.refreshPage();
      });
    }
    function submitRrported() {
      proxy.$refs["reportedRef"].validate(valid => {
        if (valid) {
          const prams = {
            ...reportedForm,
            bbrq: formDate(reportedForm.bbrq)
          };
          reported(prams).then(res => {
            proxy.$modal.msgSuccess("报备成功");
            proxy.$tab.refreshPage();
            reportedDialog.value = !reportedDialog.value;
          });
        }
      });
    }
    function resetForm() {
      form.content = "";
      form.spkssj = undefined;
      form.spjssj = undefined;
      form.status = undefined;
      form.deptId = undefined;
      form.isBb = "0";
      getList();
    }
    function openDia(row) {
      getAbroadDetail(row.id).then(res => {
        usLicense.value = res.data.useCertificates;
        abroadId.value = res.data.info.id;
      });
      row.applyStauts < 7
        ? ElMessageBox.alert("确认撤销审批?", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            title: "撤销证照",
            callback: action => {
              if (action === "confirm") {
                leavecallBackProcess({ id: row.id }).then(res => {
                  proxy.$modal.msgSuccess("撤销成功");
                  proxy.$tab.refreshPage();
                });
              }
            }
          })
        : (delVisable.value = true);
    }
    function getTime(beginTime, endTime) {
      var dateDiff = endTime.getTime() - beginTime.getTime(); //时间差的毫秒数
      var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
      return dayDiff;
    }
    function datePickerChange(e) {
      const date = new Date();
      const startMonth = new Date(e[0]).getMonth() + 1;
      const threeMonthAfter = date.getMonth() + 4;
      const startYear = new Date(e[0]).getFullYear();
      const threeYearAfter = date.getFullYear();
      const startTime = new Date(e[0]);
      const endTime = new Date(e[1]);
      const day = getTime(startTime, endTime);
      if (startYear > threeYearAfter || startMonth > threeMonthAfter) {
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
    function dateStartChange(e) {
      const date = new Date();
      const startMonth = new Date(e[0]).getMonth() + 1;
      const threeMonthAfter = date.getMonth() + 4;
      const startYear = new Date(e[0]).getFullYear();
      const threeYearAfter = date.getFullYear();
      const startTime = new Date(e[0]);
      const endTime = new Date(e[1]);
      const day = getTime(startTime, endTime);
      if (startYear > threeYearAfter || startMonth > threeMonthAfter) {
        proxy.$modal.msgError("不支持预约3个月以后的出国(境)审批!");
        tripForm.startEndTime = undefined;
        tripForm.bghkssj = undefined;
        tripForm.bghjssj = undefined;
        return;
      }
      if (day > 9) {
        proxy.$modal.msgError("出国(境)审批不能超过10天!");
        tripForm.startEndTime = undefined;
        tripForm.bghkssj = undefined;
        tripForm.bghjssj = undefined;
        return;
      }
      const herDay = getTime(abroadDetail.value.spkssj, tripForm.bghkssj);
      if (herDay > 29) {
        proxy.$modal.msgError("开始时间变更间隔不能大于30天！");
        tripForm.startEndTime = undefined;
        tripForm.bghkssj = undefined;
        tripForm.bghjssj = undefined;
        return;
      }
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

    function tripSubmit() {
      if (tripForm.startEndTime) {
        tripForm.bghkssj = formDate(tripForm.startEndTime[0]);
        tripForm.bghjssj = formDate(tripForm.startEndTime[1]);
      }
      proxy.$refs["tripFormref"].validate(valid => {
        if (valid) {
          const params = {
            ...tripForm,
            bgx: undefined,
            startEndTime: undefined,
            zh: undefined,
            bghmdd: tripForm.bghmdd ? tripForm.bghmdd.join(",") : undefined,
            isMdd: tripForm.isMdd ? 1 : 0,
            isTime: tripForm.isTime ? 1 : 0,
            isZz: tripForm.isZz ? 1 : 0,
            list: tripForm.list
          };
          changesTrip(params).then(res => {
            proxy.$tab.refreshPage();
            proxy.$modal.msgSuccess("发起行程变更成功");
            tripDialogVisible.value = !tripDialogVisible.value;
          });
        }
      });
    }
    function reportedAction({ instanceId, applyNo, name }) {
      reportedDialog.value = !reportedDialog.value;
      reportedForm.instanceId = instanceId;
      reportedForm.isQggb = 1; // qg:1 fgq:2
      reportedForm.spbb = applyNo;
      reportedForm.userName = name;
    }
    function disableddate(time) {
      return time.getTime() < Date.now() - 8.64e7;
    }
    function receivewReport(id, taskId) {
      receiveDialog.value = !receiveDialog.value;
      taskIds.value = taskId;
      getAbroadDetail(id).then(res => {
        usLicense.value = res.data.useCertificates;
      });
    }
    function backReport(id, taskId) {
      backReportDialog.value = !backReportDialog.value;
      taskIds.value = taskId;
      getAbroadDetail(id).then(res => {
        usLicense.value = res.data.useCertificates;
      });
    }
    function receiveReports() {
      proxy.$refs["approveFormRef"].validate(valid => {
        if (valid) {
          const params = {
            taskId: taskIds.value,
            result: 0,
            files: [...approveForm.file]
          };
          reviewAbroad(params).then(res => {
            receiveDialog.value = !receiveDialog.value;
            proxy.$modal.msgSuccess("领取成功");
            proxy.$tab.refreshPage();
          });
        }
      });
    }
    function getDept() {
      listDept(1).then(response => {
        roleList.value = response.data;
      });
    }
    getDept();
    function backReports() {
      const params = {
        taskId: taskIds.value,
        result: 0
      };
      reviewAbroad(params).then(res => {
        proxy.$modal.msgSuccess("归还成功");
        proxy.$tab.refreshPage();
        backReportDialog.value = !backReportDialog.value;
      });
      eport;
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
      queryParams.value.pageNum = 1;
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
          qgAbbrove(parmas).then(res => {
            proxy.$modal.msgSuccess("提交成功");
            proxy.$tab.refreshPage();
            abroadDialogVisible.value = !abroadDialogVisible.value;
          });
        }
      });
    }
    function filterNation(nation) {
      const nameObj = lajw_ft_nation.value.find(item => {
        return item.value == nation;
      });
      return nameObj.label;
    }
    function getAbroads(id, status, taskId) {
      getAbroadDetail(id).then(res => {
        abroadDetail.value = res.data.info;
        usLicense.value = res.data.useCertificates;
        gnftFamilyArr.value = res.data.families.filter(item => {
          return item.gxlx === 1;
        });
        gwftFamilyArr.value = res.data.families.filter(item => {
          return item.gxlx === 2;
        });
        changeTravels.value = res.data.changeTravels;
        approve.value = res.data.approve;
        reports.value = res.data.reports;
        taskIds.value = taskId;
      });
      activeStats.value = status;
      abroadDialogVisible.value = !abroadDialogVisible.value;
    }
    function changeCheckBox(e) {
      tripForm.list = e;
    }
    function handleZz(item, index) {
      if (item.status === 10) {
        proxy.$modal
          .confirm("确认归还证照?")
          .then(function () {})
          .then(() => {
            item.status = 20;
          });
      } else {
        proxy.$modal
          .confirm("确认领取证照?")
          .then(function () {})
          .then(() => {
            item.status = 10;
          });
      }
      zzList.value[index] = item;
      tripForm.list = zzList.value;
    }
    function submitReview() {
      proxy.$refs["review"].validate(valid => {
        if (valid) {
          let isAdopt = true;
          if (reviewForm.bdcj === 1) {
            for (
              let index = 0;
              index < proxy.$refs["bdcjnrsForm"].length;
              index++
            ) {
              proxy.$refs["bdcjnrsForm"][index].validate(valid => {
                if (!valid) {
                  isAdopt = false;
                  return;
                }
              });
            }
            if (!isAdopt) return;
            reviewForm.bdcg = [];
            for (let index = 0; index < reviewForm.bdcjnrs.length; index++) {
              const { value, describe } = cantReview[reviewForm.bdcjnrs[index]];
              reviewForm.bdcg.push({
                type: 2,
                value,
                describe
              });
            }
          } else {
            reviewForm.bdcg = [];
          }
          if (reviewForm.bycj === 1) {
            for (
              let index = 0;
              index < proxy.$refs["bycjnrsForm"].length;
              index++
            ) {
              proxy.$refs["bycjnrsForm"][index].validate(valid => {
                if (!valid) {
                  isAdopt = false;
                  return;
                }
              });
            }
            if (!isAdopt) return;
            reviewForm.bycg = [];
            for (let index = 0; index < reviewForm.bycjnrs.length; index++) {
              const { value, describe } =
                uncantReview[reviewForm.bycjnrs[index]];
              reviewForm.bycg.push({
                type: 1,
                value,
                describe
              });
            }
          } else {
            reviewForm.bycg = [];
          }

          if (!reviewForm.files || !reviewForm.files.length) {
            return proxy.$modal.msgError("请上传联审审批单");
          }

          const parmas = {
            ...reviewForm,
            taskId: taskIds.value
          };
          reviewAbroad(parmas).then(res => {
            proxy.$tab.refreshPage();
            proxy.$modal.msgSuccess("提交成功");
            abroadDialogVisible.value = !abroadDialogVisible.value;
          });
        }
      });
    }

    function handleAbroad(val, id, tId) {
      isAdd.value = val;
      abroadForm.leaveCountry = {};
      abroadForm.gngx.ftFamilyarr = [{ ...ftFamilyItems, gxlx: 1 }];
      abroadForm.gwgx.ftFamilyarr = [{ ...ftFamilyItems, gxlx: 2 }];
      abroadForm.useCertificates = [];

      proxy.$nextTick(() => {
        proxy.$refs["form"] && proxy.$refs["form"].resetFields();
      });

      if (isAdd.value && isAdd.value == 1) {
        title.value = "确认信息";
        getAbroadDetail(id).then(res => {
          abroadForm.leaveCountry = res.data.info;
          // 展示姓名格式 【姓名 主管单位 科室 职务 身份证号】
          const { name, zgdw, ks, sfzh } = abroadForm.leaveCountry;
          abroadForm.leaveCountry.name = `${name}-${zgdw}-${ks}-${sfzh}`;

          abroadForm.leaveCountry.gender = res.data.info.gender.toString();
          if (abroadForm.leaveCountry.nation) {
            abroadForm.leaveCountry.nation = res.data.info.nation.toString();
          }

          // 国内直系亲属及主要社会关系
          const arrGngxFamily = res.data.families.filter(
            item => item.gxlx === 1
          );
          abroadForm.gngx.ftFamilyarr = arrGngxFamily.length
            ? arrGngxFamily
            : [{ ...ftFamilyItems, gxlx: 1 }];

          // 国外直系亲属及主要社会关系
          const arrGwgxFamily = res.data.families.filter(
            item => item.gxlx === 2
          );
          abroadForm.gwgx.ftFamilyarr = arrGwgxFamily.length
            ? arrGwgxFamily
            : [{ ...ftFamilyItems, gxlx: 2 }];

          abroadForm.leaveCountry.startEndDate = [
            res.data.info.spkssj,
            res.data.info.spjssj
          ];
          const prams = {
            sfzh: abroadForm.leaveCountry.sfzh
          };

          useLicense(prams)
            .then(val => {
              licenseList.value = val.data;
            })
            .then(() => {
              abroadForm.useCertificates = res.data.useCertificates.map(
                item => {
                  return item.zzId;
                }
              );
            });
          abroadForm.leaveCountry.spmdd = res.data.info.spmdd.split(",");
          taskIds.value = tId;
        });
      } else {
        title.value = "发起出国(境)审批";
      }
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
    function changeTrip(id) {
      getAbroadDetail(id).then(res => {
        abroadDetail.value = res.data.info;
        tripForm.parentId = id;
        usLicense.value = res.data.useCertificates;
      });
      getAllReports(id).then(res => {
        zzList.value = res.data;
      });
      tripDialogVisible.value = !tripDialogVisible.value;
    }

    const loadLastFilledInfo = prams => {
      getPersonInfoData(prams).then(res => {
        const { leaveCountry, families } = res.data;
        let leaveCountryData = {};
        if (
          leaveCountry &&
          Object.keys(leaveCountry).length &&
          leaveCountry.constructor === Object
        ) {
          leaveCountryData = leaveCountry;
        }
        const { rdsj, cjgzsj, xl, byyx, jkzk, jl, zzbx } = leaveCountryData;
        abroadForm.leaveCountry.rdsj =
          rdsj && proxy.$dayjs(rdsj).format("YYYY-MM-DD");
        abroadForm.leaveCountry.cjgzsj =
          cjgzsj && proxy.$dayjs(cjgzsj).format("YYYY-MM-DD");
        abroadForm.leaveCountry.xl = xl;
        abroadForm.leaveCountry.byyx = byyx;
        abroadForm.leaveCountry.jkzk = jkzk;
        abroadForm.leaveCountry.jl = jl;
        abroadForm.leaveCountry.zzbx = zzbx;

        let familiesData = [];
        if (Array.isArray(families) && families.length) {
          familiesData = families;
        }
        // 国内直系亲属及主要社会关系
        const arrGngxFamily = familiesData.filter(item => item.gxlx === 1);
        abroadForm.gngx.ftFamilyarr = arrGngxFamily.length
          ? arrGngxFamily
          : [{ ...ftFamilyItems, gxlx: 1 }];

        // 国外直系亲属及主要社会关系
        const arrGwgxFamily = familiesData.filter(item => item.gxlx === 2);
        abroadForm.gwgx.ftFamilyarr = arrGwgxFamily.length
          ? arrGwgxFamily
          : [{ ...ftFamilyItems, gxlx: 2 }];

        // 新发起回显工作简历信息
        !jl && loadPersonJianLi(prams);
      });
    };
    const loadPersonJianLi = prams => {
      getPersonJianLi({ idCard: prams.sfzh }).then(res => {
        const jl = res.data.map(
          item =>
            `${item.startTime}至${item.endTime}-任${item.unitName}-${item.department}-${item.job}`
        );
        abroadForm.leaveCountry.jl = jl.join("\n");
      });
    };
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
      abroadForm.leaveCountry.csrq =
        selectInfo.csrq && proxy.$dayjs(selectInfo.csrq).format("YYYY-MM-DD");
      abroadForm.leaveCountry.zw = selectInfo.zw;
      abroadForm.leaveCountry.deptId = selectInfo.deptId;
      abroadForm.leaveCountry.ks = selectInfo.deptOfficeName;
      abroadForm.leaveCountry.baType = selectInfo.baType;
      abroadForm.leaveCountry.spmdd = [];
      abroadForm.leaveCountry.startEndDate = undefined;
      abroadForm.leaveCountry.spkssj = undefined;
      abroadForm.leaveCountry.spjssj = undefined;
      abroadForm.leaveCountry.cgsy = "";
      abroadForm.leaveCountry.gwtxcChina = "";
      abroadForm.leaveCountry.gwtxcEnglish = "";
      const prams = {
        sfzh: sfzh
      };
      useLicense(prams).then(res => {
        licenseList.value = res.data;
      });

      // 新发起回显上次出国境信息
      loadLastFilledInfo(prams);
    }
    function addAbroad() {
      abroadForm.gngx.ftFamilyarr.push({ ...ftFamilyItems, gxlx: 1 });
    }
    function addAbroadGw() {
      abroadForm.gwgx.ftFamilyarr.push({ ...ftFamilyItems, gxlx: 2 });
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
    function submit() {
      proxy.$refs.form.validate(valid => {
        if (valid) {
          if (isAdd.value && isAdd.value === 1) {
            const querParms = {
              info: {
                ...abroadForm,
                ftFamily: [
                  ...abroadForm.gngx.ftFamilyarr,
                  ...abroadForm.gwgx.ftFamilyarr
                ],
                gwgx: undefined,
                gngx: undefined
              }
            };
            querParms.info.leaveCountry.startEndDate = undefined;
            querParms.info.leaveCountry.spmdd =
              abroadForm.leaveCountry.spmdd.join(",");
            querParms.info.leaveCountry.name =
              abroadForm.leaveCountry.name?.split("-")[0];

            // 保存编辑入参
            editInfo(querParms.info).then(() => {
              // 审批入参
              const spPrams = {
                taskId: taskIds.value,
                result: 0
              };
              reviewAbroad(spPrams)
                .then(res => {
                  dialogVisible.value = !dialogVisible.value;
                  proxy.$tab.refreshPage();
                  proxy.$modal.msgSuccess("发起审批成功");
                })
                .catch(err => {
                  abroadForm.leaveCountry.spmdd =
                    abroadForm.leaveCountry.spmdd.split(",");
                });
            });
          } else {
            const nGngx = [...abroadForm.gngx.ftFamilyarr];
            const nGwgx = [...abroadForm.gwgx.ftFamilyarr];
            const newArr = [...nGngx, ...nGwgx];
            abroadForm.ftFamily = newArr;
            abroadForm.leaveCountry.type = 1;
            if (abroadForm.leaveCountry.startEndDate) {
              abroadForm.leaveCountry.spkssj = formDate(
                abroadForm.leaveCountry.startEndDate[0]
              );

              abroadForm.leaveCountry.spjssj = formDate(
                abroadForm.leaveCountry.startEndDate[1]
              );
            }
            abroadForm.leaveCountry.id = undefined;
            abroadForm.leaveCountry.name =
              abroadForm.leaveCountry.name.split("-")?.[1];
            const params = {
              ...abroadForm,
              gwgx: undefined,
              gngx: undefined
            };
            if (abroadForm.leaveCountry.spmdd) {
              params.leaveCountry.spmdd =
                abroadForm.leaveCountry.spmdd.join(",");
            }
            if (params.leaveCountry.startEndDate) {
              params.leaveCountry.startEndDate = undefined;
            }
            addUserInfo(params)
              .then(res => {
                dialogVisible.value = !dialogVisible.value;
                proxy.$tab.refreshPage();
                proxy.$modal.msgSuccess("发起审批成功");
              })
              .catch(err => {
                abroadForm.leaveCountry.spmdd =
                  abroadForm.leaveCountry.spmdd.split(",");
              });
          }
        }
      });
    }
    function changeDialog() {
      dialogVisible.value = !dialogVisible.value;
    }
    function getList() {
      loading.value = true;
      form.startEnd = undefined;
      const params = Object.assign(queryParams.value, form);
      let getLists;
      if (activeName.value === "0") {
        getLists = getAbroadWaitList;
      } else if (activeName.value === "1") {
        getLists = getCreateByme;
      } else if (activeName.value === "2") {
        getLists = getHasCreate;
      } else {
        getLists = getAllListByQg;
      }
      getLists(params).then(res => {
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

    const handleDownloadTemplate = () => {
      downloadFile(downloadQgTemplate, "领导干部因私出国（境）联审审批表");
    };

    return {
      approveFile,
      isAdd,
      approveUploadSuccess,
      approveremoveFile,
      ...toRefs(data),
      disableddate,
      roleList,
      allCountryList,
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
      zzList,
      dynamicValidateForm,
      active,
      nortanForm,
      cantReview,
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
      gnftFamilyArr,
      gwftFamilyArr,
      abroadDetail,
      approve,
      country,
      changeTravels,
      uncantReview,
      changeCantReviewCheckbox,
      reports,
      activeStats,
      instanceId,
      taskIds,
      activeName,
      backReportDialog,
      reportedForm,
      store,
      filterNation,
      handleZz,
      changeCheckBox,
      handleSelectMdd,
      tripSubmit,
      changeDialog,
      changeTrip,
      submitRrported,
      reportedAction,
      openDia,
      backReports,
      backReport,
      receiveReports,
      receivewReport,
      delLicense,
      submitReview,
      hasReviewSubmit,
      delGnAbroad,
      delGwAbroad,
      submit,
      getAbroads,
      addAbroadGw,
      jobGroupFormat,
      addAbroad,
      dateChange,
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
      resetForm,
      checkRole,
      LSDW,
      abroadId,
      getRemark,
      bblxEnmus,
      filterType,
      checkApprovalForm,
      downloadApprovalForm,
      isShowPrint,
      showDownload,
      folderFileList,
      fileList,
      delVisable,
      uploadSuccess,
      removeFile,
      getList,
      datePickerChange,
      getTime,
      dateStartChange,
      approveSuccess,
      approveFail,
      approveForm,
      handleDownloadTemplate,
      bdbyEnum
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
.font-weight {
  font-weight: 600;
  font-size: 18px;
  margin: 40px 0 0;
}
</style>
