// Here, we are going to create authentication helpers which are going to 
// do three things for us;
// 1. Authentication helpers
// 2. Encrypt password
// 3. Generate session token

import crypto from 'crypto';

const SECRET = 'RITESH-REST-API';

// Generate a string of random bytes (128 characters in length)
// This is generated in a binary format (buffer). 
// <Buffer ff ff 1a 2b ... > would be generated as printing always occurs in 
// either human readable format or hexadecimal format in the terminal

// base64 is how we convert this into a human readable base64 format
// Base64 uses 64 characters : A-Z, a-z, 0-9, + and /
export const random = () => crypto.randomBytes(128).toString('base64');
export const authentication = (salt: string, password: string) => {
    // HMAC : Hash Based Message Auth Code
    // SHA256 : Strong cryptographic encryption algorithm
    return crypto.createHmac('sha256', [salt, password].join('/'))
        .update(SECRET).digest('hex');
}
