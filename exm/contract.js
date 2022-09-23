export function handle(state, action) {
  const actions = {
    ADD_USER: 'addUser',
    CREATE_POST: 'createPost'
  }

  const { functionRole, postID, title, url, description, timeCreated, upvotes, walletAddress, author, userName } = action.input;

  if (functionRole === actions.ADD_USER) {
    state.users.push({ walletAddress, userName });
  };

  if (functionRole === actions.CREATE_POST) {
    state.posts.unshift({ postID, author, title, url, description, upvotes, timeCreated });
  };

  return { state };
}