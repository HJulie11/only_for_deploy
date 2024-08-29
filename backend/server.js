import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import 'dotenv/config'
import userRouter from './routes/userRoute.js'
import adminRouter from './routes/adminRoute.js'
// Import the YoutubeTranscript module
import { YoutubeTranscript } from 'youtube-transcript';

// APP CONFIG
const app = express()
const port = 4000
 
//MIDDLEWARE
app.use(express.json())
app.use(cors())
app.use(express.static('uploads'));

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// character encoding
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
  });
 
// DB CONNECTION
connectDB()

app.use('/api/user', userRouter) // require('./routes/userRoute.js')
app.use('/api/admin', adminRouter) // require('./routes/adminRoute.js')
app.use('/audioFiles', express.static('uploads'))

// Add a new API route to fetch the transcript
app.get('/api/transcript', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const transcript = await YoutubeTranscript.fetchTranscript(url);
        const transcriptText = transcript.map(item => item.text).join(' ');
        res.status(200).json({ transcript: transcriptText });
    } catch (error) {
        console.error('Error fetching transcript:', error);
        res.status(500).json({ error: 'Failed to fetch transcript' });
    }
});


// character encoding
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
  });

app.get('/', (req, res) => {
    res.send('API Working')
})

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`)
})

// mongodb+srv://gyeongcheong23:OMIM5vasaz7gnC84@cluster0.d8iwxjc.mongodb.net/?