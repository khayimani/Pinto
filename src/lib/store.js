// src/lib/store.js
// Persistent store implementation using Prisma ORM
// Handles account tokens, metadata, and ID generation

const { nanoid } = require('nanoid');
const prisma = require('./db');

module.exports = {
  /**
   * Retrieve an account record by ID
   * @param {string} key - Account ID
   * @returns {Promise<object|null>}
   */
  async getAccount(key) {
    try {
      return await prisma.account.findUnique({ where: { id: key } });
    } catch (err) {
      console.error('Error fetching account:', err);
      throw err;
    }
  },

  /**
   * Save or update an account record
   * @param {string} key - Account ID
   * @param {object} payload - { provider, accessToken, refreshToken, meta }
   * @returns {Promise<object>}
   */
  async saveAccount(key, payload) {
    try {
      return await prisma.account.upsert({
        where: { id: key },
        update: {
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken,
          meta: payload.meta || {},
          provider: payload.provider,
        },
        create: {
          id: key,
          provider: payload.provider,
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken,
          meta: payload.meta || {},
        },
      });
    } catch (err) {
      console.error('Error saving account:', err);
      throw err;
    }
  },

  /**
   * Generate a new unique key for an account
   * @returns {string}
   */
  createKey() {
    return nanoid();
  },

  /**
   * List all accounts (for admin/debugging)
   * @returns {Promise<Array>}
   */
  async listAccounts() {
    try {
      return await prisma.account.findMany();
    } catch (err) {
      console.error('Error listing accounts:', err);
      throw err;
    }
  },

  /**
   * Delete an account by ID
   * @param {string} key
   * @returns {Promise<void>}
   */
  async deleteAccount(key) {
    try {
      await prisma.account.delete({ where: { id: key } });
    } catch (err) {
      console.error('Error deleting account:', err);
      throw err;
    }
  },
};
