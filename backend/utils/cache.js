const NodeCache = require('node-cache');

// stdTTL: default TTL in seconds (5 minutes)
// checkperiod: how often to check for expired keys (60 seconds)
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

/**
 * Get a value from cache. Returns null if not found.
 */
const getCache = (key) => {
  const value = cache.get(key);
  return value !== undefined ? value : null;
};

/**
 * Set a value in cache with optional custom TTL (seconds).
 */
const setCache = (key, value, ttl = 300) => {
  cache.set(key, value, ttl);
};

/**
 * Delete one or more keys from cache.
 */
const delCache = (...keys) => {
  cache.del(keys);
};

/**
 * Flush (clear) all cached data.
 */
const flushCache = () => {
  cache.flushAll();
};

module.exports = { getCache, setCache, delCache, flushCache };
