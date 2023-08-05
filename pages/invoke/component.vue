<template>
	<xpc-pop ref="pop"></xpc-pop>
	<div @tap="showToast">打开提示弹窗</div>
	<br/>
	<br/>
	<div @tap="showModal">打开对话框</div>
	<div>选择的状态:{{ JSON.stringify(modalStatus)}}</div>
</template>

<script setup>
	import {ref} from 'vue'
	const pop = ref('pop')
	const modalStatus = ref('')
	const showToast = () => {
		pop.value.show({
			type:'loadingAndToast',
			title: '提示弹窗',
			duration: 2000
		})
	}
	const showModal = () => {
		pop.value.show({
			type:'modalPop',
			title: '确认框',
			content: '确认框内容',
			confirmText: '确认',
			success: (res)=>{
				modalStatus.value = res
			}
		})
	}
	
</script>

<style>

</style>
