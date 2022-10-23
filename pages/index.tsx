import Link from 'next/link';
import Head from 'next/head';
import { useQuery } from 'react-query';
import Post from '../components/Post';
import { PostProps, UserProps } from '../types';
import { useGettUser } from '../hooks/useGetUser';
import * as Styled from '../styles/home';

const RenderPosts = ({ posts }: { posts: PostProps[] }) => (
  <>
    {posts.length > 0 ? (
      posts.map((post: PostProps) => (
        <>
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
        </>
      ))
    ) : (
      <Styled.NoPosts>
        <p>No posts yet</p>
        <Link href='/submit'>Submit Post</Link>
      </Styled.NoPosts>
    )}
  </>
);

const Home = () => {
  const { currentUser } = useGettUser();

  const {
    isLoading,
    data,
  }: {
    isLoading: boolean;
    data: {
      posts: PostProps[];
      users: UserProps[];
    };
  } = useQuery(
    'getAllPosts',
    async () => {
      const fetchAll = await fetch('/api/read');
      const res = await fetchAll.json();
      return res.data;
    },
    {
      refetchOnMount: true,
    }
  );

  if (isLoading)
    return (
      <Styled.Container>
        <p style={{ fontSize: '1rem' }}>Loading...</p>
      </Styled.Container>
    );

  //Don't filter hidden posts if user is not connected
  if (!currentUser.userName && !currentUser.walletAddress) {
    return (
      <Styled.Container>
        <RenderPosts posts={data.posts} />
      </Styled.Container>
    );
  }

  const user =
    currentUser.userName &&
    data.users.find(
      (user: UserProps) => user.userName === currentUser.userName
    );

  const filteredPosts: PostProps[] = data.posts.filter(
    (post: PostProps) =>
      user.hidden.length > 0 && !user.hidden.includes(post.postID)
  );

  return (
    <Styled.Container>
      <Head>
        <title>Community News</title>
        <meta name='description' content='Community News' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        {filteredPosts.length > 0 ? (
          <RenderPosts posts={filteredPosts} />
        ) : (
          <RenderPosts posts={data.posts} />
        )}
      </main>
    </Styled.Container>
  );
};

export default Home;
