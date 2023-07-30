<template>
	<xpc-pop></xpc-pop>
	<div class="loadingAndToast">
		<div @tap="clickHandler('loading')">loading</div>
		<div @tap="clickHandler('toast')">toast</div>
	</div>
</template>

<script setup>
	import {onMounted, ref} from 'vue'
	onMounted(()=>{
		getApp().globalData.popShow({
			type:'loadingAndToast',
			title: '调用在onMounted生命周期后',
			isLoading: false
		})
	})
	const clickHandlrObj = {
		loading: () => {
			getApp().globalData.popShow({
				type:'loadingAndToast',
				title: 'loading',
				duration: 0
			})
		},
		toast: () => {
			getApp().globalData.popShow({
				type:'loadingAndToast',
				title: 'toast',
				isLoading: false,
				maskShow: false
			})
		}
	}
	const clickHandler = (type) => {
		clickHandlrObj[type]()
	}
</script>

<style>
.loadingAndToast{
	display: flex;
	padding: 0 60rpx;
	justify-content: space-between;
}
</style>
