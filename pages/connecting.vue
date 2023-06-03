<template>
    <ClientOnly>
        <div v-if="connection.failed">
            <p>{{ connection.failedReason }}</p>
            <button @click="connection.connect()">Try again</button>
        </div>

        <div v-else>
            <p>{{ connection.state }}</p>
        </div>
    </ClientOnly>
</template>


<script lang="ts" setup>

import { useConnectionStore } from "@/stores/connection";

const connection = useConnectionStore();

console.log("on connecting page")

</script>

<style scoped>
* {
    font-size: 1.5rem;
    margin-top: 2rem auto;
    text-align: center;
}
</style>