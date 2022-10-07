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
}

export interface UserProps {
  userName: string;
  walletAddress: string;
  upvotedPosts: string[];
  favorites: string[];
  bio: string;
}
