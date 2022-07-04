import {debounce} from "@/common/utils";

export const itemListenerMixin = {
  data() {
    return {
      itemImgListenner: null,
      newRefresh: null
    }
  },
  mounted() {
    // 监听item中图片加载完成
    let newRefresh = debounce(this.$refs.scroll.refresh, 200)

    //对监听的事件进行保存
    this.itemImgListenner = () => {
      newRefresh()
    }
    this.$bus.$on('itemImageLoad',this.itemImgListenner)
  }

}
