<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item prop="personName">
        <el-input
          v-model="queryParams.personName"
          placeholder="请输入要搜索的队员名称"
          clearable
          size="small"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="Search"
          size="small"
          @click="handleQuery"
          >搜索</el-button
        >
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="menuList" row-key="menuId">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="序号" type="index" width="50" align="center">
        <template #default="scope">
          <span>{{
            (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1
          }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column type="index" :index="index" label="序号" width="100"></el-table-column> -->
      <el-table-column
        prop="name"
        label="姓名"
        :show-overflow-tooltip="true"
        width="160"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="orderNum"
        label="性别"
        width="60"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="age"
        label="年龄"
        :show-overflow-tooltip="true"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="component"
        label="工作单位"
        :show-overflow-tooltip="true"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="component1"
        label="职务（级）或职称"
        :show-overflow-tooltip="true"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="component2"
        label="申请出国时间"
        :show-overflow-tooltip="true"
        align="center"
      ></el-table-column>
      <el-table-column prop="createTime" label="回国时间" align="center">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="200"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button
            size="small"
            type="text"
            icon="Edit"
            @click="handleDetail(scope.row)"
            >查看详情</el-button
          >
          <el-button
            size="small"
            type="text"
            icon="Plus"
            @click="handleAdd(scope.row)"
            >录入回执</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script setup>
const { proxy } = getCurrentInstance();
const data = reactive({
  // form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    personName: undefined
  }
  // rules: {
  //   menuName: [{ required: true, message: "菜单名称不能为空", trigger: "blur" }],
  //   orderNum: [{ required: true, message: "菜单顺序不能为空", trigger: "blur" }],
  //   path: [{ required: true, message: "路由地址不能为空", trigger: "blur" }]
  // },
});
const { queryParams, form, rules } = toRefs(data);
const menuList = ref([]);
const loading = ref(true);
const total = ref(0);
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  console.log("搜索");
  // getList();
}
/** 查询菜单列表 */
function getList() {
  console.log("查询菜单列表");
  loading.value = true;
  menuList.value = [
    {
      menuId: 1,
      name: "张三",
      orderNum: "男",
      age: "41",
      component: "拱墅区纪律检查委员会",
      component1: "科员",
      component2: "2016-10-01",
      createTime: "2016-10-07"
    },
    {
      menuId: 2,
      name: "李四",
      orderNum: "女",
      age: "35",
      component: "拱墅区纪律检查委员会",
      component1: "科员",
      component2: "2017-05-09",
      createTime: "2017-05-19"
    }
  ];
  loading.value = false;
  total.value = 12;
  // listMenu(queryParams.value).then(response => {
  //   menuList.value = proxy.handleTree(response.data, "menuId");
  //   loading.value = false;
  // total.value = response.total;
  // });
}
function handleDetail() {
  console.log("查看详情");
}
function handleAdd() {
  console.log("录入回执");
}
getList();
</script>

<style lang="scss" scoped></style>
