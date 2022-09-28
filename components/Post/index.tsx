import React from 'react';
import Link from 'next/link';
import * as utils from '../../utils/utils';
import * as Styled from './styles';
import { ThumbsupIcon } from '@primer/octicons-react';

interface PostComponentProps {
  num: number;
  title: string;
  url: string;
  postId: string;
  userPosted: string;
  timeCreated: number;
  numberOfComments: number;
}

const Post = ({
  num,
  title,
  url,
  postId,
  userPosted,
  timeCreated,
  numberOfComments, // todo
}: PostComponentProps) => {
  const shortUrl = utils.getShortUrl(url);
  const timeSincePost = utils.getPostDate(timeCreated);

  return (
    <Styled.PostWrapper>
      <Styled.PostInfo>
        <p>{num}.</p>
        <ThumbsupIcon size={12} />
      </Styled.PostInfo>

      <Styled.PostStats>
        <p className='title'>
          {title} ({shortUrl})
        </p>
        <p>
          posted by {userPosted} {timeSincePost} ago | 
        </p>
        <p>unvote |</p>
        <p>hide |</p>
        <Link href={`/post/${postId}`}>
          {numberOfComments > 0 ? `${numberOfComments} comments` : 'discuss'}
        </Link>
      </Styled.PostStats>
    </Styled.PostWrapper>
  );
};

export default Post;
