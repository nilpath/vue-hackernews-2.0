<template>
  <li class="news-item">
    <div class="score"></div>
    <div class="title">
      <template v-if="item.url">
        <a :href="item.url" target="_blank" rel="noopener">{{ item.title }}</a>
        <span class="host">&nbsp;({{ item.url | host }})</span>
      </template>
      <template v-else>
        <router-link :to="'/item/' + item.id">{{ item.title }}</router-link>
      </template>
    </div>
    <span class="meta">
      <span v-if="item.type !== 'job'" class="by">
        by
        <router-link :to="'/user/' + item.by">{{ item.by }}</router-link>
      </span>
      <span class="time">&nbsp;{{ item.time | timeAgo }} ago</span>
      <span v-if="item.type !== 'job'" class="comments-link">
        |
        <router-link :to="'/item/' + item.id">{{ item.descendants }} comments</router-link>
      </span>
      |
      <span>{{item.score}} points</span>
    </span>
    <span v-if="item.type !== 'job'" class="rate-cta">Rate similarity</span>
    <br />
    <br />
    <similar v-if="item.type === 'story'" :story="item"></similar>
  </li>
</template>

<script>
import { timeAgo } from "../util/filters";
import Similar from "./Similar.vue";

export default {
  name: "news-item",
  components: { Similar },
  props: ["item"],
  // http://ssr.vuejs.org/en/caching.html#component-level-caching
  serverCacheKey: ({ item: { id, __lastUpdated, time } }) => {
    return `${id}::${__lastUpdated}::${timeAgo(time)}`;
  }
};
</script>

<style lang="stylus">
.news-item {
  background-color: #FFFCE8;
  padding: 20px 30px 20px 30px;
  border-bottom: 1px solid #eee;
  position: relative;
  line-height: 20px;

  .rate-cta {
    float: right;
    font-size: 0.85em;
    padding-right: 30 px;
    display: inline-block;
    width: 55px;
    font-family: 'Courier New', Courier, monospace;
  }

  @media (max-width: 750px) {
    .rate-cta {
      display: none;
    }
  }

  .meta, .host {
    font-size: 0.85em;
    color: #828282;

    a {
      color: #828282;
      text-decoration: underline;

      &:hover {
        color: #F7955B;
      }
    }
  }
}
</style>
