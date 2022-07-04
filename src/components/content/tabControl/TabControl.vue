<template>
  <div class="tab-control">
    <div v-for="(item,index) in titles" :class="{active: index === currentIndex}" class="tab-control-item">
      <span @click="tabCon(index)">{{item}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "tabControl",
  data() {
    return {
      currentIndex: 0
    }
  },
  methods: {
    tabCon(index) {
      this.currentIndex = index;
      this.$emit('tabClick',index)

    }
  },
  props: {
    titles: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style scoped>

.tab-control {
  display: flex;
  text-align: center;
  height: 40px;
  line-height: 40px;
  font-size: 15px;
  background-color: white;
}

.tab-control-item {
  flex: 1;
}

.tab-control-item span {
  padding: 5px;
}
.active {
  color: var(--color-high-text);
}

.active span {
  border-bottom: 3px solid var(--color-tint);
}


</style>
