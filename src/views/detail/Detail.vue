<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav-bar" @titleClick="titleClick" ref="nav"/>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <detail-sweiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info :param-info="itemParams" ref="params"/>
      <detail-comment-info :comment-info="commentInfo" ref="comment"/>
      <goods-list :goods="recommends" ref="recommed"/>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"/>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
    <toast :message="message" :is-show="show"/>

  </div>

</template>

<script>
import DetailNavBar from "@/views/detail/childComps/DetailNavBar";
import DetailSweiper from "@/views/detail/childComps/DetailSweiper";
import DetailBaseInfo from "@/views/detail/childComps/DetailBaseInfo";
import DetailShopInfo from "@/views/detail/childComps/DetailShopInfo";
import DetailGoodsInfo from "@/views/detail/childComps/DetailGoodsInfo";
import DetailParamInfo from "@/views/detail/childComps/DetailParamInfo";
import DetailBottomBar from "@/views/detail/childComps/DetailBottomBar";
import DetailCommentInfo from "@/views/detail/childComps/DetailCommentInfo";

import Scroll from "@/components/common/scroll/Scroll";
import GoodsList from "@/components/content/goods/GoodsList";
import BackTop from "@/components/content/backTop/BackTop";
import Toast from "@/components/common/toast/Toast";


import {getDetail, getRecommend, Goods, Shop} from '@/network/detail'
import {debounce} from "@/common/utils";
import {itemListenerMixin} from "@/common/mixin"
import {mapActions} from "vuex"

export default {
  name: "Detail",
  mixins: [itemListenerMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      itemParams: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0,
      isShowBackTop: false,
      message: '',
      show: false
    }
  },
  components: {
    DetailNavBar,
    DetailSweiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    Scroll,
    GoodsList,
    DetailBottomBar,
    BackTop,
    Toast
  },
  created() {
    //得到商品id
    this.iid = this.$route.params.iid

    //根据商品id请求数据
    getDetail(this.iid).then((res) => {
      const data = res.result
      this.topImages = res.result.itemInfo.topImages

      //获取商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

      //获取商家信息
      this.shop = new Shop(data.shopInfo)

      //获取商品详细信息
      this.detailInfo = data.detailInfo;

      //获取详情页参数数据
      this.itemParams = data.itemParams;

      //获取商品评论信息
      if (data.rate.cRate != 0) {
        this.commentInfo = data.rate.list[0]
      }

      //给getThemeTopY赋值
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = []
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        this.themeTopYs.push(this.$refs.recommed.$el.offsetTop);
        this.themeTopYs.push(Number.MAX_VALUE)

      },100)


      //   这个函数指页面得到数据并渲染完成后,再来回调这个函数
      // this.$nextTick(() => {
      //    根据最新的数据,对应的dom是已经被渲染出来了
      //    但是图片依然是没有加载完(目前获取到的offsetTop不包含其中的图片)
      //    offsetTop值不对的时候,一般都是因为图片的原因
      //
      //   this.themeTopYs.push(0);
      //   this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      //   this.themeTopYs.push(this.$refs.recommed.$el.offsetTop)
      //
      //   console.log("this.themeTopYs",this.themeTopYs)
      // })

    })
    //获取推荐数据
    getRecommend().then(res => {
      this.recommends = res.data.list
    })


  },
  methods: {

    // 表示找个函数被映射过来了
    ...mapActions(['addCart']),

    addToCart() {
      //获取购物车需要展示的数据
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.realPrice
      product.iid = this.iid

      //将得到的数据放入购物车
      // this.$store.commit('addCart',product)

      // this.$store.dispatch('addCart',product).then(res => {
      //   console.log(res)
      // })

      this.addCart(product).then(res => {
        // this.show = true
        // this.message = res
        // setTimeout(() => {
        //   this.show = false
        //   this.message = ''
        // },1500)

        // 1，给时间
        // this.$toast.show(res,2000)

        // 2,没时间时
        this.$toast.show(res)
      })

    },

    backClick() {
      this.$refs.scroll.scrollTo(0, 0);
    },

    contentScroll(position){

      //判断BackTop是否显示
      this.isShowBackTop = (-position.y) > 1000 ? true : false

      //得到滚动的Y值
      const positionY = -position.y;
      let length = this.themeTopYs.length;

      //得到滚动的Y值与主题中的值对比[0, 9615, 10820, 11131]
      // 如果Y值在0 ~ 9615之间，index=0,
      // 如果Y值在9615 ~ 10820之间，index=1,
      // 如果Y值在10820 ~ 11131之间，index=2,
      // 如果Y值 > 11131之间，index=3,

      //  第一种方法,(这样判断太麻烦了)
      // for (let i = 0; i < length; i++) {
      //   if(this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) || (i === length-1 && positionY >= this.themeTopYs[i]))) {
      //     this.currentIndex = i
      //     this.$refs.nav.currentIndex = this.currentIndex
      //   }
      //
      // }

      // 第二种方法,再给它加一个值js中取最大的值   this.themeTopYs.push(Number.MAX_VALUE)
      // 此时的length = 5
      for (let i = 0; i < length-1; i++) {
        if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])) {
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }



    },

    imageLoad() {
      if(this.$refs.scroll){
        this.$refs.scroll.refresh()
      }
      //图片加载完后计算各个模块的高度
      this.getThemeTopY();
    },

    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
    }

  },
  mounted() {
  },
  destroyed() {
    this.$bus.$off('itemImageLoad', this.itemImgListenner)
  }
}
</script>

<style scoped>

#detail {
  position: relative;
  z-index: 9;
  background-color: white;
  height: 100vh;
}

.content {
  height: calc(100% - 44px);
}

.detail-nav-bar {
  position: relative;
  z-index: 9;
  background-color: white;
}

</style>
