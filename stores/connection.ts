import { defineStore } from "pinia";
import { useGamesStore } from "./games";
import { Move, useChessStore } from "./chess";

export enum State {
    Connecting = "Connecting to server...",
    Handshake = "Loading...",
    Closed = "",
    Ready = "Redirecting..."
}

export const useConnectionStore = defineStore({
    id: "connection",
    state: () => ({
        websocket: null as WebSocket | null,
        failed: false,
        failedReason: "",
        sessionID: -1,
        state: State.Closed,
        outputQueue: [],
        defaultPage: false,
    }),

    actions: {
        connect() {
            if (!process.client) {
                return
            }
            if (this.state === State.Ready) {
                return
            }
            this.failed = false;
            this.websocket = new WebSocket(useRuntimeConfig().public.API_Base);
            this.state = State.Connecting;
            useRouter().push("/connecting");
            console.log("push connecting");
            this.websocket.onerror = () => {
                this.state = State.Closed;
                this.failed = true;
                this.failedReason = "Server currently not online.";
            }
            this.websocket.onopen = () => {
                if (this.websocket!.CONNECTING) {
                    return
                }
                if (localStorage.getItem("sessionID") === null) {
                    this.websocket?.send("rs");
                    this.state = State.Handshake;
                } else {
                    this.sessionID = parseInt(localStorage.getItem("sessionID")!, 36);
                    if (this.defaultPage)
                        useRouter().replace("join");
                    else 
                        setTimeout(useRouter().back, 50);
                }
                window.addEventListener("beforeunload", () => {
                    this.websocket!.close();
                });
            }

            this.websocket.onmessage = ev => {
                let data = ev.data;
                if (typeof data !== "string") {
                    return;
                }
                console.log("recieved data: " + data)
                const chess = useChessStore();
                if (data.startsWith("s")) {
                    this.sessionID = parseInt(data.slice(1), 36);
                    localStorage.setItem("sessionID", this.sessionID.toString(36));
                    this.websocket!.send(`s${this.sessionID.toString(36)}`)
                    this.state = State.Ready;
                    if (this.defaultPage)
                        useRouter().replace("join");
                    else {
                        setTimeout(useRouter().back, 50);
                        console.log("went back");
                    }

                } else if (data === "c") {
                    this.state = State.Closed;
                    this.failed = true;
                    this.failedReason = "Server is at capacity right now.";
                    useRouter().replace("connecting");

                } else if (data.startsWith("o")) {
                    console.log("recieved data: " + data.slice(1))
                    const games = useGamesStore();
                    games.games = JSON.parse(data.slice(1));

                } else if (data.startsWith("b")) {
                    chess.boardReady = true;
                    chess.loadFromFen(data.slice(1));

                } else if (data.startsWith("m")) {
                    data = data.slice(1);
                    const move: Move = {src: [+data[1], +data[0]], dest: [+data[3], +data[2]], promote: data[4] ?? null};
                    chess.makeMove(move, false);

                } else if (data.startsWith("M")) {
                    data = data.slice(1);
                    chess.currentLegalMoves.splice(0, Infinity);
                    for (let i = 0; i < data.length; i += 4) {
                        const move = data.slice(i, i + 4);
                        chess.currentLegalMoves.push({src: [+move[1], +move[0]], dest: [+move[3], +move[2]], promote: null});
                    }
                } else if (data.startsWith("i")) {
                    chess.gameID = parseInt(data.slice(1), 36);
                } else if (data.startsWith("O")) {
                    chess.opponentName = data.slice(1);
                }
            }
        },
        send(message: string) {
            if (!process.client) {
                return
            }
            this.websocket!.send(message)
        },
        onReady(f: (ws: WebSocket) => any) {
            if (!process.client)
                return;
            if (this.state === State.Ready && this.websocket?.OPEN) {
                f(this.websocket);
            } else {
                this.websocket!.addEventListener("open", () => f(this.websocket as WebSocket));
            }
        }
    }
})