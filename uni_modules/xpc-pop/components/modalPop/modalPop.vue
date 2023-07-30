<template>
	<drawerCom ref="drawer" :transition="transition" :maskShow="maskShow" @emitMaskClick="emitMaskClick">
		<div class="box" :class="{ noTitleTop: !showData.title }" :style="boxStyle">
			<div class="title" :style="titleStyle">{{ showData.title }}</div>
			<div class="content" :style="contentStyle" v-if="!showData.editable">
				<rich-text :nodes="showData.content + '&emsp;&emsp;'" class="span" @itemclick="itemclick"></rich-text>
			</div>
			<div class="inputBox" v-else>
				<input class="input" :style="inputStyle" :placeholder="showData.placeholderText" v-model="inputModel" />
			</div>
			<div class="buttonBox" :class="{buttonBoxCenter: !showData.showCancel}">
				<div class="left  buttonItem" @tap="clickHandler('cancel')" v-if="showData.showCancel"
					:style="cancelStyle">
					{{ showData.cancelText }}
				</div>
				<div class="right  buttonItem" @tap="clickHandler('confirm')" :style="confirmStyle">
					{{ showData.confirmText }}
				</div>
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
	const inputModel = ref('')

	// 计算传递过来的样式
	const boxStyle = computed(()=> {
		return showData.value.boxStyle || {}
	})
	const cancelStyle = computed(() => {
		return showData.value.cancelStyle || {}
	})
	const confirmStyle = computed(() => {
		return showData.value.confirmStyle || {}
	})
	const titleStyle = computed(() => {
		return showData.value.titleStyle || {}
	})
	const contentStyle = computed(() => {
		return showData.value.contentStyle || {}
	})
	const inputStyle = computed(()=> {
		return showData.value.inputStyle || {}
	})
	
	// 计算样式和是否有遮罩
	const transition = computed(()=>{
		return showData.value.transition || 'fade'
	})
	const maskShow = computed(()=>{
		return showData.value.maskShow
	})

	const itemclick = (e) => {
		// 这个是点击文本，如果文本中有链接之类的可以在这里处理
		const idType = e.detail.node.attrs.id
		if (idType) {
			if (showData.value.contentHandler[idType]) {
				showData.value.contentHandler[idType]()
			}
		}
	}

	// 点击按钮
	const clickHandler = (type) => {
		const res = {
			confirm: false,
			cancel: false,
			content: ''
		}
		res[type] = true
		// 文本框，将文本信息保存传给调用者
		if (showData.value.editable) {
			res.content = inputModel.value
		}
		// 关闭
		passClose(res)
		if (showData.value.success) {
			// 传信息
			showData.value.success(res)
		}
	}
	// 传递关闭信息
	const passClose = (result) => {
		getApp().globalData.popClose({
			type: 'modalPop',
			result
		})
		inputModel.value = ''
	}
	const drawer = ref()
	const show = (data) => {
		// 保存信息，打开弹窗
		showData.value = data
		drawer.value.show()
	}
	// 关闭弹窗
	const close = () => {
		drawer.value.close()
	}
	const emitMaskClick = () => {
		if(showData.value.clickMask){
			drawer.value.close()
		}
	}
	defineExpose({
		show,
		close
	})
</script>
<style scoped lang="scss">
	.box {
		width: 600rpx;
		padding: 12rpx 25rpx;
		background: #ffffff;
		border-radius: 12rpx;

		.title {
			padding-top: 26rpx;
			text-align: center;
			font-weight: bold;
			font-size: 32rpx;
		}

		.content {
			padding-top: 27rpx;
			min-height: 67rpx;
			font-weight: 400;
			color: #a6a6a6;
			line-height: 48rpx;
			position: relative;
			text-align: center;

			.span {
				display: inline-block;
				text-align: left;
				text-indent: 2em;
			}
		}

		.inputBox {
			padding-top: 30rpx;
			padding-bottom: 30rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			.input{
				width: 270rpx;
				display: block;
				padding: 0 20rpx;
				background-color: #fff;
				border-radius: 4rpx;
				border: 1rpx solid #dcdfe6;
				box-sizing: border-box;
				height: 40rpx;
				font-size: 40rpx;
				line-height: 40rpx;
				outline: none;
				transition: border-color .2s cubic-bezier(.645,.045,.355,1);
				width: 100%;
				background-color: #eee;
			}
		}

		.textAlign {
			text-align: center;
			text-indent: 0;
		}

		.buttonBox {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-top: 41rpx;

			&.buttonBoxCenter {
				justify-content: center;
			}

			.buttonItem {
				height: 90rpx;
				width: 230rpx;
				border-radius: 54rpx;
				font-size: 38rpx;
				font-weight: 500;
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.left {}

			.right {
				color: #fff;
				background-color: #409eff;
				border-color: #409eff;
			}
		}
	}

	.noTitleTop {
		padding-top: 49rpx;
	}
</style>