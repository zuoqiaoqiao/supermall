<template>
  <div class="cart-bottom">
    <div class="check-content">
      <check-button class="check-bottom"
                    :is-checked="isSelectAll"
                    @click.native="checkClick"/>
      <span>全选</span>
    </div>
    <div class="total-price">
      合计: {{totalPrice}}
    </div>
    <div class="calculate" @click="calClick">
      去结算({{checkLength}})
    </div>
  </div>

</template>

<script>
import CheckButton from "@/components/content/checkButton/CheckButton";
import { mapGetters } from "vuex";

export default {
  name: "CartBottomBar",
  computed: {

    ...mapGetters(['cartList']),

    totalPrice() {
      // return '￥' + this.$store.state.cartList.filter(item => {
      return '￥' + this.cartList.filter(item => {
        return item.checked
      }).reduce((preValue,item) => {
        return preValue + item.price * item.count
      },0).toFixed(2)
    },

    checkLength() {
      return this.cartList.filter(item => item.checked).length
    },

    isSelectAll() {
      if(this.cartList.length === 0 )  return false

      // 方法1,全遍历,性能不高
      // return !(this.cartList.filter(item => !item.checked).length)

      // 方法2,找到一个不选中的就结束遍历(推荐使用)
      // return !this.cartList.find(item => !item.checked)

      // 方法3,不高级
      for(let item of this.cartList) {
        if(!item.checked) {
          return  false
        }
      }
      return true

    }
  },

  components: {
    CheckButton
  },

  methods: {
    checkClick() {
      if(this.isSelectAll) { //此时全都选中,点击全选应该全部变为不选中
        this.cartList.forEach(item => item.checked = false)
      }else {  // 部分或全部不选中,点击全部变为选中
        this.cartList.forEach(item => item.checked = true)
      }
    },
    calClick() {
      if(!this.isSelectAll) {
        this.$toast.show('请选择购买的商品',2000)
      }

    }
  }
}
</script>

<style scoped>

.cart-bottom {
  background-color: #eee;
  height: 40px;
  position: relative;
  line-height: 40px;
  display: flex;
}

.check-content {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.check-bottom {
  height: 22px;
  width: 22px;
  line-height: 22px;
  margin-right: 5px;
}

.total-price {
  margin-left: 30px;
  flex: 1;
}

.calculate {
  background-color: #eb4868;
  width: 70px;
  color: white;
  text-align: center;
}
</style>
