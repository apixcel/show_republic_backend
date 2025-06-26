const config = {
  PASSWORD_SALT_ROUNDS: 10,
  PASSWORD_RESET_TOKEN_EXPIRATION_HOURS: 1,
  PROJECT_ID: "testfiesta-sandbox",
  ATTACHMENT_BUCKET: "sandbox-attachments",
  DEFAULT_ACTION_GCS_OBJ: "read",
  ATTACHMENT_SIGNED_URL_DURATION: 5 * 60 * 1000, // 5 mins
  IMAGE_SIZE_LIMIT: 2 * 1024 * 1024, // 2MB
  IMAGE_TYPES: /jpeg|jpg|png|gif/,
};

export default config;
