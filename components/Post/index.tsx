import React from 'react';
import * as Styled from './styles';

interface PostProps {
  num: number;
  title: string;
  shortUrl: string;
  userPosted: string;
  timeCreated: Date;
  numberOfComments: number;
}

const Post = ({
  num, // done
  title, // done
  shortUrl, // todo
  userPosted, // todo
  timeCreated, // do now
  numberOfComments, // todo
}: PostProps) => {
  const getPostDate = (postDate: Date) => {
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - postDate.getTime(); // in milliseconds

    let postTime = '';

    // 1 minute = 60,000 milliseconds
    // 1 hour = 3,600,000 milliseconds
    // 1 day = 86,400,000 milliseconds

    if (timeDiff >= 60000 && timeDiff < 3600000) {
      postTime = `${Math.round(timeDiff / (1000 * 60))} minutes`;
    } else if (timeDiff >= 3600000 && timeDiff < 86400000) {
      postTime = `${Math.round(timeDiff / (1000 * 3600))} hours`;
    } else if (timeDiff >= 86400000) {
      postTime = `${Math.round(timeDiff / (1000 * 3600 * 24))} days`;
    } else {
      postTime = '1 miunte';
    }

    return postTime;
  };
  const timeSincePost = getPostDate(timeCreated);

  return (
    <Styled.PostWrapper>
      <Styled.PostInfo>
        <p>{num}</p>
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
