<script context="module">
    export function preload() {
        return this.fetch("/api/meta").then((r) => r.json()).then((stats) => {
            return {
                guild_count: stats.guild_count,
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

    export let guild_count;
    export let hits_count;
    export let items;
    export let topitem;

    let loaded = false;

    onMount(() => {
        loaded = true;
    })

</script>

<div class="viewbox">
    <h1 class="main-title">classic db bot</h1>
    {#if loaded}
        <div class="viewbox-content" transition:fly={{ y: 60, duration: 1200 }}>
            <div class="overview">
                <span>Used by {guild_count} server{guild_count === 1 ? "" : "s"}</span>
                <span>{hits_count} items provided</span>
            </div>
            <span class="top-item">
                <span>Most requested item: </span>
                <a class="{topitem.Quality.toLowerCase()}" href="https://itemization.info/item/{topitem.id}">
                    {topitem.Name}
                </a>
            </span>
            <div class="split">
                <div class="left">
                    <table>

                    </table>
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

    .main-title {
        font-size: 66px;
        text-transform: uppercase;
        font-weight: 300;
    }

    .viewbox-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .overview {
        display: flex;
        justify-content: space-evenly;
        width: 50%;
        font-size: 32px;
        margin-bottom: 10px;
    }

    .top-item {
        margin-bottom: 10px;
        width: 100%;
        font-size: 32px;
        text-align: center;
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