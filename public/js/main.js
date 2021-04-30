const app = new Vue({
    el: "#app",
    data: {
        products: [],
        filtered: [],
        cart: [],
        cartFiltered: [],
        // productsUrl: 'https://raw.githubusercontent.com/aminaev1311/online-store-api/master/responses/catalogData.json',
        productsUrl: './catalogData',
        // cartUrl: 'https://raw.githubusercontent.com/aminaev1311/online-store-api/master/responses/getBasket.json',
        cartUrl: './cart',
        showCart: false,
        isConnectionError: false,
    }, 
    methods: {
        onSearch(value) {
            let regExp = new RegExp(value, 'gi');
            console.log('search started:' + value);

            this.$root.filtered = this.$root.products.filter(product => regExp.test(product.product_name));
        },

        http(url, method = 'GET', data = null) {
            console.log("fetching data from" + url );
            return fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: data ? JSON.stringify(data) : null,
            })
                .then(response => {
                    console.log(response);
                    return response.json();
                })
                .catch(err => {
                    console.log(err);
                    this.$root.isConnectionError = !this.$root.isConnectionError;
                    return false;
                });
        },
    },
    mounted() {
        console.log(this);

        //get products from the server
        this.http(this.productsUrl).then( res => {
            this.products = this.filtered = [...res];
        } );

        //get cart from the server
        this.http(this.cartUrl).then( res => {
            this.cart = this.cartFiltered = [...res];
            console.log(this.cart);
        })
    }
});