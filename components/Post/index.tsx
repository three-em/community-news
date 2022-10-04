import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useGettUser } from '../../hooks/useGettUser';
import { ThumbsupIcon, NorthStarIcon } from '@primer/octicons-react';
import { useGetAllData } from '../../hooks/useGetAllData';
import * as utils from '../../utils/utils';
import * as Styled from './styles';

interface PostComponentProps {
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
  num,
  title,
  url,
  postId,
  userPosted,
  upvotes,
  timeCreated,
  numberOfComments, // todo
}: PostComponentProps) => {
  const [showThumbsup, setShowThumbsup] = useState(false),
    shortUrl = utils.getShortUrl(url),
    timeSincePost = utils.getPostDate(timeCreated),
    { userName } = useGettUser().currentUser,
    { users } = useGetAllData();

  useEffect(() => {
    const userUpvotes = users
      .map((user) => {
        if (user.userName === userName) {
          return user.upvotedPosts;
        }
      })
      .flat();
    const doesUpvoteExist = userUpvotes.some((upvote) => upvote === postId);
    setShowThumbsup(doesUpvoteExist);
  }, [postId, users, userName]);

  const handlevote = async (action: 'upVote' | 'downVote') => {
    await fetch('/api/upvote', {
      method: 'POST',
      body: JSON.stringify({
        input: {
          functionRole: action,
          postID: postId,
          userName,
        },
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
  };

  return (
    <Styled.PostWrapper>
      <Styled.PostInfo>
        <p>{num}.</p>

        {userName === userPosted ? (
          <NorthStarIcon size={10} />
        ) : (
          <>
            {showThumbsup ? null : (
              <div
                onClick={() => {
                  handlevote('upVote');
                  setShowThumbsup(false);
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
          {title} ({shortUrl})
        </p>
        <div className='authorInfo'>
          <p>
            {upvotes} upvotes | posted by{' '}
            <a href={`/user/${userPosted}`}>{userPosted}</a> {timeSincePost} ago
            |
          </p>
          {showThumbsup ? (
            <p
              onClick={() => {
                setShowThumbsup(false);
                handlevote('downVote');
              }}
            >
              unvote |
            </p>
          ) : null}
          <p>hide |</p>
          <Link href={`/post/${postId}`}>
            {numberOfComments > 0 ? `${numberOfComments} comments` : 'discuss'}
          </Link>
        </div>
      </Styled.PostStats>
    </Styled.PostWrapper>
  );
};

export default Post;
