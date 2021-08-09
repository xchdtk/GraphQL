const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const port = 8080;
const app = express();

const schema = buildSchema(`
    type Query {
        pizzabuns : [PizzaBun]
        hello : String
    }

    type PizzaBun {
        pb_idx: ID,
        pb_name: String,
        size: Int,
        bread: String,
        sauce: String,
        topping: String
    }
`)

const resolver = {
    pizzabuns: () => {
        return [{
                "pb_idx"  : "1",
                "pb_name" : "sausage",
                "size"    : 6,
                "bread" : "wheat",
                "sauce" : "tomato",
                "topping" : "sausage"
            }
        ]
    },
    hello: () => {
        return "hello love"
    }
}



app.use("/graphql", graphqlHTTP({
    schema: schema,
    rootValue: resolver,
    graphiql: true
}))

app.listen(port);
console.log('running server port 8080')
