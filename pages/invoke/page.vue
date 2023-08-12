<template>
	<xpc-pop></xpc-pop>
	<div @tap="goPagePop">覆盖原生导航栏</div>
</template>

<script setup>
	const goPagePop = () => {
		uni.navigateTo({
			url: "/pages/pagePop/pagePop"
		})
		setTimeout(()=>{
			uni.$emit('pop',{
				type: 'modalPop',
				title: '标题',
				content: '内容',
				cancelStyle: {
					color: 'gray',
					border: '1rpx solid #000',
					borderRadius: '12rpx'
				},
				success: (res) => {
					console.log(res);
					// 调用成功后返回
					uni.navigateBack()
				}
			})
		})
	}
</script>

<style>

</style>
