<script>

</script>

<slot></slot>

<style>
    :global(html) {
        height: 100%;
        overflow: hidden;
        background-color: #272727;
    }

    :global(body) {
        font-family: "Roboto", sans-serif;
        padding: 0;
        margin: 0;
    }

    :global(#sapper) {
        display: flex;
        flex-direction: column;
    }
</style>
