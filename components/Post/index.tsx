import Link from 'next/link';
import Router from 'next/router';
import { UserProps } from '../../types';
import { useEffect, useState } from 'react';
import { useGettUser } from '../../hooks/useGetUser';
import { useGetAllData } from '../../hooks/useGetAllData';
import { Button as StyledButton } from '../../styles/common';
import { ThumbsupIcon, NorthStarIcon } from '@primer/octicons-react';
import * as Styled from './styles';
import * as utils from '../../utils/helpers';

interface PostComponentProps {
  reff?: string;
  users?: UserProps[];
  num: number;
  title: string;
  url: string;
  postId: string;
  userPosted: string;
  upvotes: number;
  timeCreated: number;
  numberOfComments: number;
}

const Post = ({
  reff,
  num,
  title,
  url,
  postId,
  userPosted,
  upvotes,
  timeCreated,
  numberOfComments,
}: PostComponentProps) => {
  const [showThumbsup, setShowThumbsup] = useState(undefined),
    [hiding, setHiding] = useState(false),
    shortUrl = url === '' ? '' : utils.getShortUrl(url),
    timeSincePost = utils.getPostDate(timeCreated),
    { users } = useGetAllData(),
    { userName, walletAddress } = useGettUser().currentUser;

  let [numberOfUpvotes, setNumberOfUpvotes] = useState(upvotes);

  const isNotConnected = !walletAddress && !userName;

  useEffect(() => {
    (async () => {
      const response = await fetch('/api/read', {
        method: 'GET',
        headers: {
          Accepts: 'application/json',
        },
      });
      const data = await response.json();
      const { users } = data.data;

      if (users.length > 0) {
        const userUpvotes = users
          .map((user) => {
            if (user.userName === userName && user.upvotedPosts.length > 0) {
              return user.upvotedPosts;
            }
            return [];
          })
          .flat();

        setShowThumbsup(() => userUpvotes.includes(postId));
      }
    })();
  }, [postId, userName]);

  const handleConnect = async () => {
    await window.arweaveWallet.connect(
      ['ACCESS_ADDRESS', 'ACCESS_ALL_ADDRESSES', 'SIGN_TRANSACTION'],
      {
        name: 'CommunityLabs News',
      }
    );
    const address = await window.arweaveWallet.getActiveAddress();
    const findUser = users.find((user) => user.walletAddress === address);

    if (findUser) {
      const { userName, walletAddress } = findUser;
      localStorage.setItem('user', JSON.stringify({ userName, walletAddress }));
      location.reload();
    } else {
      Router.push('/connect');
    }
  };

  const handlevote = async (action: 'upVote' | 'downVote') => {
    if (isNotConnected) {
      handleConnect();
    } else {
      setShowThumbsup(() => (action === 'upVote' ? true : false));
      setNumberOfUpvotes(() =>
        action === 'upVote' ? (numberOfUpvotes += 1) : (numberOfUpvotes -= 1)
      );
      await fetch('/api/write-exm', {
        method: 'POST',
        body: JSON.stringify({
          data: {
            functionRole: action,
            postID: postId,
            userName,
          },
        }),
      });
    }
  };

  const handleHide = async () => {
    if (isNotConnected) {
      handleConnect();
    } else {
      setHiding(true);
      await fetch('/api/write-exm', {
        method: 'POST',
        body: JSON.stringify({
          data: {
            functionRole: 'hidePost',
            userName,
            postID: postId,
          },
        }),
      });
      Router.push(`/user/${userName}/hidden`);
      setHiding(false);
    }
  };

  return (
    <Styled.PostWrapper>
      <Styled.PostInfo>
        <p>{num}.&#41;</p>
        {userName === userPosted ? (
          <NorthStarIcon size={10} />
        ) : (
          <>
            {showThumbsup ? null : (
              <div
                onClick={() => {
                  handlevote('upVote');
                }}
              >
                <ThumbsupIcon size={12} />
              </div>
            )}
          </>
        )}
      </Styled.PostInfo>

      <Styled.PostStats>
        <p className='title'>
          {title} {shortUrl ? <span>({shortUrl})</span> : null}
        </p>
        <div className='authorInfo'>
          <p>
            {numberOfUpvotes} upvotes | posted by{' '}
            <a href={`/user/${userPosted}`}>{userPosted}</a> {timeSincePost} ago
            |
          </p>
          {showThumbsup ? (
            <p
              onClick={() => {
                handlevote('downVote');
              }}
            >
              unvote |
            </p>
          ) : null}
          {reff === 'hiddenPage' ? null : (
            <StyledButton onClick={handleHide}>
              {hiding ? 'hidding...' : 'hide'}
            </StyledButton>
          )}{' '}
          |
          <Link href={`/post/${postId}`}>
            {numberOfComments > 0 ? `${numberOfComments} comments` : 'discuss'}
          </Link>
        </div>
      </Styled.PostStats>
    </Styled.PostWrapper>
  );
};

export default Post;
