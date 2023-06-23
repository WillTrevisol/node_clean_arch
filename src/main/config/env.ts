export default {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://mongo:27017/node_clean_arch',
  port: process.env.port ?? 5050,
  jwtSecret: process.env.JWT_SECRET ?? '7h0L4=p3Dr0'
}
