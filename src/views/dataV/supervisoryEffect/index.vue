<template>
  <div class="main p-4">
    <div v-for="(item, index) in tableList" :key="index">
      <div class="mb-2 flex justify-between">
        <div>{{ item.label }}</div>
        <!-- <el-button
          class="w-20"
          type="primary"
          plain
          size="small"
          @click="handleEdit(item, index)"
          >编辑</el-button
        > -->
      </div>
      <wt-table
        style="width: 700px"
        ref="wtTableList"
        :columns="item.newColumns"
        :tableData="item.tableData"
        :isDataV="false"
        :index="false"
        :isShowPagination="false"
        :isBorder="true"
        :operation="['edit']"
        @handleEdit="handleEdit"
      >
      </wt-table>
    </div>
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="450px"
      center
    >
      <el-form
        :model="queryParams"
        ref="formRef"
        :inline="true"
        label-width="100px"
      >
        <el-form-item
          :label="item.label"
          :prop="item.prop"
          v-for="(item, index) in newColumns"
          :key="index"
          :rules="index != 0 ? rules.number : ''"
        >
          <div v-if="index == 0">{{ queryParams.qy }}</div>
          <div class="flex-center" v-else>
            <el-input
              v-model.number="queryParams[item.prop]"
              style="width: 250px"
            ></el-input>
            <div class="ml4">{{ item.suffix }}</div>
          </div>
        </el-form-item>
      </el-form>
      <div class="flex-center">
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import $api from "@/api";
const { proxy } = getCurrentInstance();
const props = defineProps({});
const route = useRoute();
const formRef = ref(null);
const tableList = ref([
  {
    label: "协同监督",
    newColumns: [
      {
        label: "区域",
        prop: "qy"
      },
      {
        label: "发现问题",
        prop: "fxwt",
        suffix: "个",
        formatter: (row, column) => {
          return (row.fxwt || 0) + "个";
        }
      },
      {
        label: "整改问题",
        prop: "zgwt",
        suffix: "个",
        formatter: (row, column) => {
          return (row.zgwt || 0) + "个";
        }
      },
      {
        label: "问题处置",
        prop: "wtcz",
        suffix: "条",
        formatter: (row, column) => {
          return (row.wtcz || 0) + "条";
        }
      },
      {
        label: "责任追究",
        prop: "zrzj",
        suffix: "人",
        formatter: (row, column) => {
          return (row.zrzj || 0) + "人";
        }
      }
    ]
  },
  {
    label: "毗邻监督",
    newColumns: [
      {
        label: "区域",
        prop: "qy"
      },
      {
        label: "发现问题",
        prop: "fxwt",
        suffix: "个",
        formatter: (row, column) => {
          return (row.fxwt || 0) + "个";
        }
      },
      {
        label: "整改问题",
        prop: "zgwt",
        suffix: "个",
        formatter: (row, column) => {
          return (row.zgwt || 0) + "个";
        }
      },
      {
        label: "行政处罚",
        prop: "xzcf",
        suffix: "件",
        formatter: (row, column) => {
          return (row.xzcf || 0) + "件";
        }
      },
      {
        label: "责任追究",
        prop: "zrzj",
        suffix: "人",
        formatter: (row, column) => {
          return (row.zrzj || 0) + "人";
        }
      }
    ]
  },
  {
    label: "项目监督",
    newColumns: [
      {
        label: "区域",
        prop: "qy"
      },
      {
        label: "发现问题",
        prop: "fxwt",
        suffix: "个",
        formatter: (row, column) => {
          return (row.fxwt || 0) + "个";
        }
      },
      {
        label: "整改问题",
        prop: "zgwt",
        suffix: "个",
        formatter: (row, column) => {
          return (row.zgwt || 0) + "个";
        }
      },
      {
        label: "监察建议",
        prop: "jcjy",
        suffix: "条",
        formatter: (row, column) => {
          return (row.jcjy || 0) + "条";
        }
      },
      {
        label: "责任追究",
        prop: "zrzj",
        suffix: "人",
        formatter: (row, column) => {
          return (row.zrzj || 0) + "人";
        }
      }
    ]
  },
  {
    label: "嵌入监督",
    newColumns: [
      {
        label: "区域",
        prop: "qy"
      },
      {
        label: "实时预警",
        prop: "ssyj",
        suffix: "条",
        formatter: (row, column) => {
          return (row.ssyj || 0) + "条";
        }
      },
      {
        label: "预警整改",
        prop: "yjzg",
        suffix: "条",
        formatter: (row, column) => {
          return (row.yjzg || 0) + "条";
        }
      },
      {
        label: "问题处置",
        prop: "wtcz",
        suffix: "条",
        formatter: (row, column) => {
          return (row.wtcz || 0) + "条";
        }
      },
      {
        label: "责任追究",
        prop: "zrzj",
        suffix: "人",
        formatter: (row, column) => {
          return (row.zrzj || 0) + "人";
        }
      }
    ]
  },
  {
    label: "群众监督",
    newColumns: [
      {
        label: "区域",
        prop: "qy"
      },
      {
        label: "群众举报",
        prop: "qzjb",
        suffix: "条",
        formatter: (row, column) => {
          return (row.qzjb || 0) + "条";
        }
      },
      {
        label: "经查属实",
        prop: "jcss",
        suffix: "条",
        formatter: (row, column) => {
          return (row.jcss || 0) + "条";
        }
      },
      {
        label: "问题线索",
        prop: "wtxs",
        suffix: "条",
        formatter: (row, column) => {
          return (row.wtxs || 0) + "条";
        }
      },
      {
        label: "责任追究",
        prop: "zrzj",
        suffix: "人",
        formatter: (row, column) => {
          return (row.zrzj || 0) + "人";
        }
      }
    ]
  }
]);
const newColumns = ref([]);
const rules = ref({
  qy: [
    {
      required: true,
      message: "请选择",
      trigger: "change"
    }
  ],
  number: [
    {
      required: true,
      message: "请输入",
      trigger: "change"
    },
    { pattern: /^\+?[0-9]\d*$/, message: "请输入正确的数字" }
  ]
});
const dialogVisible = ref(false);
const queryParams = ref({});
const dialogTitle = ref("");
// 编辑
function handleEdit(row) {
  let labelList = ["协同监督", "毗邻监督", "项目监督", "嵌入监督", "群众监督"];
  dialogTitle.value = `编辑${labelList[row.type - 1]}`;
  dialogVisible.value = true;
  let obj = JSON.parse(JSON.stringify(row));
  queryParams.value = obj;
  formRef.value && formRef.value.resetFields();
  newColumns.value = tableList.value[row.type - 1].newColumns;
}
// 保存
function handleSave() {
  formRef.value.validate(valid => {
    if (valid) {
      $api.getJdxyEdit(queryParams.value).then(res => {
        if (res.code == 200) {
          getData();
          proxy.$modal.msgSuccess(res.msg);
        }
      });
      dialogVisible.value = false;
    }
  });
}
function getData() {
  $api.getJdxyList().then(res => {
    for (let item in res.data) {
      if (res.data[item][0].type == item) {
        tableList.value[item - 1].tableData = res.data[item];
      }
    }
  });
}
onMounted(() => {
  getData();

  // tableList.value.map(item => {
  //   item.tableData = [
  //     {
  //       qy: "青浦",
  //       fxwt: "6",
  //       zgwt: "6",
  //       wtcz: "6",
  //       zrzj: "6"
  //     },
  //     {
  //       qy: "吴江",
  //       fxwt: "6",
  //       zgwt: "6",
  //       wtcz: "6",
  //       zrzj: "6"
  //     }
  //   ];
  // });
});
</script>

<style scoped lang="scss"></style>
