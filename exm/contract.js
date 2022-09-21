export function handle(state, action) {

  /**
   *****POST FORMAT*****
     const post = {
      postID: '',
      author: '',
      title: '',
      url: '',
      description: '',
      dateAndTime: '',
      comments: [
        {
          author: '',
          text: '',
          replies: [
            {
              author: '',
              text: '',
            }
          ]
        }
      ]

    }
   */


  const { functionRole, postID, author, title, url, description, timeCreated, upvotes, username, comments, replies } = action.input;

  if (functionRole === 'createPost') {
    state.posts.unshift({ postID, author, title, url, description, upvotes, timeCreated });
  };

  if (functionRole === 'addUsername') {
    state.usernames.push({ username })
  };

  // this is strictly for dev. Do not deploy to prod
  if (functionRole === 'clearPosts') {
    state.posts.length = 0;
  }

  return { state };
}