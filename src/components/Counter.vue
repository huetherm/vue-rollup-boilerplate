<template>
<div>
    <p>{{counter}} </p>
    <v-btn icon @click="setCounter(counter + 1)"><v-icon>mdi-plus</v-icon></v-btn>
    <v-btn icon @click="setCounter(counter - 1)"><v-icon>mdi-minus</v-icon></v-btn>   
    <v-btn icon @click="resetCounter()"><v-icon left>mdi-delete</v-icon></v-btn>   
</div>
</template>

<script>
import { store, mutations } from "../store.js";

  export default {
    computed: {
      counter() { return store.counter } 
    },
     methods: {
      setCounter: mutations.setCounter,
      resetCounter: mutations.resetCounter
    }
  }
</script>