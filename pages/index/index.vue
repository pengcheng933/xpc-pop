<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>
		<div class="feature functionality">
			<div v-for="(item, index) in featureTitle" @tap="gotoFeaturePage(index)">{{item}}</div>
		</div>
		<div class="usage functionality">
			<div v-for="(item, index) in usageTitle" @tap="gotoFeaturePage(index+3)">{{item}}</div>
		</div>
	</view>
</template>

<script setup>
	const title = 'hello'
	const featureTitle = ['加载和提示', '确认框','其他用法']
	const usageTitle = ['正常组件使用', '函数时调用使用','覆盖导航菜单']
	const gotoFeaturePage = (index) => {
		let url;
		switch (index) {
			case 0:
			url = '/pages/loadingAndToast/loadingAndToast'
			break
			case 1:
			url ='/pages/modal/modal'
			break
			case 2:
			url = '/pages/other/other'
			break
			case 3:
			url ='/pages/invoke/component'
			break
			case 4:
			url ='/pages/invoke/function'
			break
			case 5:
			url ='/pages/invoke/page'
			break
		}
		uni.navigateTo({
			url
		})
	}
</script>

<style scoped lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
	.functionality{
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100vw;
		margin-top: 20rpx;
	}
	.feature {
		padding: 0 90rpx;
		box-sizing: border-box;
	}
	.usage{
		padding: 0 40rpx;
		box-sizing: border-box;
	}
</style>
