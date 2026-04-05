const express = require('express');
const router = express.Router();
const { loginUser, verifyLogin } = require('../controllers/loginUser');

// —————————————————————————————————————————————————————————————————————————————
// Public Routes
// —————————————————————————————————————————————————————————————————————————————

router.post('/', loginUser);
router.post('/verify', verifyLogin);

module.exports = router;
