<!--
 * @Date: 2022-11-02
 * @LastEditTime: 2022-12-06 14:03:13
 * @LastEditors: xkloveme
 * @FileDesc:选择地图经纬度
 * @FilePath: /js-web/src/packages/wt-map/wt-map.vue
 * @Copyright © xkloveme
-->
<template>
  <div class="wt-map">
    <el-dialog v-model="show" title="选择经纬度" width="60%" :before-close="handleClose">
      <h3 v-if="selectData.address">
        地址:{{ selectData.address }}&nbsp;经纬度:{{ selectData.location.lng }},{{
            selectData.location.lat
        }}
      </h3>
      <div class="serach-map">

        <div class="input-card">
          <div class="input-item">
            <div class="input-item-prepend"><span class="input-item-text">省</span></div>
            <select id='province' style="width:80px" @change="(e) => search(e, 'province')">
              <option value="">请选择</option>
              <option v-for="item in citySelect" :key="item.adcode" :value="item.name">{{ item.name }}</option>
            </select>
          </div>
          <div class="input-item">
            <div class="input-item-prepend"><span class="input-item-text">市</span></div>
            <select id='city' style="width:80px" @change="(e) => search(e, 'city')">
              <option value="">请选择</option>
              <option v-for="item in districtSelect" :key="item.adcode" :value="item.name">{{ item.name }}</option>
            </select>
          </div>
          <div class="input-item">
            <div class="input-item-prepend"><span class="input-item-text">区</span></div>
            <select id='district' style="width:80px" @change="(e) => search(e, 'district')">
              <option value="">请选择</option>
              <option v-for="item in areaSelect" :key="item.adcode" :value="item.name">{{ item.name }}</option>
            </select>
          </div>
        </div>
        <div class="search-div">
          <el-autocomplete style="width:300px;margin-left:0.4rem;" v-model="inputSearchVal" highlight-first-item
            size="large" :fetch-suggestions="searchKeyword" placeholder="请输入关键字搜索" @select="handleSelectPoint">
            <template #default="{ item }">
              <div class="value text-blue-400">{{ item.name }}</div>
              <span class="link ">地址:{{ item.address }}</span>
            </template>
          </el-autocomplete>
        </div>
      </div>
      <div class="relative">
        <div id="MAps" style="width: 55vw; height: 500px; margin: 0 auto;pointer-events: auto"></div>
        <img class="absolute w-5 h-5 top-1/2 left-1/2"
          src="//webapi.amap.com/ui/1.1/ui/misc/PositionPicker/assets/position-picker.png" alt="点位" srcset="">
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="show = false">取消</el-button>
          <el-button type="primary" @click="sure">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="wtMap">
import { nextTick } from 'vue';
import { MapLoader } from './map.js'
const emit = defineEmits(["update:modelValue", "handleSure"]);
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  row: {
    type: Object,
    default: () => { }
  },
  lnglat: {
    type: Array,
    default: () => []
  }
});
const show = computed({
  get: () => {
    return props.modelValue;
  },
  set: val => {
    emit("update:modelValue", val);
  }
});

watch(show, (newValue, oldValue) => {
  if (newValue) {
    MapLoader().then(
      () => {
        selectData.value={}
        initMaps()
      },
      e => {
        console.log('地图加载失败', e)
      },
    )
  }
})
function sure () {
  show.value = false
  emit('handleSure', selectData.value)
}
let MAps = null
let positionPicker = null//拖拽选址功能
let auto = null
let marker = null
let selectData = ref({})
let inputSearchVal = ref('')
let placeSearch = null
let district = null
let polygons = []
let citySelect = ref([]); // 省
let districtSelect = ref([]); // 市
let areaSelect = ref([]); // 区
let city = ref('')
function initMaps () {
  // 配置地图的基本显示
  MAps = new AMap.Map('MAps', {
    turboMode: true,
    showIndoorMap: true,
    defaultCursor: 'pointer',
    showBuildingBlock: true,
    showLabel: true,
    zoom: props.lnglat.length ? 17 : 9,
    center: props.lnglat.length ? props.lnglat : ['120.84559', '31.09993'], // 初始化地图中心点
  })
  if (!district) {
    //实例化DistrictSearch
    district = new AMap.DistrictSearch({
      subdistrict: 1, //获取边界不需要返回下级行政区
      extensions: 'all', //返回行政区边界坐标组等具体信息
    })
  }
  district.search('中国', function (status, result) {
    if (status == 'complete') {
      citySelect.value = result.districtList[0].districtList
    }
  });
  auto = new AMap.Autocomplete({
    input: "tipinput"
  });
  placeSearch = new AMap.PlaceSearch({})
  MAps.on('dragend', showInfoDragend);
  showInfoDragend()
}


