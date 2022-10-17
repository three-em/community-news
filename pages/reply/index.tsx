import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useRouter } from 'next/router';
import Router from 'next/router';
import { getPostDate } from '../../utils/helpers';

const Reply = () => {
  const router = useRouter();
  const { query } = router;
  const [reply, setReply] = useState('');
  const [replying, setReplying] = useState(false);

  const { commentID, username, commentText, timePosted, postTitle, postID } =
    query;

  const handleReply = async () => {
    const data = {
      functionRole: 'createReply',
      postID,
      commentID,
      comment: {
        id: uuid(),
        text: reply,
        author: username,
        timePosted: new Date().getTime(),
        comments: [],
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
      <p>
        {username} {getPostDate(Number(timePosted))} ago | on: {postTitle}{' '}
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
  );
};

export default Reply;
