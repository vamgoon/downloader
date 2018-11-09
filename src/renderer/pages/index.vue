<template>
<div id="wrapper">
    <header></header>
    <button @click="download">下载</button>
    <p v-for="(value, key) in msg" :key="key">{{key}}: {{value}}</p>
</div>
</template>

<script>
import { ipcRenderer } from 'electron';// eslint-disable-line
import Header from './components/header';
export default {
    name: 'HomePage',
    data() {
        return {
            msg: {
                '0001': 0,
                '0002': 0
            }
        };
    },
    methods: {
        download() {
            const arr = ['0001', '0002', '0003', '0004', '0005'];

            arr.forEach((item) => {
                ipcRenderer.send('download', item);
            });
        },
        pause(index) {
            ipcRenderer.send('pause', index);
        }
    },
    mounted() {
        ipcRenderer.on('receivedBytes', (event, msg) => {
            this.msg[msg.vName] = msg.receivedBytes;
        });
        ipcRenderer.on('completed', (event, msg) => {
            console.log(msg);
        });
    },
    components: {
        Header
    }
};
</script>

<style scoped>
#wrapper {
    width: 100vw;
    height: 100vh;
}
button {
    padding: 5px 8px;
    margin: 10px;
}
</style>

