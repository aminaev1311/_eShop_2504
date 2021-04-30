Vue.component( 'error', {
    template:`
        <div style="color:red" v-show="$root.isConnectionError">Error connecting to server</div>
    `,

    methods: {
    },
    data() {
        return {
        }
    }
});