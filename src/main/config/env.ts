export default {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://0.0.0.0:27017/node_clean_arch',
  port: process.env.port ?? 5050
}
