Vue.component( 'search', {
    props: ['products', 'type'],
    template:`
        <div>
            <input class="form-control me-2" type="text" placeholder="Search by product name" aria-label="Search" @input="onSearch($event.target.value)" />
        </div>`,

    methods: {
        onSearch(value) {
            let regExp = new RegExp(value, 'gi');
            console.log('search started:' + value);

            if (this.type==='products') {
                this.$root.filtered = this.$root.products.filter(product => regExp.test(product.product_name));
                console.log(this.$root.filtered);
            } else if (this.type==="cart") {
                this.$root.cartFiltered = this.$root.cart.filter(product => regExp.test(product.product_name));
                console.log(this.$root.cartFiltered);
            }
        },
    },
    data() {
        return {
        }
    }
});