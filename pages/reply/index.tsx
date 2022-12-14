import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import Router, { useRouter } from 'next/router';
import { getPostDate } from '../../utils/helpers';
import { useGettUser } from '../../hooks/useGetUser';
import { Wrapper } from '../../styles/common';
import styled from 'styled-components';

const CustomWrapper = styled(Wrapper)`
  padding: 1rem;
`;

const Reply = () => {
  const router = useRouter();
  const { currentUser } = useGettUser();
  const { query } = router;
  const [reply, setReply] = useState('');
  const [replying, setReplying] = useState(false);

  const {
    commentID,
    username,
    commentText,
    timePosted,
    postTitle,
    postID,
    parentAuthor,
  } = query;

  const handleReply = async () => {
    const data = {
      functionRole: 'createReply',
      postID,
      commentID,
      reply: {
        parentCommentAuthor: parentAuthor,
        id: uuid(),
        text: reply,
        author: username,
        timePosted: new Date().getTime(),
      },
    };
    try {
      setReplying(true);
      await fetch('/api/write-exm', {
        method: 'POST',
        body: JSON.stringify({ data }),
      })
        .then(async (res) => {
          const response = await res.json();
          const { data } = response.data;
          const { posts } = data.execution.state;
          setReply('');
          setReplying(false);
          Router.push(
            {
              pathname: `/post/${postID}`,
              query: {
                replyAllPosts: JSON.stringify([...posts]),
              },
            },
            `/post/${postID}`
          );
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CustomWrapper>
      <p style={{ fontStyle: 'italic' }}>
        {parentAuthor} {getPostDate(Number(timePosted))} ago | on: {postTitle}{' '}
      </p>
      <p>{commentText}</p>

      <textarea
        name='reply'
        id='reply'
        cols={30}
        rows={10}
        value={reply}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          setReply(e.target.value);
        }}
      ></textarea>

      <button
        onClick={handleReply}
        disabled={!reply}
        style={{ display: 'block', marginTop: '1rem' }}
      >
        {replying ? 'replying...' : 'reply'}
      </button>
    </CustomWrapper>
  );
};

export default Reply;
