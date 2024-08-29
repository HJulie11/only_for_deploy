import express from 'express';
import { loginUser, registerUser } from '../controllers/usercontroller.js';
import usermodel from '../models/usermodel.js';
import multer from 'multer';
import authMiddleware from '../middleware/auth.js';

const userRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const fileName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    cb(null, `${Date.now()}_${fileName}`); // Appending timestamp to filename
  }
});

const upload = multer({ storage: storage });

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

userRouter.post('/upload-audio', upload.single('audioFile'), authMiddleware, async (req, res) => {
  try {
    const userId = req.body.userId; // Pass User ID in the body
    const file = req.file;

    if (!file) {
      return res.status(400).send('No file uploaded');
    }

    if (!userId) {
      return res.status(400).send('User ID is missing');
    }

    // Extract the original name and storage name
    const fileDisplayName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    const fileStorageName = file.filename;

    // Update user audioList
    const updatedUser = await usermodel.findByIdAndUpdate(userId, {
      $push: {
        audioList: {
          fileDisplayName: fileDisplayName,
          fileStorageName: fileStorageName
        },
      },
    }, { new: true });

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    res.status(200).json({ message: 'File uploaded successfully', user: updatedUser });
  } catch (error) {
    console.error('Error during file upload:', error);
    res.status(500).send(error.message || 'Server error');
  }
});

// userRouter.post('/upload-transcript', upload.single('transcript'), authMiddleware, async (req, res) => {
//   try {
//     const { userId, fileStorageName, transcriptText } = req.body;

//     if (!userId || !fileStorageName || !transcriptText) {
//       return res.status(400).send('Missing required information');
//     }

//     // Update the user's audioList with the transcript text
//     const updatedUser = await usermodel.findOneAndUpdate(
//       { _id: userId, "audioList.fileStorageName": fileStorageName },
//       { $set: { "audioList.$.transcriptText": transcriptText } },
//       { new: true }
//     );

//     if (!updatedUser) {
//       return res.status(404).send('User or audio file not found');
//     }

//     res.status(200).json({ message: 'Transcript uploaded successfully', user: updatedUser });
//   } catch (error) {
//     console.error('Error uploading transcript:', error);
//     res.status(500).send(error.message || 'Server error');
//   }
// });

userRouter.post('/upload-transcript', upload.single('transcript'), authMiddleware, async (req, res) => {
  try {
    const userId = req.body.userId;
    const transcript = req.body.transcript;

    if (!transcript) {
      return res.status(400).send('No text provided');
    }

    if (!userId) {
      return res.status(400).send('User ID is missing');
    }

    // if (!fileStorageName) {
    //   return res.status(400).send('File name is missing');
    // }

    // Update the user's audioList with the transcript text
    const updatedUser = await usermodel.findOneAndUpdate(userId, {
      $push: {
        audioList: {
          transcript: transcript
        },
      },
    }, { new: true });
    
    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    res.status(200).json({ message: 'Transcript uploaded successfully', user: updatedUser });
  } catch (error) {
    console.error('Error uploading transcript:', error);
    res.status(500).send(error.message || 'Server error');
  }
});

userRouter.get('/audio-files', authMiddleware, async (req, res) => {
  try {
    const userId = req.body.userId;
    console.log('Fetching audio files for user:', userId);

    if (!userId) {
      return res.status(400).json({ error: 'User ID is missing' });
    }

    const user = await usermodel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User found:', user);
    res.status(200).json({ success:true, audioFiles: user.audioList });
  } catch (error) {
    console.error('Error fetching audio files:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

userRouter.get('/myaccount', authMiddleware, async (req, res) => {
  try {
    const userId = req.body.userId;
    console.log('Fetching user details for user:', userId);
    if (!userId) {
      return res.status(400).json({ error: 'User ID is missing' });
    }
    const user = await usermodel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User found:', user);
    res.status(200).json({ success:true, 
      name: user.name,
      email: user.email,
      dateofbirth: user.dateofbirth,
      mobilenumber: user.mobilenumber,
      gender: user.gender,
      address: user.address,
      institute: user.institute,
      group: user.group,
     });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default userRouter;