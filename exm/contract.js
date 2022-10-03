export function handle(state, action) {
  const actions = {
    ADD_USER: 'addUser',
    CREATE_POST: 'createPost',
    UPVOTE: 'upVote',
    DOWNVOTE: 'downVote'
  }

  const { functionRole, postID, title, url, description, timeCreated, upvotes, walletAddress, author, userName } = action.input;

  if (functionRole === actions.ADD_USER) {
    state.users.push({ walletAddress, userName, upvotedPosts: [] });
  };

  if (functionRole === actions.CREATE_POST) {
    state.posts.unshift({ postID, author, title, url, description, upvotes, timeCreated });
  };

  if (functionRole === actions.UPVOTE) {
    const postIndex = state.posts.findIndex((post) => post.postID === postID)
    const userIndex = state.users.findIndex((user) => user.userName === userName)
    state.posts[postIndex].upvotes += 1
    state.users[userIndex].upvotedPosts.push(postID)
  }

  if (functionRole === actions.DOWNVOTE) {
    const postIndex = state.posts.findIndex((post) => post.postID === postID),
      userIndex = state.users.findIndex((user) => user.userName === userName),
      upvotedIndex = state.users[userIndex].upvotedPosts.findIndex((post) => post === postID);
    state.posts[postIndex].upvotes -= 1
    state.users[userIndex].upvotedPosts.splice(upvotedIndex, 1);
  }

  return { state };
}