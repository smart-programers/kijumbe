

export const getDaysAgo = (date:Date) => {
  const givenDate:any = new Date(date);
  const now:any = new Date();

  const diffInMs = givenDate-now;
  const msInDay = 1000 * 60 * 60 * 24;

  return Math.floor(diffInMs / msInDay);
};

export const formatDate = (timestamp:Date) => {
  const date = new Date(timestamp);
  
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' }); 
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

