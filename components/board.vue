<template>
    <div>
        <div class="board" :class="{ flipped: chess.clientPlayer === 'w' }">
            <div v-for="row, rank in chess.board" class="row" :class="{ flipped: chess.clientPlayer === 'b' }">
                <div v-for="tile, file in row" class="tile"
                    :class="{ light: (rank + file) % 2 !== 0, dark: (rank + file) % 2 === 0, hover: movin && inArray([rank, file], currentPieceMoves.map(move => move.dest)) }"
                    @click="handleClick(rank, file)">

                    <nuxt-icon v-if="tile !== ''" class="piece"
                        :name="`${(tile === tile.toLowerCase()) ? 'black' : 'white'}/${tile}`" filled></nuxt-icon>
                    <nuxt-icon v-if="inArray([rank, file], currentPieceMoves.map(move => move.dest))" class="overlay"
                        :name="chess.overlayAt(rank, file)" filled></nuxt-icon>
                </div>
            </div>
            <div class="promote" v-if="promoteOverlay">
                <nuxt-icon v-for="piece in 'qrbn'" @click="finishPromote(piece)" v-if="promoteOverlay"
                    :name="`${chess.asWhite() ? 'white' : 'black'}/${chess.asWhite() ? piece.toUpperCase() : piece}`"
                    class="promote-icon" filled></nuxt-icon>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useChessStore, Move, Position } from "@/stores/chess";
import equal from 'deep-equal';

const chess = useChessStore();

const movin = ref(false);
const currentPieceMoves = ref([] as Move[]);
const promoteOverlay = ref(false);
let currentPiece = null as Position | null
let promoteDest: Position | null = null;

const inArray = <T>(obj: T, array: T[]): boolean => {
    for (const item of array) {
        if (equal(obj, item))
            return true;
    }
    return false;
}

const handleClick = (rank: number, file: number) => {
    if (!chess.currentPlayer)
        return;
    if (movin.value) {
        if (inArray([rank, file], currentPieceMoves.value.map(move => move.dest))) {
            console.log(rank)
            console.log(file)
            if (chess.boardAtPos(currentPiece!).toLowerCase() === "p" && (rank === 7 || rank === 0)) {
                promoteOverlay.value = true;
                promoteDest = [rank, file];
                console.log("promote");
            } else {
                chess.makeMove({src: currentPiece!, dest: [rank, file], promote: null});
            }

            currentPieceMoves.value.splice(0, Infinity);
            movin.value = false;
        } else if (chess.boardAt(rank, file)) {
            if (equal([rank, file], currentPiece)) {
                movin.value = false;
                currentPieceMoves.value.splice(0, Infinity);
                return;
            } else {
                selectPiece(rank, file);
            }
        } else {
            movin.value = false;
            currentPieceMoves.value.splice(0, Infinity);
        }
    } else {
        if (chess.boardAt(rank, file)) {
            selectPiece(rank, file);
        }
    }
    console.log(movin.value);
    console.log(currentPiece);
    console.log("\n");
}

const finishPromote = (piece: string) => {
    promoteOverlay.value = false;
    chess.makeMove({src: currentPiece!, dest: promoteDest!, promote: piece})
}

const selectPiece = (rank: number, file: number) => {
    movin.value = true;
    currentPieceMoves.value = chess.currentLegalMoves
        .filter(move => equal(move.src, [rank, file]))
    currentPiece = [rank, file];
}
</script>

<style>
.board {
    width: min(90vw, 90vh);
    height: min(90vw, 90vh);
    display: flex;
    flex-direction: column;
    align-items: stretch;
    border: min(1vw, .7vh) solid black;
    border-radius: 5px;
    margin: auto;
    position: relative;
}

.board.flipped {
    flex-direction: column-reverse;
}

.row {
    height: 12.5%;
    width: 100%;
    display: flex;
    align-items: stretch;
    justify-content: stretch;
}

.row.flipped {
    flex-direction: row-reverse;
}

.tile {
    flex-basis: 100%;
    position: relative;
}

.tile.light.hover:hover {
    background: #f7f57d
}

.tile.dark.hover:hover {
    background: #baca49
}

.tile.light {
    background: #e5d4ad;
}

.tile.dark {
    background: #ae7247;
}

.piece,
.overlay {
    display: inline-flex;
    width: 100%;
    height: 100%;
    align-items: stretch;
    justify-content: stretch;
}

.overlay {
    z-index: 1;
    position: absolute;
    left: 0;
}

.nuxt-icon svg {
    margin: 0;
    width: 100%;
    height: 100%;
}

.promote {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: row wrap;
    inset: 37.5%;
    background: #0006;
    border: .4em solid black;
    border-radius: .7em;
}

.promote-icon {
    display: inline-block;
    width: 50%;
    height: auto;
}
</style>