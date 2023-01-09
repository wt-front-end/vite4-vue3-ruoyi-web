<template>
  <div style="border: 1px solid #ccc;width:100%" v-if="showModel">
    <div style="border: 1px solid #ccc;text-align: center;" @click="showModel=false">关闭源码</div>
    <el-input v-model="valueHtml" :autosize="{ minRows: 10,minCols: 10 }" type="textarea" placeholder="粘贴源码到此处" />
  </div>
  <div style="border: 1px solid #ccc" v-else>
    <!-- 工具栏 -->
    <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" style="border-bottom: 1px solid #ccc" />
    <!-- 编辑器 -->
    <Editor v-model="valueHtml" :defaultConfig="editorConfig" @onChange="handleChange" @onCreated="handleCreated"
      @onDestroyed="handleDestroyed" @onFocus="handleFocus" @onBlur="handleBlur" @customAlert="customAlert"
      @customPaste="customPaste" style="height: 500px" />
  </div>
</template>

<script setup name="wtEditor">
import { Boot } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import $api from "@/api";
const emit = defineEmits(['change', 'input', "update:modelValue"]);
const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  modelValue: {
    type: String,
    default: ''
  },
  readOnly: {
    type: Boolean,
    default: false
  }
});
let MyButonid = 'MyButon' + Math.random().toString(16).slice(2)
let showModel = ref(false)
class MyButtonMenu {
  constructor() {
    this.title = '源码',
      this.tag = 'button'
  }
  getValue () { return '' }
  isActive () { return false }
  isDisabled () { return false }
  exec (editor) {
    console.log(editor, showModel)
    showModel.value = true
  }
}
const menuConf = {
  key: MyButonid,
  factory () {
    return new MyButtonMenu()
  },
}
Boot.registerMenu(menuConf)
// 编辑器实例，必须用 shallowRef ，重要！
const editorRef = shallowRef()
// 内容 HTML
const valueHtml = computed({
  get: () => props.modelValue || props.value || '',
  set: val => {
    emit('update:modelValue', val)
  }
})
// 编辑器配置
const editorConfig = {
  MENU_CONF: {
    uploadImage: {
      // 自定义上传
      async customUpload (file, insertFn) {  // TS 语法
        const formData = new FormData()
        formData.append('pathPrefix', 'js-web')
        formData.append('file', file)
        $api.editUploadOss(formData).then((res) => {
          insertFn(res.data.url, file.name, '')
        })
      }
    }
  }, readOnly: props.readOnly, placeholder: '请输入内容...', showLinkVideo: false
}
// 工具栏配置
const toolbarConfig = {
  insertKeys: {
    index: 0, // 插入的位置，基于当前的 toolbarKeys
    keys: [MyButonid]
  },
  excludeKeys: [
    'uploadVideo',
  ]
}
// 编辑器回调函数
const handleCreated = (editor) => {
  console.log("created", editor);
  editorRef.value = editor // 记录 editor 实例，重要！
}
const handleChange = (editor) => {
  console.log("change:", editor.children);
  emit('change', editor.getHtml())
  emit('input', editor.getHtml())
}
const handleDestroyed = (editor) => {
  console.log('destroyed', editor)
}
const handleFocus = (editor) => {
  console.log('focus', editor)
}
const handleBlur = (editor) => {
  console.log('blur', editor)
}
const customAlert = (info, type) => {
  alert(`【自定义提示】${type} - ${info}`)
}
// const customPaste = (editor, event, callback) => {
//   const content = event.clipboardData.getData('text/html') // 获取粘贴的 html
//   // const rtf = event.clipboardData.getData('text/rtf')
//   // const text = event.clipboardData.getData('text/plain') // 获取粘贴的纯文本
//   if (content == '' && !content) return ''
//   const input = content
//   // 1. remove line breaks / Mso classes
//   const stringStripper = /(\n|\r| class=(")?Mso[a-zA-Z]+(")?)/g
//   let output = input.replace(stringStripper, ' ')
//   // 2. strip Word generated HTML comments
//   const commentSripper = new RegExp('<!--(.*?)-->', 'g')
//   output = output.replace(commentSripper, '')
//   let tagStripper = new RegExp('<(/)*(meta|link|span|\\?xml:|st1:|o:|font)(.*?)>', 'gi')
//   // 3. remove tags leave content if any
//   output = output.replace(tagStripper, '')
//   // 4. Remove everything in between and including tags '<style(.)style(.)>'
//   const badTags = ['style', 'script', 'applet', 'embed', 'noframes', 'noscript']

//   for (let i = 0; i < badTags.length; i++) {
//     tagStripper = new RegExp('<' + badTags[i] + '.*?' + badTags[i] + '(.*?)>', 'gi')
//     output = output.replace(tagStripper, '')
//   }
//   // 5. remove attributes ' style="..."'
//   const badAttributes = ['style', 'start']
//   for (let i = 0; i < badAttributes.length; i++) {
//     const attributeStripper = new RegExp(' ' + badAttributes[i] + '="(.*?)"', 'gi')
//     output = output.replace(attributeStripper, '')
//   }
//   // 自定义插入内容
//   editor.setHtml(output)
//   // 返回值（注意，vue 事件的返回值，不能用 return）
//   callback(false) // 返回 false ，阻止默认粘贴行为
//   // callback(true) // 返回 true ，继续默认的粘贴行为
// }
const customPaste = (editor, event, callback) => {
  console.log('ClipboardEvent 粘贴事件对象', event)
  const content = event.clipboardData.getData('text/html') // 获取粘贴的 html
  // 自定义插入内容
  editor.setHtml(output)
  callback(false) // 返回 false ，阻止默认粘贴行为
  // callback(true) // 返回 true ，继续默认的粘贴行为
}

// 及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  // 销毁，并移除 editor
  editor.destroy()
})
const getHtml = () => {
  const editor = editorRef.value
  if (editor == null) return
  return editor.getHtml()
}
</script>



<style src="@wangeditor/editor/dist/css/style.css">

</style>