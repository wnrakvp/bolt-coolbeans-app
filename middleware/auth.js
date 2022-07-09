module.exports = async function authenticateUser({ payload, next }) {
  userId = payload.user;
  await next();
  // const user = await client.oauth.v2.access();
  // console.log(user)
};
