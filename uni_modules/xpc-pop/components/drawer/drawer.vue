<template>
  <view class="lu-popup-wrapper" :class="popupClass" :style="popupStyle">
    <view
      class="lu-popup-content"
      :class="transitionClass"
      :style="[{ backgroundColor: backgroundColor }]"
    >
      <slot></slot>
    </view>
    <view v-if="maskShow" class="lu-popup-mask" :class="popupMaskClass" @tap="maskClick"></view>
  </view>
</template>
<script setup>
import { computed, toRefs, ref } from 'vue'
const props = defineProps({
  type: {
    type: String,
    default: 'center' // left right top bottom center
  },
  transition: {
    type: String,
    default: 'fade' // none slider fade
  },
  backgroundColor: {
    type: String,
    default: 'transparent' //transparent
  },
  maskShow: {
    type: Boolean,
    default: true
  },
  mask: {
    type: Boolean,
    default: true
  }
})
const { type, transition, backgroundColor, maskShow, mask } = toRefs(props)
const emit = defineEmits(['emitMaskClick'])

// 用于控制加入动画
const newTransition = ref(true)
// 用于控制显示组件
const newActive = ref(false)
const popupClass = computed(() => {
  let _class = ''
  if (newActive.value) {
    _class += 'lu-popup-active'
  }
  let arrType = ['left', 'right', 'top', 'bottom', 'center']
  if (arrType.indexOf(type.value) !== -1) {
    _class += ' lu-popup-' + type.value
  }
  return _class
})
const popupStyle = computed(() => {
  let _style = {}
  if (!mask.value) {
    _style.pointerEvents = 'none'
  }
  return _style
})
const transitionClass = computed(() => {
  let _class = ''
  if (!!newTransition.value && transition.value !== 'none') {
    _class += 'lu-popup-transition-' + transition.value
  }
  return _class
})
const popupMaskClass = computed(() => {
  let _class = ''
  if (newTransition.value) {
    _class += 'lu-popup-mask-fade'
  }
  return _class
})

const show = () => {
  newTransition.value = true
  newActive.value = true
  setTimeout(() => {
    newTransition.value = false
  }, 50)
}
const close = () => {
  newTransition.value = true
  setTimeout(() => {
    newActive.value = false
  }, 300)
}
const maskClick = () => {
	emit('emitMaskClick')
}
defineExpose({
  show,
  close
})
</script>
<style scoped lang="scss">
.lu-popup-wrapper {
  position: fixed;
  z-index: 998;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  display: none;
  overflow: hidden;
  &.lu-popup-active {
    display: flex;
  }
  &.lu-popup-center {
    .lu-popup-content {
      justify-content: center;
    }
  }
  &.lu-popup-left {
    justify-content: flex-start;
    .lu-popup-transition-slider {
      transform: translate3d(-100%, 0, 0);
    }
  }
  &.lu-popup-right {
    justify-content: flex-end;
    .lu-popup-transition-slider {
      transform: translate3d(100%, 0, 0);
    }
  }
  &.lu-popup-top {
    align-items: flex-start;
    .lu-popup-transition-slider {
      transform: translate3d(0, -100%, 0);
    }
  }
  &.lu-popup-bottom {
    align-items: flex-end;
    .lu-popup-transition-slider {
      transform: translate3d(0, 100%, 0);
    }
  }
  .lu-popup-content {
    z-index: 2;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    align-content: flex-start;
    transform: translate3d(0, 0, 0) scale(1);
    opacity: 1;
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
    &.lu-popup-transition-fade {
      transform: translate3d(0, 0, 0) scale(0.3);
      opacity: 0;
    }
  }
  .lu-popup-mask {
    position: absolute;
    z-index: 1;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(#000, 0.8);
    transition: background 0.3s ease-in-out;
    &.lu-popup-mask-fade {
      background-color: rgba(#000, 0);
    }
  }
}
</style>

