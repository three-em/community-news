import Router from 'next/router';
import React, { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { useRouter } from 'next/router';
import { PostProps } from '../../types';
import { getShortUrl, getPostDate } from '../../utils/helpers';
import { fetchData } from '../../utils/getData';
import { useGettUser } from '../../hooks/useGetUser';
import { Reply, UserProps } from '../../types/index';
import Comment from '../../components/Comment';
import { Button } from '../../styles/common';
import { useGetAllData } from '../../hooks/useGetAllData';
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
    { postId, replyAllPosts, editAllPosts, deleteAllPost } = router.query,
    routerQueryPosts =
      (replyAllPosts && JSON.parse(replyAllPosts as string)) ||
      (editAllPosts && JSON.parse(editAllPosts as string)),
    { currentUser } = useGettUser(),
    [isNotConnected, setIsNotConnected] = useState(false),
    [refreshedPosts, setRefreshedPosts] = useState(routerQueryPosts || []),
    [posting, setPosting] = useState(false),
    [connecting, setConnecting] = useState(false),
    [commentText, setCommentText] = useState(''),
    [addingFav, setAddingFav] = useState(false),
    { userName } = useGettUser().currentUser,
    { users } = useGetAllData();

  useEffect(() => {
    setIsNotConnected(!currentUser.userName && !currentUser.walletAddress);
  });

  const post =
    refreshedPosts.length > 0
      ? refreshedPosts.find((post: PostProps) => post.postID === postId)
      : posts.find((post: PostProps) => post.postID === postId);

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
      }).then(async (res) => {
        const response = await res.json();
        const { data } = response.data;
        const { posts } = data.execution.state;

        setCommentText('');
        setPosting(false);
        setRefreshedPosts(posts);
      });
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

  const handleConnect = async () => {
    setConnecting(true);
    await window.arweaveWallet.connect(
      ['ACCESS_ADDRESS', 'ACCESS_ALL_ADDRESSES', 'SIGN_TRANSACTION'],
      {
        name: 'CommunityLabs News',
      }
    );

    const address = await window.arweaveWallet.getActiveAddress();
    const user = users.find(
      (user: UserProps) => user.walletAddress === address
    );

    if (user) {
      const { userName, walletAddress } = user;
      localStorage.setItem('user', JSON.stringify({ userName, walletAddress }));
      setConnecting(false);
      location.reload();
    } else {
      setConnecting(false);
      Router.push('/connect');
    }
  };

  return (
    <>
      {post ? (
        <Styled.Wrapper>
          <Styled.PostInfo>
            <div>
              <Styled.PostTitle>
                {post.title}{' '}
                {post.url ? <span>({getShortUrl(post.url)})</span> : null}
              </Styled.PostTitle>
              <Styled.PostAuthor>
                posted by {post.author.userName} {getPostDate(post.timeCreated)}{' '}
                ago |
                {post.comments.length
                  ? ` ${post.comments.length} comments`
                  : ' No Comments'}{' '}
                |
                <Button onClick={handleFavorite}>
                  {addingFav ? 'adding..' : 'add favorite'}
                </Button>
              </Styled.PostAuthor>
            </div>
          </Styled.PostInfo>

          <>
            <Styled.Description>
              {post.description ? post.description : null}
            </Styled.Description>
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

            {isNotConnected ? (
              <Styled.SubmitButton onClick={handleConnect}>
                {connecting ? 'connecting...' : 'connect to add comment'}
              </Styled.SubmitButton>
            ) : (
              <Styled.SubmitButton
                onClick={handleComment}
                disabled={!commentText}
              >
                {posting ? 'posting...' : 'add comment'}
              </Styled.SubmitButton>
            )}
          </>
        </Styled.Wrapper>
      ) : (
        <p>loading...</p>
      )}

      {post && post.comments.length > 0 ? (
        <Styled.Wrapper>
          {post.comments.map((comment) => (
            <div>
              <div>
                <Comment
                  replyID={comment.id}
                  editID={comment.id}
                  parentAuthor={post.author.userName}
                  author={comment.author}
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
                      marginLeft: '3.5rem',
                      marginBottom: '1rem',
                    }}
                  >
                    <Comment
                      type='reply'
                      editID={reply.id}
                      postID={post.postID}
                      replyID={comment.id}
                      parentAuthor={comment.author}
                      author={reply.author}
                      timePosted={reply.timePosted}
                      text={reply.text}
                      postTitle={reply.text}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </Styled.Wrapper>
      ) : null}
    </>
  );
};

export default ViewPost;
