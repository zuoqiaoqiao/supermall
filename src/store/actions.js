export default {
  addCart(context,payload) {
    return new Promise((resolve, reject) => {
      // 方法二, 用数组的函数find()
      let oldProduct = context.state.cartList.find(function (item) {
        return item.iid === payload.iid
      })

      if(oldProduct) {
        // oldProduct.count += 1
        context.commit('addCounter',oldProduct)
        resolve('当前商品数量+1')
      }else {
        payload.count = 1
        // context.state.cartList.push(payload)
        context.commit('addToCart',payload)
        resolve('添加了新的商品')
      }
    })

  }
}
