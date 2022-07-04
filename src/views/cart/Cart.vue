<template>
  <div id="shopping-cart">
    <!-- 顶部导航栏   -->
    <nav-bar class="cart-nav">
      <div slot="center">购物车({{length}})</div>
    </nav-bar>
    <!--  商品列表   -->
    <cart-list />
    <!--  底部汇总   -->
    <cart-bottom-bar />
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar"

import CartList from "@/views/cart/childCompos/CartList";
import CartBottomBar from "@/views/cart/childCompos/CartBottomBar";

import { mapGetters } from 'vuex'

  export default {
    name: "Cart",
    computed: {
        // return this.$store.state.cartList.length
        // ...mapGetters(['cartLength'])
        ...mapGetters({
          length: 'cartLength'
        })
    },
    components: {
      NavBar,
      CartList,
      CartBottomBar

    }
  }
</script>


<style scoped>

.cart-nav {
  background-color: var(--color-tint);
  color: #f6f6f6;
  font-weight: 700;
}

#shopping-cart {
  height: 100vh;
}

</style>
