import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useGetAllData } from '../hooks/useGetAllData';
import Post from '../components/Post';

const NewPosts = () => {
  const { posts, loading } = useGetAllData();
  const currentTime = new Date().getTime();

  const newPosts = posts.filter(
    (post) => currentTime - post.timeCreated <= 86400000
  );

  if (loading) return <p>Loading...</p>;

  return (
    <main>
      {newPosts.length > 0 ? (
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
    </main>
  );
};

const PastPosts = () => {
  const { posts, loading } = useGetAllData();
  const currentTime = new Date().getTime();

  const pastPosts = posts.filter(
    (post) => currentTime - post.timeCreated >= 86400000
  );

  if (loading) return <p>Loading...</p>;

  return (
    <main>
      {pastPosts.length > 0 ? (
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
    </main>
  );
};

const Comments = () => {
  const { posts, loading } = useGetAllData();

  const commentedPosts = posts.filter((post) => post.comments.length > 0);

  if (loading) return <p>Loading...</p>;

  return (
    <main>
      {commentedPosts.length > 0 ? (
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
    </main>
  );
};

const Ask = () => {
  const { posts, loading } = useGetAllData();

  const askedPosts = posts.filter((post) => !post.url);

  if (loading) return <p>Loading...</p>;

  return (
    <main>
      {askedPosts.length > 0 ? (
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
    </main>
  );
};

const NavItemsView = () => {
  const router = useRouter();
  const { navItem } = router.query;
  if (navItem === 'new') return <NewPosts />;
  if (navItem === 'past') return <PastPosts />;
  if (navItem === 'comments') return <Comments />;
  if (navItem === 'ask') return <Ask />;
};

export default NavItemsView;
