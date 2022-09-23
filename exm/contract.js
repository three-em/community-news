export function handle(state, action) {
  const { functionRole, postID, title, url, description, timeCreated, upvotes, walletAddress, author, userName } = action.input;

  if (functionRole === 'addUser') {
    state.users.push({ walletAddress, userName });
  };

  if (functionRole === 'createPost') {
    state.posts.unshift({ postID, author, title, url, description, upvotes, timeCreated });
  };
  return { state };
}