<template>
	<div class="loadingAndToast">
		<div @tap="clickHandler('loading')">loading</div>
		<div @tap="clickHandler('toast')">toast</div>
	</div>
</template>

<script setup>
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

</style>
