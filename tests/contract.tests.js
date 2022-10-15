import assert from 'assert';
import { readFileSync } from 'fs';
import { TestFunction, createWrite, FunctionType } from '@execution-machine/sdk';

const testPostId = 'e74e9d33-8f9a-44e3-b68f-21ef7031d887';
const testCommentId = 'e71e6d89-3f94a-4e3-b686-213703187';
const initialState = {
  posts: [],
  users: [],
}

const testData = {
  addUser: {
    input: {
      inputs: [{
        data: JSON.stringify({
          functionRole: 'addUser',
          walletAddress: 'Am_iBfzjo5g7VMdlYvLINmk6XRJlA0mg725BZM0hXGk',
          userName: 'codingknite',
          upvotedPosts: [],
          favorites: [],
          bio: '',
        }),
        tags: [],
      }],
    }
  },
  updateBio: {
    input: {
      functionRole: 'updateBio',
      inputs: [{
        data: JSON.stringify({
          userName: 'codingknite',
          bio: 'testing this out',
        }),
        tags: []
      }]
    },
  },
  favorites: {
    input: {
      functionRole: 'addFavorite',
      inputs: [{
        data: JSON.stringify({
          userName: 'codingknite',
          postID: testPostId
        }),
        tags: []
      }],
    },
  },
  createPost: {
    input: {
      functionRole: 'createPost',
      inputs: [{
        data: JSON.stringify({
          postID: testPostId,
          author: {
            userName: 'codingknite',
          },
          timeCreated: new Date().getTime(), // change plain Date
          title: 'Testing Locally',
          url: new URL('https://testinglocally.com'),
          description: 'Description Testing Locally',
          upvotes: 0,
          comments: [], // todo - implement this in the frontend
        }),
        tags: [],
      }]
    },
  },
  upvote: {
    input: {
      functionRole: 'upVote',
      inputs: [{
        data: JSON.stringify({
          postID: testPostId,
          userName: 'codingknite',
        }),
        tags: [],
      }]
    },
  },
  downvote: {
    input: {
      functionRole: 'downVote',
      inputs: [{
        data: JSON.stringify({
          postID: testPostId,
          userName: 'codingknite',
        }),
        tags: [],
      }],
    },
  },
  createComment: {
    input: {
      functionRole: 'createComment',
      inputs: [{
        data: JSON.stringify({
          postID: testPostId,
          comment: {
            id: testCommentId,
            text: 'this is a comment',
            author: 'codingknite',
            timePosted: new Date(),
          }
        }),
        tags: [],
      }]
    }
  }
}

const createUser = await TestFunction({
  functionSource: readFileSync('exm/contract.js'),
  functionType: FunctionType.JAVASCRIPT,
  functionInitState: initialState,
  writes: [createWrite(testData.addUser.input)]
})

const updateBio = await TestFunction({
  functionSource: readFileSync('exm/contract.js'),
  functionType: FunctionType.JAVASCRIPT,
  functionInitState: initialState,
  writes: [createWrite(testData.addUser.input), createWrite(testData.updateBio.input)]
})

const addFavorite = await TestFunction({
  functionSource: readFileSync('exm/contract.js'),
  functionType: FunctionType.JAVASCRIPT,
  functionInitState: initialState,
  writes: [createWrite(testData.addUser.input), createWrite(testData.favorites.input)]

})

const createPost = await TestFunction({
  functionSource: readFileSync('exm/contract.js'),
  functionType: FunctionType.JAVASCRIPT,
  functionInitState: initialState,
  writes: [createWrite(testData.createPost.input)]
})

const upVotePost = await TestFunction({
  functionSource: readFileSync('exm/contract.js'),
  functionType: FunctionType.JAVASCRIPT,
  functionInitState: initialState,
  writes: [createWrite(testData.addUser.input), createWrite(testData.createPost.input), createWrite(testData.upvote.input)]
})

const downVotePost = await TestFunction({
  functionSource: readFileSync('exm/contract.js'),
  functionType: FunctionType.JAVASCRIPT,
  functionInitState: initialState,
  writes: [createWrite(testData.addUser.input), createWrite(testData.createPost.input), createWrite(testData.upvote.input), createWrite(testData.downvote.input)]
})

const createComment = await TestFunction({
  functionSource: readFileSync('exm/contract.js'),
  functionType: FunctionType.JAVASCRIPT,
  functionInitState: initialState,
  writes: [createWrite(testData.createPost.input), createWrite(testData.createComment.input)]
})


assert(createUser.state.users, [testData.addUser.input]);
assert(updateBio.state.users, [testData.addUser.input, testData.updateBio.input]);
assert(addFavorite.state.users, [testData.addUser.input, testData.favorites.input]);
assert(createPost.state.posts, [testData.createPost.input]);
assert(upVotePost.state.users, [testData.addUser.input, testData.createPost.input, testData.upvote.input]);
assert(downVotePost.state.users, [testData.addUser.input, testData.createPost.input, testData.upvote.input, testData.downvote.input]);
assert(createComment.state.posts, [testData.createPost.input, testData.createComment.input,])