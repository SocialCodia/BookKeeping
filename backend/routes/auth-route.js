const router = require('express').Router();
const authController = require('../controllers/auth-controller');

router.post('/login',authController.login);
router.post('/forgot',authController.forgot);
router.patch('/reset',authController.reset);
router.get('/logout',authController.logout);
router.get('/refresh',authController.refresh);
router.get('/demo',authController.demo);



module.exports = router;