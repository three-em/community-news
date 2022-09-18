export default function handle(state, action) {
  const { functionRole, title, url } = action.input;

  if (functionRole === 'createPost') {
    state.posts.push({ title, url, });
  };

  return { state };
}
