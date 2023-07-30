<template>
	<drawerCom ref="drawer" :transition="transition" :maskShow="maskShow" :mask="false">
		<div class="box" :class="{ loadingBox: showData.isLoading, noTitleBox: !showData.title }" :style="BoxStyle">
			<div class="loading" v-if="showData.isLoading">
				<image class="image" :src="imageUrl"></image>
			</div>
			<div class="title" v-if="showData.title" :style="titleStyle">
				{{ showData.title }}
			</div>
		</div>
	</drawerCom>
</template>
<script setup>
	import {
		computed,
		ref
	} from 'vue'
	import drawerCom from '../drawer/drawer.vue'
	const showData = ref({})
	const drawer = ref()
	// loading不给动画，toast给
	const transition = computed(() => {
		return showData.value.isLoading ? 'none' : showData.value.transition || 'fade'
	})
	// 计算各种样式
	const titleStyle = computed(() => {
		return {
			color: showData.value.titleColor,
			fontSize: showData.value.titleFontSize,
			lineHeight: showData.value.titleLineHeight
		}
	})
	const BoxStyle = computed(() => {
		return {
			width: showData.value.width,
			height: showData.value.height,
			borderRadius: showData.value.borderRadius,
		}
	})
	const imageUrl = computed(()=>{
		return showData.value.imageUrl || '/static/loading.png'
	})
	const imageStyle = computed(()=>{
		return {
			width: showData.value.imageWidth,
			height: showData.value.imageHeight
		}
	}) 
	// 是否展示遮罩
	const maskShow = computed(()=>{
		return showData.value.maskShow
	})
	// 展示组件，该方法最终保存于PopClass类中，通过全局globalData.showPop调用该方法
	const show = (data) => {
		showData.value = data
		// 如果是弹窗延时关闭
		if (Number(data.duration) !== 0) {
			setTimeout(() => {
				getApp().globalData.popClose({
					type: 'loadingAndToast'
				})
			}, data.duration)
		}
		drawer.value.show()
	}
	// 关闭，该方法最终保存于PopClass类中，通过全局globalData.popClose调用该方法
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
		background-color: #585858;
		min-width: 290rpx;
		padding: 12rpx 20rpx;
		position: relative;
		border-radius: 8rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-direction: column;

		.loading {
			width: 70rpx;
			height: 70rpx;
			animation: rotate 2s infinite backwards;
			flex-shrink: 0;

			.image {
				width: 100%;
				height: 100%;
			}
		}

		@keyframes rotate {
			0% {
				transform: rotate(0deg);
			}

			8.33% {
				transform: rotate(30deg);
			}

			16.67% {
				transform: rotate(60deg);
			}

			25% {
				transform: rotate(90deg);
			}

			33.33% {
				transform: rotate(120deg);
			}

			41.67% {
				transform: rotate(150deg);
			}

			50% {
				transform: rotate(180deg);
			}

			58.33% {
				transform: rotate(210deg);
			}

			66.67% {
				transform: rotate(240deg);
			}

			75% {
				transform: rotate(270deg);
			}

			83.33% {
				transform: rotate(300deg);
			}

			91.67% {
				transform: rotate(330deg);
			}

			100% {
				transform: rotate(360deg);
			}
		}
	}

	.loadingBox {
		width: 290rpx;
		border-radius: 20rpx;
		text-align: center;
	}

	.noTitleBox {
		height: auto;
		padding: 52rpx 22rpx 52rpx;
	}
</style>