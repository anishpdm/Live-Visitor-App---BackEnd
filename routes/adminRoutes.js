const express = require('express');
const { loginAdmin, addSecurity, viewAllSecurity, removeSecurity, viewLogs,searchSecurityByName } = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/add-security', protect, addSecurity);
router.get('/view-security', protect, viewAllSecurity);
router.delete('/remove-security/:id', protect, removeSecurity);
router.get('/view-logs', protect, viewLogs);
router.get('/search-security', protect, searchSecurityByName);

module.exports = router;
