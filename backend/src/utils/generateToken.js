const crypto = require('crypto');

/**
 * Generate a secure random token for request tracking
 * Format: 32 character hexadecimal string
 */
const generateTrackingToken = () => {
  return crypto.randomBytes(16).toString('hex');
};

module.exports = generateTrackingToken;
