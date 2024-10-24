const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

const secret_key = "zxcvnaaa";

const usersdata = [
    { username: "Nile", email: "alia23@gmail.com", password: '12347', role: 'user',
        post: [{ id: 1, postcontent: "hello to user 1 post", comments: [], like: 0 }] },
    { username: "Amar", email: "munawar3@gmail.com", password: 'mypswd', role: 'user', post: [{ id: 2, postcontent: "hello to user 2 post", comments: [], like: 0 }] },
    { username: "Jabeen", email: "zeesh23@gmail.com", password: 'get123', role: 'user', post: [{ id: 3, postcontent: "hello to user 3 post", comments: [], like: 0 }] },
    { username: "Azeem", email: "alim567@gmail.com", password: 'kotlin343', role: 'user', post: [{ id: 4, postcontent: "hello to user 4 post", comments: [], like: 0 }] },
    { username: "Admin", email: "noor0093@gmail.com", password: 'admin123', role: 'admin', post: [{ id: 5, postcontent: "hello to user 5 post", comments: [], like: 0 }] }
];

function generate_token(user) {
    return jwt.sign({ username: user.username, role: user.role }, secret_key, { expiresIn: '1h' });
}

function authenticate(req, res, next) {
    const token = req.headers.token;
    if (!token) {
        return res.status(401).json({
            message: "Not logged In."
        });
    }
    jwt.verify(token, secret_key, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = user;
        next();
    });
}

app.get('/usersdata', (request, response) => {
    response.send(usersdata);
});

// Login section
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = usersdata.find(user => user.username === username && user.password === password);

    if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
    }
    const token = generate_token(user);
    res.json({ message: 'Login Success', token });
});

app.get('/admin', authenticate, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Not an admin...Admin access required !!" });
    }
    res.json({ message: "Welcome Admin, you have full access" });
});

//Post Section 
app.get('/profile', authenticate, (req, res) => {
    const loginuser = usersdata.find(user => user.username === req.user.username);
    if (!loginuser) 
        return res.status(404).json({ message: "User not found for desired profile" });

    res.json({ post: loginuser.post });
});

//Timeline Section 
app.get('/timeline', authenticate, (req, res) => {
    const loginuser = usersdata.find(user => user.username === req.user.username);
    if (!loginuser) {
        return res.status(404).json({ message: "Users not found for timeline" });
    }
        const timelinepost = [];
        usersdata.forEach(user =>{
            user.post.forEach(post =>{
                if(!loginuser.post.some(userpost =>userpost.id === post.id))
                {
                    timelinepost.push(post);
                }
            });
        });

        res.json({timeline: timelinepost});
});

const port =5000;
app.listen(port, () =>{
    console.log(`Sever is running on port: http://localhost:${port}`);
});