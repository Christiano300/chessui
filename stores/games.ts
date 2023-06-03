import { defineStore } from "pinia";

interface OpenGame {
    name: string,
    id: number,
    color: string
}

export const colors = {
    "r": "Random",
    "w": "White",
    "b": "Black"
}

export const useGamesStore = defineStore({
    id: "games",
    state: () => ({
        games: [] as Array<OpenGame>
    })
})