interface PostProps {
  title: string;
  url: string;
  description: string;
}

interface StateProps {
  posts: PostProps[];
  author: string | null;
}

interface ActionProps {
  caller: string;
  input: {
    post: PostProps;
    function: string;
  };
}

export default function handle(state: StateProps, action: ActionProps) {
  if (action.input.function === 'initialize') {
    state.author = action.caller;
  }

  if (
    action.input.function === 'createPost' &&
    action.caller === state.author
  ) {
    // get all current posts
    const allPosts = state.posts;
    // add new post to array of current posts
    allPosts.push(action.input.post);
    //update state
    state.posts = allPosts;
  }

  // add action for creating comments
  return { state };
}
