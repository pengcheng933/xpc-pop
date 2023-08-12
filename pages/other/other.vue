<template>
	<xpc-pop ref="pop1"></xpc-pop>
	<xpc-pop ref="pop2"></xpc-pop>
	<div class="other">
		<div @tap="nested">嵌套弹窗</div>
		<div @tap="popIsActive">检测当前是否有弹窗激活</div>
	</div>
</template>

<script setup>
	import {onMounted, ref} from 'vue'
	const pop1 = ref()
	const pop2 = ref()
	const nestedSuceess = (res) => {
		getApp().globalData.popShow({
			type: 'modalPop',
			id: pop2.value.id,
			title: '二级弹窗',
			content: `你确认${res.cancel?'否':'是'}`,
			boxStyle: {
				 width: '380rpx',
				 height: '260rpx',
				 padding: '0 25rpx'
			},
			buttonStyle: {
				padding: 0
			},
			confirmStyle:{
				height: '50rpx', 
			},
			cancelStyle: {
				height: '50rpx',
				color: 'gray',
				border: '1rpx solid #000',
				borderRadius: '12rpx'
			},
			success: (res) => {
				console.log(res);
				console.log(getApp().globalData);
				getApp().globalData.closeAllPop()
			}
		})
		
	}
	const nested = ()=>{
		getApp().globalData.popShow({
			type: 'modalPop',
			id: pop1.value.id,
			title: '一级弹窗',
			content: '嵌套弹窗',
			cancelStyle: {
				color: 'gray',
				border: '1rpx solid #000',
				borderRadius: '12rpx',
			},
			success: nestedSuceess
		})
	}
	const popIsActive = () => {
		console.log(getApp().globalData.isShow({
			type: 'modalPop'
		}));
	}
	

</script>

<style>

</style>
