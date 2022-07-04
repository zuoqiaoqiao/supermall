import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from "@/store";
import toast from "@/components/common/toast"
import FastClick from 'fastclick'
import VueLazyload from "vue-lazyload";

Vue.config.productionTip = false
Vue.prototype.$bus = new Vue()

// 安装toast插件
Vue.use(toast)

//使用vue-lazyload图片懒加载插件
Vue.use(VueLazyload,{
  // loading: require('@/assets/img/common/placeholder.png')
})

// 解决移动端300ms延迟的问题
FastClick.attach(document.body)

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
