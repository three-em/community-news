import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getShortUrl, getPostDate } from '../../utils/utils';

interface PostProps {
  postID: string;
  author: {
    userName: string;
  };
  title: string;
  url: URL;
  description: string;
  upvotes: number;
  timeCreated: number;
}

const ViewPost = () => {
  const router = useRouter();
  const { postId } = router.query;
  const [post, setPost] = useState<PostProps>();

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await fetch('/api/getAllPosts');
        const allData = await response.json();
        const { posts } = allData.data;
        setPost(
          () => posts.filter((post: PostProps) => post.postID === postId)[0]
        );
      } catch (error) {
        console.error(error);
      }
    };
    getPost();
  }, [postId]);

  return (
    <>
      {post ? (
        <>
          <div>
            <p>upvote</p>
            <p>{post.title}</p>
            <p>({getShortUrl(new URL(post.url))})</p>
          </div>
          <p>
            posted by {post.author.userName} {getPostDate(post.timeCreated)} |
            152 comments
          </p>

          <textarea
            name='comment'
            id='comment'
            cols={30}
            rows={10}
            placeholder='your thoughts'
          ></textarea>

          <button>add comment</button>
        </>
      ) : (
        <p>loading...</p>
      )}
    </>
  );
};

export default ViewPost;

//todo - comments and replies
