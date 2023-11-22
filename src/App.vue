<script setup>
import { routes } from './routing/router.js'

const demoRoutes = routes.filter(_ => _.path.startsWith('/demos/'))
</script>

<template>
  <router-link :to="{ name: 'home' }">
    <h1 id="appTitle">VueGrid Demos</h1>
  </router-link>
  <nav>
    <span v-for="{ name, title } of demoRoutes" :key="name"
      class="nav-link">
        <router-link :to="{ name: name }">{{ title }}</router-link>
    </span>
  </nav>
  <main>
    <router-view />
  </main>
</template>

<style scoped>
  #appTitle {
    margin-bottom: 1rem;
    color: #555
  }
  nav {
    background-color: #ddd;
  }
  main {
    margin-top: 3rem;
  }

  .nav-link {
    padding: 0 0.5rem;
    border-right: 2px solid #888;
  }
  .nav-link:last-child {
    border-right:none;
  }
</style>

<style lang="scss">
  /* demonstration of style overrides */
  $title-color: #6c6f70;
  $green-color:  #5cb85c;
  $light-color: lighten($title-color, 35);
  $dark-color: darken($title-color, 20);
  $odd-row-color: #f9f9f9;
  $text-color: #fff;

  button {
    border: 1px solid darken($green-color, 30);
    border-radius: 0.4rem;
    background-color: $green-color;
    color: #fff;
    margin: 0.5rem;
    line-height: 2rem;
    padding:0.2rem 1rem;
  }

  input[type='text'] {
    border: 1px solid #aaa;
    height: 2rem;
    margin: 0.5rem;
    padding: 0.2rem 0.5rem;
  }

  .grid-style {
    min-width: 70rem;
    margin: 2rem auto 4rem;

    >table {
      min-height: 800px;
    }

    .search {
      >input[type="text"] {
        margin-right:0;
      }
      button {
        border-radius: 0 0.4rem 0.4rem 0;
        margin-left:0;
        background-color: $green-color !important;
        color: $text-color !important;
      }
    }
  }

  .title-container {
    background-color: $title-color !important;
    color: $text-color !important;
  }
  .pager {
    background-color: $title-color !important;
  }
  tr:nth-of-type(odd) {
    background-color: $odd-row-color !important;
  }
  .pager {
    color: $text-color;
    .active {
      background-color: $dark-color !important;
    }
    .page-number:hover {
      background-color: $light-color !important;
      color: #333;
    }
  }
</style>
