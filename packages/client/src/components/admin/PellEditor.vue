<template>
  <div >
  <!-- can I enforce paste without styling? -->

    <div 
    class="border rounded broder-gray-400 p-0.5 min-h-[200px] focus:outline-none pb-10 resizable"
    @paste="onPaste"
    id="editor" ></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import pell from 'pell'
import {Icon} from '@iconify/vue'
const editor = ref(null)
const vhtml = defineModel()

const onPaste = (e) => {
  e.preventDefault()
  const text = e.clipboardData.getData('text/plain')
  document.execCommand('insertText', false, text)
}

onMounted(() => {
  editor.value = pell.init({
    element: document.getElementById('editor'),
    onChange: (html) => {
      html = html.replace(/<[^>]*style="[^"]*"[^>]*>/g, function (match) {
        if (match.includes('font-weight') || match.includes('font-style')) {
          return match
        } else {
          return match.replace(/style="[^"]*"/, '')
        }
      })

      html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      vhtml.value = html
      },
      defaultParagraphSeparator: 'p',
      styleWithCSS: true,
    actions: ['bold', 'italic', 'heading1', 'heading2', 'olist', 'ulist', 'link', 'code', 'line', 'quote',
      {
    name: 'clear',
    title: 'Clear format',
    icon: '<div class="text-xs text-gray-500">Unformat</div>',
    result: () => document.execCommand('formatBlock', false, 'div')
    },
    ,],
      
  })
    editor.value.content.innerHTML = vhtml.value
})
</script>

<style scoped>
:deep(.pell-content) {
  height: 300px;
  outline: 0;
  overflow-y: auto;
  padding: 10px;
}
:deep(.pell-actionbar) {
  @apply border-b border-gray-200;
}
:deep(.pell-button) {
  cursor: pointer;
  height: 30px;
  width: 34px;
  vertical-align: bottom;
}
/* :deep(.pell-button-selected) {
  background-color: #f0f0f0;
} */
.resizable {
  resize:both;
  overflow:auto; 
}
</style>
