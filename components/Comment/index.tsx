import React from 'react';
import Router from 'next/router';
import { useGettUser } from '../../hooks/useGetUser';
import { getPostDate } from '../../utils/helpers';
import { useGetAllData } from '../../hooks/useGetAllData';
import { UserProps } from '../../types';
import { Button as StyledButton } from '../../styles/common';
import * as Styled from './styles';

interface Props {
  type?: 'comment' | 'reply';
  replyID: string;
  editID: string;
  parentAuthor: string;
  author: string;
  timePosted: number;
  text: string;
  postTitle: string;
  postID?: string;
}
const Comment = ({
  type,
  replyID,
  editID,
  parentAuthor,
  author,
  timePosted,
  text,
  postTitle,
  postID,
}: Props) => {
  const { currentUser } = useGettUser();
  const { users } = useGetAllData();

  const handleConnect = async () => {
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
      location.reload();
    } else {
      Router.push('/connect');
    }
  };

  return (
    <Styled.Wrapper>
      <div style={{ fontSize: '0.9rem', fontStyle: 'italic' }}>
        replied by{' '}
        <a
          href={`/user/${author}`}
          style={{ color: 'green', cursor: 'pointer' }}
        >
          {author}
        </a>{' '}
        {getPostDate(timePosted)} ago |
        {type === 'reply' ? (
          <>
            replying to{' '}
            <a
              href={`/user/${parentAuthor}`}
              style={{ color: 'green', cursor: 'pointer' }}
            >
              @{parentAuthor}
            </a>{' '}
            | &#x2198; thread |
          </>
        ) : null}
        {currentUser.userName === author ? (
          <>
            <StyledButton
              onClick={() => {
                Router.push(
                  {
                    pathname: '/edit',
                    query: {
                      id: editID,
                      text,
                      postTitle,
                      postID,
                    },
                  },
                  `/edit/${postID}`
                );
              }}
            >
              edit
            </StyledButton>
            |
            <StyledButton
              onClick={() => {
                Router.push(
                  {
                    pathname: '/delete',
                    query: {
                      commentID: replyID,
                      postID,
                      postTitle,
                    },
                  },
                  `/delete/${postID}`
                );
              }}
            >
              delete
            </StyledButton>
          </>
        ) : null}
      </div>
      <Styled.CommentText>{text}</Styled.CommentText>
      <StyledButton
        onClick={() => {
          currentUser.userName && currentUser.walletAddress
            ? Router.push(
                {
                  pathname: '/reply',
                  query: {
                    commentID: replyID,
                    username: currentUser.userName,
                    timePosted: timePosted,
                    commentText: text,
                    postTitle,
                    postID,
                    parentAuthor,
                  },
                },
                `/reply/${postID}`
              )
            : handleConnect();
        }}
      >
        {currentUser.userName && currentUser.walletAddress
          ? 'reply'
          : 'connect wallet to reply'}
      </StyledButton>
    </Styled.Wrapper>
  );
};

export default Comment;
