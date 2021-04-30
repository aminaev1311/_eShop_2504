{/* 
    <a class="nav-link active" aria-current="page" href="#" style="margin-right:10px">Catalogue</a>
    <a class="nav-link active" href="#" @click="$root.showcatalog = false">Cart</a>
*/}

Vue.component('nav-bar',{
    props: [],
    template:`
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0" style="flex-direction: row;">
                    <li class="navbar-brand">eShop</li>
                    <li class="nav-item" @click="$root.showcatalog = true" style="margin-right:20px">
                        <button @click="$root.showcatalog = true" class="btn btn-primary">Catalog page</button>
                    </li>
                    <li class="nav-item">
                        <button @click="$root.showcatalog = false" class="btn btn-secondary">Cart page</button>
                    </li>
                </ul>
                <button class="btn btn-outline-success" type="button" @click="$root.showCart = !$root.showCart" style="position:relative">Cart</button>
                <slot></slot>
        </div>
    </nav>
    `,

    data() {
        return {
            showcatalog: true,
        }
    },
    methods: {
        onSearch(value) {
            let regExp = new RegExp(value, 'gi');

            console.log('search started:' + value);
            this.$root.$refs.products.filtered = this.$root.$refs.products.products.filter(product => regExp.test(product.product_name));
        },
    }
});