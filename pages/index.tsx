import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import Post from '../components/Post';
import styles from '../styles/Home.module.css';

interface PostProps {
  postID: string;
  author: {
    userName: string;
  };
  title: string;
  url: string;
  description: string;
  upvotes: number;
  timeCreated: number;
}

const Home: NextPage = () => {
  const [posts, setPosts] = useState<any>([]);

  useEffect(() => {
    const getAllPosts = async () => {
      try {
        const response = await fetch('/api/allPosts'),
          getPosts = await response.json(),
          { posts } = getPosts.data;
        setPosts(posts);
      } catch (error) {
        console.error(error);
      }
    };
    getAllPosts();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Community News</title>
        <meta name='description' content='EXM Data Indexing Application' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        {posts.length > 0 ? (
          posts.map((post: PostProps) => (
            <Post
              key='1'
              num={posts.indexOf(post) + 1}
              title={post.title}
              url={post.url}
              userPosted={post.author.userName}
              timeCreated={post.timeCreated}
              numberOfComments={10}
            />
          ))
        ) : (
          <>
            <p>No posts yet</p>
            <Link href='/submit'>Submit Post</Link>
          </>
        )}
      </main>
    </div>
  );
};

export default Home;

// todo - add loading state since we're not using getStaticProps
