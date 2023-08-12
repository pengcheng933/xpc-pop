<script>
	import {Pop} from './uni_modules/xpc-pop/common/pop'
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
			popClose: Pop.closePop,
			closeAllPop: Pop.closeAllPop,
			isShow: Pop.isShow
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
