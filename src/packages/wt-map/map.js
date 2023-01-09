/*
 * 异步创建script标签,加载amap地图
 */
import AMapLoader from '@amap/amap-jsapi-loader';
export function MapLoader () {
  // 安全密钥
  window._AMapSecurityConfig = {
    securityJsCode: '5fda8c0e32f2bc0ef9025dcb12ace754',
  }
  const key = 'a08a2a3e54269dffd35f5ec9191fcfaa'
  const plugin =
    ['ElasticMarker,AMap.DistrictSearch,AMap.RangingTool,AMap.Geolocation,AMap.LabelsLayer,AMap.PlaceSearch,AMap.Autocomplete,AMap.Geocoder']
  return new Promise((resolve, reject) => {
    AMapLoader.load({
      "key": key,              // 申请好的Web端开发者Key，首次调用 load 时必填
      "version": "1.4.15",    // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      "plugins": plugin,          // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      // AMapUI: {
      //   version: "1.1",
      //   plugins: ["misc/PositionPicker"]
      // },
      "Loca": {               // 是否加载 Loca， 缺省不加载
        "version": '1.3.2'  // Loca 版本，缺省 1.3.2
      }
    }).then(AMap => {
      window.AMap = AMap
      resolve(AMap)
    }).catch(e => {
      console.error(e);
      reject(e)
    })
  })
  // return new Promise((resolve, reject) => {
  //   if (window.AMap) {
  //     resolve(window.AMap)
  //   } else {
  //     var script = document.createElement('script')
  //     const key = 'a08a2a3e54269dffd35f5ec9191fcfaa'
  //     const plugin =
  //       'ElasticMarker,AMap.DistrictSearch,AMap.RangingTool,AMap.Geolocation,AMap.LabelsLayer,AMap.PlaceSearch,AMap.Autocomplete'
  //     script.type = 'text/javascript'
  //     script.async = true
  //     script.src = `https://webapi.amap.com/maps?v=1.4.15&callback=initAMap&key=${key}&plugin=${plugin}`
  //     script.onerror = reject
  //     document.head.appendChild(script)
  //   }
  //   window.initAMap = () => {
  //     resolve(window.AMap)
  //   }
  // })
}

export function MapLoaderUI () {
  return new Promise((resolve, reject) => {
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.onerror = reject
    script.src = `//webapi.amap.com/ui/1.1/main-async.js`
    document.head.appendChild(script);
    window.initAMapUI = () => {
      resolve(window.AMapUI)
    }
  })

}