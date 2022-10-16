import React from 'react';
import Post from '../../components/Post';
import { useRouter } from 'next/router';
import { PostProps } from '../../types';
import { fetchData } from '../../utils/getData';

export async function getServerSideProps() {
  const { posts } = await fetchData();

  return {
    props: {
      posts,
    },
  };
}

const Submissions = ({ posts }: { posts: PostProps[] }) => {
  const router = useRouter(),
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
          numberOfComments={post.comments.length}
        />
      ))}
    </main>
  );
};

export default Submissions;
