<template>
<div id="wrapper">
    <button @click="download('0001')">点击0001</button>
    <button @click="cancel('0001')">cancel0001</button>
    <br>
    <button @click="download('0002')">点击0002</button>
    <button @click="cancel('0002')">cancel0002</button>
</div>
</template>

<script>
import { ipcRenderer } from 'electron';// eslint-disable-line
export default {
    name: 'HomePage',
    methods: {
        download(index) {
            ipcRenderer.send('download', index);
        },
        cancel(index) {
            ipcRenderer.send('cancel', index);
        }
    }
};
</script>

<style>

</style>
