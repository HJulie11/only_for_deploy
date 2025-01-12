import express from 'express';
import { loginUser, registerUser } from '../controllers/usercontroller.js';
import usermodel from '../models/usermodel.js';
import multer from 'multer';
import authMiddleware from '../middleware/auth.js';
import AWS from 'aws-sdk';
import crypto from 'crypto';
import path from 'path';

const userRouter = express.Router();

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

s3.listBuckets((err, data) => {
  if (err) {
    console.log('Error', err);
  } else {
    console.log('Buckets:', data.Buckets);
  }
});

const storage = multer.memoryStorage();

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     const fileName = Buffer.from(file.originalname, 'latin1').toString('utf8');
//     cb(null, `${Date.now()}_${fileName}`); // Appending timestamp to filename
//   }
// });

const upload = multer({ storage: storage });

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

userRouter.post('/upload-audio', upload.single('audioFile'), authMiddleware, async (req, res) => {
  console.log('Received upload request');
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
    // const fileDisplayName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    // Generate a unique file name using timestamp and random characters
    const fileExtension = path.extname(file.originalname);
    // const fileStorageName = file.filename;
    // const fileStorageName = `/uploads/${file.filename}`;
    const fileStorageName = `${crypto.randomBytes(16).toString('hex')}_${Date.now()}${fileExtension}`;


    // S3 upload parameters
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `audio/${fileStorageName}`, // file path in the bucket
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read' // access control
    };
    
    // Upload file to S3
    const s3Upload = await s3.upload(params).promise();

    // Save file path (S3 URL) in MongoDB for the user
    const fileDisplayName = Buffer.from(file.originalname, 'latin1').toString('utf8');

    // Update user audioList
    const updatedUser = await usermodel.findByIdAndUpdate(userId, {
      $push: {
        audioList: {
          fileDisplayName: fileDisplayName,
          fileStorageName: s3Upload.Location //S3 URL for the uploaded file
        },
      },
    }, { new: true });

    console.log('Updated user:', updatedUser);

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    // res.status(200).json({ message: 'File uploaded successfully', user: updatedUser });
    res.status(200).json({ success: true, message: 'File uploaded successfully', user: updatedUser });
  } catch (error) {
    console.error('Error during file upload:', error);
    res.status(500).send(error.message || 'Server error');
  }
});

// , upload.single('transcript') //TODO: change this to put request
userRouter.post('/upload-transcript', authMiddleware, async (req, res) => {
  try {
    const { userId, fileStorageName, transcript } = req.body;

    if (!transcript || !fileStorageName) {
      return res.status(400).send('Transcript or file name is missing');
    }

    // if (!userId) {
    //   return res.status(400).send('User ID is missing');
    // }

    // const updatedUser = await usermodel.findOneAndUpdate(userId, {
    //   $push: {
    //     audioList: {
    //       transcript: transcript
    //     },
    //   },
    // }, { new: true });

    const user = await usermodel.findOneAndUpdate(
      { _id: userId, 'audioList.fileStorageName': fileStorageName },
      { $set: { 'audioList.$.transcript': transcript } },
      { new: true }
    );
    
    // if (!updatedUser) {
    //   return res.status(404).send('User not found');
    // }
    if (!user) {
      return res.status(404).send('User or file not found');
    }

    res.status(200).json({ success: true, message: 'Transcript uploaded successfully' });
  } catch (error) {
    console.error('Error uploading transcript:', error);
    res.status(500).send(error.message || 'Server error');
  }
});

// userRouter.get('/audio-transcript', authMiddleware, async (req, res) => {
//   try {
//     const userId = req.body.userId;
//     console.log('Fetching audio files for user:', userId);

//     if (!userId) {
//       return res.status(400).json({ error: 'User ID is missing' });
//     }

//     const user = await usermodel.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     console.log('User found:', user);
//     res.status(200).json({ success:true, transcript: user.audioList.transcript });
//   } catch (error) {
//     console.error('Error fetching audio files:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

userRouter.get('/audio-transcript', authMiddleware, async (req, res) => {
  const userId = req.body.userId;
  const fileStorageName = req.query.fileStorageName;

  console.log('Received userId:', userId);
  console.log('Received fileStorageName:', fileStorageName);

  if (!userId || !fileStorageName) {
    return res.status(400).json({ error: 'Missing userId or fileStorageName' });
  }

  try {
    const user = await usermodel.findById(userId);
    if (!user) {
      console.error('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    // const audioFile = user.audioList.find(audio => audio.fileStorageName === fileStorageName);
    const audioFile = user.audioList.find(audio => audio.fileStorageName === fileStorageName);
    console.log('Audio file:', audioFile);
    if (!audioFile) {
      console.error('Audio file not found');
      return res.status(404).json({ message: 'Audio file not found' });
    }

    console.log('Transcript:', audioFile.transcript); // Log the transcript
    res.status(200).json({ success: true, transcript: audioFile.transcript });
  } catch (error) {
    console.error('Error fetching audio transcript:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});


userRouter.get('/audio-files', authMiddleware, async (req, res) => {
  try {
    const userId = req.body.userId;
    const fileStorageName = req.query.fileStorageName;
    console.log('Fetching audio files for user:', userId);

    if (!userId) {
      return res.status(400).json({ error: 'User ID is missing' });
    }

    const user = await usermodel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (fileStorageName) {
      const audioFile = user.audioList.find(file => file.fileStorageName === fileStorageName);
      if (!audioFile) {
        return res.status(404).json({ error: 'Audio file not found' });
      }

      console.log('Audio file found:', audioFile);
      return res.status(200).json({ success:true, audioFile });
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

// userRouter.put('/audio-progress/:userId/:audioId', authMiddleware, async (req, res) => {
//   const { userId, audioId } = req.params;
//   const { progress } = req.body;

//   try {
//     const user = await usermodel.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     const audioFile = user.audioList.id(audioId);
//     if (!audioFile) {
//       return res.status(404).json({ error: 'Audio file not found' });
//     }

//     audioFile.progress = progress;
//     if (progress === '100') {
//       audioFile.dateRecorded = new Date();
//     }

//     await user.save();
//     res.status(200).json({ success: true, message: 'Progress updated successfully' });
//   } catch (error) {
//     console.error('Error updating progress:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

userRouter.post('/update-progress', authMiddleware, async (req, res) => {

  try {
    const { userId, fileStorageName, progress } = req.body;

    await usermodel.findOneAndUpdate(
      { _id: userId, 'audioList.fileStorageName': fileStorageName },
      { $set: { 'audioList.$.progress': progress } },
      // { new : true }
    );

    
    res.status(200).json({ success: true, message: 'Progress updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error', error });
  }
});

userRouter.get('/get-progress', authMiddleware, async (req, res) => {
  const { userId, fileStorageName } = req.query;

  if (!userId || !fileStorageName) {
    return res.status(400).json({ error: 'Missing userId or fileStorageName' });
  }

  try {
    const user = await usermodel.findOne(
      { _id: userId, 'audioList.fileStorageName': fileStorageName },
      { 'audioList.$': 1 }
    );

    if (!user || !user.audioList || user.audioList.length === 0) {
      return res.status(404).json({ error: 'User or audio file not found' });
    }

    const progress = user.audioList[0].progress;
    res.status(200).json({ success: true, progress });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Server error', error });
  }
});


export default userRouter;