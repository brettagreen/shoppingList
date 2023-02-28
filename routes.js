const cart = require("./fakeDB");

const express = require("express");
const router = new express.Router();

const ExpressError = require("./expresserror");

router.get("/", function(req, res) {
    return res.json(cart);
});

router.post("/", function(req, res) {
    cart.push(req.body);
    return res.json({added: req.body});
});

router.get("/:name", function(req, res) {
    const item = cart.find(function (i) {
        return i.name === req.params.name;
    })
    console.log(item);
    if (item === undefined) {
        console.log("GETTING TO ITEM NOT FOUND")
        return res.json({error: "item not found"});
    } else {
        return res.json(item);
    }
});

router.patch("/:name", function(req, res) {
    const item = cart.find(function (i) {
        return i.name === req.params.name;
    })
    if (req.body.name) {
        item.name = req.body.name;
    } 
    if (req.body.price) {
        item.price = req.body.price;
    }

    return res.json({updated: item});
});

router.delete("/:name", function(req, res) {

    const item = cart.find((value) => {
        return value.name === req.params.name
    });
    
    let idx = cart.indexOf(item);
    if (idx === -1) {
        throw new ExpressError("item not found. cannot delete.", 402);
    } else {
        cart.splice(cart.indexOf(item), 1);
    }

    return res.json({message: "Deleted"});
});

router.post("/clear", function(req, res) {
    cart.length = 0;
    return res.json({updated: "cart has been emptied."});
})

module.exports = { router, cart };