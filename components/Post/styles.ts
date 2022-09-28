import styled from 'styled-components';

const PostWrapper = styled.div`
  display: flex;
  padding: 0.5rem;
  align-items: baseline;
`;

const PostInfo = styled.div`
  gap: 0.5rem;
  display: flex;
  font-size: 14px;
  align-items: baseline;

  p {
    margin: 0;
    font-size: 1rem;
  }
`;

const PostStats = styled.div`
  gap: 0.4rem;
  display: flex;
  font-size: 13px;
  flex-wrap: wrap;
  align-items: center;
  margin-left: 0.5rem;

  .title {
    font-weight: 500;
    font-size: 15px;
    color: #000;
  }

  p {
    margin: 0;
    color: gray;
    font-size: 13px;
  }

  a {
    text-decoration: none;
    color: gray;
  }
`;

export { PostWrapper, PostInfo, PostStats };
