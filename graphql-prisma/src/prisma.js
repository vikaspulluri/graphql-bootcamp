import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: 'http://localhost:4466'
});

// prisma.query.users(null, '{id name email}').then(result => console.log(result))
prisma.mutation.createPost({
  data: {
    title: "Graphql post is live",
    body: "Graphql post body",
    published: true,
    author: {
      connect: {
        id: "ck63iaicv012s0719j1rh203v"
      }
    }
  }
}, '{id title body published}').then(result => {
  console.log(result)
})
