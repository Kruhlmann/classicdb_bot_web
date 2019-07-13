<script>

</script>

<slot></slot>

<style>
    :global(html, body) {
        height: 100%;
        overflow: hidden;
        font-family: "Roboto", sans-serif;
        padding: 0;
        margin: 0;
    }

    :global(#sapper) {
        display: flex;
        flex-direction: column;
        height: 100%;
        background-color: #272727;
    }
</style>
