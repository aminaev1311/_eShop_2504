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
            <vertical-card v-for="product of $root.cartFiltered" :key="product.id_product" :product="product" @remove="remove(product)" @add="add(product)" @erase="erase(product)">
            </vertical-card>
            <div v-show="isEmpty">The cart is empty</div>
            <div v-show="!isEmpty">total: {{total}} RUB. {{$root.cart.length}} position(s) in the cart</div>
            <button @click="openCartPage" class="btn btn-info">Go to cart page</button>
        </div>
    `,
    computed: {
        isEmpty() {
            return this.$root.cart.length === 0;
        },
        total() {
            return this.$root.cart.reduce((acc, curr) => acc + curr.quantity * curr.price, 0);
        }
    },
    data() {
        return {
        }
    },
    methods: {
        openCartPage() {
            this.$root.showcatalog = false;
            this.$root.showCart = false;
        },

        async add(product) {
            try {
                let productWithQuantity = Object.assign({ quantity: 1 }, product);
                let find = this.$root.cart.find(item => item.id_product === product.id_product);
                if (find) {
                    //send put request to update the quantity of the product
                    const { result } = await this.$root.http(`/cart/${find.id_product}`, "PUT", { quantity: 1 });
                    if (result) {
                        return find.quantity++;
                    }
                    throw new Error('Неверный ответ сервера')
                } else {
                    //send the newly added product to the server
                    const { result } = await this.$root.http(this.$root.cartUrl, "POST", productWithQuantity)
                    if (result) {
                        return this.$root.cart.push(productWithQuantity);
                    }
                    throw new Error('Неверный ответ сервера')
                }
            } catch (e) {
                console.log(e)
            }

        },
        async remove(product) {
            try {
                if (product.quantity > 1) {
                    const { result } = await this.$root.http(`/cart/${product.id_product}`, "PUT", { quantity: -1 });
                    if (result) {
                        return product.quantity--;
                    }
                    throw new Error('Неверный ответ сервера')
                } else {
                    const { result } = await this.$root.http(this.$root.cartUrl + `/${product.id_product}`, "DELETE");
                    if (result) {
                        let index = this.$root.cart.findIndex(p => p.id_product === product.id_product);
                        return this.$root.cart.splice(index, 1);
                    }
                    throw new Error('Неверный ответ сервера')
                }
            } catch (e) {
                console.log(e)
            }
        },

        erase(product) {
            this.$root.http(this.$root.cartUrl + `/${product.id_product}`, "DELETE");

            let index = this.$root.cart.findIndex(p => p.id_product === product.id_product);
            if (index === -1) {
                console.log(product + "not found in cart");
            } else {
                this.$root.cart.splice(index, 1);
            }
        }
    },
    mounted() {
    }
});