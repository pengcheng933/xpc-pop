<template>
	<drawerCom ref="drawer" :transition="transition" :maskShow="false" :mask="false">
		<div class="box" :class="{ toastBox: !showData.isLoading, noTitleBox: !showData.title }">
			<div class="loading" v-if="showData.isLoading">
				<image class="image" src="/static/loading.png"></image>
			</div>
			<div class="title" v-if="showData.title">
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
		return showData.value.isLoading ? 'none' : 'fade'
	})
	// 展示组件，该方法最终保存于PopClass类中，通过全局globalData.showPop调用该方法
	const show = (data) => {
		showData.value = data
		// 如果是弹窗延时关闭
		if (!data.isLoading) {
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
		background-color: #4c4c4c;
		min-width: 316rpx;
		height: 316rpx;
		position: relative;
		border-radius: 30rpx;
		padding: 88rpx 22rpx 52rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-direction: column;
		.loading {
			width: 70rpx;
			height: 70rpx;
			animation: rotate 2s infinite backwards;

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

		.title {
			font-size: 34rpx;
			color: #ffffff;
			line-height: 48rpx;
		}
	}

	.toastBox {
		height: auto;
		padding: 30rpx 39rpx;
		background-color: rgba(0, 0, 0, 0.8);
		border-radius: 20rpx;
	}

	.noTitleBox {
		height: auto;
		padding: 52rpx 22rpx 52rpx;
	}
</style>
