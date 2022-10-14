import Link from 'next/link';
import Head from 'next/head';
import Post from '../components/Post';
import { PostProps } from '../types';
import * as Styled from '../styles/home';
import { fetchData } from '../utils/getData';

export async function getServerSideProps() {
  const { posts } = await fetchData();

  return {
    props: {
      posts,
    },
  };
}

const Home = ({ posts }: { posts: PostProps[] }) => {
  return (
    <Styled.Container>
      <Head>
        <title>Community News</title>
        <meta name='description' content='EXM Data Indexing Application' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        {posts.length > 0 ? (
          posts.map((post: PostProps) => (
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
