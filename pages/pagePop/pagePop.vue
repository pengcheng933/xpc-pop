<template>
		<xpc-pop></xpc-pop>
</template>

<script setup>
	uni.$on('pop',(data)=>{
		getApp().globalData.popShow(data)
	})
</script>

<style>
	page{
		background-color: transparent;
	}

</style>
