<script context="module">
    import { base_uri } from "../config.js";

    export function preload() {
        return this.fetch(`${base_uri}/api/meta`).then((r) => r.json()).then((stats) => {
            return {
                guilds: stats.guilds,
                hits_count: stats.hits_count,
                items: stats.items,
            };
        });
    }
</script>

<script>
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";

    export let guilds;
    export let hits_count;
    export let items;

    const missing_guilds = guilds.filter((g) => !g.name).length;

    let loaded = false;
    let max_height = 0;
    let title_container;
    let split_header;
    let rankings;

    function update_height() {
        max_height = window.innerHeight
            - title_container.clientHeight
            - split_header.clientHeight
            - rankings.clientHeight
            - 20;
    }

    onMount(() => {
        loaded = true;
        update_height();
        window.addEventListener("resize", update_height);
    });

</script>

<div class="social">
    <a href="https://discord.gg/mRUEPnp">
        <img width="36px" height="36px" src="{base_uri}/icons/discord.png" alt="dicord invite">
    </a>
    <a href="https://github.com/Kruhlmann/classicdb_bot">
        <svg height="30" class="octicon octicon-mark-github" viewBox="0 0 16 16" version="1.1" width="30" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
        </svg>
    </a>
</div>

<div class="viewbox">
    <div class="title-container" bind:this={title_container}>
        <img src="{base_uri}/icons/favicon-96x96.png" alt="wow icon">
        <h1 class="main-title">classic db bot</h1>
    </div>
    <div class="rankings" bind:this={rankings}>
        {#if guilds.length > 0}
            <div class="rank gold">
                <div class="guild">
                    <img class="guild-icon" alt="guild icon" src="{base_uri}/icons/guilds/{guilds[0].icon}">
                    <div class="guild-tooltip">
                        <span>{guilds[0].name}</span>
                    </div>
                </div>
                <span class="subtitle">{guilds[0].hits} ITEMS</span>
            </div>
        {/if}
        {#if guilds.length > 1}
            <div class="rank silver">
                <div class="guild">
                    <img class="guild-icon" alt="guild icon" src="{base_uri}/icons/guilds/{guilds[1].icon}">
                    <div class="guild-tooltip">
                        <span>{guilds[1].name}</span>
                    </div>
                </div>
                <span class="subtitle">{guilds[1].hits} ITEMS</span>
            </div>
        {/if}
        {#if guilds.length > 2}
            <div class="rank bronze">
                <div class="guild">
                    <img class="guild-icon" alt="guild icon" src="{base_uri}/icons/guilds/{guilds[2].icon}">
                    <div class="guild-tooltip">
                        <span>{guilds[2].name}</span>
                    </div>
                </div>
                <span class="subtitle">{guilds[2].hits} ITEMS</span>
            </div>
        {/if}
    </div>
    {#if loaded}
        <div class="viewbox-content" transition:fly={{ y: 60, duration: 1200 }}>
            <div class="split-headers" bind:this={split_header}>
                <div class="left">
                    <span class="table-title">{hits_count} item link{hits_count === 1 ? "" : "s"} sent</span>
                </div>
                <div class="right">
                    <span class="table-title">Used by {guilds.length} server{guilds.length === 1 ? "" : "s"}</span>
                </div>
            </div>
            <div class="split">
                <div class="left" style="max-height: {max_height}px;">
                    <table class="item-table">
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>name</th>
                                <th>#</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each items as item}
                                {#if item.hits > 0}
                                    <tr on:click={() => window.location.href = `https://itemization.info/item/${item.id}`}>
                                        <td>{item.id}</td>
                                        <td class="name {item.Quality.toLowerCase()}" >
                                            {item.Name}
                                        </td>
                                        <td>{item.hits}</td>
                                    </tr>
                                {/if}
                            {/each}
                        </tbody>
                    </table>
                </div>
                <div class="right" style="max-height: {max_height}px;">
                    <div class="server-table" >
                        {#each guilds as guild}
                            {#if guild.icon && guild.name}
                                <div class="guild">
                                    <img class="guild-icon" alt="guild icon" src="{base_uri}/icons/guilds/{guild.icon}">
                                    <div class="guild-tooltip">
                                        <span>{guild.name}</span>
                                    </div>
                                </div>
                            {/if}
                        {/each}
                        {#if missing_guilds > 0}
                            <div class="guild">
                                <img class="guild-icon" alt="guild icon" src="{base_uri}/icons/default-discord-server.png">
                                <div class="guild-tooltip">
                                    <span>{missing_guilds} not shown</span>
                                </div>
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    .viewbox {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        color: white;
    }

    .title-container {
        display: flex;
        align-items: center;
    }

    .title-container img {
        width: 85px;
        height: 85px;
        margin-right: 15px;
    }

    .main-title {
        font-size: 66px;
        text-transform: uppercase;
        font-weight: 300;
    }

    .table-title {
        font-size: 26px;
        margin-bottom: 5px;
    }

    .viewbox-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .split, .split-headers {
        width: 100%;
        display: flex;
    }

    .left, .right {
        width: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0 10px;
        overflow: auto;
    }

    .item-table {
        width: 100%;
        border-spacing: 0;
    }

    .item-table thead {
        text-transform: uppercase;
        background-color: #373737;
        font-size: 18px;
    }

    .item-table td, .item-table th {
        padding: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .item-table tbody tr:nth-child(even) {
        background-color: #323232;
    }

    .item-table tbody tr:hover {
        cursor: pointer;
        background-color: #373737;
    }

    .item-table tbody tr:hover .name {
        text-decoration: underline;
    }

    .server-table {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }

    .guild-icon {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        cursor: default;
    }

    .guild-tooltip {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
        border-radius: 50%;
        top: -100%;
        position: relative;
        opacity: 0;
        cursor: default;
        font-size: 11px;
        background-color: rgba(0, 0, 0, 0.7);
        transition: opacity 0.2s ease-in-out;
    }

    .guild {
        width: 75px;
        height: 75px;
        border-radius: 50%;
        border: 2px solid #444;
        margin: 5px;
    }

    .guild:hover > .guild-tooltip {
        opacity: 1;
    }

    .social {
        align-items: center;
        position: fixed;
        top: 5px;
        right: 5px;
        display: flex;
    }

    .rankings {
        display: flex;
    }

    .rankings .rank {
        display: flex;
        flex-direction: column;
        min-width: 150px;
    }

    .rankings .rank .subtitle {
        font-size: 22px;
        text-align: center;
    }

    .rankings .rank .guild {
        border-width: 8px;
        margin: 0 auto;
        margin-bottom: 12px;
    }

    .rankings .rank.gold .guild {
        border-color: #d7ba16;
    }

    .rankings .rank.silver .guild {
        border-color: #afaaaa;
    }

    .rankings .rank.bronze .guild {
        border-color: #8d560d;
    }

    .social svg {
        fill: white;
    }

    .artifact {
	    color: #e5cc80 !important;
    }

    .legendary {
        color: #ff8000 !important;
    }

    .epic {
        color: #a335ee !important;
    }

    .rare {
        color: #0070dd !important;
    }

    .uncommon {
        color: #1eff00 !important;
    }

    .common {
        color: white !important;
    }

    .poor {
        color: #9d9d9d !important;
    }

</style>
