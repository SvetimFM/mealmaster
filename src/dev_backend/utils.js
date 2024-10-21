/**
 * Generates a pseudo-random identifier.
 * @returns {string} A random string that can be used as an ID.
 */
export const generateRandomId = () => {
    return Math.random().toString(36).substr(2, 9);
};