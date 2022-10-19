import React from 'react';
import { useRouter } from 'next/router';
import Post from '../../../../components/Post';
import { useGetAllData } from '../../../../hooks/useGetAllData';
import { useGettUser } from '../../../../hooks/useGetUser';
import styled from 'styled-components';

const Wrapper = styled.main`
  background: #f6f6ef;
  margin: auto;

  @media (min-width: 1100px) {
    width: 80%;
  }
`;

const UpvotedPosts = () => {
  const { username: queryingUser } = useRouter().query,
    { userName } = useGettUser().currentUser,
    { users, posts } = useGetAllData();

  const userUpvotes =
    users && users.find((user) => user.userName === userName)?.upvotedPosts;

  const upvotedPosts =
    userUpvotes && userUpvotes.length > 0
      ? posts && posts.filter((post) => !userUpvotes?.includes(post.postID))
      : [];

  if (!userUpvotes)
    <Wrapper>
      return <p>Loading...</p>
    </Wrapper>;

  return (
    <Wrapper>
      {queryingUser === userName ? (
        <>
          {upvotedPosts && upvotedPosts.length > 0 ? (
            <>
              {upvotedPosts &&
                upvotedPosts.map((post) => (
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
                ))}
            </>
          ) : (
            <p>you haven't upvoted any posts yet.</p>
          )}
        </>
      ) : (
        <p>Can&apos;t display this</p>
      )}
    </Wrapper>
  );
};

const HiddenPosts = () => {
  const { userName } = useGettUser().currentUser,
    { currentUser } = useGettUser(),
    { username: queryingUser } = useRouter().query,
    { posts, users } = useGetAllData(),
    user = users.find((user) => user.userName === currentUser.userName),
    hidden = user && user.hidden,
    userHidden = posts && posts.filter((post) => hidden?.includes(post.postID));

  return (
    <Wrapper>
      {queryingUser === userName ? (
        <>
          {hidden && hidden.length > 0 ? (
            <>
              {userHidden &&
                userHidden.map((post) => (
                  <Post
                    reff='hiddenPage'
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
                ))}
            </>
          ) : (
            <p>you haven't hidden any posts yet.</p>
          )}
        </>
      ) : (
        <p>Can&apos;t display this</p>
      )}
    </Wrapper>
  );
};

const Submissions = () => {
  const router = useRouter(),
    { username } = router.query,
    { posts } = useGetAllData(),
    submittedPosts =
      posts && posts.filter((post) => post.author.userName === username);

  if (!submittedPosts)
    return (
      <Wrapper>
        <p>Loading...</p>
      </Wrapper>
    );
  return (
    <Wrapper>
      {submittedPosts && submittedPosts.length > 0 ? (
        <>
          {submittedPosts &&
            submittedPosts.map((post) => (
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
            ))}
        </>
      ) : (
        <p>{username} hasn&apos;t added made any submissions yet</p>
      )}
    </Wrapper>
  );
};

const Favorites = () => {
  const { userName } = useGettUser().currentUser,
    { currentUser } = useGettUser(),
    { posts, users } = useGetAllData(),
    user = users.find((user) => user.userName === currentUser.userName),
    favorites = user && user.favorites,
    userFavorites =
      posts && posts.filter((post) => favorites?.includes(post.postID));

  if (!favorites)
    return (
      <Wrapper>
        <p>Loading...</p>
      </Wrapper>
    );

  return (
    <Wrapper>
      {favorites?.length > 0 ? (
        <>
          {userFavorites &&
            userFavorites.map((post) => (
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
            ))}
        </>
      ) : (
        <p>{userName} hasn&apos;t added any favorite submissions yet.</p>
      )}
    </Wrapper>
  );
};

const UserSummary = () => {
  const router = useRouter();
  const { item } = router.query;

  if (item === 'favorites') return <Favorites />;
  if (item === 'submissions') return <Submissions />;
  if (item === 'upvoted') return <UpvotedPosts />;
  if (item === 'hidden') return <HiddenPosts />;
};
export default UserSummary;
