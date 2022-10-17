import Link from 'next/link';
import Head from 'next/head';
import Post from '../components/Post';
import { PostProps } from '../types';
import * as Styled from '../styles/home';
import { fetchData } from '../utils/getData';
import { useEffect, useState } from 'react';
import { useGetAllData } from '../hooks/useGetAllData';

export async function getServerSideProps() {
  const { posts } = await fetchData();

  return {
    props: {
      posts,
    },
  };
}

const Home = ({ posts }: { posts: PostProps[] }) => {
  const [allPosts, setAllPosts] = useState(posts);

  useEffect(() => {
    (async () => {
      const response = await fetch('/api/read', {
        method: 'GET',
      });
      const all = await response.json();
      const { posts } = all.data;
      setAllPosts(posts);
    })();
  }, []);

  return (
    <Styled.Container>
      <Head>
        <title>Community News</title>
        <meta name='description' content='EXM Data Indexing Application' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        {allPosts.length > 0 ? (
          allPosts.map((post: PostProps) => (
            <Post
              key={post.postID}
              num={allPosts.indexOf(post) + 1}
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
          <>
            <p>No posts yet</p>
            <Link href='/submit'>Submit Post</Link>
          </>
        )}
      </main>
    </Styled.Container>
  );
};

export default Home;
