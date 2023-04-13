const { PLATTS_ORIGINAL_URL } = require('./index');

exports.PLATTS_API_URL = {
    API_PLATTS_GET_CURRENT: `${PLATTS_ORIGINAL_URL}/market-data/v3/value/current/symbol`,
    API_PLATTS_GET_TOKEN: `${PLATTS_ORIGINAL_URL}/auth/api`
}

