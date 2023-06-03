<template>
    <form @submit.prevent="send">
        <input type="text" name="example" id="example" placeholder="Your Name: " v-model.trim="name">
        <div>
            <label><input type="radio" name="single" value="p" v-model="singleplayer" checked>Against a Friend</label>
            <label><input type="radio" name="single" value="s" v-model="singleplayer">Against the Computer</label>
        </div>
        <div>
            <p>I'm playing as </p>
            <label><input type="radio" name="color" value="w" v-model="color">White</label>
            <label><input type="radio" name="color" value="r" v-model="color" checked>Random</label>
            <label><input type="radio" name="color" value="b" v-model="color">Black</label>
        </div>
        <div v-if="singleplayer === 'p'">
            <label><input type="radio" name="vis" value="pub" v-model="visibility" checked>Public</label>
            <label><input type="radio" name="vis" value="prv" v-model="visibility">Private</label>
        </div>
        <div v-else>
            <select v-model="stockfishMode" required>
                <option v-for="mode in stockfishModes" :value="mode.value">
                    {{ mode.text }}
                </option>
            </select>
        </div>
        <button type="submit">Create</button>
    </form>
</template>

<script setup lang="ts">
import { useConnectionStore } from "@/stores/connection";

const stockfishModes = ref([
    { text: 'Badfish', value: 'w' },
    { text: 'Worstfish', value: 'W' },
    { text: '1 ms', value: '1' },
    { text: 'Depth "0"', value: 'e' },
    { text: 'Depth 18', value: 'd' },
    { text: 'Depth 25', value: 'D' },
    { text: '50k nodes', value: 'n' },
    { text: '1M nodes', value: 'N' },
    { text: '100 ms', value: 't' },
    { text: '1500 ms', value: 'T' },
    { text: 'Random', value: 'r' }
]);

const name = ref("Anonymous");
const color = ref("r");
const visibility = ref("pub");
const singleplayer = ref("p");
const stockfishMode = ref("");

const connection = useConnectionStore();
const send = () => {
    connection.send(`n${singleplayer.value}${stockfishMode.value}${color.value}${visibility.value}${name.value}`);
    useRouter().push("play")
    // console.log(`n${singleplayer.value}${stockfishMode.value}${color.value}${visibility.value}${name.value}`)
}

</script>

<style scoped>
form {
    width: fit-content;
}
</style>