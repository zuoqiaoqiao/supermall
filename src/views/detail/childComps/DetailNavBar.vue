<template>
  <div class="detail-nav-bar">
    <nav-bar>
      <div slot="left" @click="backClick">
        <img src="~assets/img/common/back.svg" alt="" style="margin-top: 12px">
      </div>
      <div slot="center" class="title">
        <div v-for="(item,index) in title"
             class="title-item"
             :class="{active: currentIndex === index}"
             @click="titleClick(index)"
              >{{item}}</div>
      </div>
    </nav-bar>
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";

export default {
  name: "DetailNavBar",
  components: {
    NavBar
  },
  data() {
    return {
      title: ['商品','参数','评论','推荐'],
      currentIndex: 0
    }
  },
  methods: {
    titleClick(index) {
      this.currentIndex = index
      this.$emit('titleClick',index)
    },
    backClick() {
      this.$router.back()
    }
  }
}
</script>

<style scoped>

.title {
  display: flex;
  font-size: 13px;
}

.title-item {
  flex: 1;
}

.active {
  color: var(--color-high-text);
}

</style>
