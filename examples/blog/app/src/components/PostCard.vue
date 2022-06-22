<template>
  <div>
    <h1>{{ title }}</h1>
    <h3>{{ description }}</h3>
    <h2>{{ content }}</h2>
  </div>
</template>

<script>
export default {
  name: "PostCard",
  props: {
    title: String,
    description: String,
    content: String
  }
};
</script>
