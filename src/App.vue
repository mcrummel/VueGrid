<script setup>
</script>

<template>
  <h1>VueGrid Demos</h1>
  <nav id="demosNav">
    <router-link :to="{ name: 'editable' }">Editable Table</router-link> |
    <router-link :to="{ name: 'staticData' }">Static Data Example</router-link> |
    <router-link :to="{ name: 'odata' }">Odata Example</router-link>
  </nav>
  <main id="content">
    <router-view />
  </main>
</template>

<style lang="scss">
  h1 {
    margin-bottom: 1rem;
  }
  #demosNav {
    background-color: #ddd;
  }
  main {
    margin-top: 3rem;
  }

  .grid-style {
    min-width: 70rem;
    height: 800px;
    margin: 2rem auto 4rem;
  }

  input[type='text'] {
    border: 1px solid #aaa;
    height: 2rem;
    margin: 0.5rem;
  }

  /* demonstration of style overrides */
  $title-color: #6c6f70;
  $green-color:  #5cb85c;
  $light-color: lighten($title-color, 35);
  $dark-color: darken($title-color, 20);
  $odd-row-color: #f9f9f9;

  button {
    border: 1px solid darken($green-color, 30);
    border-radius: 0.4rem;
    background-color: $green-color;
    color: #fff;
    margin: 0.5rem;
    line-height: 2rem;
    padding:0.2rem 1rem;
  }

  .title-container {
    background-color: $title-color !important;
    color: #fff !important;
  }
  .pager {
    background-color: $title-color !important;
  }
  tr:nth-of-type(odd) {
    background-color: $odd-row-color !important;
  }
  .pager {
    color: #fff;
    .active {
      background-color: $dark-color !important;
    }
    .page-number:hover {
      background-color: $light-color !important;
      color: #333;
    }
  }
  /**/
</style>
