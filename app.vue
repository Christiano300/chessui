<template>
  <!-- <p>Das ist immer da</p> -->
  <NuxtPage></NuxtPage>
</template>

<script lang="ts" setup>

import { useConnectionStore } from "@/stores/connection";

const connection = useConnectionStore();

connection.connect();


useHead({
  meta: [
    { name: "theme-color", content: "#001517" }
  ]
});

</script>

<style>
:root {
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  color: #ffe;
}

button, input[type=text], select {
  color: #ffe;
  background: #00ff0007;
  box-shadow: #19593e 0 0 0 2px;
  padding: .5em 1em;
  border-radius: .5em;
  border: 2px solid #237f58;
  transition: border .2s linear, box-shadow .2s linear, scale .2s ease-in-out;
  outline: transparent;
  font-size: 1.1rem;
}

input[type=text], select {
  background: #ffffff;
  color: rgb(0, 21, 12);
}

button:hover, button:focus-visible, input[type=text]:focus, select:focus {
  scale: 1.01;
  border: 2px solid transparent;
  box-shadow: #237f58 0 0 0 2px, #19593e 0 0 1px 3px;
}

button:active {
  scale: .98;
}

ul {
  list-style-type: none;
}

ul li {
  border-radius: .5em;
  box-shadow: #ffe 1px 1px 9px -4px;
  display: block;
}

body {
  background-color: #001517;
}

form {
  font-size: 1.2rem;
  padding: 1.5em;
  border-radius: 1.5em;
  border: 3px solid #237f58;
  margin: 2em auto;
  display: flex;
  flex-flow: column nowrap;
  gap: 1em;
}

form p, form label {
  margin: .2em;
}

</style>