const PORT = 3002;
const express = require('express');
const fs = require('fs');
const path = require('path');

const { readFile, writeFile } = require('./functions');

const urlCatalog = path.join(__dirname, 'db', 'catalog.json');
const urlCart = path.join(__dirname, 'db', 'cart.json');
const urlStats = path.join(__dirname, 'db', 'stats.json');

const app = express();

app.use(express.json()); // Даем знать приложению, что работаем с json'ом
// app.use('/', express.static( '../public' ));
app.use('/', express.static(path.join(__dirname, '../', '/public')));

//get catalog items
app.get('/catalogData', async (req, res) => {
    const data = await readFile(urlCatalog);
    data ? res.send(data) : res.sendStatus(404, JSON.stringify({ result: 0, text: err }));

});

//get cart items
app.get('/cart', async (req, res) => {
    const data = await readFile(urlCart);
    data ? res.send(data) : res.sendStatus(404, JSON.stringify({ result: 0, text: err }));
});

//get statistical data, currently this is no view to display it
app.get('/stats', async (req, res) => {
    const data = await readFile(urlStats);
    data ? res.send(data) : res.sendStatus(404, JSON.stringify({ result: 0, text: err }));
});

//post new cart item
app.post('/cart', async (req, res) => {

    try {
        const data = await readFile(urlCart);
        const dataStats = await readFile(urlStats);

        const cart = JSON.parse(data);
        cart.push(req.body);

        const stats = JSON.parse(dataStats);
        stats.push({
            date: new Date(),
            action: 'add to cart',
            product: req.body.product_name
        })

        await writeFile(urlCart, JSON.stringify(cart));
        await writeFile(urlStats, JSON.stringify(stats));
        res.json({ result: 1 });

    } catch (e) {
        res.send(JSON.stringify({ result: 0, text: e }));
    }

});

//update a quantity of an itme in the cart
app.put('/cart/:id', async (req, res) => {
    try {
        const data = await readFile(urlCart);
        const dataStats = await readFile(urlStats);

        const stats = JSON.parse(dataStats);

        if (data) {
            const cart = JSON.parse(data); //create an array of JSON cart objects      
            const elem = cart.find(el => el.id_product === +req.params.id);
            let quantity = +req.body.quantity;
            if (quantity === 1 ) {
                stats.push( {
                    date: new Date(),
                    action: 'decrease by 1',
                    product: elem.product_name
                });
            } 
            if (quantity === -1 ) {
                stats.push( {
                    date: new Date(),
                    action: 'increase by 1',
                    product: elem.product_name
                });
            }

            elem.quantity += quantity;
            await writeFile(urlCart, JSON.stringify(cart));
            await writeFile(urlStats, JSON.stringify(stats));
            res.json({ result: 1 });
        }
    } catch (e) {
        res.send(JSON.stringify({ result: 0, text: e }));
    }
});

app.delete('/cart/:id', async (req, res) => {

    try {
        const data = await readFile(urlCart);
        const cart = JSON.parse(data);

        const dataStats = await readFile(urlStats);
        const stats = JSON.parse(dataStats);

        const elem = cart.find(el => el.id_product === +req.params.id);

        if (elem) {
            cart.splice(cart.indexOf(elem), 1);
            
            try {
                await writeFile(urlCart, JSON.stringify(cart));
                res.send(JSON.stringify({ result: 1 }));
                stats.push({
                    date: new Date(),
                    action: "delete",
                    product: elem.product_name
                });
                await writeFile(urlStats, JSON.stringify(stats) );
            } catch (e) {
                res.send(JSON.stringify({ result: 0, text: e }))
            }
        }
    } catch(e) {
        res.sendStatus(404, JSON.stringify({ result: 0, text: e }));
    }
});

//creating a server
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}/`);
    /*  console.log(__dirname);
     console.log('path to public folder: ' + path.join(__dirname, '../', '/public')); */
});





