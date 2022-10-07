import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { PostProps } from '../../types';
import { ThumbsupIcon } from '@primer/octicons-react';
import { useGetAllData } from '../../hooks/useGetAllData';
import { getShortUrl, getPostDate } from '../../utils/utils';
import * as Styled from '../../styles/postView';

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
        <Styled.Wrapper>
          <Styled.PostInfo>
            <ThumbsupIcon size={12} />
            <div>
              <Styled.PostTitle>
                {post.title} ({getShortUrl(post.url)})
              </Styled.PostTitle>
              <Styled.PostAuthor>
                posted by {post.author.userName} {getPostDate(post.timeCreated)}{' '}
                | 152 comments
              </Styled.PostAuthor>
            </div>
          </Styled.PostInfo>

          <>
            <Styled.TextArea
              name='comment'
              id='comment'
              cols={30}
              rows={10}
              placeholder='your thoughts'
            ></Styled.TextArea>

            <Styled.SubmitButton>add comment</Styled.SubmitButton>
          </>
        </Styled.Wrapper>
      ) : (
        <p>loading...</p>
      )}
    </>
  );
};

export default ViewPost;
