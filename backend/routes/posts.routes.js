import { Router } from "express";
import multer from 'multer';
import { activeClack, createPost, deletePost, getAllPosts, commentPost, get_comment_by_post, delete_comment_of_user, increment_likes } from '../controllers/posts.controllers.js';

const router = Router();

// Multer storage and file filter configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
  
  // Multer upload instance
  const upload = multer({
    storage: storage,
  });

// Routes
router.route('/').get(activeClack); 
router.route("/post").post(upload.single('media'), createPost)
router.route("/posts").get(getAllPosts)
router.route("/delete_post").post(deletePost)
router.route("/comment").post(commentPost)
router.route("/get_comment").post(get_comment_by_post)
router.route("/delete_comment").post(delete_comment_of_user)
router.route("/increment_post_likes").post(increment_likes)

export default router;
