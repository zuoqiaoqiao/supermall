<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control class="tab-control"
                 v-show="isTabFixed"
                 :titles="['流行','新款','精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            :pull-up-load="true"
            @pullingUp="loadMore"
            @scroll="contentScroll">
      <home-swei :banner="banner" @sweiperImageLoad="sweiperImageLoad"/>
      <recommend-view :recommend="recommend"/>
      <feature-view/>
      <tab-control class="tab-con"
                   :titles="['流行','新款','精选']"
                   @tabClick="tabClick"
                   ref="tabControl2"/>
      <goods-list :goods="showGoods"/>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
import TabControl from "@/components/content/tabControl/TabControl"
import GoodsList from "@/components/content/goods/GoodsList";
import Scroll from "@/components/common/scroll/Scroll";
import BackTop from "@/components/content/backTop/BackTop";

import HomeSwei from "@/views/home/childCompos/HomeSwei";
import RecommendView from "@/views/home/childCompos/RecommendView";
import FeatureView from "@/views/home/childCompos/FeatureView";


import {getHomeMultidata, getGoods} from "@/network/home";
import {debounce} from "@/common/utils";
import {itemListenerMixin} from "@/common/mixin"


export default {
  name: "Home",
  components: {
    NavBar,
    TabControl,
    HomeSwei,
    RecommendView,
    FeatureView,
    GoodsList,
    Scroll,
    BackTop
  },
  mixins: [itemListenerMixin],
  data() {
    return {
      banner: [],
      recommend: [],
      goods: {
        'pop': {page: 0, list: []},
        'new': {page: 0, list: []},
        'sell': {page: 0, list: []},
      },
      currentType: 'pop',
      isShowBackTop: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0
    }
  },

  created() {
    // 1,请求多个数据
    this.getHomeMultidata()
    // 2,请求商品数据
    this.getGoods('pop')
    this.getGoods('new')
    this.getGoods('sell')

  },
  mounted() {
  },
  methods: {
    /**
     * 获取tabControl的offsetTop属性，（offsetTop属性，组件没有，但元素（标签有））
     * 所有的组件都有一个属性 $el: 就是用来获取组件中的元素
     * 例子：console.log(this.$refs.tabControl.$el)
     */
    sweiperImageLoad() {
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
    },

    /**
     * 事件监听相关的方法
     */
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = 'pop'
          break
        case 1:
          this.currentType = 'new'
          break
        case 2:
          this.currentType = 'sell'
      }
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2.currentIndex = index
    },
    backClick() {
      this.$refs.scroll.scrollTo(0, 0);

    },
    contentScroll(position) {
      // 判断BackTop是否显示
      this.isShowBackTop = (-position.y) > 1000 ? true : false

      //决定tabControl是否吸顶（position: fixes）
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
    loadMore() {
      this.getGoods(this.currentType)
    },
    /**
     * 网络请求相关的方法
     */
    getHomeMultidata() {
      getHomeMultidata().then(res => {
        this.banner = res.data.banner.list;
        this.recommend = res.data.recommend.list;
      })
    },
    getGoods(type) {
      const page = this.goods[type].page + 1
      getGoods(type, page).then(res => {
        this.goods[type].list.push(...res.data.list)
        this.goods[type].page += 1
        //因为scroll默认只加载一次，所以调用scroll   finishPullUp()
        this.$refs.scroll.finishPullUp()
      })
    }
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list
    }
  },
  activated() {
    this.$refs.scroll.scrollTo(0, this.saveY, 10)
    this.$refs.scroll.refresh()

  },
  deactivated() {
    //保存Y值
    this.saveY = this.$refs.scroll.getScrollY()

    //取消全局事件的监听
    this.$bus.$off('itemImageLoad',this.itemImgListenner)
  }


}
</script>

<style scoped>

#home {
  /*padding-top: 44px;*/
  height: 100vh;
  position: relative;
}

.tab-control {
  position: relative;
  z-index: 9;
}

.content {
  position: absolute;
  overflow: hidden;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}


.home-nav {
  background-color: var(--color-tint);
  color: #f6f6f6;
  /*position: fixed;*/
  /*left: 0;*/
  /*right: 0;*/
  /*top: 0;*/
  /*z-index: 9;*/
}

.fixed {
  position: fixed;
  left: 0;
  right: 0;
  top: 44px;
}

/*.tab-con { 原生滚动条的吸顶效果，在scroll下已经不起作用了，一般开发不用*/
/*  position: sticky;*/
/*  top: 44px;*/
/*  z-index: 9;*/
/*}*/


/*.content {*/
/*  height: calc(100% - 93px);*/
/*  margin-top: 44px;*/
/*  overflow: hidden;*/
/*}*/

</style>
