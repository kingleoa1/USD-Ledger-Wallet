const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // Key provided in .env file
const iv = crypto.randomBytes(16); // Random initialization vector for each encryption

// Encrypt function
const encrypt = (data) => {
    let cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`; // Return IV + encrypted text
};

// Decrypt function
const decrypt = (encryptedData) => {
    const [ivHex, encryptedText] = encryptedData.split(':');
    let decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(ivHex, 'hex'));
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

module.exports = { encrypt, decrypt };
