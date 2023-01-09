<template>
  <el-table :data="dataList" border stripe :span-method="spanMethod">
    <el-table-column
      label="序号"
      align="center"
      width="100"
      type="index"
      :index="index => index + 1"
    />
    <el-table-column label="预警类别" width="200" align="center">
      <template #default="scope">
        <div>{{ scope.row.ruleType }}</div>
      </template>
    </el-table-column>

    <el-table-column label="预警规则" align="center" prop="ruleDesc">
      <template #default="scope">
        <!-- <rule-desc> -->
        {{ scope.row.ruleDesc }}
        <!-- </rule-desc> -->
      </template>
    </el-table-column>
    <!-- <el-table-column label="预警状态" width="200" align="center">
      <template #default="scope">
        <div>{{ scope.row.warningStatus == 0 ? "黄灯" : "红灯" }}</div>
      </template>
    </el-table-column> -->
    <el-table-column label="操作" align="center" prop="isDeleted" width="300">
      <template #default="scope">
        <el-radio-group
          v-model="scope.row.isDeleted"
          @change="onChangeRadio(scope.row)"
        >
          <el-radio :label="0">启用</el-radio>
          <el-radio :label="1">禁用</el-radio>
        </el-radio-group>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
const { proxy } = getCurrentInstance();
// import RuleDesc from "./RuleDesc";

const dataList = ref([
  {
    id: 10,
    ruleType: "出国（境）应批未批",
    ruleDesc: "纳管对象出国应批未批预警，则高风险预警提醒。",
    isDeleted: 0,
    warningStatus: 0
  },
  {
    id: 11,
    ruleType: "纳管人员应备未备",
    ruleDesc: "纳管对象存在应备案未备案预警，则中风险预警提醒。",
    isDeleted: 0,
    warningStatus: 0
  },
  {
    id: 12,
    ruleType: "证照应管未管",
    ruleDesc: "纳管对象存在应保管未保管证照预警，则高风险预警提醒。",
    isDeleted: 0,
    warningStatus: 0
  },
  {
    id: 13,
    ruleType: "自然年内多次出国（境）",
    ruleDesc: "纳管对象自然年内多次出境预警，则高风险预警提醒。",
    isDeleted: 0,
    warningStatus: 0
  },
  {
    id: 14,
    ruleType: "前往敏感地区",
    ruleDesc: "纳管对象出入境敏感地区预警，则低风险预警提醒。",
    isDeleted: 0,
    warningStatus: 0
  },
  {
    id: 15,
    ruleType: "实际与审批目的地不一致",
    ruleDesc: "纳管对象实际与审批目的地不一致预警，则高风险预警提醒。",
    isDeleted: 0,
    warningStatus: 0
  }
]);

const mergeTables = key => {
  const values = dataList.value.map(items => items[key]);
  const removalValues = [...new Set(values)];
  const result = [];
  const newArray = [];

  for (let index = 0; index < removalValues.length; index++) {
    const element = values.filter(item => item === removalValues[index]);
    result[index] = element.length;
  }

  for (let index = 0; index < result.length; index++) {
    const item = new window.Array();
    item.push(result[index]);
    item.length = result[index];
    newArray.push(...item);
  }
  return newArray;
};

let colRuleTypeRules = mergeTables("ruleType");

const spanMethod = ({ row, column, rowIndex, columnIndex }) => {
  if (columnIndex === 1) {
    const rowspan = colRuleTypeRules[rowIndex];
    if (rowspan) {
      return {
        rowspan,
        colspan: 1
      };
    } else {
      return {
        rowspan: 0,
        colspan: 0
      };
    }
  }
};

const onChangeRadio = () => {
  proxy.$modal.msgSuccess(`修改成功`);
};

const onRuleDesc = () => {
  proxy.$modal.msgSuccess(`修改成功`);
};
</script>
