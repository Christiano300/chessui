<template>
    <div v-if="chess.boardReady">
        <p>{{ chess.opponentName }}</p>
        <Board></Board>
        <p>{{ chess.name }}</p>
    </div>
    <div v-else class="wait-text">
        <p>Waiting for the other player to join...</p>
        <p>Game-ID: {{ chess.gameID.toString(36) }}</p>
    </div>
</template>

<script setup lang="ts">
import { useChessStore } from "~/stores/chess";

const chess = useChessStore();

</script>

<style scoped>
p {
    margin: .5em;
    text-align: center;
    font-size: 1.2rem;
}

.wait-text {
    margin: 5em;
}
</style>