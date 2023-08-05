if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue, shared) {
  "use strict";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$b = {
    __name: "index",
    setup(__props) {
      const title = "hello";
      const featureTitle = ["加载和提示", "确认框"];
      const usageTitle = ["正常组件使用", "函数时调用使用", "覆盖导航菜单"];
      const gotoFeaturePage = (index) => {
        let url;
        switch (index) {
          case 0:
            url = "/pages/loadingAndToast/loadingAndToast";
            break;
          case 1:
            url = "/pages/modal/modal";
            break;
          case 2:
            url = "/pages/invoke/component";
            break;
          case 3:
            url = "/pages/invoke/function";
            break;
          case 4:
            url = "/pages/invoke/page";
            break;
        }
        uni.navigateTo({
          url
        });
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
          vue.createElementVNode("image", {
            class: "logo",
            src: "/static/logo.png"
          }),
          vue.createElementVNode("view", { class: "text-area" }, [
            vue.createElementVNode("text", { class: "title" }, vue.toDisplayString(title))
          ]),
          vue.createElementVNode("div", { class: "feature functionality" }, [
            (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList(featureTitle, (item, index) => {
                return vue.createElementVNode("div", {
                  onClick: ($event) => gotoFeaturePage(index)
                }, vue.toDisplayString(item), 9, ["onClick"]);
              }),
              64
              /* STABLE_FRAGMENT */
            ))
          ]),
          vue.createElementVNode("div", { class: "usage functionality" }, [
            (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList(usageTitle, (item, index) => {
                return vue.createElementVNode("div", {
                  onClick: ($event) => gotoFeaturePage(index + 2)
                }, vue.toDisplayString(item), 9, ["onClick"]);
              }),
              64
              /* STABLE_FRAGMENT */
            ))
          ])
        ]);
      };
    }
  };
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["__scopeId", "data-v-1cf27b2a"], ["__file", "E:/项目/xioachengxu/xpc_pop/pages/index/index.vue"]]);
  class PopClass {
    constructor() {
      // 展示弹窗
      this.showPop = (data) => {
        const methodArr = this.methods[data.type];
        const showDate = Object.assign({}, this.dataDefault[data.type], data);
        let popInstances;
        if (data.id) {
          popInstances = methodArr.find((item) => item.id === data.id) || {};
        } else {
          popInstances = methodArr[methodArr.length - 1];
        }
        popInstances.isActive = true;
        popInstances.show(showDate);
        if (data.type === "modalPop") {
          return new Promise((resolve) => {
            this.resolve = resolve;
          });
        }
      };
      // 关闭弹窗
      this.closePop = (data) => {
        const methodArr = this.methods[data.type];
        let popInstances;
        if (data.id) {
          popInstances = methodArr.find((item) => item.id === data.id) || {};
        } else {
          popInstances = methodArr[methodArr.length - 1];
        }
        popInstances.isActive = false;
        popInstances.close();
        if (data.type === "modalPop") {
          this.resolve && this.resolve(data.result);
        }
      };
      // 判断当前是否有弹窗在展示了
      this.isShow = (data) => {
        const methodArr = this.methods[data.type];
        let popInstances;
        if (data.id) {
          popInstances = methodArr.find((item) => item.id === data.id) || {};
        } else {
          popInstances = methodArr[methodArr.length - 1];
        }
        return popInstances.isActive;
      };
      this.dataDefault = {
        loadingAndToast: {
          isLoading: true,
          duration: 1500
        },
        modalPop: {
          content: "必须要有内容",
          confirmText: "确认",
          cancelText: "取消",
          showCancel: true,
          editable: false,
          placeholderText: ""
        }
      };
      this.methods = {
        loadingAndToast: [],
        modalPop: []
      };
    }
    // 添加打开弹窗的方法
    addMethods(type, obj) {
      this.methods[type].push(obj);
    }
    // 删除弹窗
    delMethods(type, id) {
      if (id) {
        this.methods[type] = this.methods[type].filter((item) => item.id !== id);
        return;
      }
      this.methods[type].pop();
    }
  }
  const Pop = new PopClass();
  const _sfc_main$a = {
    __name: "drawer",
    props: {
      type: {
        type: String,
        default: "center"
        // left right top bottom center
      },
      transition: {
        type: String,
        default: "fade"
        // none slider fade
      },
      backgroundColor: {
        type: String,
        default: "transparent"
        //transparent
      },
      maskShow: {
        type: Boolean,
        default: true
      },
      mask: {
        type: Boolean,
        default: true
      }
    },
    emits: ["emitMaskClick"],
    setup(__props, { expose, emit }) {
      const props = __props;
      const { type, transition, backgroundColor, maskShow, mask } = vue.toRefs(props);
      const newTransition = vue.ref(true);
      const newActive = vue.ref(false);
      const popupClass = vue.computed(() => {
        let _class = "";
        if (newActive.value) {
          _class += "lu-popup-active";
        }
        let arrType = ["left", "right", "top", "bottom", "center"];
        if (arrType.indexOf(type.value) !== -1) {
          _class += " lu-popup-" + type.value;
        }
        return _class;
      });
      const popupStyle = vue.computed(() => {
        let _style = {};
        if (!mask.value) {
          _style.pointerEvents = "none";
        }
        return _style;
      });
      const transitionClass = vue.computed(() => {
        let _class = "";
        if (!!newTransition.value && transition.value !== "none") {
          _class += "lu-popup-transition-" + transition.value;
        }
        return _class;
      });
      const popupMaskClass = vue.computed(() => {
        let _class = "";
        if (newTransition.value) {
          _class += "lu-popup-mask-fade";
        }
        return _class;
      });
      const show = () => {
        newTransition.value = true;
        newActive.value = true;
        setTimeout(() => {
          newTransition.value = false;
        }, 50);
      };
      const close = () => {
        newTransition.value = true;
        setTimeout(() => {
          newActive.value = false;
        }, 300);
      };
      const maskClick = () => {
        emit("emitMaskClick");
      };
      expose({
        show,
        close
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(
          "view",
          {
            class: vue.normalizeClass(["lu-popup-wrapper", vue.unref(popupClass)]),
            style: vue.normalizeStyle(vue.unref(popupStyle))
          },
          [
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["lu-popup-content", vue.unref(transitionClass)]),
                style: vue.normalizeStyle([{ backgroundColor: vue.unref(backgroundColor) }])
              },
              [
                vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
              ],
              6
              /* CLASS, STYLE */
            ),
            vue.unref(maskShow) ? (vue.openBlock(), vue.createElementBlock(
              "view",
              {
                key: 0,
                class: vue.normalizeClass(["lu-popup-mask", vue.unref(popupMaskClass)]),
                onClick: maskClick
              },
              null,
              2
              /* CLASS */
            )) : vue.createCommentVNode("v-if", true)
          ],
          6
          /* CLASS, STYLE */
        );
      };
    }
  };
  const drawerCom = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-75bd1f84"], ["__file", "E:/项目/xioachengxu/xpc_pop/uni_modules/xpc-pop/components/drawer/drawer.vue"]]);
  const _sfc_main$9 = {
    __name: "loadingAndToast",
    setup(__props, { expose }) {
      const showData = vue.ref({});
      const drawer = vue.ref();
      const transition = vue.computed(() => {
        return showData.value.isLoading ? "none" : showData.value.transition || "fade";
      });
      const titleStyle = vue.computed(() => {
        return {
          color: showData.value.titleColor,
          fontSize: showData.value.titleFontSize,
          lineHeight: showData.value.titleLineHeight
        };
      });
      const BoxStyle = vue.computed(() => {
        return {
          width: showData.value.width,
          height: showData.value.height,
          borderRadius: showData.value.borderRadius
        };
      });
      const imageUrl = vue.computed(() => {
        return showData.value.imageUrl || "/static/loading.png";
      });
      vue.computed(() => {
        return {
          width: showData.value.imageWidth,
          height: showData.value.imageHeight
        };
      });
      const maskShow = vue.computed(() => {
        return showData.value.maskShow;
      });
      const show = (data) => {
        showData.value = data;
        if (Number(data.duration) !== 0) {
          setTimeout(() => {
            getApp().globalData.popClose({
              type: "loadingAndToast"
            });
          }, data.duration);
        }
        drawer.value.show();
      };
      const close = () => {
        drawer.value.close();
      };
      expose({
        show,
        close
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(drawerCom, {
          ref_key: "drawer",
          ref: drawer,
          transition: vue.unref(transition),
          maskShow: vue.unref(maskShow),
          mask: false
        }, {
          default: vue.withCtx(() => [
            vue.createElementVNode(
              "div",
              {
                class: vue.normalizeClass(["box", { loadingBox: showData.value.isLoading, noTitleBox: !showData.value.title }]),
                style: vue.normalizeStyle(vue.unref(BoxStyle))
              },
              [
                showData.value.isLoading ? (vue.openBlock(), vue.createElementBlock("div", {
                  key: 0,
                  class: "loading"
                }, [
                  vue.createElementVNode("image", {
                    class: "image",
                    src: vue.unref(imageUrl)
                  }, null, 8, ["src"])
                ])) : vue.createCommentVNode("v-if", true),
                showData.value.title ? (vue.openBlock(), vue.createElementBlock(
                  "div",
                  {
                    key: 1,
                    class: "title",
                    style: vue.normalizeStyle(vue.unref(titleStyle))
                  },
                  vue.toDisplayString(showData.value.title),
                  5
                  /* TEXT, STYLE */
                )) : vue.createCommentVNode("v-if", true)
              ],
              6
              /* CLASS, STYLE */
            )
          ]),
          _: 1
          /* STABLE */
        }, 8, ["transition", "maskShow"]);
      };
    }
  };
  const loadingAndToastCom = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-d1979f58"], ["__file", "E:/项目/xioachengxu/xpc_pop/uni_modules/xpc-pop/components/loadingAndToast/loadingAndToast.vue"]]);
  const _sfc_main$8 = {
    __name: "modalPop",
    setup(__props, { expose }) {
      const showData = vue.ref({});
      const inputModel = vue.ref("");
      const boxStyle = vue.computed(() => {
        return showData.value.boxStyle || {};
      });
      const cancelStyle = vue.computed(() => {
        return showData.value.cancelStyle || {};
      });
      const confirmStyle = vue.computed(() => {
        return showData.value.confirmStyle || {};
      });
      const titleStyle = vue.computed(() => {
        return showData.value.titleStyle || {};
      });
      const contentStyle = vue.computed(() => {
        return showData.value.contentStyle || {};
      });
      const inputStyle = vue.computed(() => {
        return showData.value.inputStyle || {};
      });
      const transition = vue.computed(() => {
        return showData.value.transition || "fade";
      });
      const maskShow = vue.computed(() => {
        return showData.value.maskShow;
      });
      const itemclick = (e) => {
        const idType = e.detail.node.attrs.id;
        if (idType) {
          if (showData.value.contentHandler[idType]) {
            showData.value.contentHandler[idType]();
          }
        }
      };
      const clickHandler = (type) => {
        const res = {
          confirm: false,
          cancel: false,
          content: ""
        };
        res[type] = true;
        if (showData.value.editable) {
          res.content = inputModel.value;
        }
        passClose(res);
        if (showData.value.success) {
          showData.value.success(res);
        }
      };
      const passClose = (result) => {
        getApp().globalData.popClose({
          type: "modalPop",
          result
        });
        inputModel.value = "";
      };
      const drawer = vue.ref();
      const show = (data) => {
        showData.value = data;
        drawer.value.show();
      };
      const close = () => {
        drawer.value.close();
      };
      const emitMaskClick = () => {
        if (showData.value.clickMask) {
          drawer.value.close();
        }
      };
      expose({
        show,
        close
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(drawerCom, {
          ref_key: "drawer",
          ref: drawer,
          transition: vue.unref(transition),
          maskShow: vue.unref(maskShow),
          onEmitMaskClick: emitMaskClick
        }, {
          default: vue.withCtx(() => [
            vue.createElementVNode(
              "div",
              {
                class: vue.normalizeClass(["box", { noTitleTop: !showData.value.title }]),
                style: vue.normalizeStyle(vue.unref(boxStyle))
              },
              [
                vue.createElementVNode(
                  "div",
                  {
                    class: "title",
                    style: vue.normalizeStyle(vue.unref(titleStyle))
                  },
                  vue.toDisplayString(showData.value.title),
                  5
                  /* TEXT, STYLE */
                ),
                !showData.value.editable ? (vue.openBlock(), vue.createElementBlock(
                  "div",
                  {
                    key: 0,
                    class: "content",
                    style: vue.normalizeStyle(vue.unref(contentStyle))
                  },
                  [
                    vue.createElementVNode("rich-text", {
                      nodes: showData.value.content + "  ",
                      class: "span",
                      onItemclick: itemclick
                    }, null, 40, ["nodes"])
                  ],
                  4
                  /* STYLE */
                )) : (vue.openBlock(), vue.createElementBlock("div", {
                  key: 1,
                  class: "inputBox"
                }, [
                  vue.withDirectives(vue.createElementVNode("input", {
                    class: "input",
                    style: vue.normalizeStyle(vue.unref(inputStyle)),
                    placeholder: showData.value.placeholderText,
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => inputModel.value = $event)
                  }, null, 12, ["placeholder"]), [
                    [vue.vModelText, inputModel.value]
                  ])
                ])),
                vue.createElementVNode(
                  "div",
                  {
                    class: vue.normalizeClass(["buttonBox", { buttonBoxCenter: !showData.value.showCancel }])
                  },
                  [
                    showData.value.showCancel ? (vue.openBlock(), vue.createElementBlock(
                      "div",
                      {
                        key: 0,
                        class: "left buttonItem",
                        onClick: _cache[1] || (_cache[1] = ($event) => clickHandler("cancel")),
                        style: vue.normalizeStyle(vue.unref(cancelStyle))
                      },
                      vue.toDisplayString(showData.value.cancelText),
                      5
                      /* TEXT, STYLE */
                    )) : vue.createCommentVNode("v-if", true),
                    vue.createElementVNode(
                      "div",
                      {
                        class: "right buttonItem",
                        onClick: _cache[2] || (_cache[2] = ($event) => clickHandler("confirm")),
                        style: vue.normalizeStyle(vue.unref(confirmStyle))
                      },
                      vue.toDisplayString(showData.value.confirmText),
                      5
                      /* TEXT, STYLE */
                    )
                  ],
                  2
                  /* CLASS */
                )
              ],
              6
              /* CLASS, STYLE */
            )
          ]),
          _: 1
          /* STABLE */
        }, 8, ["transition", "maskShow"]);
      };
    }
  };
  const modalPopCom = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-8b9b31f3"], ["__file", "E:/项目/xioachengxu/xpc_pop/uni_modules/xpc-pop/components/modalPop/modalPop.vue"]]);
  const _sfc_main$7 = {
    __name: "xpc-pop",
    setup(__props, { expose }) {
      const loadingAndToast = vue.ref(null);
      const modalPop = vue.ref(null);
      const id = String((/* @__PURE__ */ new Date()).getTime()) + Math.floor(Math.random() * 1e3);
      vue.onMounted(() => {
        Pop.addMethods("loadingAndToast", {
          id,
          show: loadingAndToast.value.show,
          close: loadingAndToast.value.close
        });
        Pop.addMethods("modalPop", {
          id,
          show: modalPop.value.show,
          close: modalPop.value.close
        });
      });
      vue.onUnmounted(() => {
        Pop.delMethods("loadingAndToast", {
          id
        });
        Pop.delMethods("modalPop", {
          id
        });
      });
      const show = (data) => {
        if (data.type === "loadingAndToast") {
          loadingAndToast.value.show(data);
        } else {
          modalPop.value.show(data);
        }
      };
      const close = (data) => {
        if (data.type === "loadingAndToast") {
          loadingAndToast.value.close(data);
        } else {
          modalPop.value.close(data);
        }
      };
      expose({
        id,
        show,
        close
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(
          vue.Fragment,
          null,
          [
            vue.createVNode(
              loadingAndToastCom,
              {
                ref_key: "loadingAndToast",
                ref: loadingAndToast
              },
              null,
              512
              /* NEED_PATCH */
            ),
            vue.createVNode(
              modalPopCom,
              {
                ref_key: "modalPop",
                ref: modalPop
              },
              null,
              512
              /* NEED_PATCH */
            )
          ],
          64
          /* STABLE_FRAGMENT */
        );
      };
    }
  };
  const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__file", "E:/项目/xioachengxu/xpc_pop/uni_modules/xpc-pop/components/xpc-pop/xpc-pop.vue"]]);
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  function resolveEasycom(component, easycom) {
    return shared.isString(component) ? easycom : component;
  }
  const _sfc_main$6 = {
    __name: "loadingAndToast",
    setup(__props) {
      vue.onMounted(() => {
        getApp().globalData.popShow({
          type: "loadingAndToast",
          title: "调用在onMounted生命周期后",
          isLoading: false
        });
      });
      const clickHandlrObj = {
        loading: () => {
          getApp().globalData.popShow({
            type: "loadingAndToast",
            title: "loading",
            duration: 0
          });
        },
        toast: () => {
          getApp().globalData.popShow({
            type: "loadingAndToast",
            title: "toast",
            isLoading: false,
            maskShow: false
          });
        }
      };
      const clickHandler = (type) => {
        clickHandlrObj[type]();
      };
      return (_ctx, _cache) => {
        const _component_xpc_pop = resolveEasycom(vue.resolveDynamicComponent("xpc-pop"), __easycom_0);
        return vue.openBlock(), vue.createElementBlock(
          vue.Fragment,
          null,
          [
            vue.createVNode(_component_xpc_pop),
            vue.createElementVNode("div", { class: "loadingAndToast" }, [
              vue.createElementVNode("div", {
                onClick: _cache[0] || (_cache[0] = ($event) => clickHandler("loading"))
              }, "loading"),
              vue.createElementVNode("div", {
                onClick: _cache[1] || (_cache[1] = ($event) => clickHandler("toast"))
              }, "toast")
            ])
          ],
          64
          /* STABLE_FRAGMENT */
        );
      };
    }
  };
  const PagesLoadingAndToastLoadingAndToast = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__file", "E:/项目/xioachengxu/xpc_pop/pages/loadingAndToast/loadingAndToast.vue"]]);
  const _sfc_main$5 = {
    __name: "modal",
    setup(__props) {
      const title = ["普通确认框", "只有确认按钮", "带文本输入框"];
      const clickHandlerArr = [
        () => {
          getApp().globalData.popShow({
            type: "modalPop",
            title: "标题",
            content: "内容",
            cancelStyle: {
              color: "gray",
              border: "1rpx solid #000",
              borderRadius: "12rpx"
            },
            success: (res) => {
              formatAppLog("log", "at pages/modal/modal.vue:23", res);
            }
          });
        },
        () => {
          getApp().globalData.popShow({
            type: "modalPop",
            content: "内容",
            showCancel: false,
            clickMask: true
          });
        },
        () => {
          getApp().globalData.popShow({
            type: "modalPop",
            editable: true,
            placeholderText: "输入框提示语句",
            inputStyle: {
              color: "red"
            },
            maskShow: false,
            boxStyle: {
              backgroundColor: "gray"
            }
          }).then((res) => {
            formatAppLog("log", "at pages/modal/modal.vue:48", res);
          });
        }
      ];
      const clickHandler = (index) => {
        clickHandlerArr[index]();
      };
      return (_ctx, _cache) => {
        const _component_xpc_pop = resolveEasycom(vue.resolveDynamicComponent("xpc-pop"), __easycom_0);
        return vue.openBlock(), vue.createElementBlock(
          vue.Fragment,
          null,
          [
            vue.createVNode(_component_xpc_pop),
            vue.createElementVNode("div", null, "他们的调用都在onMounted生命周期后"),
            vue.createElementVNode("div", { class: "modal" }, [
              (vue.openBlock(), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList(title, (item, index) => {
                  return vue.createElementVNode("div", {
                    class: "item",
                    onClick: ($event) => clickHandler(index)
                  }, vue.toDisplayString(item), 9, ["onClick"]);
                }),
                64
                /* STABLE_FRAGMENT */
              ))
            ])
          ],
          64
          /* STABLE_FRAGMENT */
        );
      };
    }
  };
  const PagesModalModal = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-12def911"], ["__file", "E:/项目/xioachengxu/xpc_pop/pages/modal/modal.vue"]]);
  const _sfc_main$4 = {
    __name: "component",
    setup(__props) {
      const pop = vue.ref("pop");
      const modalStatus = vue.ref("");
      const showToast = () => {
        pop.value.show({
          type: "loadingAndToast",
          title: "提示弹窗",
          duration: 2e3
        });
      };
      const showModal = () => {
        pop.value.show({
          type: "modalPop",
          title: "确认框",
          content: "确认框内容",
          confirmText: "确认",
          success: (res) => {
            modalStatus.value = res;
          }
        });
      };
      return (_ctx, _cache) => {
        const _component_xpc_pop = resolveEasycom(vue.resolveDynamicComponent("xpc-pop"), __easycom_0);
        return vue.openBlock(), vue.createElementBlock(
          vue.Fragment,
          null,
          [
            vue.createVNode(
              _component_xpc_pop,
              {
                ref_key: "pop",
                ref: pop
              },
              null,
              512
              /* NEED_PATCH */
            ),
            vue.createElementVNode("div", { onClick: showToast }, "打开提示弹窗"),
            vue.createElementVNode("br"),
            vue.createElementVNode("br"),
            vue.createElementVNode("div", { onClick: showModal }, "打开对话框"),
            vue.createElementVNode(
              "div",
              null,
              "选择的状态:" + vue.toDisplayString(JSON.stringify(modalStatus.value)),
              1
              /* TEXT */
            )
          ],
          64
          /* STABLE_FRAGMENT */
        );
      };
    }
  };
  const PagesInvokeComponent = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__file", "E:/项目/xioachengxu/xpc_pop/pages/invoke/component.vue"]]);
  const _sfc_main$3 = {
    __name: "function",
    setup(__props) {
      const clickHandlrObj = {
        loading: () => {
          getApp().globalData.popShow({
            type: "loadingAndToast",
            title: "loading",
            duration: 0
          });
        },
        toast: () => {
          getApp().globalData.popShow({
            type: "loadingAndToast",
            title: "toast",
            isLoading: false,
            maskShow: false
          });
        }
      };
      const clickHandler = (type) => {
        clickHandlrObj[type]();
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", { class: "loadingAndToast" }, [
          vue.createElementVNode("div", {
            onClick: _cache[0] || (_cache[0] = ($event) => clickHandler("loading"))
          }, "loading"),
          vue.createElementVNode("div", {
            onClick: _cache[1] || (_cache[1] = ($event) => clickHandler("toast"))
          }, "toast")
        ]);
      };
    }
  };
  const PagesInvokeFunction = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__file", "E:/项目/xioachengxu/xpc_pop/pages/invoke/function.vue"]]);
  const _sfc_main$2 = {
    __name: "page",
    setup(__props) {
      const goPagePop = () => {
        uni.navigateTo({
          url: "/pages/pagePop/pagePop"
        });
        setTimeout(() => {
          uni.$emit("pop", {
            type: "modalPop",
            title: "标题",
            content: "内容",
            cancelStyle: {
              color: "gray",
              border: "1rpx solid #000",
              borderRadius: "12rpx"
            },
            success: (res) => {
              formatAppLog("log", "at pages/invoke/page.vue:21", res);
              uni.navigateBack();
            }
          });
        });
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", { onClick: goPagePop }, "覆盖原生导航栏");
      };
    }
  };
  const PagesInvokePage = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__file", "E:/项目/xioachengxu/xpc_pop/pages/invoke/page.vue"]]);
  const _sfc_main$1 = {
    __name: "pagePop",
    setup(__props) {
      uni.$on("pop", (data) => {
        getApp().globalData.popShow(data);
      });
      return (_ctx, _cache) => {
        const _component_xpc_pop = resolveEasycom(vue.resolveDynamicComponent("xpc-pop"), __easycom_0);
        return vue.openBlock(), vue.createBlock(_component_xpc_pop);
      };
    }
  };
  const PagesPagePopPagePop = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__file", "E:/项目/xioachengxu/xpc_pop/pages/pagePop/pagePop.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/loadingAndToast/loadingAndToast", PagesLoadingAndToastLoadingAndToast);
  __definePage("pages/modal/modal", PagesModalModal);
  __definePage("pages/invoke/component", PagesInvokeComponent);
  __definePage("pages/invoke/function", PagesInvokeFunction);
  __definePage("pages/invoke/page", PagesInvokePage);
  __definePage("pages/pagePop/pagePop", PagesPagePopPagePop);
  const _sfc_main = {
    globalData: {
      popShow: Pop.showPop,
      popClose: Pop.closePop
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "E:/项目/xioachengxu/xpc_pop/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue, uni.VueShared);
