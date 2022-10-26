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
  const [edit, setEdit] = useState('');
  const [editing, setEditing] = useState(false);

  const handleEdit = async () => {
    const data = {
      functionRole: 'editComment',
      postID,
      commentID: id,
      editedComment: edit,
    };
    try {
      setEditing(true);
      await fetch('/api/write-exm', {
        method: 'POST',
        body: JSON.stringify({ data }),
      })
        .then(async (res) => {
          const response = await res.json();
          const { data } = response.data;
          const { posts } = data.execution.state;
          setEdit('');
          setEditing(false);
          Router.push(
            {
              pathname: `/post/${postID}`,
              query: {
                editAllPosts: JSON.stringify([...posts]),
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
          value={edit}
          placeholder=''
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setEdit(e.target.value);
          }}
        ></textarea>

        <button
          onClick={handleEdit}
          disabled={!edit}
          style={{ display: 'block', marginTop: '1rem' }}
        >
          {editing ? 'editing...' : 'edit'}
        </button>
      </>
    </CustomWrapper>
  );
};

export default Edit;
