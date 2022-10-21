import Link from 'next/link';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import Post from '../components/Post';
import { PostProps, UserProps } from '../types';
import { useGettUser } from '../hooks/useGetUser';
import * as Styled from '../styles/home';

const Home = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useGettUser();

  const { isLoading, error, data } = useQuery('getAllPosts', async () => {
    const fetchAll = await fetch('/api/read');
    const res = await fetchAll.json();
    return res.data;
  });

  // possibility to use react-router

  // useEffect(() => {
  // (async () => {
  //   setLoading(true);
  //   const response = await fetch('/api/read', {
  //     method: 'GET',
  //   });
  //   const all = await response.json();
  //   const { posts, users } = all.data;

  //   const user =
  //     users &&
  //     currentUser.userName &&
  //     users.find((user) => user.userName === currentUser.userName);

  // const filteredPosts = posts.filter(
  //   (post) =>
  //     user && user.hidden.length > 0 && !user.hidden.includes(post.postID)
  // );
  // setAllPosts(() => [...allPosts, ...posts]);
  // setLoading(false);
  //   })();
  // }, []);

  // console.log('REACT QUERY', data);
  // console.log('REACT QUERY LOADING', isLoading);
  // console.log('REACT QUERY ERROR', error);

  if (isLoading)
    return (
      <Styled.Container style={{ background: '#fff' }}>
        <p style={{ fontSize: '1rem' }}>Loading...</p>
      </Styled.Container>
    );

  if (error) console.log('ERROR', error);

  const user =
    currentUser.userName &&
    data.users.find(
      (user: UserProps) => user.userName === currentUser.userName
    );

  const filteredPosts: PostProps[] = data.posts.filter(
    (post: PostProps) =>
      user.hidden.length > 0 && !user.hidden.includes(post.postID)
  );

  console.log('POSTS', data.posts);
  console.log('FILTERED', filteredPosts);
  console.log('FILTERED LENGTH', filteredPosts.length);

  return (
    <Styled.Container>
      <Head>
        <title>Community News</title>
        <meta name='description' content='Community News' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post: PostProps) => (
            <Post
              key={post.postID}
              num={filteredPosts.indexOf(post) + 1}
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
