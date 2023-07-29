<template>
  <drawerCom ref="drawer">
    <div class="box" :class="{ noTitleTop: !showData.title }">
      <div class="title">{{ showData.title }}</div>
      <div class="content" v-if="!showData.editable">
        <rich-text
          :nodes="showData.content + '&emsp;&emsp;'"
          class="span"
          @itemclick="itemclick"
        ></rich-text>
      </div>
      <div class="inputBox" v-else>
        <input
          class="inputDefault input"
          :placeholder="showData.placeholderText"
          v-model="inputModel"
        />
      </div>
      <div class="buttonBox">
        <div
          class="left com-button-line-gray buttonItem"
          @tap="clickHandler('cancel')"
          v-if="showData.showCancel"
        >
          {{ showData.cancelText }}
        </div>
        <div
          class="right com-button-solid-blue buttonItem"
          @tap="clickHandler('confirm')"
        >
          {{ showData.confirmText }}
        </div>
      </div>
    </div>
  </drawerCom>
</template>
<script setup>
import { ref } from 'vue'
	import drawerCom from '../drawer/drawer.vue'
const showData = ref({})
const inputModel = ref('')

const goPage = (url) => {
  uni.navigateTo({
    url
  })
}
const itemclickHandlerObj = {
  privacyPolicy: () => goPage('/pages/agreement/index?type=1'),
  userAgreement: () => goPage('/pages/agreement/index?type=2')
}
const itemclick = (e) => {
  // 这个是点击文本，如果文本中有链接之类的可以在这里处理
  console.log(e)
  const classType = e.detail.node.attrs.class
  if (classType) {
    console.log(classType)
    if (itemclickHandlerObj[classType]) {
      itemclickHandlerObj[classType]()
    }
  }
}

// 点击按钮
const clickHandler = (type) => {
  const res = {
    confirm: false,
    cancel: false,
    content: ''
  }
  res[type] = true
  // 文本框，将文本信息保存传给调用者
  if (showData.value.editable) {
    res.content = inputModel.value
  }
  // 关闭
  passClose(res)
  if (showData.value.success) {
    // 传信息
    showData.value.success(res)
  }
}
// 传递关闭信息
const passClose = (result) => {
  getApp().globalData.closePop({
    type: 'modalPop',
    result
  })
}
const drawer = ref()
const show = (data) => {
  // 保存信息，打开弹窗
  showData.value = data
  drawer.value.show()
}
// 关闭弹窗
const close = () => {
  drawer.value.close()
}
defineExpose({
  show,
  close
})
</script>
<style scoped lang="scss">
.box {
  width: 610rpx;
  padding: 26rpx 40rpx 60rpx;
  background: #ffffff;
  border-radius: 20rpx;
  font-size: 38rpx;
  .title {
    padding-top: 26rpx;
    text-align: center;
    font-weight: 500;
  }
  .content {
    padding-top: 27rpx;
    min-height: 67rpx;
    font-weight: 400;
    color: #a6a6a6;
    line-height: 48rpx;
    position: relative;
    text-align: center;
    .span {
      display: inline-block;
      text-align: left;
      text-indent: 2em;
    }
  }
  .inputBox {
    .input {
      padding-top: 30rpx;
      padding-bottom: 30rpx;
    }
  }
  .textAlign {
    text-align: center;
    text-indent: 0;
  }
  .buttonBox {
    width: 100%;
    display: flex;
    padding-top: 41rpx;
    .buttonItem {
      flex: 1;
      height: 90rpx;
      border-radius: 54rpx;
      font-size: 38rpx;
      font-weight: 500;
    }
    .left {
      margin-right: 30rpx;
      color:#1a1a1a;
    }
  }
}
.noTitleTop {
  padding-top: 49rpx;
}
</style>
