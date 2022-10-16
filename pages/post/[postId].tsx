import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { PostProps } from '../../types';
import { ThumbsupIcon } from '@primer/octicons-react';
import { getShortUrl, getPostDate } from '../../utils/helpers';
import * as Styled from '../../styles/postView';
import { fetchData } from '../../utils/getData';

export async function getServerSideProps() {
  const { posts } = await fetchData();

  return {
    props: {
      posts,
    },
  };
}

const ViewPost = ({ posts }: { posts: PostProps[] }) => {
  const router = useRouter(),
    { postId } = router.query,
    [post, setPost] = useState<PostProps>();

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
                |
                {post.comments.length
                  ? ` ${post.comments.length} comments`
                  : ' No Comments'}
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
