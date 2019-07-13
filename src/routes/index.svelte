<script context="module">
    export function preload() {
        return this.fetch("/api/meta").then((r) => r.json()).then((stats) => {
            return this.fetch(`https://itemization.info/item/${stats.top_item}`)
                .then((r) => r.text())
                .then((html) => {
                    const r = /<span class="(legendary|rare) name">(.*?)<\/span>/gm;
                    const match = r.exec(html);
                    return {
                        guild_count: stats.guild_count,
                        hits_count: stats.hits_count,
                        top_item: {
                            id: stats.top_item,
                            quality: match[1],
                            name: match[2],
                        }
                    };
                });
        });
    }
</script>

<script>
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";

    export let guild_count;
    export let hits_count;
    export let top_item;

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
                <a class="{top_item.quality}" href="https://itemization.info/item/{top_item.id}">
                    {top_item.name}
                </a>
            </span>
            <div class="split">
                <div class="left">
                    
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
        justify-content: space-around;
        width: 50%;
        font-size: 32px;
        margin: 15px 0;
    }

    .top-item {
        margin: 15px 0;
        width: 100%;
        font-size: 42px;
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