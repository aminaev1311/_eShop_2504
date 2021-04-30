Vue.component('vertical-card', {
    props: ['product'],
    template:`
    <div class="card mb-3" style="max-width: 540px;">
        <div class="row g-0">
            <div class="col-md-4">
            <img :src="src" alt="image">
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title">{{product.product_name}}</h5>
                    <p class="card-text">q-ty: 
                        <input type="number" min="1" max="10" v-model.number="product.quantity" style="width: 45px">
                    </p>
                    <p class="card-text">each: {{product.price}} RUB</p>
                    <p class="card-text">
                        <small class="text-muted"> total: {{total}}
                        </small>
                    </p>
                    <a class="btn btn-primary" @click="$emit('remove', product)">X</a>
                </div>
            </div>
        </div>
    </div>
    `,
    computed: {
        src() {
            return "https://picsum.photos/130/228?random=" + (Math.random()*1000);
        },
        total() {
            return this.product.quantity*this.product.price;
        }
    }
});

Vue.component('cart', {
    template: `
        <div v-show="$root.showCart" class="cart" style="right: 14px;
        position: absolute;
        gap: 20px;
        padding: 20px;
        top: 55px;
        background: white;
        z-index: 1;
        width: 500px;
        box-shadow: 1px 1px 1px 1px;">
            <vertical-card v-for="product of $root.cart" :key="product.id_product" :product="product" @remove="remove(product)">
            </vertical-card>
            <div v-show="isEmpty">The cart is empty</div>
            <div v-show="!isEmpty">total: {{total}} RUB. {{$root.cart.length}} position(s) in the cart</div>
        </div>
    `,
    computed: {
        isEmpty() {
            return this.$root.cart.length===0;
        },
        total() {
            return this.$root.cart.reduce( (acc,curr) => acc + curr.quantity*curr.price,0);
        }
    },
    data() {
        return {
        }
    },
    methods: {
        log(product, action) {
            console.log(product, action, new Date());
            let logObj = {product: product, action: action, time: new Date()};
            this.$root.http('/stats', "POST", logObj)
            return logObj;
        },
        add(product) {
            let productWithQuantity = Object.assign({quantity: 1}, product);
            let find = this.$root.cart.find(item => item.id_product === product.id_product);
            this.log(product.product_name, action = 'add');
            if (find) {
                find.quantity++;
                this.$root.cartFiltered = this.$root.cart;
                //send put request to update the quantity of the product
                this.$root.http( `/cart/${find.id_product}`, "PUT", {quantity: find.quantity});
            } else {
                //send the newly added product to the server
                this.$root.http(this.$root.cartUrl, "POST", productWithQuantity).then(data => {
                    if (data.result === 1) {
                        console.log("adding to cart: " + product.product_name);
                        this.$root.cart.push(productWithQuantity);
                        this.$root.cartFiltered = this.$root.cart;
                    }
                });
            }
        },

        remove(product) {
            this.log(product.product_name, action = 'remove');
            this.$root.http(this.$root.cartUrl+`/${product.id_product}`, "DELETE")
                .then( data => {
                    if (data.result ===1) {
                        console.log("removing from cart: " + product);
                        let index = this.$root.cart.findIndex( p=> p.id_product === product.id_product);
                        if (index === -1) {
                            console.log(product + "not found in cart");
                        } else {
                            product.quantity--;
                            if (product.quantity===0) {
                                this.$root.cart.splice(index,1);
                            }
                        }
                        this.$root.cartFiltered = this.$root.cart;
                    }
                }
            );
        },
    },
    mounted() {
    }
});