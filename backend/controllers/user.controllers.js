import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import ConnectionRequest from "../models/connections.model.js"; // Ensure the correct path
import crypto from "crypto";
import bcrypt from "bcrypt";
import PDFDocument from "pdfkit";
import fs from "fs";


/// Convert User Data to PDF
const convertUserDataToPDF = async (userData) => {
  const doc = new PDFDocument();
  const outputPath = `${crypto.randomBytes(32).toString("hex")}.pdf`;
  const stream = fs.createWriteStream(`uploads/${outputPath}`);
  doc.pipe(stream);

  // Add content to the PDF
  doc.image(`uploads/${userData.userId.profilePicture}`, {
    align: "center",
    width: 100,
  });
  doc.fontSize(14).text(`Name: ${userData.userId.name}`);
  doc.fontSize(14).text(`Username: ${userData.userId.username}`);
  doc.fontSize(14).text(`Email: ${userData.userId.email}`);
  doc.fontSize(14).text(`Bio: ${userData.userId.bio || "N/A"}`);
  doc.fontSize(14).text(`Current Position: ${userData.userId.currentPosition || "N/A"}`);

  doc.fontSize(14).text("Past Work: ");
  userData.pastWork.forEach((work) => {
    doc.fontSize(14).text(`Company Name: ${work.companyName}`);
    doc.fontSize(14).text(`Position: ${work.position}`);
    doc.fontSize(14).text(`Years: ${work.years}`);
  });

  doc.end();
  return outputPath; // Ensure this returns the correct file path
};


// User Registration
export const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });

    await newUser.save();

    const profile = new Profile({ userId: newUser._id });
    await profile.save();

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// User Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.token = token; // Save token in the user record
    await user.save();

    return res.json({ token: token});
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Upload Profile Picture
export const uploadProfilePicture = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profilePicture = req.file.filename; // Assumes req.file is set by Multer
    await user.save();

    return res.json({ message: "Profile picture updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Upload User Data (Profile Updates)
export const uploadUserPicture = async (req, res) => {
  try {
    const { token, ...newUserData } = req.body;

    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { username, email } = newUserData;

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser && String(existingUser._id) !== String(user._id)) {
      return res
        .status(400)
        .json({ message: "User with these credentials already exists" });
    }

    Object.assign(user, newUserData);
    await user.save();

    return res.json({ message: "User updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get User and Profile
export const getUserAndProfile = async (req, res) => {
  try {
    const { token } = req.body;

    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name email username profilePicture"
    );
    return res.json(userProfile);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update Profile Data
export const updateProfileData = async (req, res) => {
  try {
    const { token, ...newProfileData } = req.body;

    const userProfile = await User.findOne({ token });

    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    const profileToUpdate = await Profile.findOne({ userId: userProfile._id });
    Object.assign(profileToUpdate, newProfileData);
    await profileToUpdate.save();

    return res.json({ message: "Profile updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get All User Profiles
export const getAllUserProfile = async (req, res) => {
  try {
    const profiles = await Profile.find().populate(
      "userId",
      "name username email profilePicture"
    );
    return res.json({ profiles });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Download Profile
export const downloadProfile = async (req, res) => {
  const userId = req.query.id; // Change res.query to req.query

  try {
    const userProfile = await Profile.findOne({ userId }).populate(
      "userId",
      "name username email profilePicture"
    );

    const outputPath = await convrtUserDataTOPDF(userProfile);

    return res.json({ message: outputPath });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Send Connection Request
export const sendConnectionRequest = async (req, res) => {
  const { token, connectionId } = req.body;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connectionUser = await User.findOne({ _id: connectionId });

    if (!connectionUser) {
      return res.status(404).json({ message: "Connection user not found" });
    }

    const existingRequest = await ConnectionRequest.findOne({ 
      userId: user._id,
      connectionId: connectionUser._id,
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Request already sent" });
    }

    const request = new ConnectionRequest({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    await request.save();

    return res.json({ message: "Request sent" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMyConnectionRequest = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connection = await ConnectionRequest.find({ userId: user._id })
      .populate("connectionId", "name username email profilePicture");

    return res.json({ connection });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const whatAreMyConnection = async (req, res) => {
  
  const {token} = res.body;

  try {
    const user = await User.findOne({token})

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connection = await ConnectionRequest.find({ connectionId: user._id })
    .populate("userId", "name username email profilePicture");

    return res.json(connection);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export const acceptConnectionRequest = async (req, res) => {
  const { token, requestId, action_type } = req.body; 

  try {
    
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    const connection = await ConnectionRequest.findOne({ _id: requestId });

    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

   
    if (action_type !== "accept") {
      connection.status_accepted = true;
    } else {
      connection.status_accepted = false;
    }

    await connection.save();
    return res.json({ message: "Resquest Updated"})

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

