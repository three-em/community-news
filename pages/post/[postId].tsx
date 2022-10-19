import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useRouter } from 'next/router';
import { PostProps } from '../../types';
import { ThumbsupIcon } from '@primer/octicons-react';
import { getShortUrl, getPostDate } from '../../utils/helpers';
import { fetchData } from '../../utils/getData';
import { useGettUser } from '../../hooks/useGetUser';
import { Reply } from '../../types/index';
import Comment from '../../components/Comment';
import * as Styled from '../../styles/postView';

interface DataProps {
  functionRole: string;
  postID: string;
  comment: {
    id: string;
    text: string;
    author: string;
    timePosted: number;
    replies: Reply[];
  };
}
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
    { currentUser } = useGettUser(),
    [allPosts, setAllPosts] = useState(posts),
    [refresh, setRefresh] = useState(false),
    [post, setPost] = useState<PostProps>(),
    [posting, setPosting] = useState(false),
    [commentText, setCommentText] = useState(''),
    [addingFav, setAddingFav] = useState(false),
    { userName } = useGettUser().currentUser;

  useEffect(() => {
    (async () => {
      const response = await fetch('/api/read', {
        method: 'GET',
      });
      const all = await response.json();
      const { posts } = all.data;
      setAllPosts(posts);
      setRefresh(false);
    })();
  }, [refresh]);

  useEffect(() => {
    (async () => {
      try {
        setPost(() =>
          allPosts.find((post: PostProps) => post.postID === postId)
        );
      } catch (error) {
        console.error(error);
      }
    })();
  }, [allPosts, postId]);

  const handleComment = async () => {
    const data: DataProps = {
      functionRole: 'createComment',
      postID: postId as string,
      comment: {
        id: uuid(),
        text: commentText,
        author: currentUser.userName,
        timePosted: new Date().getTime(),
        replies: [],
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
      setRefresh(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFavorite = async () => {
    setAddingFav(true);
    await fetch('/api/write-exm', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          functionRole: 'addFavorite',
          userName,
          postID: postId,
        },
      }),
    });
    Router.push(`/user/${userName}/favorites`);
    setAddingFav(false);
  };

  return (
    <>
      {post ? (
        <Styled.Wrapper>
          <Styled.PostInfo>
            <ThumbsupIcon size={12} />
            <div>
              <Styled.PostTitle>
                {post.title}{' '}
                {post.url ? <p>({getShortUrl(post.url)})</p> : null}
              </Styled.PostTitle>
              <Styled.PostAuthor>
                posted by {post.author.userName} {getPostDate(post.timeCreated)}{' '}
                ago |
                {post.comments.length
                  ? ` ${post.comments.length} comments`
                  : ' No Comments'}{' '}
                |{' '}
                <button onClick={handleFavorite}>
                  {addingFav ? 'adding..' : 'add favorite'}
                </button>
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
            <>
              <div>
                <Comment
                  id={comment.id}
                  parentAuthor={post.author.userName}
                  author={comment.author} // this is the problem
                  timePosted={comment.timePosted}
                  text={comment.text}
                  postTitle={post.title}
                  postID={post.postID}
                />
              </div>
              {comment.replies.map((reply) => {
                return (
                  <div
                    style={{
                      marginLeft: '3rem',
                      background: 'aliceblue',
                      padding: '0.8rem',
                      marginBottom: '1rem',
                    }}
                  >
                    <Comment
                      type='reply'
                      id={comment.id}
                      parentAuthor={post.author.userName}
                      author={reply.author}
                      timePosted={reply.timePosted}
                      text={reply.text}
                      postTitle={post.title}
                      postID={post.postID}
                    />
                  </div>
                );
              })}
            </>
          ))}
        </>
      ) : null}
    </>
  );
};

export default ViewPost;
