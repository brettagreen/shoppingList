process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("./app");
let { cart } = require("./routes");
const ExpressError = require("./expresserror");

let defaultItem = { name: "Bleach", price: "$9.99" };

beforeEach(function() {
    cart.push(defaultItem);
});

afterEach(function() {
    defaultItem = { name: "Bleach", price: "$9.99" };
    cart.length = 0;
})

describe("GET /items", function() {

    test("Returns a list of all shopping cart items", async function() {
        const resp = await request(app).get(`/items`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual([{name: "Bleach", price: "$9.99"}])
    });
});

describe("POST /items", function() {

    test ("add item to shopping cart", async function() {
        const resp = await request(app).post('/items').send({name: "legos", price: "$99.99"});
        expect(resp.body).toEqual({
            added: { name: "legos", price: "$99.99" }
          });
        expect(cart.length).toEqual(2);
    });
});

describe("GET /items/:name", function() {

    test("Return shopping cart item via :name param", async function() {
        const resp = await request(app).get(`/items/Bleach`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({name: "Bleach", price: "$9.99"});
    });

    test("Response when item does not exist in cart", async function() {
        const resp = await request(app).get(`/items/Glue`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({error: "item not found"});
    });

});

describe("PATCH /items/:name", function() {

    test("Update cart item name and/or price attributes, via :name param", async function() {
        const resp = await request(app).patch('/items/Bleach').send({name: "Bleeech", price: "$999.99"});
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({ updated: {name: "Bleeech", price: "$999.99"}});
    });
});

describe("DELETE /items/:name", function() {

    test("Delete cart item matching :name param", async function() {
        const resp = await request(app).delete('/items/Bleach');
        expect(cart.length).toBe(0);
        expect(resp.body).toEqual({ message: "Deleted" });
    });

    test("throw error if item does not exist in cart", async function() {
        const resp = await request(app).delete('/items/Firepit');
        expect(resp.body).toEqual({"error": {"message": "item not found. cannot delete.", "status": 402}});
    });
});