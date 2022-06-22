<template>
  <div id="posts">
    <div class="post" v-for="item in posts" :key="item">
      <PostCard
        :title="item.title"
        :description="item.description"
        :content="item.content"
      />
    </div>
  </div>
</template>

<script>
import { getBlogPosts } from "../utils";
import PostCard from "./PostCard.vue";

export default {
  name: "Posts",
  data() {
    return {
      posts: []
    };
  },
  created() {
    getBlogPosts()
      .then((results) => {
        this.posts = results;
      })
      .catch((e) => {
        console.log(e);
      });
  },
  components: { PostCard }
};
</script>

<style scoped>
#posts {
  text-align: center;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.post {
  min-width: 300px;
  max-width: 60vw;
  margin: 4vh auto;
  border: 2px solid #6c6c6c;
}

.content {
  margin: 0 auto;
  height: 15vh;
  overflow: hidden;
  word-break: break-word;
  text-overflow: ellipsis;
}

a {
  color: #cccccc;
}

h5,
h3 {
  margin-top: 0;
  margin-bottom: 0;
}

h3 {
  color: goldenrod;
  text-shadow: 0px 0px 1em #000;
}
</style>
