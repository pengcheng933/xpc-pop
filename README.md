# xpc-pop
# 该项目封装了自定义弹窗
## 传入参数说明 loadingAndToast
| 参数         | 说明         |  类型 |
| :---:        |    :----:   |  :----: |
| type         |     loadingAndToast,默认值undfined        |  String|
| title        |  展示的文案信息      | String |
| isLoading	   |  是否是loading组件,默认值未true（有默认图片，也可以配置更换）| String
| duration     |  展示几秒后关闭,默认值1500ms（未0时不自动关闭，调用关闭方法关闭） | Boolean
| titleColor   |  字体颜色,默认#ff | 颜色值 |
| titleFontSize|  字体大小,默认34rpx | String |
| titleLineHeight|字体行高,默认48rpx | String |
| borderRadius |  盒子的圆角,默认8rpx| String |
| width        |  盒子的宽度,如果时toast默认最小宽度290rpx,loading默认290rpx         | String |
| height       |  盒子的高度,默认自适应 |String |
| imageUrl     |  loading图片,默认有自带loading | String|
| imageWidth   |  图片宽度  | String |
| imageHeight  |  图片高度  | String |
| transition   |  动画效果,loading时设置此属性无效,taost默认设置为fade | String（slider \| fade） |
| maskShow     |  背景遮罩  | Boolean|
注： toast自动关闭的弹窗，调用需要节流处理
## 传入参数说明 modalPop
| 参数         | 说明         |  类型 |
| :---:        |    :----:   |  :----: |
| type         |     modalPop,默认值undfined        |  String|
| title        |  展示的文案标题      | String |
| content      |  展示的文案内容,支持html渲染,如果执行中有特殊事件要处理,通过contentHandler传值即可      | String |
| contentHandler| html样式中'\<a\ id="test">'的点击事件处理函数,{test:()=>{console.log('test')}} | Object|
| showCancel   |  是否展示关闭按钮,默认值为true    | Boolean |
| confirmText  |  确认文案,默认值'确认'| String |
| cancelText   |  取消文案,默认值'取消'| String |
| cancelStyle  |  取消按钮样式,支持内联的CSS样式（字体,大小,宽高...）| Object|
| confirmStyle |  确认按钮样式,支持内联的CSS样式（字体,大小,宽高...）| Object|
| boxStyle     |  外面大盒子的样式,支持内联的CSS样式（字体,大小,宽高...）| Object|
| titleStyle   |  标题样式,支持内联的CSS样式（字体,大小,宽高...）| Object|
| contentStyle |  内容样式,支持内联的CSS样式（字体,大小,宽高...）| Object|
| success      |  选择后的成功回调,回调值{cancel: false,confirm: true,content: ""}| Function |
| editable     |  是否展示输入框,默认值false | Boolean |
| placeholderText | 输入框提示文本 | String |
| inputStyle   |  输入框样式 | Object  |
| transition   |  动画效果,默认设置为fade | String（slider \| fade \| null） |
| maskShow     |  背景遮罩  | Boolean|
| clickMask    |  能否点击遮罩关闭弹窗,默认值为flase,不能点击 | Boolean |
# 调用示例
## 普通组件调用
注意：这样调用没得默认值
```javascript
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
```
## 普通组件调用
这种调用先挂载在globalData上，后续直接通过globalData上挂载的方法调用
```javascript
// 在App.vue中先引用
<script>
	import {Pop} from './uni_modules/xpc-pop/common/pop'
	export default {
		globalData:{
			popShow: Pop.showPop,
			popClose: Pop.closePop
		}
	}
</script>

// 需要的组件中引入,注意在一个主页面只需要引入一次就行
// text.vue
<template>
	<xpc-pop></xpc-pop>
	<div class="loadingAndToast">
		<div @tap="clickHandler('loading')">loading</div>
		<div @tap="clickHandler('toast')">toast</div>
	</div>
</template>

<script setup>
	import {onMounted, ref} from 'vue'
	onMounted(()=>{
		getApp().globalData.popShow({
			type:'loadingAndToast',
			title: '调用在onMounted生命周期后',
			isLoading: false
		})
	})
	const clickHandlrObj = {
		loading: () => {
			getApp().globalData.popShow({
				type:'loadingAndToast',
				title: 'loading',
				duration: 0
			})
		},
		toast: () => {
			getApp().globalData.popShow({
				type:'loadingAndToast',
				title: 'toast',
				isLoading: false,
				maskShow: false
			})
		}
	}
	const clickHandler = (type) => {
		clickHandlrObj[type]()
	}
</script>

<style>
.loadingAndToast{
	display: flex;
	padding: 0 60rpx;
	justify-content: space-between;
}
</style>

```
## 覆盖原生导航栏
```javascript
// 先新建一个pagePop.vue页面
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
// 在page.json中注册
{
	"pages": [ //pages数组中第一项表示应用启动页，参考：https://uniapp.dcloud.io/collocation/pages
		{
		    "path" : "pages/pagePop/pagePop",
		    "style" :                                                                                    
		    {
		         "navigationStyle":"custom",
				 "app-plus": {
				 	"animationDuration": 200,
					"animationType": "fade-in",
					"background": "transparent",
					"backgroundColorTop": "transparent",
					"popGesture": "none",
					"scrollIndicator": false,
					"titleNView": false
				 }
		    }
		    
		}
}
// 使用示范
<template>
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

```