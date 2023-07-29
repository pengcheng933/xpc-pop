<template>
	<xpc-pop></xpc-pop>
</template>

<script setup>
	import {onMounted} from 'vue'
	onMounted(()=>{
		getApp().globalData.popShow({
			type:'loadingAndToast',
			title: '调用在onMounted生命周期后',
			isLoading: false
		})
	})
</script>

<style>

</style>
