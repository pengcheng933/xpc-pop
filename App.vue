<script>
	import {Pop} from './uni_modules/xpc-pop/common/pop.js'
	console.log(Pop);
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		globalData:{
			popShow: Pop.showPop,
			popClose: Pop.closePop
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
