import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useRouter } from 'next/router';
import { PostProps } from '../../types';
import { ThumbsupIcon } from '@primer/octicons-react';
import { getShortUrl, getPostDate } from '../../utils/helpers';
import { fetchData } from '../../utils/getData';
import { useGettUser } from '../../hooks/useGetUser';
import * as Styled from '../../styles/postView';
import { Comment } from '../../types/index';
import Router from 'next/router';

interface DataProps {
  functionRole: string;
  postID: string;
  comment: Comment;
}
export async function getServerSideProps() {
  const { posts } = await fetchData();

  return {
    props: {
      posts,
    },
  };
}

const Post = ({ id, author, timePosted, text, postTitle, postID }) => (
  <div key={id} style={{ background: 'whitesmoke' }}>
    <p>
      {author} {getPostDate(timePosted)} ago | edit | delete
    </p>
    <p>{text}</p>
    <button
      onClick={() => {
        Router.push(
          {
            pathname: '/reply',
            query: {
              commentID: id,
              username: author,
              timePosted: timePosted,
              commentText: text,
              postTitle,
              postID,
            },
          },
          `/reply/${postID}`
        );
      }}
    >
      reply
    </button>
  </div>
);

const ViewPost = ({ posts }: { posts: PostProps[] }) => {
  const router = useRouter(),
    { postId } = router.query,
    { currentUser } = useGettUser(),
    [post, setPost] = useState<PostProps>(),
    [posting, setPosting] = useState(false),
    [commentText, setCommentText] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setPost(() => posts.find((post: PostProps) => post.postID === postId));
      } catch (error) {
        console.error(error);
      }
    })();
  }, [posts, postId]);

  const handleComment = async () => {
    const data: DataProps = {
      functionRole: 'createComment',
      postID: postId as string,
      comment: {
        id: uuid(),
        text: commentText,
        author: currentUser.userName,
        timePosted: new Date().getTime(),
        comments: [],
      },
    };

    try {
      setPosting(true);
      await fetch('/api/write-exm', {
        method: 'POST',
        body: JSON.stringify({ data }),
      });
      setCommentText('');
      setPosting(false);
    } catch (error) {
      console.error(error);
    }
  };

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
                ago |
                {post.comments.length
                  ? ` ${post.comments.length} comments`
                  : ' No Comments'}
              </Styled.PostAuthor>
            </div>
          </Styled.PostInfo>

          <>
            <p>{post.description ? post.description : null}</p>
            <Styled.TextArea
              name='comment'
              id='comment'
              cols={30}
              rows={10}
              value={commentText}
              placeholder={commentText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setCommentText(e.target.value);
              }}
            ></Styled.TextArea>

            <Styled.SubmitButton
              onClick={handleComment}
              disabled={!commentText}
            >
              {posting ? 'posting...' : 'add comment'}
            </Styled.SubmitButton>
          </>
        </Styled.Wrapper>
      ) : (
        <p>loading...</p>
      )}

      {post && post.comments.length > 0 ? (
        <>
          {post.comments.map((comment) => (
            <div>
              <Post
                id={comment.id}
                author={comment.author}
                timePosted={comment.timePosted}
                text={comment.text}
                postTitle={post.title}
                postID={post.postID}
              />

              <div style={{ marginLeft: '2rem' }}>
                {comment.comments.length > 0 ? (
                  <>
                    {comment.comments.map((reply) => (
                      <>
                        <Post
                          id={reply.id}
                          author={reply.author}
                          timePosted={reply.timePosted}
                          text={reply.text}
                          postTitle={post.title}
                          postID={post.postID}
                        />
                      </>
                    ))}
                  </>
                ) : null}
              </div>
            </div>
          ))}
        </>
      ) : null}
    </>
  );
};

export default ViewPost;

// todo - implement edit and delete
// todo - render multidimensional array in react (CONSIDER FLATTENING ARRAY)