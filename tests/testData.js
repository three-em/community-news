import { v4 as uuid } from 'uuid';


const testData = {
  addUser: {
    input: {
      functionRole: 'addUser',
      walletAddress: 'Am_iBfzjo5g7VMdlYvLINmk6XRJlA0mg725BZM0hXGk',
      userName: 'codingknite',
      upvotedPosts: [],
      favorites: [],
    }
  },
  createPost: {
    input: {
      functionRole: 'createPost',
      postID: testPostId,
      author: {
        userName: 'codingknite',
      },
      timeCreated: new Date().getTime(), // change plain Date
      title: 'Testing Locally',
      url: new URL('https://testinglocally.com'),
      description: 'Description Testing Locally',
      upvotes: 0,
    },
  },
  upvote: {
    input: {
      functionRole: 'upVote',
      postID: testPostId,
      userName: 'codingknite',
    },
  },
  downvote: {
    input: {
      functionRole: 'downVote',
      postID: testPostId,
      userName: 'codingknite',
    },
  },
  updateBio: {
    input: {
      functionRole: 'updateBio',
      userName: 'codingknite',
      bio: 'testing this out',
    },
  },
  favorites: {
    input: {
      functionRole: 'updateBio',
      userName: 'codingknite',
      postID: testPostId
    },
  }
}

export { testData };