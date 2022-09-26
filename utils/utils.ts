const getPostDate = (time: number) => {
  const currentTime = new Date().getTime();
  const timeDiff = currentTime - time; // in milliseconds

  let timeSincePost = '';

  // 1 minute = 60,000 milliseconds
  // 1 hour = 3,600,000 milliseconds
  // 1 day = 86,400,000 milliseconds

  if (timeDiff >= 60000 && timeDiff < 3600000) {
    timeSincePost = `${Math.round(timeDiff / (1000 * 60))} minutes`;
  } else if (timeDiff >= 3600000 && timeDiff < 86400000) {
    timeSincePost = `${Math.round(timeDiff / (1000 * 3600))} hours`;
  } else if (timeDiff >= 86400000) {
    timeSincePost = `${Math.round(timeDiff / (1000 * 3600 * 24))} days`;
  } else {
    timeSincePost = '1 miunte';
  }

  return timeSincePost;
};

const getShortUrl = (url: string) => {
  const { hostname } = new URL(url);
  return hostname;
};

export { getPostDate, getShortUrl };
