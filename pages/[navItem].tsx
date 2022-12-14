import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useGetAllData } from '../hooks/useGetAllData';
import Post from '../components/Post';
import styled from 'styled-components';

const Wrapper = styled.main`
  background: #f6f6ef;
  margin: auto;

  @media (min-width: 1100px) {
    width: 80%;
  }
`;

const NewPosts = () => {
  const { posts, loading } = useGetAllData();
  const currentTime = new Date().getTime();

  const newPosts = posts.filter(
    (post) => currentTime - post.timeCreated <= 86400000
  );

  if (loading)
    return (
      <Wrapper>
        <p>Loading...</p>
      </Wrapper>
    );

  return (
    <Wrapper>
      {newPosts && newPosts.length > 0 ? (
        newPosts.map((post) => (
          <Post
            key={post.postID}
            num={posts.indexOf(post) + 1}
            title={post.title}
            url={post.url}
            postId={post.postID}
            upvotes={post.upvotes}
            userPosted={post.author.userName}
            timeCreated={post.timeCreated}
            numberOfComments={post.comments.length}
          />
        ))
      ) : (
        <p>no new posts yet. check back later</p>
      )}
    </Wrapper>
  );
};

const PastPosts = () => {
  const { posts, loading } = useGetAllData();
  const currentTime = new Date().getTime();

  const pastPosts = posts.filter(
    (post) => currentTime - post.timeCreated >= 86400000
  );

  if (loading)
    return (
      <Wrapper>
        <p>Loading...</p>
      </Wrapper>
    );

  return (
    <Wrapper>
      {pastPosts && pastPosts.length > 0 ? (
        pastPosts.map((post) => (
          <Post
            key={post.postID}
            num={posts.indexOf(post) + 1}
            title={post.title}
            url={post.url}
            postId={post.postID}
            upvotes={post.upvotes}
            userPosted={post.author.userName}
            timeCreated={post.timeCreated}
            numberOfComments={post.comments.length}
          />
        ))
      ) : (
        <p>no past posts yet. check back later</p>
      )}
    </Wrapper>
  );
};

const Threads = () => {
  const { posts, loading } = useGetAllData();

  const commentedPosts = posts.filter((post) => post.comments.length > 0);

  if (loading)
    return (
      <Wrapper>
        <p>Loading...</p>
      </Wrapper>
    );

  return (
    <Wrapper>
      {commentedPosts && commentedPosts.length > 0 ? (
        commentedPosts.map((post) => (
          <Post
            key={post.postID}
            num={posts.indexOf(post) + 1}
            title={post.title}
            url={post.url}
            postId={post.postID}
            upvotes={post.upvotes}
            userPosted={post.author.userName}
            timeCreated={post.timeCreated}
            numberOfComments={post.comments.length}
          />
        ))
      ) : (
        <p>
          be the first to comment on <Link href='/'>new posts</Link>
        </p>
      )}
    </Wrapper>
  );
};

const Ask = () => {
  const { posts, loading } = useGetAllData();

  const askedPosts = posts.filter((post) => !post.url);

  if (loading)
    return (
      <Wrapper>
        <p>Loading...</p>
      </Wrapper>
    );

  return (
    <Wrapper>
      {askedPosts && askedPosts.length > 0 ? (
        askedPosts.map((post) => (
          <Post
            key={post.postID}
            num={posts.indexOf(post) + 1}
            title={post.title}
            url={post.url}
            postId={post.postID}
            upvotes={post.upvotes}
            userPosted={post.author.userName}
            timeCreated={post.timeCreated}
            numberOfComments={post.comments.length}
          />
        ))
      ) : (
        <p>
          submissions without a link will be assumed to be questions. they'll
          appear on this page. <Link href='/submit'>Submit Post</Link>
        </p>
      )}
    </Wrapper>
  );
};

const NavItemsView = () => {
  const router = useRouter();
  const { navItem } = router.query;
  if (navItem === 'new') return <NewPosts />;
  if (navItem === 'past') return <PastPosts />;
  if (navItem === 'threads') return <Threads />;
  if (navItem === 'ask') return <Ask />;
};

export default NavItemsView;
