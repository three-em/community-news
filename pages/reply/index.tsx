import Router from 'next/router';
import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useRouter } from 'next/router';
import { getPostDate } from '../../utils/helpers';
import { useGettUser } from '../../hooks/useGetUser';

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
      });

      setReplying(false);
      setReply('');
      Router.push(`/post/${postID}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <>
        <p>
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

        <button onClick={handleReply} disabled={!reply}>
          {replying ? 'replying...' : 'reply'}
        </button>
      </>
    </>
  );
};

export default Reply;
