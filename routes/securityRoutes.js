const express = require('express');
const { loginSecurity, addLog, viewLogs, editLog } = require('../controllers/securityController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', loginSecurity);
router.post('/add-log', protect, addLog);
router.get('/view-logs', protect, viewLogs);
router.put('/edit-log/:id', protect, editLog);

module.exports = router;
