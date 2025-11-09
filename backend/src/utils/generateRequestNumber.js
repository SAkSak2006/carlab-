/**
 * Generate a unique 6-digit request number
 * Format: 123456 (random 6 digits)
 */
const generateRequestNumber = () => {
  // Generate random 6-digit number (100000 to 999999)
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = generateRequestNumber;
