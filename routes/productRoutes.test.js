const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authMiddleware = require('../middlewares/auth');
const Product = mongoose.model('products');

router.use(authMiddleware);

router.get(`/product`, async (req, res) => {
    let products = await Product.find();
    return res.status(200).send(products);
});

router.post(`/product`, async (req, res) => {
    let product = await Product.create(req.body);
    return res.status(201).send({
        error: false,
        product
    })
})

router.put(`/product/:id`, async (req, res) => {
    const { id } = req.params;

    let product = await Product.findOneAndUpdate(id, req.body);

    return res.status(202).send({
        error: false,
        product
    })

});

router.delete(`/product/:id`, async (req, res) => {
    const { id } = req.params;

    let product = await Product.findByIdAndDelete(id);

    return res.status(202).send({
        error: false,
        product
    })

})


module.exports = (app) => app.use('/api', router);