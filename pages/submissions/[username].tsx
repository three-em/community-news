import React from 'react';
import Post from '../../components/Post';
import { useRouter } from 'next/router';
import { useGetAllData } from '../../hooks/useGetAllData';

const Submissions = () => {
  const router = useRouter(),
    { posts } = useGetAllData(),
    { username } = router.query,
    submittedPosts = posts.filter((post) => post.author.userName === username);

  return (
    <main>
      {submittedPosts.map((post) => (
        <Post
          key={post.postID}
          num={posts.indexOf(post) + 1}
          title={post.title}
          url={post.url}
          postId={post.postID}
          upvotes={post.upvotes}
          userPosted={post.author.userName}
          timeCreated={post.timeCreated}
          numberOfComments={0}
        />
      ))}
    </main>
  );
};

export default Submissions;
