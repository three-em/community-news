import React from 'react';
import styled from 'styled-components';
import { Wrapper } from '../../styles/common';

const CustomWrapper = styled(Wrapper)`
  padding: 1rem;
`;

const Delete = () => {
  return (
    <CustomWrapper>
      <p style={{ fontSize: '1.15rem' }}>post title</p>
      <p style={{ fontSize: '1.15rem' }}>Do you want this to be deleted?</p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button>yes</button>
        <button>no</button>
      </div>
    </CustomWrapper>
  );
};

export default Delete;
