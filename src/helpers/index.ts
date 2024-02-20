// Here, we are going to create authentication helpers which are going to 
// do two things for us;
// 1. Authentication helpers
// 2. Encrypt password
// 3. Generate session token

import crypto from 'crypto';

const SECRET = 'RITESH-REST-API';

export const random = () => crypto.randomBytes(128).toString('base64');
export const authentication = (salt: string, password: string) => {
    return crypto.createHmac('sha256', [salt, password].join('/'))
        .update(SECRET).digest('hex');
}
