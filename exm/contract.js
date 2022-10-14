export function handle(state, action) {
  const actions = {
    ADD_USER: 'addUser',
    UPDATE_BIO: 'updateBio',
    UPVOTE: 'upVote',
    DOWNVOTE: 'downVote',
    CREATE_POST: 'createPost',
    ADD_FAVORITE: 'addFavorite',
    CREATE_COMMENT: 'createComment',
    CREATE_REPLY: 'createReply'
  }

  const { inputs, functionRole } = action.input;

  let inputData;

  if (inputs) {
    const { data: stringifiedData } = inputs[0];
    inputData = JSON.parse(stringifiedData);
  }

  const getUser = (username) => {
    const user = state.users.find((user) => user.userName === username);
    const userIndex = state.users.findIndex((user) => user.userName === username);

    return { user, userIndex }
  }

  if (functionRole === actions.ADD_USER) {
    const { walletAddress, userName, upvotedPosts, favorites, bio } = inputData;
    state.users.push({ walletAddress, userName, upvotedPosts, favorites, bio });
  };

  if (functionRole === actions.UPDATE_BIO) {
    const { userName, bio } = inputData;
    const { userIndex } = getUser(userName);
    if (state.users.length > 0) {
      state.users[userIndex].bio = bio;
    }
  };

  if (functionRole === actions.ADD_FAVORITE) {
    const { userName, postID } = inputData;
    const { userIndex } = getUser(userName);
    if (state.users.length > 0) {
      state.users[userIndex].favorites.push(postID);
    }
  };

  if (functionRole === actions.CREATE_POST) {
    const { postID, author, title, url, description, upvotes, timeCreated, comments } = inputData;
    state.posts.unshift({ postID, author, title, url, description, upvotes, timeCreated, comments });
  }

  if (functionRole === actions.UPVOTE) {
    const { postID, userName } = inputData;
    const postIndex = state.posts.findIndex((post) => post.postID === postID)
    const userIndex = state.users.findIndex((user) => user.userName === userName)
    state.posts[postIndex].upvotes += 1;
    state.users[userIndex].upvotedPosts.push(postID)
  }

  if (functionRole === actions.DOWNVOTE) {
    const { postID, userName } = inputData;
    const postIndex = state.posts.findIndex((post) => post.postID === postID)
    const userIndex = state.users.findIndex((user) => user.userName === userName)
    const upvotedIndex = state.users[userIndex].upvotedPosts.findIndex((post) => post === postID);
    state.posts[postIndex].upvotes -= 1;
    state.users[userIndex].upvotedPosts.splice(upvotedIndex, 1);
  }

  if (functionRole === actions.CREATE_COMMENT) {
    const { comment, postID } = inputData;
    const postIndex = state.posts.findIndex((post) => post.postID === postID);
    state.posts[postIndex].comments.push(comment);
  }

  return { state };
}