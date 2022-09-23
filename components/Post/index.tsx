import React from 'react';
import * as utils from './utils';
import * as Styled from './styles';

interface PostProps {
  num: number;
  title: string;
  url: string;
  userPosted: string;
  timeCreated: number;
  numberOfComments: number;
}

const Post = ({
  num,
  title,
  url,
  userPosted,
  timeCreated,
  numberOfComments, // todo
}: PostProps) => {
  const shortUrl = utils.getShortUrl(url);
  const timeSincePost = utils.getPostDate(timeCreated);

  return (
    <Styled.PostWrapper>
      <Styled.PostInfo>
        <p>{num}.</p>
        <p>upvote</p>
        <p>
          {title} ({shortUrl})
        </p>
      </Styled.PostInfo>

      <Styled.PostStats>
        <p>
          posted by {userPosted} {timeSincePost} ago
        </p>
        <p>unvote</p>
        <p>hide</p>
        <p>
          {numberOfComments > 0 ? `${numberOfComments} comments` : 'discuss'}
        </p>
      </Styled.PostStats>
    </Styled.PostWrapper>
  );
};

export default Post;
