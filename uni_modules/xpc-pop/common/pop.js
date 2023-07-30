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
	delMethods(type, id) {
		if (id) {
			this.methods[type] = this.methods[type].filter(item => item.id !== id)
			return
		}
		this.methods[type].pop()
	}
	// 展示弹窗
	showPop = (data) => {
		// 展示弹窗组件 用箭头防止this指针干扰
		const methodArr = this.methods[data.type]
		const showDate = Object.assign({}, this.dataDefault[data.type], data)
		let popInstances
		if (data.id) {
			popInstances = methodArr.find(item => item.id === data.id) || {}
		} else {
			popInstances = methodArr[methodArr.length - 1]
		}
		popInstances.isActive = true
		popInstances.show(showDate)
		if (data.type === 'modalPop') {
			return new Promise((resolve) => {
				this.resolve = resolve
			})
		}
	}
	// 关闭弹窗
	closePop = (data) => {
		const methodArr = this.methods[data.type]
		let popInstances
		if (data.id) {
			popInstances = methodArr.find(item => item.id === data.id) || {}
		} else {
			popInstances = methodArr[methodArr.length - 1]
		}
		popInstances.isActive = false
		popInstances.close()
		if (data.type === 'modalPop') {
			this.resolve(data.result)
		}
	}
	// 判断当前是否有弹窗在展示了
	isShow = (data) => {
		const methodArr = this.methods[data.type]
		let popInstances
		if (data.id) {
			popInstances = methodArr.find(item => item.id === data.id) || {}
		} else {
			popInstances = methodArr[methodArr.length - 1]
		}
		return popInstances.isActive
	}
}
const Pop = new PopClass()
export {
	Pop
}