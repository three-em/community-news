import React from 'react';
import { useRouter } from 'next/router';
import Post from '../../../../components/Post';
import { useGetAllData } from '../../../../hooks/useGetAllData';
import { useGettUser } from '../../../../hooks/useGetUser';

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

  if (!userUpvotes) return <p>Loading...</p>;
  return (
    <main>
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
    </main>
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
    <main>
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
    </main>
  );
};

const Submissions = () => {
  const router = useRouter(),
    { username } = router.query,
    { posts } = useGetAllData(),
    submittedPosts =
      posts && posts.filter((post) => post.author.userName === username);

  if (!submittedPosts) return <p>Loading...</p>;
  return (
    <main>
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
        <p>{username} hasn&apos;t added any favorite submissions yet</p>
      )}
    </main>
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

  if (!favorites) return <p>Loading...</p>;

  return (
    <main>
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
    </main>
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
