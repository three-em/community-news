import React, { useState } from 'react';
import Router, { useRouter } from 'next/router';
import { Wrapper } from '../../styles/common';
import styled from 'styled-components';

const CustomWrapper = styled(Wrapper)`
  padding: 1rem;
`;

const Edit = () => {
  const router = useRouter();
  const { query } = router;
  const { postTitle, text, id, postID } = query;
  const [update, setUpdate] = useState('');
  const [updating, setUpdating] = useState(false);

  const handleEdit = async () => {
    const data = {
      functionRole: 'editComment',
      postID,
      commentID: id,
      editedComment: update,
    };
    try {
      setUpdating(true);
      await fetch('/api/write-exm', {
        method: 'POST',
        body: JSON.stringify({ data }),
      });
      setUpdating(false);
      setUpdate('');
      Router.push(`/post/${postID}`);
    } catch (error) {}
  };

  return (
    <CustomWrapper>
      <div>
        <p>Community News: {postTitle}</p>
        <p>{text}</p>
      </div>

      <>
        <textarea
          name='comment'
          id='comment'
          cols={30}
          rows={10}
          value={update}
          placeholder=''
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setUpdate(e.target.value);
          }}
        ></textarea>

        <button
          onClick={handleEdit}
          disabled={!update}
          style={{ display: 'block', marginTop: '1rem' }}
        >
          {updating ? 'updating...' : 'update'}
        </button>
      </>
    </CustomWrapper>
  );
};

export default Edit;
