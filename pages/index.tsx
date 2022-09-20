import axios from 'axios';
import Link from 'next/link';
import Head from 'next/head';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import styles from '../styles/Home.module.css';

interface PostProps {
  num: number;
  title: string;
  shortUrl: string;
  userPosted: string;
  timeCreated: string;
  numberOfComments: number;
}

const PostWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const PostInfo = styled.div`
  display: flex;
  gap: 0.5rem;
  font-size: 14px;
  margin-top: 0.4rem;

  p {
    margin: 0;
  }
`;

const PostStats = styled.div`
  display: flex;
  font-size: 13px;

  p {
    margin: 0.3rem;
  }
`;

const Home: NextPage = () => {
  const [posts, setPosts] = useState<any>([]);

  useEffect(() => {
    const getAllPosts = async () => {
      try {
        const response = await axios.get('/api/allPosts');
        const { posts } = response.data.data;
        setPosts(posts);
      } catch (error) {
        console.error(error);
      }
    };
    getAllPosts();
  }, []);

  const Post = ({
    num,
    title,
    shortUrl,
    userPosted,
    timeCreated,
    numberOfComments,
  }: PostProps) => {
    return (
      <PostWrapper>
        <PostInfo>
          <p>{num}</p>
          <p>upvote</p>
          <p>
            {title} ({shortUrl})
          </p>
        </PostInfo>

        <PostStats>
          <p>
            posted by {userPosted} {timeCreated} ago
          </p>
          <p>unvote</p>
          <p>hide</p>
          <p>
            {numberOfComments > 0 ? `${numberOfComments} comments` : 'discuss'}
          </p>
        </PostStats>
      </PostWrapper>
    );
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Community News</title>
        <meta name='description' content='EXM Data Indexing Application' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        {posts.length > 0 ? (
          posts.map((post: any) => (
            <Post
              key='1'
              num={posts.indexOf(post) + 1}
              title={post.title}
              shortUrl='codingknite.com'
              userPosted='codingknite'
              timeCreated='50 minutes'
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
