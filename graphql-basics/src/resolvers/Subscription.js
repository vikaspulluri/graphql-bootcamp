const Subscription = {
  count: {
    subscribe(parent, args, {pubsub}, info) {
      let count = 0;
      setInterval(() => {
        count++;
        pubsub.publish('count_channel', {
          count
        })
      }, 1000)
      return pubsub.asyncIterator('count_channel');
    }
  },
  comment: {
    subscribe(parent, {postId}, {db, pubsub}, info) {
      const post = db.posts.find(post => post.id === postId && post.published);
      if (!post) {
        throw new Error('Post not found!');
      }
      return pubsub.asyncIterator(`COMMENT ${postId}`);
    }
  }
}

export { Subscription as default }
