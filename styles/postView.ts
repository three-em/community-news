import styled from 'styled-components';

const Wrapper = styled.div`
  background-color: #f6f6ef;
`;

const PostInfo = styled.div`
  gap: 0.5rem;
  display: flex;
  padding: 0.5rem;
  align-items: baseline;

  p {
  }
`;

const PostTitle = styled.p`
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
`;

const PostAuthor = styled.p`
  margin: 0;
  color: gray;
  margin-top: 0.5rem;
`;

const TextArea = styled.textarea`
  margin: 1.2rem;
  width: 85%;
`;

const Button = styled.button`
  margin: 0 1.2rem;
`;

export { Wrapper, PostInfo, PostTitle, PostAuthor, TextArea, Button };
