<template>
  <nav class="nav flex-column gap-2 justify-content-between">
    <div>
      <router-link
        class="nav-link"
        exact
        exact-active-class="active"
        v-for="(router, i) in routerLinks"
        :key="i"
        :to="{ name: router.name }"
      >
        <i class="fa" :class="`fa-${router.meta.icon}`" />
        {{ router.meta.title }}
      </router-link>
    </div>

    <layout-logout />
  </nav>
</template>

<script>
import LayoutLogout from "./LayoutLogout";
export default {
  components: {
    LayoutLogout,
  },
  computed: {
    routerLinks() {
      return this.$router.options.routes.filter((r) => r.name !== "login");
    },
  },
};
</script>

<style scoped lang="scss">
.nav {
  margin-left: -1rem;
  width: calc(100% + 1.7rem);
  height: calc(100vh - 49px);
  .nav-link {
    color: var(--white);
    transition: 0.5s;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    &.active {
      color: var(--featured);
      background-color: transparent;
    }
    &:hover {
      color: var(--dark);
      background-color: var(--featured);
    }
  }
}
</style>
