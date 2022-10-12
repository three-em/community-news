import Link from 'next/link';
import { UserProps } from '../../types';
import { useEffect, useState } from 'react';
import { fetchData } from '../../utils/getData';
import { useGettUser } from '../../hooks/useGettUser';
import { ThumbsupIcon, NorthStarIcon } from '@primer/octicons-react';
import * as Styled from './styles';
import * as utils from '../../utils/utils';

interface PostComponentProps {
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

export async function getServerSideProps() {
  const { users } = await fetchData();

  return {
    props: {
      users,
    },
  };
}

const Post = ({
  users,
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
    { userName } = useGettUser().currentUser;

  useEffect(() => {
    if (users) {
      const userUpvotes = users
        .map((user) => {
          if (user.userName === userName) {
            return user.upvotedPosts;
          }
        })
        .flat();
      const doesUpvoteExist = userUpvotes.some((upvote) => upvote === postId);
      setShowThumbsup(doesUpvoteExist);
    }
  }, [postId, users, userName]);

  const handlevote = async (action: 'upVote' | 'downVote') => {
    await fetch('/api/write-exm', {
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
