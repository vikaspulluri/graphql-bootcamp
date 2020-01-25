import uuidv4 from 'uuid/v4';

const Mutation = {
  createUser(parent, args, {db}, info) {
    const emailTaken = db.users.some(user => user.email === args.data.email);

    if (emailTaken) {
      throw new Error('Email already exists!');
    }

    const user = {
      id: uuidv4(),
      ...args.data
    }

    db.users.push(user);

    return user;
  },
  updateUser(parent, { id, data }, {db}, info) {
    const user = db.users.find(user => user.id.toString() === id.toString());
    if (!user) {
      throw new Error('User not found!');
    }

    if (typeof data.email === 'string') {
      const emailTaken = db.users.some(user => user.email === data.email);
      if (emailTaken) {
        throw new Error('Email already taken');
      }
      user.email = data.email;
    }

    if (typeof data.name === 'string') {
      user.name = data.name;
    }

    if (typeof data.age !== undefined) {
      user.age = data.age;
    }
    return user;
  },
  deleteUser(parent, args, {db}, info) {
    const index = db.users.findIndex(user => user.id.toString() === args.id);
    if (index < 0) {
      throw new Error('User not found');
    }
    const deletedUsers = db.users.splice(index, 1);
    db.posts = db.posts.filter(post => {
      let match = post.author === args.id;
      if (match) {
        db.comments.filter(comment => comment.post !== post.id);
      }
      return !match;
    });
    db.comments = comments.filter(comment => comment.author !== args.id);
    return deletedUser[0];
  },
  createPost(parent, args, {db, pubsub}, info) {
    const userExists = db.users.some(user => user.id === args.data.author);
    if (!userExists) throw new Error('Author not found!');

    const post = {
      id: uuidv4(),
      ...args.data
    }
    db.posts.push(post);
    args.data.published ? pubsub.publish('POST', {post: {mutation: 'CREATED', data: post}}) : null;
    return post;
  },
  updatePost(parent, {id, data}, {db, pubsub}, info) {
    const post = db.posts.find(post => post.id === id);
    const originalPost = {...post}; // Object.assign({}, post);
    if (!post) {
      throw new Error('Post not found!');
    }
    if (typeof data.title === 'string') {
      post.title = data.title;
    }
    if (typeof data.published !== undefined) {
      post.published = data.published;

      if (originalPost.published && !post.published) {
        // DELETED
        pubsub.publish('POST', {post: {mutation: 'DELETED', data: originalPost}})
      } else if (!originalPost.published && post.published) {
        // CREATED
        pubsub.publish('POST', {post: {mutation: 'CREATED', data: post}})
      }
    } else if (post.published) {
      // UPDATED
      pubsub.publish('POST', {post: {mutation: 'UPDATED', data: post}})
    }
    if (typeof data.body !== 'string') {
      post.body = data.body;
    }
    return post;
  },
  deletePost(parent, {id}, {db, pubsub}, info) {
    const postIndex = db.posts.findIndex(post => post.id === id);
    if (postIndex < 0) {
      throw new Error('Post not found');
    }
    const [deletedPost] = db.posts.splice(postIndex, 1);
    db.comments = db.comments.filter(comment => comment.post !== id);
    if (deletedPost.published) {
      pubsub.publish('POST', {post: {mutation: 'DELETED', data: deletedPost}});
    }
    return deletedPost;
  },
  createComment(parent, args, {db, pubsub}, info) {
    const userExists = db.users.some(user => user.id.toString() === args.data.author);
    if (!userExists) throw new Error('Author not found!');

    const post = db.posts.some(post => post.id.toString() === args.data.post);
    if (!post) throw new Error('Post not found!');

    const comment = {
      id: uuidv4(),
      ...args.data
    }
    db.comments.push(comment);
    // pubsub.publish(`COMMENT ${args.data.post}`, { comment: comment});
    pubsub.publish('COMMENT', {comment: {mutation: 'CREATED', data: comment}});
    return comment;
  },
  updateComment(parent, {id, data}, {db, pubsub}, info) {
    const comment = db.comments.find(comment => comment.id === id);
    if (!comment) {
      throw new Error('Comment not found');
    }
    if (typeof data.text === 'string') {
      comment.text = data.text;
    }
    return comment;
  },
  deleteComment(parent, {id}, {db, pubsub}, info) {
    const commentIndex = db.comments.findIndex(comment => comment.id === id);
    if (commentIndex < 0) {
      throw new Error('Comment not found');
    }
    const deletedComments = db.comments.splice(commentIndex, 1);
    return deletedComments[0];
  }
}

export { Mutation as default }
