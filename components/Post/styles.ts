import styled from 'styled-components';

const PostWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const PostInfo = styled.div`
  display: flex;
  gap: 0.5rem;
  font-size: 14px;
  margin-top: 0.4rem;

  p {
    margin: 0;
  }
`;

const PostStats = styled.div`
  display: flex;
  font-size: 13px;

  p {
    margin: 0.3rem;
  }
`;

export { PostWrapper, PostInfo, PostStats };
