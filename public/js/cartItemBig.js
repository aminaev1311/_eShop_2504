verticalCard =  Vue.component('cart-item', {
    props: ['product'],
    template:`
    <div class="card" style="width:100%">
        <div style="display:flex;">
            <div >
                <img :src="src" alt="image">
            </div>
            <div >
                <div class="card-body" style="display:flex;">
                    <div>
                        <h5 class="card-title">{{product.product_name}}</h5>
                        <p class="card-text">q-ty: {{product.quantity}}
                            <a class="btn btn-primary" @click="$emit('add', product)">+</a>
                            <a class="btn btn-primary" @click="$emit('remove', product)">-</a>
                        </p>
                        <p class="card-text">each: {{product.price}} RUB</p>
                        <p class="card-text">
                            <small class="text-muted"> total: {{total}}
                            </small>
                        </p>
                    <a class="btn btn-primary" @click="$emit('erase', product)">X</a>
                    </div>
                    <div style="margin-left:30px;">
                        <p class="card-text">warranty: {{product.warranty}} </p>
                        <p class="card-text">manufacturer: {{product.manufacturer}}</p>
                        <p class="card-text">weight: {{product.weight}}</p>
                        <p class="card-text">size: {{product.size}}</p>
                    </div>
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