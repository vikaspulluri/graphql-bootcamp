import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

// Scalar types - String, Boolean, Int, Float, ID
const users = [
  {
    id: 1,
    name: 'Vikas',
    age: 24,
    email: 'abc@a.com'
  },
  {
    id: 2,
    name: 'Vicky',
    age: 25,
    email: 'def@a.com'
  },
  {
    id: 3,
    name: 'Max',
    age: 29,
    email: 'ghi@a.com'
  }
];
const posts = [
  {
    id: 1,
    title: 'post-1',
    body: '',
    published: false,
    author: 1
  },
  {
    id: 2,
    title: 'post-2',
    body: '',
    published: false,
    author: 2
  },
  {
    id: 3,
    title: 'post-3',
    body: '',
    published: false,
    author: 2
  },
  {
    id: 4,
    title: 'post-4',
    body: '',
    published: false,
    author: 3
  }
];
const comments = [
  {
    id: 1,
    text: 'comment-1',
    author: 1,
    post: 1
  },
  {
    id: 2,
    text: 'comment-2',
    author: 2,
    post: 1
  },
  {
    id: 3,
    text: 'comment-3',
    author: 2,
    post: 2
  },
  {
    id: 4,
    text: 'comment-4',
    author: 2,
    post: 3
  }
];
// Type definitions (schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    me: User!
    post: Post!
    posts(query: String): [Post!]!
    comments: [Comment!]!
  }

  type Mutation {
    createUser(name: String!, email: String!, age: Int): User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
`;
// Resolvers
const resolvers = {
  Query: {
    me() {
      return users[0];
    },
    post() {
      return {
        id: 1,
        title: 'First post',
        body: 'Some random text',
        published: false
      }
    },
    users(parent, args, ctx, info) {
      console.log(args);
      if (!args.query) return users;
      let u = users.filter(user => {
        return user.id.toString() === args.query;
      })
      return u;
    },
    posts(parent, args, ctx, info) {
      if (!args.query) return posts;
      return posts.filter(post => post.id.toString() === args.query);
    },
    comments(parent, args, ctx, info) {
      return comments;
    }
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some(user => user.email === args.email);

      if (emailTaken) {
        throw new Error('Email already exists!');
      }

      const user = {
        id: uuidv4(),
        name: args.name,
        email: args.email,
        age: args.age
      }

      users.push(user);

      return user;
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => user.id === parent.author);
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => comment.post === parent.id)
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => post.author === parent.id);
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => comment.author === parent.id);
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find(user => user.id === parent.author);
    }
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers
})

server.start(() => {
  console.log('The server is up');
})
