class PopClass {
	constructor() {
		// 默认参数
		this.dataDefault = {
			loadingAndToast: {
				isLoading: true,
				duration: 1500
			},
			modalPop: {
				content: '必须要有内容',
				confirmText: '确认',
				cancelText: '取消',
				showCancel: true,
				editable: false,
				placeholderText: ''
			}
		}
		this.methods = {
			loadingAndToast: [],
			modalPop: []
		}
	}
	// 添加打开弹窗的方法
	addMethods(type, obj) {
		this.methods[type].push(obj)
	}
	// 删除弹窗
	delMethods(type) {
		this.methods[type].pop()
	}
	// 展示弹窗
	showPop = (data) => {
		// 展示弹窗组件 用箭头防止this指针干扰
		const methodArr = this.methods[data.type]
		const showDate = Object.assign({}, this.dataDefault[data.type], data)
		console.log(methodArr);
		methodArr[methodArr.length - 1].isActive = true
		methodArr[methodArr.length - 1].show(showDate)
		if (data.type === 'modalPop') {
			return new Promise((resolve) => {
				this.resolve = resolve
			})
		}
	}
	// 关闭弹窗
	closePop = (data) => {
		const methodArr = this.methods[data.type]
		methodArr[methodArr.length - 1].isActive = false
		methodArr[methodArr.length - 1].close()
		if (data.type === 'modalPop') {
			this.resolve(data.result)
		}
	}
	// 判断当前是否有弹窗在展示了
	isShow = (type) => {
		const methodArr = this.methods[type]
		return methodArr[methodArr.length - 1].isActive
	}
}
const Pop = new PopClass()
export {
	Pop
}
