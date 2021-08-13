const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const port = 8080;
const app = express();

const schema = buildSchema(`
    input ProductInput {
        name: String
        price: Int
        description: String
    }

    type Query {
        getProduct(id:ID!) : Product
    }

    type Mutation {
        addProduct( input : ProductInput) : Product
        updateProduct( id: ID!, input: ProductInput!): Product
        deleteProduct( id: ID!): Product
    }

    type Product {
        id: ID!
        name: String
        price: Int
        description: String
    }    
`)

const products = [
    {
        id: 1,
        name: "맜있어",
        price: 2000,
        description: '맜있어 정말'
    },
    {
        id: 2,
        name: "행복해",
        price: 4000,
        description: '행복해 정말'
    },
]

const root = {
    getProduct : ({id}) => products.find( product => product.id === parseInt(id)),
    addProduct : ({input})  => {
        input.id = parseInt(products.length+1);
        products.push(input);
        return root.getProduct({ id: input.id})
    },

    updateProduct : ({id, input}) => {
        const index = products.findIndex(product => product.id === parseInt(id))
        products[index] = {
            id: parseInt(id),
            ...input
        }
        return products[index]
    },

    deleteProduct : ({id}) => {
        const index = products.findIndex( product => product.id === parseInt(id))
        const product = products.splice(index, 1);
        console.log(product)
        return product[0]
    }
}



app.use("/graphql", graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}))

app.listen(port);
console.log('running server port 8080')
