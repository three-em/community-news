import Link from 'next/link';
import Head from 'next/head';
import Post from '../components/Post';
import { PostProps } from '../types';
import * as Styled from '../styles/home';
import { useEffect, useState } from 'react';
import { useGettUser } from '../hooks/useGetUser';

const Home = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useGettUser();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const response = await fetch('/api/read', {
        method: 'GET',
      });
      const all = await response.json();
      const { posts, users } = all.data;

      const user =
        users &&
        currentUser.userName &&
        users.find((user) => user.userName === currentUser.userName);

      // const filteredPosts = posts.filter(
      //   (post) =>
      //     user && user.hidden.length > 0 && !user.hidden.includes(post.postID)
      // );
      setAllPosts(() => [...allPosts, ...posts]);
      setLoading(false);
    })();
  }, [currentUser]);

  console.log('ALL', allPosts);

  if (loading)
    return (
      <Styled.Container style={{ background: '#fff' }}>
        <p style={{ fontSize: '1rem' }}>Loading...</p>
      </Styled.Container>
    );

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
          <Styled.NoPosts>
            <p>No posts yet</p>
            <Link href='/submit'>Submit Post</Link>
          </Styled.NoPosts>
        )}
      </main>
    </Styled.Container>
  );
};

export default Home;
