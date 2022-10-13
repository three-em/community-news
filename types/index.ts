export interface Comment {
  id: string;
  postID: string;
  text: string;
  author: string;
  timePosted: Date;
  comments: Array<Comment>;
}
export interface PostProps {
  postID: string;
  author: {
    userName: string;
  };
  title: string;
  url: string;
  description: string;
  upvotes: number;
  timeCreated: number;
  comments: Array<Comment>;
}

export interface UserProps {
  userName: string;
  walletAddress: string;
  upvotedPosts: string[];
  favorites: string[];
  bio: string;
}
