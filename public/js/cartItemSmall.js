verticalCard =  Vue.component('vertical-card', {
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