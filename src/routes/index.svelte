<script context="module">
    export function preload() {
        return this.fetch("/api/meta").then((r) => r.json()).then((stats) => {
            return {
                guilds: stats.guilds,
                hits_count: stats.hits_count,
                items: stats.items,
                topitem: stats.topitem,
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
    export let topitem;

    let loaded = false;

    onMount(() => {
        loaded = true;
    })

</script>

<div class="viewbox">
    <div class="title-container">
        <img src="/icons/favicon-96x96.png" alt="wow icon">
        <h1 class="main-title">classic db bot</h1>
    </div>
    {#if loaded}
        <div class="viewbox-content" transition:fly={{ y: 60, duration: 1200 }}>
            <div class="split">
                <div class="left">
                    <span class="table-title">{hits_count} item link{hits_count === 1 ? "" : "s"} sent</span>
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
                                    <tr on:click={() => window.location.href = `https://itemization.info/item/${item.id}`}>
                                        <td>{item.id}</td>
                                        <td
                                            class="name {item.Quality.toLowerCase()}"
                                        >
                                            {item.Name}
                                        </td>
                                        <td>{item.hits}</td>
                                    </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
                <div class="right">
                    <span class="table-title">Used by {guilds.length} server{guilds.length === 1 ? "" : "s"}</span>
                    <div class="server-table">
                        {#each guilds as guild}
                            <div class="guild">
                                <span class="name">{guild.name}</span>
                                <img src="{guild.icon}" alt="guild icon">
                            </div>
                        {/each}
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

    .split {
        width: 100%;
        display: flex;
    }

    .split .left, .split .right {
        width: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0 10px;
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