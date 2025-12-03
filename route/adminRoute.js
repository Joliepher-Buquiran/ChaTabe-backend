import express from 'express';
import { verifyToken,adminOnly } from '../middleware/authMiddleware.js';
import { getTotalUsers } from '../controller/admin/getTotalUsers.js';
import { getTotalMessages } from '../controller/admin/getTotalMessages.js';
import { getTotalAdmins } from '../controller/admin/getTotalAdmins.js';
import { getActiveUsers } from '../controller/admin/getActiveUsers.js';
import { getMessagesToday } from '../controller/admin/getTotalMessagesToday.js';
import { getRegisteredUserToday } from '../controller/admin/getTotalRegisteredUserToday.js'
import { getStatsByRange } from '../controller/admin/getStats.js';
import { getUsers } from '../controller/admin/getUsers.js';
import { getAllMessages} from '../controller/admin/getMessages.js';
import { banUser,unbanUser,getBannedUsers } from '../controller/admin/banUser.js';
import { getTotalBannedUsers } from '../controller/admin/getTotalBannedUser.js';


const router = express.Router(); 

router.get('/total-users', verifyToken,adminOnly,getTotalUsers);
router.get('/total-messages', verifyToken,adminOnly,getTotalMessages);
router.get('/total-admins', verifyToken,adminOnly,getTotalAdmins);
router.get('/active-users', verifyToken,adminOnly,getActiveUsers);
router.get('/messages-today', verifyToken, adminOnly, getMessagesToday);
router.get('/registered-users-today', verifyToken,adminOnly,getRegisteredUserToday)
router.get('/stats', verifyToken, adminOnly, getStatsByRange);
router.get('/users',verifyToken,adminOnly,getUsers)
router.get('/messages',verifyToken,adminOnly,getAllMessages)
router.get('/total-banned-users',verifyToken,adminOnly,getTotalBannedUsers)

router.post('/ban/:userId', verifyToken,adminOnly,banUser);           
router.post('/unban/:userId', verifyToken, adminOnly,unbanUser);       
router.get('/banned-users', verifyToken, adminOnly, getBannedUsers);


export default router;