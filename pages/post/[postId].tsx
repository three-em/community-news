import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { PostProps } from '../../types';
import { useGetAllData } from '../../hooks/useGetAllData';
import { getShortUrl, getPostDate } from '../../utils/utils';

const ViewPost = () => {
  const router = useRouter(),
    { postId } = router.query,
    [post, setPost] = useState<PostProps>(),
    { posts } = useGetAllData();

  useEffect(() => {
    (async () => {
      try {
        setPost(() => posts.find((post: PostProps) => post.postID === postId));
      } catch (error) {
        console.error(error);
      }
    })();
  }, [posts, postId]);

  return (
    <>
      {post ? (
        <>
          <div>
            <p>upvote</p>
            <p>{post.title}</p>
            <p>({getShortUrl(post.url)})</p>
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
