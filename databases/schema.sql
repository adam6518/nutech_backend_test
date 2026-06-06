CREATE TABLE users (
    id SERIAL PRIMARY KEY,

    email VARCHAR(255) UNIQUE NOT NULL,

    first_name VARCHAR(255) NOT NULL,

    last_name VARCHAR(255) NOT NULL,

    password_hashed TEXT NOT NULL,

    profile_image TEXT,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE balances (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id),
    balance BIGINT DEFAULT 0
);

CREATE TABLE banners (
    id SERIAL PRIMARY KEY,
    banner_name VARCHAR(255) NOT NULL,
    banner_image TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    service_code VARCHAR(50) UNIQUE NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    service_icon TEXT NOT NULL,
    service_tariff BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(100),
    user_id INTEGER REFERENCES users(id),
    transaction_type VARCHAR(50),
    description VARCHAR(255),
    total_amount BIGINT,
    created_on TIMESTAMP DEFAULT NOW()
);