function showInfoDragend () {
  let currentCenter = MAps.getCenter();
  AMap.plugin('AMap.Geocoder', function () {
    let geocoder = new AMap.Geocoder({
      // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
      city: city.value
    })
    let lnglat = [currentCenter.lng, currentCenter.lat]
    geocoder.getAddress(lnglat, function (status, result) {
      if (status === 'complete' && result.info === 'OK') {
        selectData.value.address = result.regeocode.formattedAddress
        selectData.value.location = {
          lng: currentCenter.lng,
          lat: currentCenter.lat
        }
      }
    })
  })
}
const searchKeyword = (queryString, cb) => {
  placeSearch.setCity(city.value);
  placeSearch.search(inputSearchVal.value, function (status, result) {
    // 查询成功时，result即对应匹配的POI信息
    if (status == 'complete') {
      cb(result.poiList.pois)
    } else {
      cb([])
    }
  })
}
function handleSelectPoint (item) {
  inputSearchVal.value = item.name
  if (marker) {
    marker.setMap(null);
    marker = null;
  }
  marker = new AMap.Marker({
    position: new AMap.LngLat(item.location.lng, item.location.lat),
    title: item.name
  });
  selectData.value.address = item.address
  selectData.value.location = {
    lng: item.location.lng,
    lat: item.location.lat
  }
  marker.setMap(MAps);
  MAps.setZoomAndCenter(18, [item.location.lng, item.location.lat]); //同时设置地图层级与中心点
}


function addBoundary (name = '', level = 'district') {
  district.setLevel(level); //行政区级别
  district.search(name, function (status, result) {
    if (JSON.stringify(result) !== '{}') {
      // 获取朝阳区的边界信息
      var bounds = result.districtList[0].boundaries
      //清空下一级别的下拉列表
      if (level === 'province') {
        districtSelect.value = []
        areaSelect.value = []
        districtSelect.value = result.districtList[0].districtList
      } else if (level === 'city') {
        areaSelect.value = []
        areaSelect.value = result.districtList[0].districtList
      }
      if (bounds) {
        for (var i = 0, l = bounds.length; i < l; i++) {
          //生成行政区划polygon
          var polygon = new AMap.Polygon({
            map: MAps,
            strokeWeight: 1,
            path: bounds[i],
            fillOpacity: 0.3,
            strokeColor: '#0091ea',
            fillColor: '#80d8ff',
            strokeStyle: 'dashed',
          })
          polygons.push(polygon)
        }
      }
      // 地图自适应
      MAps.setFitView()
    }
  })
}

function search (e, level) {
  //清除地图上所有覆盖物
  for (var i = 0, l = polygons.length; i < l; i++) {
    polygons[i].setMap(null);
  }
  if (e.target.value) {
    city.value = e.target.value
    addBoundary(e.target.value, level)
  } else {
    districtSelect.value = []
    areaSelect.value = []
  }
}
</script>

<style scoped lang="scss">
.wt-map {
  .search-div {
    display: flex;
    justify-content: flex-end;
    height: 40px;
    box-sizing: border-box;
    margin: 0.5rem 0;
  }

  .serach-map {
    display: flex;
    background-color: #fff;
    background-clip: border-box;
    border-width: 0;
    border-radius: 0.4rem;
    padding: 0.75rem 1.25rem;
  }

  .input-card {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    word-wrap: break-word;
    border-radius: .25rem;
    width: 100%;

    .input-item {
      position: relative;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-wrap: wrap;
      flex-wrap: wrap;
      -ms-flex-align: center;
      align-items: center;
      width: 100%;
      height: 3rem;
    }

    .input-item:last-child {
      margin-bottom: 0;
    }

    .input-item>select,
    .input-item>input[type=text],
    .input-item>input[type=date] {
      position: relative;
      -ms-flex: 1 1 auto;
      flex: 1 1 auto;
      width: 1%;
      margin-bottom: 0;
    }

    .input-item>select:not(:last-child),
    .input-item>input[type=text]:not(:last-child),
    .input-item>input[type=date]:not(:last-child) {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0
    }

    .input-item>select:not(:first-child),
    .input-item>input[type=text]:not(:first-child),
    .input-item>input[type=date]:not(:first-child) {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0
    }


    .input-item-text,
    input[type=text],
    input[type=date],
    select {
      height: calc(2.2rem + 2px);
    }

    .input-item-text {
      width: 2rem;
      text-align: justify;
      padding: 0.4rem;
      display: inline-block;
      text-justify: distribute-all-lines;
      /*ie6-8*/
      text-align-last: justify;
      /* ie9*/
      -moz-text-align-last: justify;
      /*ff*/
      -webkit-text-align-last: justify;
      /*chrome 20+*/
      -ms-flex-align: center;
      align-items: center;
      margin-bottom: 0;
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.5;
      color: #495057;
      text-align: center;
      white-space: nowrap;
      background-color: #e9ecef;
      border: 1px solid #ced4da;
      border-radius: .25rem;
      border-bottom-right-radius: 0;
      border-top-right-radius: 0;
    }

    .input-item-text input[type=checkbox],
    .input-item-text input[type=radio] {
      margin-top: 0
    }
  }

  select,
  input[type=text],
  input[type=date] {
    display: inline-block;
    width: 100%;
    padding: .375rem 1.75rem .375rem .75rem;
    line-height: 1.5;
    color: #495057;
    vertical-align: middle;
    background: #fff url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%23343a40' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E") no-repeat right .75rem center;
    background-size: 8px 10px;
    border: 1px solid #ced4da;
    border-radius: .25rem;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none
  }

  input[type=text],
  input[type=date] {
    background: #fff;
    padding: .375rem .75rem;
  }

  select:focus,
  input[type=text]:focus,
  input[type=date]:focus {
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 .1rem rgba(128, 189, 255, .1)
  }

  .btn:focus {
    outline: 0;
    box-shadow: none;
  }

  select:focus::-ms-value,
  input[type=text]:focus::-ms-value,
  input[type=date]:focus::-ms-value {
    color: #495057;
    background-color: #fff
  }

}
</style>
