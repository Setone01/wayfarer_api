import dotenv from "dotenv";

dotenv.config();

const variables = {
  app: {
    port: Number(process.env.PORT),
    dbUrl: process.env.DATABASE_URL,
  },

  auth: {
    jwtSecret: process.env.SECRET_KEY,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
    jwtAlgorithm: process.env.JWT_ALGORITHM,
    jwtSaltRounds: Number(process.env.SALT_ROUNDS)
  },
};

export default variables;
