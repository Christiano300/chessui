<template>
    <p>Connecting...</p>
</template>


<script lang="ts" setup>
import { useConnectionStore } from "@/stores/connection";

const connection = useConnectionStore();

connection.defaultPage = true;
</script>

<style scoped>
* {
    font-size: 1.5rem;
    margin-top: 2rem auto;
    text-align: center;
}

</style>