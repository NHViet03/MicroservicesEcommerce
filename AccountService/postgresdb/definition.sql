DROP TABLE IF EXISTS public."users" CASCADE;
DROP TABLE IF EXISTS public."email_verifications";
DROP TABLE IF EXISTS public."password_resets";
DROP TABLE IF EXISTS public."customers";

-- users table
CREATE TABLE users (
    userId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    passwordHash VARCHAR(255) NOT NULL,
    isVerified BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX users_email_idx ON users(email);

-- email_verifications table
CREATE TABLE email_verifications (
    userId UUID REFERENCES users(userId) ON DELETE CASCADE,
    verificationToken UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expiresAt TIMESTAMP NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- customer table
CREATE TABLE customers (
    customerId SERIAL PRIMARY KEY,
    userId UUID REFERENCES users(userId) ON DELETE CASCADE,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    phoneNumber VARCHAR(255),
    address VARCHAR(255)
);