import React from 'react';
import Post from '../../components/Post';
import { useGettUser } from '../../hooks/useGettUser';
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

const Favorites = ({ posts }: { posts: PostProps[] }) => {
  const { favorites, userName } = useGettUser().currentUser,
    userFavorites = posts.filter((post) => favorites?.includes(post.postID));

  return (
    <main>
      {favorites?.length > 0 ? (
        <>
          {userFavorites.map((post) => (
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
          ))}
        </>
      ) : (
        <p>{userName} hasn&apos;t added any favorite submissions yet.</p>
      )}
    </main>
  );
};

export default Favorites;
