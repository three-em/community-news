export const fetchData = async () => {
  const url = `https://api.exm.dev/read/${process.env.TEST_FUNCTION_ID}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accepts: 'application/json',
    },
  });
  const data = await res.json();
  const { users, posts } = data;

  return { users, posts };
};
