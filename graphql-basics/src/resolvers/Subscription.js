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
  }
}

export { Subscription as default }
