import React from 'react';
import Post from '../../components/Post';
import { useGettUser } from '../../hooks/useGettUser';
import { useGetAllData } from '../../hooks/useGetAllData';

const Favorites = () => {
  const { loading, posts } = useGetAllData();
  const { favorites, userName } = useGettUser().currentUser;

  const userFavorites = posts.filter((post) =>
    favorites?.includes(post.postID)
  );

  return (
    <main>
      {loading ? (
        <p>loading</p>
      ) : favorites?.length > 0 ? (
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
