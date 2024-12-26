import Profile from '../models/profile.model.js';
import User from '../models/user.model.js';
import Post from '../models/posts.model.js';
import bcrypt from 'bcrypt';

export const activeClack = (req, res) => {
    res.status(200).json({ message: "RUNNING" });
};

export const createPost = async (req, res) => {
    const { token, body } = req.body;

    try {
       
        if (!token) {
            return res.status(400).json({ message: "Token is required" });
        }

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const post = new Post({
            userId: user._id,
            body: req.body.body,
            media: req.file ? req.file.filename : "",
            fileType: req.file ? req.file.mimetype.split("/")[1] : "",
        });

        await post.save();

        return res.status(201).json({ message: "Post created successfully" });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred while creating the post." });
    }
}; 

export const getAllPosts = async (req, res) => {
 
    try {
        const  posts = await Post.find().populate('userId', 'name username email profilePicture')
        returnnres.json({ post })
    }catch (error) {
         
        return res.status(500).json({ message: erroe.message });
    }
} 

export const deletePost = async (req, res) => {

   const { token, post_id} = req.body;

    try {
        const user = await User.findOne({ token: token})
        .select("_id");

        if(!user) {
            return res.status(404).json({ message: "User not found"})
        }

        const post = await Post.findOne({_id: post_id});

        if(!post) {
            return res.status.json({message: "post not found" })
        }

        if (post.userId.toString() !== user._id.toString()) {
            return res.status.json({message: "unautharized" });
        }

        await Post.deletePost({_id: post_id});

        return res.json({ message: "Post Deleted"})
        
    } catch (error) {
        return res.status(500).json({ message: erroe.message });
    }
}

export const commentPost = async (req, res) => {
    const { token, post_id, commentBody } = req.body;
  
    try {
      const user = await User.findOne({ token: token }).select("id");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const post = await Post.findOne({ _id: post_id }); 
  
      if (!post) {
        return res.status(404).json({ message: "Post not found" }); 
      }
  
      const comment = new Comment({
        userId: user._id,
        postId: post_id,
        comment: commentBody,
      });
  
      await comment.save();
  
      return res.status(200).json({ message: "Comment Added" }); // Fixed typo: "omment" to "Comment"
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

export const get_comment_by_post = async (req, res) => {

    const { post_id } = res.body;
    
    try {
        const post = await Post.findOne({_id: post_id});
        
    } catch (error) {
        return res.status(500).json({ message: erroe.message });
    }
}

export const delete_comment_of_user = async (req, res) => {

    const { token, comment_id } = res.body;

    try {
        const user = await User
        .findOne({token: token })
        .select("-id");

        if(!user) {
            return res.status.json({message: "user not found" })
        }

        const comment = await Comment.findOne({"_": comment_id})

        if(!comment) {
            return res.status.json({message: "comment not found" })
        }

        if (post.userId.toString() !== user._id.toString()) {
            return res.status.json({message: "unautharized" });
        }

        await Comment.deleteOne({"_id": comment_id});

        return res.json({message: "Comment Deleted"})

    } catch (error) {
        return res.status(500).json({ message: erroe.message });
    }
}

export const increment_likes = async (req, res) => {

const { post_id } = req.body;

try {
    const post = await Post.findOne({_id: post_id });
    
    if(!post) {
        return res.status.json({message: "post not found" })
    }
    post.likes = post.likes + 1;

    await post.save();

    return res.json({ message: "Likes incremented"})

} catch (error) {
    return res.status(500).json({ message: erroe.message });
}
}