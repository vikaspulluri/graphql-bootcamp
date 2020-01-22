import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

// Scalar types - String, Boolean, Int, Float, ID
let users = [
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
let posts = [
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
let comments = [
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
    createUser(data: CreateUserInput!): User!
    deleteUser(id: ID!): User!
    createPost(data: CreatePostInput!): Post!
    createComment(data: CreateCommentInput!): Comment!
  }

  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }

  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }

  input CreateCommentInput {
    text: String!
    post: ID!
    author: ID!
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
      const emailTaken = users.some(user => user.email === args.data.email);

      if (emailTaken) {
        throw new Error('Email already exists!');
      }

      const user = {
        id: uuidv4(),
        ...args.data
      }

      users.push(user);

      return user;
    },
    deleteUser(parent, args, ctx, info) {
      const index = users.findIndex(user => user.id.toString() === args.id);
      if (index < 0) {
        throw new Error('User not found');
      }
      const deletedUsers = users.splice(index, 1);
      posts = posts.filter(post => {
        let match = post.author === args.id;
        if (match) {
          comments.filter(comment => comment.post !== post.id);
        }
        return !match;
      )};
      comments = comments.filter(comment => comment.author !== args.id);
      return deletedUser[0];
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some(user => user.id === args.data.author);
      if (!userExists) throw new Error('Author not found!');

      const post = {
        id: uuidv4(),
        ...args.data
      }
      posts.push(post);
      return post;
    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some(user => user.id.toString() === args.data.author);
      if (!userExists) throw new Error('Author not found!');

      const post = posts.some(post => post.id.toString() === args.post);
      if (!post) throw new Error('Post not found!');

      const comment = {
        id: uuidv4(),
        ...args.data
      }
      comments.push(comment);
      return comment;
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
      return users.find(user => user.id.toString() === parent.author);
    },
    post(parent, args, ctx, info) {
      return posts.find(post => post.id.toString() === parent.post);
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
