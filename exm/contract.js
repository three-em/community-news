export function handle(state, action) {
  const actions = {
    ADD_USER: 'addUser',
    UPDATE_BIO: 'updateBio',
    UPVOTE: 'upVote',
    DOWNVOTE: 'downVote',
    CREATE_POST: 'createPost',
    ADD_FAVORITE: 'addFavorite',
    CREATE_COMMENT: 'createComment',
    CREATE_REPLY: 'createReply',
    DELETE_COMMENT: 'deleteComment',
    EDIT_COMMENT: 'editComment',
    HIDE_POST: 'hidePost',
    ADD_FAVORITE: 'addFavorite'
  }

  const { functionRole } = action.input;

  const getUser = (username) => {
    const user = state.users.find((user) => user.userName === username);
    const userIndex = state.users.findIndex((user) => user.userName === username);

    return { user, userIndex }
  }

  if (functionRole === actions.ADD_USER) {
    const { walletAddress, userName, upvotedPosts, hidden, favorites, bio, creationDate } = action.input;
    state.users.push({ walletAddress, userName, upvotedPosts, hidden, favorites, bio, creationDate });
  };

  if (functionRole === actions.UPDATE_BIO) {
    const { userName, bio } = action.input;
    const { userIndex } = getUser(userName);
    if (state.users.length > 0) {
      state.users[userIndex].bio = bio;
    }
  };

  if (functionRole === actions.ADD_FAVORITE) {
    const { userName, postID } = action.input;
    const { userIndex } = getUser(userName);
    if (state.users.length > 0) {
      state.users[userIndex].favorites.push(postID);
    }
  };

  if (functionRole === actions.HIDE_POST) {
    const { userName, postID } = action.input;
    const { userIndex } = getUser(userName);
    if (state.users.length > 0) {
      state.users[userIndex].hidden.push(postID);
    }
  };

  if (functionRole === actions.CREATE_POST) {
    const { postID, author, title, url, description, upvotes, timeCreated, comments } = action.input;
    state.posts.unshift({ postID, author, title, url, description, upvotes, timeCreated, comments });
  }

  if (functionRole === actions.UPVOTE) {
    const { postID, userName } = action.input;
    const postIndex = state.posts.findIndex((post) => post.postID === postID)
    const userIndex = state.users.findIndex((user) => user.userName === userName)
    state.posts[postIndex].upvotes += 1;
    state.users[userIndex].upvotedPosts.push(postID)
  }

  if (functionRole === actions.DOWNVOTE) {
    const { postID, userName } = action.input;
    const postIndex = state.posts.findIndex((post) => post.postID === postID)
    const userIndex = state.users.findIndex((user) => user.userName === userName)
    const upvotedIndex = state.users[userIndex].upvotedPosts.findIndex((post) => post === postID);
    state.posts[postIndex].upvotes -= 1;
    state.users[userIndex].upvotedPosts.splice(upvotedIndex, 1);
  }

  if (functionRole === actions.CREATE_COMMENT) {
    const { comment, postID } = action.input;
    const postIndex = state.posts.findIndex((post) => post.postID === postID);
    state.posts[postIndex].comments.push(comment);
  }

  if (functionRole === actions.CREATE_REPLY) {
    const { postID, commentID, reply } = action.input;
    const post = state.posts.find((post) => post.postID === postID);
    const comment = post.comments.find((comment) => comment.id === commentID);
    comment.replies.push(reply)
  }

  if (functionRole === actions.EDIT_COMMENT) {
    const { postID, commentID, editedComment } = action.input;
    const post = state.posts.find((post) => post.postID === postID);

    const { comments } = post;

    const editComment = (commentsArr, editedComment) => {
      for (let comment of commentsArr) {
        if (comment.id === commentID) {
          comment.text = editedComment;
        }
        editComment(comment.replies, editedComment);
      }
    }
    if (comments.length > 0) {
      editComment(comments, editedComment);
    };
  }

  if (functionRole === actions.DELETE_COMMENT) {
    const { postID, commentID } = action.input;
    const post = state.posts.find((post) => post.postID === postID);
    const { comments } = post;

    const deleteComment = (comments, commentID) => {
      let index = 0;
      for (let comment of comments) {
        index += 1;
        if (comment.id === commentID) {
          comments.splice(index - 1, 1)
        }
        deleteComment(comment.replies, commentID)
      }
    }

    deleteComment(comments, commentID)
  }

  return { state };
}