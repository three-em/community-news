import React from 'react';
import Post from '../../components/Post';
import { useRouter } from 'next/router';
import { useGettUser } from '../../hooks/useGettUser';
import { useGetAllData } from '../../hooks/useGetAllData';

const UpvotedPosts = () => {
  const { user: queryingUser } = useRouter().query,
    { users, posts } = useGetAllData(),
    { userName } = useGettUser().currentUser;

  const userUpvotes = users.find(
    (user) => user.userName === userName
  )?.upvotedPosts;

  const upvotedPosts = posts.filter(
    (post) => !userUpvotes?.includes(post.postID)
  );

  return (
    <main>
      {queryingUser === userName ? (
        upvotedPosts?.map((post) => (
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
        <p>Can&apos;t display this</p>
      )}
    </main>
  );
};

export default UpvotedPosts;
