const database = require('./database')
const { ApolloServer, gql } = require('apollo-server')
const typeDefs = gql`
  type Query {
    teams: [Team]
    equipments: [Equipment]
    supplies: [Supply]
    team(id: Int): Team
  }
  type Team {
    id: Int
    manager: String
    office: String
    extension_number: String
    mascot: String
    cleaning_duty: String
    project: String
    supplies: [Supply]
  }
  type Equipment {
    id: String
    used_by: String
    count: Int
    new_or_used: String
  }

  type Supply {
    id: String
    team: Int
  }
`
const resolvers = {
  // Query는 데이터 조회
  Query: {
    teams: () => database.teams
    .map((team) => {
      team.supplies = database.supplies
      .filter((supply) => {
        return supply.team == team.id
      })
      return team
    }),
    // filter는 배열을 반환하기에 [0]을 붙여주어야 한다
    team: (parent, args, context, info) => database.teams
          .filter((team) => {
            return team.id === args.id
          })[0],
    equipments: () => database.equipments,
    supplies: () => database.supplies,
  }
}
const server = new ApolloServer({ typeDefs, resolvers })
server.listen().then(({ url }) => {
console.log(`🚀  Server ready at ${url}`)
})