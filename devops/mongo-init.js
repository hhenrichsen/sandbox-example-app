db.getSiblingDB("admin").auth(
  process.env.MONGO_INITDB_ROOT_USERNAME,
  process.env.MONGO_INITDB_ROOT_PASSWORD,
);
db.createUser({
  user: "app",
  pwd: "password",
  roles: ["readWrite"],
});
