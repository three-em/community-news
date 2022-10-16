import { useEffect, useState } from 'react';
import { PostProps, UserProps } from '../types/index';

export const useGetAllData = () => {
  const [posts, setPosts] = useState<PostProps[]>([]),
    [users, setUsers] = useState<UserProps[]>([]),
    [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/read', {
          method: 'GET',
        });
        const allPosts = await response.json(),
          { posts, users } = allPosts.data;
        setPosts(posts);
        setUsers(users);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return { loading, posts, users };
};
