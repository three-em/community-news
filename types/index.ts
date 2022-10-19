export interface Comment {
  id: string;
  text: string;
  author: string;
  timePosted: number;
  replies: Array<Reply>;
}
export interface Reply {
  parentCommentAuthor: string;
  id: string;
  text: string;
  author: string;
  timePosted: number;
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
  hidden: string[];
  bio: string;
  creationDate: Date;
}
