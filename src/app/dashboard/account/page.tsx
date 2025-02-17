import { fetchUserById } from './actions';
import Page from './client';

const page = async () => {
  const user = await fetchUserById();
  return <Page user={user.data} />;
};

export default page;
