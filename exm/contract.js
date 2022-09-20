export function handle(state, action) {
  const { functionRole, title, url, description, upvotes } = action.input;

  if (functionRole === 'createPost') {
    state.posts.unshift({ title, url, description, upvotes });
  };

  return { state };
}