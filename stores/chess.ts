import { defineStore } from "pinia";
import { useConnectionStore } from "./connection";
import equal from "deep-equal";

export enum Overlay {
    None = "",
    Move = "etc/overlay",
    Capture = "etc/capture"
}

export type Position = number[] // rank,file

export interface Move {
    src: Position;
    dest: Position;
    promote: string | null;
}

export const useChessStore = defineStore({
    id: "chess",
    state: () => ({
        board: [] as string[][],
        boardReady: false,
        gameID: 0,
        boardFlipped: false,
        clientPlayer: "w",
        currentPlayer: true,
        castling: ["K", "Q", "k", "q"],
        enPassantPos: null as Position | null,
        // currentLegalMoves: [] as Move[],
        currentLegalMoves: [{ src: [6, 1], dest: [6, 3] }] as Move[],
        name: "",
        opponentName: "",
    }),
    actions: {
        loadFromFen(fen: string) {
            this.board = Array.from(Array(8), () => Array.from(Array(8), () => ""))
            this.clientPlayer = fen.at(0)!;
            fen = fen.slice(1);
            const parts = fen.split(" ");
            const fenBoard = parts[0];
            let file = 0, rank = 7;
            for (const symbol of fenBoard) {
                if (symbol === "/") {
                    file = 0;
                    rank -= 1;
                }
                else {
                    if (isNaN(+symbol)) {
                        this.board[rank][file] = symbol;
                        file += 1;
                    } else
                        file += +symbol;
                }
            }
            this.currentPlayer = parts[1] === this.clientPlayer;
            this.castling = Array.from(parts[2]);

            if (parts[3] != "-")
                this.enPassantPos = [...parts[3]].map(x => +x);
        },
        makeMove(move: Move, send: boolean = true) {
            const src = this.boardAtPos(move.src);
            const currentPlayerIsWhite = this.currentPlayer === (this.clientPlayer === "w");

            // ep capture
            if (src.toLowerCase() === "p" && equal(move.dest, this.enPassantPos)) {
                this.setBoardAtPos([move.dest[0] + (currentPlayerIsWhite ? -1 : 1), move.dest[1]], "");
                this.enPassantPos = null;
                // ep move
            } else if (src.toLowerCase() === "p" && Math.abs(move.dest[0] - move.src[0]) === 2) {
                this.enPassantPos = [move.dest[0] + (currentPlayerIsWhite ? -1 : 1), move.dest[1]];
                // normal move
            } else {
                this.enPassantPos = null;
            }

            const castleOffset = move.dest[1] - move.src[1];
            if (src.toLowerCase() === "k" && Math.abs(castleOffset) === 2) {
                if (castleOffset === 2 && this.castling.includes(this.currentPlayer ? "K" : "k")) {
                    this.castling.splice(this.castling.indexOf(this.currentPlayer ? "K" : "k"), 1);
                    this.castle(move);

                } else if (castleOffset === -2 && this.castling.includes(this.currentPlayer ? "Q" : "q")) {
                    this.castling.splice(this.castling.indexOf(this.currentPlayer ? "Q" : "q"), 1);
                    this.castle(move);
                }
            }

            this.setBoardAtPos(move.dest, this.boardAtPos(move.src));
            this.setBoardAtPos(move.src!, "");

            if (move.promote) {
                this.setBoardAtPos(move.dest, currentPlayerIsWhite ? move.promote.toUpperCase() : move.promote.toLowerCase());
            }

            this.currentPlayer = !this.currentPlayer;
            if (send)
                this.sendMove(move.src, move.dest, move.promote);
        },
        sendMove(src: Position, dest: Position, promote?: string | null) {
            const connection = useConnectionStore();
            connection.onReady(ws => ws.send(`m${src[1]}${src[0]}${dest[1]}${dest[0]}${promote || ""}`))
        },
        overlayAt(rank: number, file: number) {
            return (this.boardAt(rank, file) !== "" || equal([rank, file], this.enPassantPos)) ? Overlay.Capture : Overlay.Move;
        },
        boardAt(rank: number, file: number) {
            return this.board[rank][file];
        },
        boardAtPos(pos: Position) {
            return this.board[pos[0]][pos[1]];
        },
        setBoardAt(rank: number, file: number, piece: string) {
            this.board[rank][file] = piece;
        },
        setBoardAtPos(pos: Position, piece: string) {
            this.board[pos[0]][pos[1]] = piece;
        },
        asWhite() {
            return this.clientPlayer === "w"
        },
        castle(move: Move) {
            const rookFile = move.dest[1] === 2 ? 0 : 7;
            this.setBoardAtPos([move.dest[0], move.dest[1] === 2 ? 3 : 5], this.boardAtPos([move.dest[0], rookFile]));
            this.setBoardAtPos([move.dest[0], rookFile], "");
        }
    }
});
