<template>
  <div class>
    <div class="tab__header">
      <a href="#" @click.prevent="active = !active">
        <span class="accordion-title">{{title}}</span>
        <p class="subtitle">
          Today's stories along with the most similar ones between 2006 and 2015.
          <span class="expand-cta cta" v-show="!active">(read more ▼)</span>
          <span class="collapse-cta cta" v-show="active">(show less ▲)</span>
        </p>
      </a>
    </div>
    <div class="tab__content p-2" v-show="active">
      <slot />
    </div>
  </div>
</template>>


<style lang="stylus">
  .accordion-title {
    font-style: normal;
    font-weight: bold;
    font-size: 32px;
    line-height: 20px;
  }

  .subtitle {
    font-size: 18px;
    line-height: 18px;
  }

  .tab__content {
    background-color: #FFFEF2;
    padding: 4px 16px;
  }

  .cta {
    font-size: 14px;
  }
</style>


<script>
export default {
  name: "accordion",
  props: ["title"],
  data() {
    return {
      active: false
    };
  }
};
</script>

