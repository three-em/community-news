import React from 'react';
import Router from 'next/router';
import { useGettUser } from '../hooks/useGetUser';
import { getPostDate } from '../utils/helpers';
import { useGetAllData } from '../hooks/useGetAllData';
import { UserProps } from '../types';

interface Props {
  type?: 'comment' | 'reply';
  id: string;
  parentAuthor: string;
  author: string;
  timePosted: number;
  text: string;
  postTitle: string;
  postID?: string;
}
const Comment = ({
  type,
  id,
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
    <div key={id} style={{ background: 'whitesmoke', margin: '1rem' }}>
      <div>
        replied by {author} {getPostDate(timePosted)} ago |{' '}
        {type === 'reply' ? (
          <>replying to @{parentAuthor} | &#x2198; thread |</>
        ) : null}
        {currentUser.userName === author ? (
          <>
            <button
              onClick={() => {
                Router.push(
                  {
                    pathname: '/edit',
                    query: {
                      id,
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
            </button>{' '}
            |{' '}
            <button
              onClick={() => {
                Router.push(
                  {
                    pathname: '/edit',
                    query: {
                      id,
                      text,
                      postTitle,
                      postID,
                    },
                  },
                  `/edit/${postID}`
                );
              }}
            >
              delete
            </button>
          </>
        ) : null}
      </div>
      <p>{text}</p>
      <button
        onClick={() => {
          currentUser.userName && currentUser.walletAddress
            ? Router.push(
                {
                  pathname: '/reply',
                  query: {
                    commentID: id,
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
      </button>
    </div>
  );
};

export default Comment;
