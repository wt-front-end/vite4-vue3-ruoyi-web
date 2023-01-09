<template>
  <div style="padding: 20px 40px">
    <el-card>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="全部" name="1">
          <el-form
            :model="queryParams1"
            ref="queryForm1"
            :inline="true"
            label-width="83px"
          >
            <el-form-item label="备案批号" prop="applyNo">
              <el-input
                style="width: 180px"
                v-model="queryParams1.applyNo"
                placeholder="请输入备案批号"
                clearable
                size="small"
              />
            </el-form-item>
            <el-form-item label="填表日期" prop="ruleName">
              <!-- <el-date-picker
                v-model="queryParams1.tbrq"
                type="date"
                placeholder="选择填表日期"
              >
              </el-date-picker> -->
              <el-date-picker
                v-model="dateRange"
                size="small"
                style="width: 240px"
                value-format="YYYY-MM-DD"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="change1"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="备案状态" prop="pcbazt">
              <el-select
                v-model="queryParams1.pcbazt"
                placeholder="请选择备案状态"
                clearable
                size="small"
              >
                <el-option
                  v-for="dict in ft_ryba_pcbazt"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" size="small" @click="handleQuery"
                >搜索</el-button
              >
              <el-button size="small" @click="reset">重置</el-button>
            </el-form-item>
            <el-table
              v-loading="loading"
              :data="userList"
              @selection-change="handleSelectionChange"
            >
              <el-table-column label="序号" type="index" align="center" />
              <el-table-column
                label="备案批号"
                align="center"
                prop="applyNo"
                width="130"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                label="填表日期"
                align="center"
                prop="tbrq"
                width="160"
              >
                <template #default="scope">
                  <span>{{ scope.row.tbrq.substring(0, 10) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="报备单位名称"
                align="center"
                prop="bbdwmc"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                label="报备单位联系人"
                align="center"
                prop="bbdwlxr"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                label="联系电话"
                align="center"
                prop="lxdh"
                width="120"
              />
              <el-table-column label="审批状态" align="center">
                <template #default="scope">
                  {{ spOption[scope.row.applyStatus] }}
                  <!-- {{ sqztOption[scope.row.pcbazt] }} -->
                </template>
              </el-table-column>
              <!-- <el-table-column label="公安操作状态" align="center">
                <template #default="scope">
                  {{ gaOption[scope.row.gaczzt] }}
                </template>
              </el-table-column> -->
              <el-table-column
                label="审批时间"
                align="center"
                prop="spsj"
                width="160"
              >
                <template #default="scope">
                  <span>{{ parseTime(scope.row.spsj) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="审批意见"
                align="center"
                prop="spyj"
                width="120"
              />
              <el-table-column label="备案状态" align="center">
                <template #default="scope">
                  <dict-tag
                    :options="ft_ryba_pcbazt"
                    :value="scope.row.pcbazt"
                  />
                </template>
              </el-table-column>

              <el-table-column
                label="操作"
                align="center"
                width="160"
                class-name="small-padding fixed-width"
              >
                <template #default="scope">
                  <el-button
                    size="small"
                    type="text"
                    icon="el-icon-edit"
                    @click="handleDetail(scope.row)"
                    >查看</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <pagination
              v-show="total1 > 0"
              :total="total1"
              v-model:page="queryParams1.pageNum"
              v-model:limit="queryParams1.pageSize"
              @pagination="handleQuery"
            />
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="待我处理" name="2">
          <el-form
            :model="queryParams2"
            ref="queryForm1"
            :inline="true"
            label-width="83px"
          >
            <el-form-item label="备案批号" prop="applyNo">
              <el-input
                style="width: 180px"
                v-model="queryParams2.applyNo"
                placeholder="请输入备案批号"
                clearable
                size="small"
              />
            </el-form-item>
            <el-form-item label="填表日期" prop="ruleName">
              <!-- <el-date-picker
                v-model="queryParams2.tbrq"
                type="date"
                placeholder="选择填表日期"
              >
              </el-date-picker> -->
              <el-date-picker
                v-model="dateRange1"
                size="small"
                style="width: 240px"
                value-format="YYYY-MM-DD"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="change2"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="备案状态" prop="type">
              <el-select
                v-model="queryParams2.pcbazt"
                placeholder="请选择备案状态"
                clearable
                size="small"
              >
                <el-option
                  v-for="dict in ft_ryba_pcbazt"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" size="small" @click="handleQuery1"
                >搜索</el-button
              >
              <el-button size="small" @click="reset1">重置</el-button>
            </el-form-item>
            <el-table
              v-loading="loading"
              :data="waitList"
              @selection-change="handleSelectionChange"
            >
              <el-table-column label="序号" type="index" align="center" />
              <el-table-column
                label="备案批号"
                align="center"
                width="130"
                prop="applyNo"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                label="填表日期"
                align="center"
                prop="tbrq"
                width="160"
              >
                <template #default="scope">
                  <span>{{ scope.row.tbrq.substring(0, 10) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="报备单位名称"
                align="center"
                prop="bbdwmc"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                label="报备单位联系人"
                align="center"
                prop="bbdwlxr"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                label="联系电话"
                align="center"
                prop="lxdh"
                width="120"
              />
              <el-table-column label="审批状态" align="center">
                <template #default="scope">
                  {{ spOption[scope.row.applyStatus] }}
                  <!-- {{ sqztOption[scope.row.pcbazt] }} -->
                </template>
              </el-table-column>
              <!-- <el-table-column label="公安操作状态" align="center">
                <template #default="scope">
                  {{ gaOption[scope.row.gaczzt] }}
                </template>
              </el-table-column> -->
              <el-table-column
                label="审批时间"
                align="center"
                prop="spsj"
                width="160"
              >
                <template #default="scope">
                  <span>{{ parseTime(scope.row.spsj) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="审批意见"
                align="center"
                prop="spyj"
                width="120"
              />
              <el-table-column label="备案状态" align="center">
                <template #default="scope">
                  <dict-tag
                    :options="ft_ryba_pcbazt"
                    :value="scope.row.pcbazt"
                  />
                </template>
              </el-table-column>

              <el-table-column
                label="操作"
                align="center"
                width="160"
                class-name="small-padding fixed-width"
              >
                <template #default="scope">
                  <el-button
                    size="small"
                    type="text"
                    icon="el-icon-edit"
                    @click="handleDetail(scope.row)"
                    >查看</el-button
                  >
                  <el-button
                    size="small"
                    type="text"
                    icon="el-icon-key"
                    v-if="scope.row.pcbazt == 0 && scope.row.applyStatus == 0"
                    @click="handleBasp(scope.row)"
                    >备案审批</el-button
                  >
                  <el-button
                    size="small"
                    type="text"
                    icon="el-icon-key"
                    v-if="scope.row.gaczzt == 0"
                    @click="handleZtbg(scope.row)"
                    >备案状态变更</el-button
                  >
                  <el-button
                    size="small"
                    type="text"
                    icon="el-icon-key"
                    v-if="scope.row.pcbazt == 3 && scope.row.applyStatus == 0"
                    @click="handleCxsp(scope.row)"
                    >撤销备案审批</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <pagination
              v-show="total2 > 0"
              :total="total2"
              v-model:page="queryParams2.pageNum"
              v-model:limit="queryParams2.pageSize"
              @pagination="handleQuery1"
            />
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="我发起的" name="3">
          <el-form
            :model="queryParams1"
            ref="queryForm1"
            :inline="true"
            label-width="83px"
          >
            <el-form-item label="备案批号" prop="applyNo">
              <el-input
                style="width: 180px"
                v-model="queryParams3.applyNo"
                placeholder="请输入备案批号"
                clearable
                size="small"
              />
            </el-form-item>
            <el-form-item label="填表日期" prop="ruleName">
              <!-- <el-date-picker
                v-model="queryParams3.tbrq"
                type="date"
                placeholder="选择填表日期"
              >
              </el-date-picker> -->
              <el-date-picker
                v-model="dateRange2"
                size="small"
                style="width: 240px"
                value-format="YYYY-MM-DD"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="change3"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="备案状态" prop="type">
              <el-select
                v-model="queryParams3.pcbazt"
                placeholder="请选择备案状态"
                clearable
                size="small"
              >
                <el-option
                  v-for="dict in ft_ryba_pcbazt"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" size="small" @click="handleQuery2"
                >搜索</el-button
              >
              <el-button size="small" @click="reset2">重置</el-button>
            </el-form-item>
            <el-table
              v-loading="loading"
              :data="startList"
              @selection-change="handleSelectionChange"
            >
              <el-table-column label="序号" type="index" align="center" />
              <el-table-column
                label="备案批号"
                align="center"
                width="130"
                prop="applyNo"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                label="填表日期"
                align="center"
                prop="tbrq"
                width="160"
              >
                <template #default="scope">
                  <span>{{ scope.row.tbrq.substring(0, 10) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="报备单位名称"
                align="center"
                prop="bbdwmc"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                label="报备单位联系人"
                align="center"
                prop="bbdwlxr"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                label="联系电话"
                align="center"
                prop="lxdh"
                width="120"
              />
              <el-table-column label="审批状态" align="center">
                <template #default="scope">
                  {{ spOption[scope.row.applyStatus] }}
                </template>
              </el-table-column>
              <!-- <el-table-column label="公安操作状态" align="center">
                <template #default="scope">
                  {{ gaOption[scope.row.gaczzt] }}
                </template>
              </el-table-column> -->
              <el-table-column
                label="审批时间"
                align="center"
                prop="spsj"
                width="160"
              >
                <template #default="scope">
                  <span>{{ parseTime(scope.row.spsj) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="审批意见"
                align="center"
                prop="spyj"
                width="120"
              />
              <el-table-column label="备案状态" align="center">
                <template #default="scope">
                  <dict-tag
                    :options="ft_ryba_pcbazt"
                    :value="scope.row.pcbazt"
                  />
                </template>
              </el-table-column>

              <el-table-column
                label="操作"
                align="center"
                width="160"
                class-name="small-padding fixed-width"
              >
                <template #default="scope">
                  <el-button
                    size="small"
                    type="text"
                    icon="el-icon-edit"
                    @click="handleDetail(scope.row)"
                    >查看</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <pagination
              v-show="total3 > 0"
              :total="total3"
              v-model:page="queryParams3.pageNum"
              v-model:limit="queryParams3.pageSize"
              @pagination="handleQuery2"
            />
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="我已处理" name="4">
          <el-form
            :model="queryParams4"
            ref="queryForm1"
            :inline="true"
            label-width="83px"
          >
            <el-form-item label="备案批号" prop="applyNo">
              <el-input
                style="width: 180px"
                v-model="queryParams4.applyNo"
                placeholder="请输入备案批号"
                clearable
                size="small"
              />
            </el-form-item>
            <el-form-item label="填表日期" prop="ruleName">
              <!-- <el-date-picker
                v-model="queryParams4.tbrq"
                type="date"
                placeholder="选择填表日期"
              >
              </el-date-picker> -->
              <el-date-picker
                v-model="dateRange"
                size="small"
                style="width: 240px"
                value-format="YYYY-MM-DD"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="change4"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="备案状态" prop="type">
              <el-select
                v-model="queryParams4.pcbazt"
                placeholder="请选择备案状态"
                clearable
                size="small"
              >
                <el-option
                  v-for="dict in ft_ryba_pcbazt"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" size="small" @click="handleQuery3"
                >搜索</el-button
              >
              <el-button size="small" @click="reset3">重置</el-button>
            </el-form-item>
            <el-table
              v-loading="loading"
              :data="dealList"
              @selection-change="handleSelectionChange"
            >
              <el-table-column label="序号" type="index" align="center" />
              <el-table-column
                label="备案批号"
                align="center"
                prop="applyNo"
                width="130"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                label="填表日期"
                align="center"
                prop="tbrq"
                width="160"
              >
                <template #default="scope">
                  <span>{{ scope.row.tbrq.substring(0, 10) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="报备单位名称"
                align="center"
                prop="bbdwmc"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                label="报备单位联系人"
                align="center"
                prop="bbdwlxr"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                label="联系电话"
                align="center"
                prop="lxdh"
                width="120"
              />
              <el-table-column label="审批状态" align="center">
                <template #default="scope">
                  {{ spOption[scope.row.applyStatus] }}
                </template>
              </el-table-column>
              <!-- <el-table-column label="公安操作状态" align="center">
                <template #default="scope">
                  {{ gaOption[scope.row.gaczzt] }}
                </template>
              </el-table-column> -->
              <el-table-column
                label="审批时间"
                align="center"
                prop="spsj"
                width="160"
              >
                <template #default="scope">
                  <span>{{ parseTime(scope.row.spsj) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="审批意见"
                align="center"
                prop="spyj"
                width="120"
              />
              <el-table-column label="备案状态" align="center">
                <template #default="scope">
                  <dict-tag
                    :options="ft_ryba_pcbazt"
                    :value="scope.row.pcbazt"
                  />
                </template>
              </el-table-column>

              <el-table-column
                label="操作"
                align="center"
                width="160"
                class-name="small-padding fixed-width"
              >
                <template #default="scope">
                  <el-button
                    size="small"
                    type="text"
                    icon="el-icon-edit"
                    @click="handleDetail(scope.row)"
                    >查看</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <pagination
              v-show="total4 > 0"
              :total="total4"
              v-model:page="queryParams4.pageNum"
              v-model:limit="queryParams4.pageSize"
              @pagination="handleQuery3"
            />
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 查看 -->
    <el-dialog :title="title" v-model="open" width="1000px" append-to-body>
      <el-table
        v-loading="loading"
        :data="form.ryList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="序号" type="index" align="center" />
        <el-table-column
          label="姓名"
          align="center"
          prop="xm"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="出生日期"
          align="center"
          prop="csrq"
          width="160"
        >
          <template #default="scope">
            <span>{{ scope.row.csrq.substring(0, 10) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="性别"
          align="center"
          prop="xb"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="身份证号"
          align="center"
          prop="sfzh"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="工作单位"
          align="center"
          prop="gzdw"
          width="120"
        />
        <el-table-column label="职务（级）或职称" align="center" prop="zj" />
        <el-table-column
          label="人事主管单位"
          align="center"
          prop="rszgdw"
          width="160"
        />
        <el-table-column
          label="户口所在地"
          align="center"
          prop="hkszd"
          width="120"
        />
      </el-table>
      <el-form
        :model="form"
        :rules="rules"
        ref="userRef"
        style="margin-top: 15px"
        label-width="180px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="报备单位联系人：" prop="xm">
              {{ form.bbdwlxr }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话：" prop="createTime">
              {{ form.lxdh }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="组织机构代码（9位）：" prop="csrq">
              {{ form.zzjgdm }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="填表日期：" prop="xb">
              {{ form.tbrq }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单位负责人签字：" prop="sfzh">
              {{ form.dwfzrqm }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报备单位名称（盖章）：" prop="gzdw">
              {{ form.bbdwmc }}
            </el-form-item>
            <img
              :src="img"
              alt=""
              v-if="form.applyStatus == 1"
              style="
                width: 100px;
                height: 100px;
                position: relative;
                left: 200px;
                top: -80px;
              "
            />
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleDownload">下 载</el-button>
          <el-button @click="open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog :title="title1" v-model="open1" width="1000px" append-to-body>
      <el-table
        v-loading="loading"
        :data="form1.ryList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="序号" type="index" align="center" />
        <el-table-column
          label="姓名"
          align="center"
          prop="xm"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="出生日期"
          align="center"
          prop="csrq"
          width="160"
        >
          <template #default="scope">
            <span>{{ scope.row.csrq.substring(0, 10) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="性别"
          align="center"
          prop="xb"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="身份证号"
          align="center"
          prop="sfzh"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="工作单位"
          align="center"
          prop="gzdw"
          width="120"
        />
        <el-table-column label="职务（级）或职称" align="center" prop="zj" />
        <el-table-column
          label="人事主管单位"
          align="center"
          prop="rszgdw"
          width="160"
        />
        <el-table-column
          label="户口所在地"
          align="center"
          prop="hkszd"
          width="120"
        />
      </el-table>
      <el-form
        :model="form"
        :rules="rules"
        ref="userRef"
        style="margin-top: 15px"
        label-width="180px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="报备单位联系人：" prop="xm">
              {{ form1.bbdwlxr }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话：" prop="createTime">
              {{ form1.lxdh }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="组织机构代码（9位）：" prop="csrq">
              {{ form1.zzjgdm }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="填表日期：" prop="xb">
              {{ form1.tbrq }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单位负责人签字：" prop="sfzh">
              {{ form1.dwfzrqm }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报备单位名称（盖章）：" prop="gzdw">
              {{ form1.bbdwmc }}
            </el-form-item>
            <img
              :src="img"
              alt=""
              v-if="form1.applyStatus == 1"
              style="
                width: 100px;
                height: 100px;
                position: relative;
                left: 200px;
                top: -80px;
              "
            />
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="refuse">审批</el-button>
          <el-button @click="open1 = false" style="margin-left: 12px"
            >取消</el-button
          >
        </div>
      </template>
    </el-dialog>
    <el-dialog :title="title2" v-model="open2" width="1000px" append-to-body>
      <el-table
        v-loading="loading"
        :data="form2.ryList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="序号" type="index" align="center" />
        <el-table-column
          label="姓名"
          align="center"
          prop="xm"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="出生日期"
          align="center"
          prop="csrq"
          width="160"
        >
          <template #default="scope">
            <span>{{ scope.row.csrq.substring(0, 10) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="性别"
          align="center"
          prop="xb"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="身份证号"
          align="center"
          prop="sfzh"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="工作单位"
          align="center"
          prop="gzdw"
          width="120"
        />
        <el-table-column label="职务（级）或职称" align="center" prop="zj" />
        <el-table-column
          label="人事主管单位"
          align="center"
          prop="rszgdw"
          width="160"
        />
        <el-table-column
          label="户口所在地"
          align="center"
          prop="hkszd"
          width="120"
        />
      </el-table>
      <el-form
        :model="form"
        :rules="rules"
        ref="userRef"
        style="margin-top: 15px"
        label-width="180px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="报备单位联系人：" prop="xm">
              {{ form2.bbdwlxr }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话：" prop="createTime">
              {{ form2.lxdh }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="组织机构代码（9位）：" prop="csrq">
              {{ form2.zzjgdm }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="填表日期：" prop="xb">
              {{ form2.tbrq }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单位负责人签字：" prop="sfzh">
              {{ form2.dwfzrqm }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报备单位名称（盖章）：" prop="gzdw">
              {{ form2.bbdwmc }}
            </el-form-item>
            <img
              :src="img"
              v-if="form2.applyStatus == 1"
              alt=""
              style="
                width: 100px;
                height: 100px;
                position: relative;
                left: 200px;
                top: -80px;
              "
            />
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="refuse1">审批</el-button>
          <el-button @click="open2 = false" style="margin-left: 12px"
            >取消</el-button
          >
        </div>
      </template>
    </el-dialog>

    <el-dialog :title="title3" v-model="open3" width="600px" append-to-body>
      <el-form
        :model="form"
        :rules="rules"
        ref="userRef"
        style="margin-top: 15px"
        label-width="180px"
      >
        <el-form-item label="审批结果：" prop="spjg">
          <el-radio-group v-model="spjg">
            <el-radio :label="0">通过</el-radio>
            <el-radio :label="1">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审批意见：" prop="spyj">
          <el-input
            v-model="spyj"
            :rows="2"
            type="textarea"
            placeholder="审批意见"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="sure">确定</el-button>
          <el-button @click="cancel1" style="margin-left: 12px">取消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog :title="title4" v-model="open4" width="600px" append-to-body>
      <el-form
        :model="form"
        :rules="rules"
        ref="userRef"
        style="margin-top: 15px"
        label-width="180px"
      >
        <el-form-item label="备案状态" prop="pcbazt">
          <el-select
            v-model="pcbazt"
            placeholder="请选择备案状态"
            clearable
            size="small"
          >
            <el-option
              v-for="dict in ft_ryba_pcbazt"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="sure2">确定</el-button>
          <el-button @click="open4 = false" style="margin-left: 12px"
            >取消</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
const { proxy } = getCurrentInstance();
import {
  waitRybaAct,
  startRybaAct,
  dealRybaAct,
  getRyba,
  allListRybaAct,
  auditRybaAct,
  getSealPicSign,
  getPdfSign
} from "@/api/people/ry";
const router = useRouter();
const loading = ref(false);
const img = ref("");
const dateRange = ref([]);
const dateRange1 = ref([]);
const dateRange2 = ref([]);
const dateRange3 = ref([]);
const activeName = ref("1");
const total1 = ref(0);
const total2 = ref(0);
const total3 = ref(0);
const total4 = ref(0);
const pcbazt = ref("");
const rgbaId = ref("");
const open = ref(false);
const spyj = ref("");
const spjg = ref(0);
const open1 = ref(false);
const open2 = ref(false);
const open3 = ref(false);
const open4 = ref(false);
const title = ref("");
const title1 = ref("");
const title2 = ref("");
const title3 = ref("");
const title4 = ref("");
const taskId = ref("");
const name = ref(1);
const userList = ref([]);
const waitList = ref([]);
const startList = ref([]);
const dealList = ref([]);
const idDownload = ref("");
const spOption = { 0: "待审批", 1: "通过", 2: "不通过" };
const gaOption = { 0: "完成", 1: "失败" };
const { ft_ryba_pcbazt } = proxy.useDict("ft_ryba_pcbazt");
const data = reactive({
  form: {},
  form1: {},
  form2: {},
  queryParams1: {
    pageNum: 1,
    pageSize: 10,
    applyNo: "",
    pcbazt: "",
    beginTbrq: "",
    endTbrq: ""
  },
  queryParams2: {
    pageNum: 1,
    pageSize: 10,
    applyNo: "",
    pcbazt: "",
    beginTbrq: "",
    endTbrq: ""
  },
  queryParams3: {
    pageNum: 1,
    pageSize: 10,
    applyNo: "",
    pcbazt: "",
    beginTbrq: "",
    endTbrq: ""
  },
  queryParams4: {
    pageNum: 1,
    pageSize: 10,
    applyNo: "",
    pcbazt: "",
    beginTbrq: "",
    endTbrq: ""
  },
  typeOptions: [],
  spOptions: []
});
const {
  form,
  form1,
  form2,
  queryParams1,
  queryParams2,
  queryParams3,
  queryParams4,
  typeOptions,
  spOptions
} = toRefs(data);
function handleClick(tab, event) {
  console.log(tab.props.name, event);
  if (tab.props.name == 1) {
    loading.value = true;
    allListRybaAct(queryParams1.value).then(res => {
      loading.value = false;
      userList.value = res.rows;
      total1.value = res.total;
    });
  } else if (tab.props.name == 2) {
    loading.value = true;
    waitRybaAct(queryParams2.value).then(res => {
      loading.value = false;
      waitList.value = res.rows;
      total2.value = res.total;
    });
  } else if (tab.props.name == 3) {
    startRybaAct(queryParams3.value).then(res => {
      loading.value = false;
      startList.value = res.rows;
      total3.value = res.total;
    });
  } else if (tab.props.name == 4) {
    dealRybaAct(queryParams4.value).then(res => {
      loading.value = false;
      dealList.value = res.rows;
      total4.value = res.total;
    });
  }
}
// 重置
function reset() {
  dateRange.value = [];
  queryParams1.value = {
    applyNo: undefined,
    pcbazt: undefined,
    beginTbrq: "",
    endTbrq: "",
    pageNum: 1,
    pageSize: 10
  };
  handleQuery();
}
function reset1() {
  dateRange1.value = [];
  queryParams2.value = {
    applyNo: undefined,
    pcbazt: undefined,
    beginTbrq: "",
    endTbrq: "",
    pageNum: 1,
    pageSize: 10
  };
  handleQuery1();
}
// 下载
function handleDownload() {
  getPdfSign(idDownload.value).then(res => {
    window.open(
      res.msg.replace(
        "http://10.71.81.122:9998",
        "http://gscgj.gongshu.gov.cn/oss-res/"
      )
    );
  });
}
function reset2() {
  dateRange2.value = [];
  queryParams3.value = {
    applyNo: undefined,
    pcbazt: undefined,
    beginTbrq: "",
    endTbrq: "",
    pageNum: 1,
    pageSize: 10
  };
  handleQuery2();
}
function reset3() {
  dateRange3.value = [];
  queryParams4.value = {
    applyNo: undefined,
    pcbazt: undefined,
    beginTbrq: "",
    endTbrq: "",
    pageNum: 1,
    pageSize: 10
  };
  handleQuery3();
}
// /** 查询用户列表 */
// function getList() {
//   loading.value = true;
// }
function handleStatusChange() {}
function handleSelectionChange() {}
function handleQuery() {
  allListRybaAct(queryParams1.value, dateRange.value).then(res => {
    loading.value = false;
    userList.value = res.rows;
    total1.value = res.total;
  });
}
function handleQuery1() {
  waitRybaAct(queryParams2.value, dateRange1.value).then(res => {
    loading.value = false;
    waitList.value = res.rows;
    total2.value = res.total;
  });
}
function handleQuery2() {
  startRybaAct(queryParams3.value, dateRange2.value).then(res => {
    loading.value = false;
    startList.value = res.rows;
    total3.value = res.total;
  });
}
function handleQuery3() {
  dealRybaAct(queryParams4.value, dateRange3.value).then(res => {
    loading.value = false;
    dealList.value = res.rows;
    total4.value = res.total;
  });
}
handleQuery();
function handleReset() {}
function handleDetail(row) {
  idDownload.value = row.id;
  const id = row.id;
  const sealSn = row.zzjgdm;
  getSealPicSign({ sealSn: sealSn }).then(r => {
    img.value = "data:" + "image/png;base64," + r.data;
    console.log(img.value);
  });
  getRyba(id).then(response => {
    form.value = response.data;
    form.value.ryList = response.data.ryList;
    title.value = "查看";
    open.value = true;
  });
}
function handleBasp(row) {
  const id = row.id;
  const sealSn = row.zzjgdm;
  taskId.value = row.taskId;
  rgbaId.value = row.id;
  getSealPicSign({ sealSn: sealSn }).then(r => {
    img.value = "data:" + "image/png;base64," + r.data;
    console.log(img.value);
  });
  getRyba(id).then(response => {
    form1.value = response.data;
    form1.value.ryList = response.data.ryList;
    title1.value = "备案审批";
    open1.value = true;
  });
}
function handleCxsp(row) {
  const id = row.id;
  const sealSn = row.zzjgdm;
  taskId.value = row.taskId;
  rgbaId.value = row.id;
  getSealPicSign({ sealSn: sealSn }).then(r => {
    img.value = "data:" + "image/png;base64," + r.data;
    console.log(img.value);
  });
  getRyba(id).then(response => {
    form2.value = response.data;
    form2.value.ryList = response.data.ryList;
    title2.value = "撤销备案审批";
    open2.value = true;
  });
}
function refuse() {
  title3.value = "审批";
  open3.value = true;
}
// function agree() {
//   title3.value = '审批';
//   open3.value = true;
// }
function refuse1() {
  title3.value = "审批";
  open3.value = true;
}
// function agree1() {
//   title3.value = '审批';
//   open3.value = true;
// }
function sure() {
  let params = {
    rgbaId: rgbaId.value,
    spjg: spjg.value,
    spyj: spyj.value
  };
  auditRybaAct(params, taskId.value).then(r => {
    if (r.code == 200) {
      spjg.value = "";
      spyj.value = "";
      open3.value = false;
      open2.value = false;
      open1.value = false;
      proxy.$modal.msgSuccess("操作成功！");
      handleQuery1();
    }
  });
}
function change1(date) {
  if (date == null) {
    queryParams1.value.beginTbrq = "";
    queryParams1.value.endTbrq = "";
  } else {
    queryParams1.value.beginTbrq = date[0];
    queryParams1.value.endTbrq = date[1];
  }
}
function change2(date) {
  if (date == null) {
    queryParams2.value.beginTbrq = "";
    queryParams2.value.endTbrq = "";
  } else {
    queryParams2.value.beginTbrq = date[0];
    queryParams2.value.endTbrq = date[1];
  }
}
function change3(date) {
  if (date == null) {
    queryParams3.value.beginTbrq = "";
    queryParams3.value.endTbrq = "";
  } else {
    queryParams3.value.beginTbrq = date[0];
    queryParams3.value.endTbrq = date[1];
  }
}
function change4(date) {
  if (date == null) {
    queryParams4.value.beginTbrq = "";
    queryParams4.value.endTbrq = "";
  } else {
    queryParams4.value.beginTbrq = date[0];
    queryParams4.value.endTbrq = date[1];
  }
}
function cancel1() {
  spjg.value = "";
  spyj.value = "";
  open3.value = false;
}
function sure2() {
  let params = {
    rgbaId: rgbaId.value,
    pcbazt: pcbazt.value
  };
  auditRybaAct(params, taskId.value).then(r => {
    if (r.code == 200) {
      // spjg.value='';
      // spyj.value='';
      open4.value = false;
      open2.value = false;
      proxy.$modal.msgSuccess("操作成功！");
      handleQuery1();
    }
  });
}

function handleZtbg(row) {
  taskId.value = row.taskId;
  rgbaId.value = row.id;
  pcbazt.value = row.pcbazt.toString();
  title4.value = "备案状态变更";
  open4.value = true;
}
</script>
