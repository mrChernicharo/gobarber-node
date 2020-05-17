export default {
  jwt: {
    secret: process.env.APP_SECRET || 'default',
    expriresIn: '1d',
  },
};
