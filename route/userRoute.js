import express from 'express';
import { registerUser,loginUser ,logoutUser,refreshAccessToken,getUser} from '../controller/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { addContact, searchUser } from '../controller/searchUser.js';
import { getUserData } from '../controller/userData.js';
import { searchMessage } from '../controller/searchMessage.js';

import { getMessages, sendMessage, getUserConversations ,editMessage, deleteMessage } from '../controller/chatController.js';
import { blockContact } from '../controller/blockUser.js';
import { updateMood } from '../controller/updateMood.js';

import upload from "../middleware/upload.js";

const router = express.Router();


router.post('/register', upload.single("image"),registerUser);
router.get('/users/:id/profilePic', getUser);
router.post('/login',loginUser)
router.post('/logout', verifyToken,logoutUser);
router.get('/search', verifyToken, searchUser)
router.post('/add-contact', verifyToken, addContact)
router.get('/user-data',verifyToken,getUserData)

router.post("/refresh-token",refreshAccessToken);


router.post('/send-message', verifyToken, sendMessage)
router.post('/messages', verifyToken, getMessages)
router.post('/conversation', verifyToken, getUserConversations)
router.put('/edit-message/:id', verifyToken,editMessage)
router.delete('/delete-message/:id', verifyToken,deleteMessage)

router.post('/search-message', verifyToken, searchMessage);
router.post('/block-contact', verifyToken, blockContact);
router.post('/update-mood', verifyToken, updateMood);



export default router;
