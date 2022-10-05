import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  background-color: #f6f6ef;
  flex-direction: column;
  
  @media (min-width: 1100px) {
    width: 81%;
    margin: auto;
  }
`;

const PostInfo = styled.div`
  gap: 0.5rem;
  display: flex;
  padding: 0.5rem;
  align-items: baseline;
`;

const PostTitle = styled.p`
  margin: 0;
  font-size: 15px;
  font-weight: 500;
`;

const PostAuthor = styled.p`
  margin: 0;
  color: gray;
  margin-top: 0.5rem;
  font-size: 12px;
`;

const TextArea = styled.textarea`
  margin: 1.2rem;
  width: 85%;
  border-radius: 5px;

  @media (min-width: 550px) {
    width: 450px;
  }
`;

const SubmitButton = styled.button`
  align-self: flex-start;
  margin-left: 1rem;
  padding: 0.4rem;
  border: 1px solid gray;
  border-radius: 5px;
`;

export { Wrapper, PostInfo, PostTitle, PostAuthor, TextArea, SubmitButton };
