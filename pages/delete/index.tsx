import React, { useState } from 'react';
import styled from 'styled-components';
import { Wrapper } from '../../styles/common';
import Router, { useRouter } from 'next/router';

const CustomWrapper = styled(Wrapper)`
  padding: 1rem;
`;

const Delete = () => {
  const router = useRouter();
  const { query } = router;
  const { commentID, postID } = query;
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    const data = {
      functionRole: 'deleteComment',
      postID,
      commentID,
    };

    try {
      setDeleting(true);
      await fetch('/api/write-exm', {
        method: 'POST',
        body: JSON.stringify({ data }),
      })
        .then(async (res) => {
          const response = await res.json();
          const { data } = response.data;
          const { posts } = data.execution.state;
          setDeleting(false);
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
      <p style={{ fontSize: '1.15rem' }}>post title</p>
      <p style={{ fontSize: '1.15rem' }}>Do you want this to be deleted?</p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button onClick={handleDelete}>
          {deleting ? 'deleting...' : 'yes'}
        </button>
        <button onClick={() => router.back()}>no</button>
      </div>
    </CustomWrapper>
  );
};

export default Delete;
