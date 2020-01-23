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

const db = {
  users,
  posts,
  comments
}

export { db as default }
