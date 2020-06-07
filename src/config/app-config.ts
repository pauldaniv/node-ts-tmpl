import { config } from "dotenv";

config();


export const appConf = {
  port: process.env.PORT || 8000,
  sessionSecret: process.env.SESSiON_SECRET,
  profile: process.env.NODE_ENV,
};

export const dbConf = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  pool: {
    max: 10,
    min: 0,
    acquire: 50000,
  },
  dialect: process.env.DB_DIALECT || 'postgres',
  dialectOptions: {decimalNumbers: true},
  logging: process.env.NODE_ENV === 'development'
};

export const email = {
  host: process.env.EMAIL_HOST,
  // port: process.env.EMAIL_PORT,
  // secure: true,
  auth: {
    // type: process.env.EMAIL_AUTH_TYPE,
    user: process.env.EMAIL_AUTH_USERNAME,
    pass: process.env.EMAIL_AUTH_PASSWORD,
  }
};

export const sftpConf = {
  host: process.env.SFTP_HOST,
  port: process.env.SFTP_PORT,
  username: process.env.SFTP_USERNAME,
  password: process.env.SFTP_PASSWORD,
  baseFolder: process.env.SFTP_BASE_FOLDER,
  enabled: process.env.SFTP_IMPORT_ENABLED,
  onBootEnabled: process.env.SFTP_IMPORT_ON_BOOT_ENABLED,
};

export const notificationCleaning = {
  countThreshold: process.env.NC_COUNT_THRESHOLD,
  timeThreshold: process.env.NC_TIME_THRESHOLD,
  schedule: {
    time: process.env.NC_SCHEDULE_TIME,
    enabled: process.env.NC_SCHEDULE_ENABLED,
  }
};
