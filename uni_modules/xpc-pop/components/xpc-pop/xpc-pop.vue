<template>
	<loadingAndToastCom ref="loadingAndToast"></loadingAndToastCom>
	<modalPopCom ref="modalPop"></modalPopCom>
</template>
<script setup>
	import {ref,onMounted,onUnmounted} from 'vue'
	import { Pop } from '../../common/pop.js'
	import loadingAndToastCom from '../loadingAndToast/loadingAndToast.vue'
	import modalPopCom from '../modalPop/modalPop.vue'
	const loadingAndToast =ref(null)
	const modalPop = ref(null)
	const id = String(new Date().getTime()) + Math.floor(Math.random()*1000)
	console.log(id);
	onMounted(()=>{
		console.log(this);
		console.log(loadingAndToast.value, modalPop.value);
		Pop.addMethods('loadingAndToast',{
			id,
			show: loadingAndToast.value.show,
			close: loadingAndToast.value.close
		})
		Pop.addMethods('modalPop',{
			id,
			show:modalPop.value.show,
			close:modalPop.value.close
		})
	})
	onUnmounted(()=>{
		Pop.delMethods('loadingAndToast',{
			id
		})
		Pop.delMethods('modalPop',{
			id
		})
	})
</script>
<style scoped lang="scss">
</style>
