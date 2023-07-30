<template>
	<xpc-pop></xpc-pop>
	<div>他们的调用都在onMounted生命周期后</div>
	<div class="modal">
		<div class="item" v-for="(item,index) in title" @tap="clickHandler(index)">{{item}}</div>
	</div>
</template>

<script setup>
	const title = ['普通确认框', '只有确认按钮', '带文本输入框']
	const clickHandlerArr = [
		() => {
			getApp().globalData.popShow({
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
				}
			})
		},
		() => {
			getApp().globalData.popShow({
				type: 'modalPop',
				content: '内容',
				showCancel: false,
				clickMask: true
			})
		},
		() => {
			getApp().globalData.popShow({
				type: 'modalPop',
				editable: true,
				placeholderText: '输入框提示语句',
				inputStyle: {
					color: 'red'
				},
				maskShow: false,
				boxStyle: {
					backgroundColor: 'gray'
				}
			}).then(res => {
				console.log(res);
			})
		}
	]
	const clickHandler = (index) => {
		clickHandlerArr[index]()
	}
</script>

<style scoped lang="scss">
	.modal {
		display: flex;
		padding: 40rpx;
		justify-content: space-between;
		flex-wrap: wrap;

		.item {
			height: 40rpx;
		}
	}
</style>