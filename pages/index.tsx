import type { NextPage } from 'next';
import { PostProps } from '../types';
import { useGetAllData } from '../hooks/useGetAllData';
import Link from 'next/link';
import Head from 'next/head';
import Post from '../components/Post';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const { posts, loading } = useGetAllData();

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
              postId={post.postID}
              userPosted={post.author.userName}
              timeCreated={post.timeCreated}
              numberOfComments={10}
            />
          ))
        ) : loading ? (
          <p> loading...</p>
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
// todo - move user props to dedicated types folder
