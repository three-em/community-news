import Link from 'next/link';
import Head from 'next/head';
import { useQuery } from 'react-query';
import Post from '../components/Post';
import { PostProps, UserProps } from '../types';
import { useGettUser } from '../hooks/useGetUser';
import * as Styled from '../styles/home';
import { useRouter } from 'next/router';

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
  const router = useRouter();
  const { submitAllPosts } = router.query;
  const postsFromSubmit: PostProps[] =
    submitAllPosts && JSON.parse(submitAllPosts as string);

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

  if (isLoading && !submitAllPosts)
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

  const filteredPosts: PostProps[] = !submitAllPosts
    ? data.posts.filter(
        (post: PostProps) =>
          user && user.hidden.length > 0 && !user.hidden.includes(post.postID)
      )
    : postsFromSubmit.filter(
        (post: PostProps) =>
          user && user.hidden.length > 0 && !user.hidden.includes(post.postID)
      );

  return (
    <Styled.Container>
      <Head>
        <title>Community News | Arweave</title>
        <meta name="title" content="Community News | Arweave" />
        <meta name="description" content="A place for Arweavers to discuss their latest thoughts, ideas, and questions." />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://news.communitylabs.com/" />
        <meta property="og:title" content="Community News | Arweave" />
        <meta property="og:description" content="A place for Arweavers to discuss their latest thoughts, ideas, and questions." />
        <meta property="og:image" content="/header.jpg" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://news.communitylabs.com/" />
        <meta property="twitter:title" content="Community News | Arweave" />
        <meta property="twitter:description" content="A place for Arweavers to discuss their latest thoughts, ideas, and questions." />
        <meta property="twitter:image" content="/header.jpg" />
        <link rel="icon" type="image/png" href="https://arweave.net/HuDE37wlwN-gwdkoxaWOxXsvlJaaf8b9mA9BlHuPEqU" />      
      </Head>

      <main>
        {filteredPosts.length > 0 ? (
          <RenderPosts posts={filteredPosts} />
        ) : postsFromSubmit && postsFromSubmit.length > 0 ? (
          <RenderPosts posts={postsFromSubmit} />
        ) : (
          <RenderPosts posts={data.posts} />
        )}
      </main>
    </Styled.Container>
  );
};

export default Home;
