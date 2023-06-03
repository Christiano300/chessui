<template>
    <div class="container">
        <div>
            <p>Join a public Game</p>
            <ul id="games">
                <li v-for="game in games.games" @click="joinGame(game.id)">
                    <div>{{ game.name }}</div>
                    <div class="color">{{ (colors as any)[game.color] }}</div>
                    <nuxt-icon class="color-icon" :name="`games/${(colors as any)[game.color].toLowerCase()}`" filled></nuxt-icon>
                </li>
            </ul>
        </div>
        <div>
            <p>or join a private Game via ID</p>
            <input type="text" placeholder="GameID" v-model="joinID">
            <button @click="joinGame(parseInt(joinID, 36))" @keydown.enter="joinGame(parseInt(joinID, 36))">Join!</button>
        </div>
        <div>
            <button @click="useRouter().push('new')">or create a new Game</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useConnectionStore } from "@/stores/connection"
import { useGamesStore, colors } from "@/stores/games";

const games = useGamesStore();
const connection = useConnectionStore();

const joinID = ref("");



const joinGame = (id: number) => {
    connection.send("j" + id.toString(36));
    useRouter().push("play");
}

connection.onReady((ws) => ws.send("rg"));

</script>

<style>
.container {
    display: flex;
    height: 100%;
    justify-content: space-around;
    align-items: center;
    margin-top: 2em;
}

@media screen and (max-width: 50em) {
    .container {
        flex-direction: column;
        gap: 3em;
    }
}

.container > div {
    flex-basis: 25%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
}

p {
    text-align: center;
}

.container > div > input[type=text] {
    margin-bottom: 1em;
}

ul {
    padding-left: 0
}

li {
    width: 100%;
    margin: .5em;
    padding: .3em;
    transition: scale .2s ease;
    position: relative;
    height: fit-content;
}

li:hover {
    scale: 1.03;
}

.color-icon {
    position: absolute;
    right: .2em;
    top: 0;
    height: 100%;
    width: auto;
}

.nuxt-icon svg {
    height: 100%;
    width: auto;
}
</style>