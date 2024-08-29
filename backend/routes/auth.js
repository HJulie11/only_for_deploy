import express from 'express'

const router = express.Router();

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Failed to logout');
        }
        res.clearCookie('connect.sid');
        res.redirect('/'); // or /login
    });
});

export default router;