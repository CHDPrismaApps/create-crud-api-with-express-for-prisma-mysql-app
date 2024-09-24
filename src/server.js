import { PrismaClient } from '@prisma/client';
import express from 'express';

const app = express();
const prisma = new PrismaClient();

//********************************
// RUN SERVER: npm run dev
//********************************
// SEE: package.json
//"scripts": {
//  "dev": "nodemon --watch --exec node src/server.js",
//  "dev1": "nodemon --watch --exec node src/serverDeleteRequest.js",
//  "test": "echo \"Error: no test specified\" && exit 1"
//},
//********************************

// custom middleware
app.use((req, res, next) => {
  console.log(`${req.url} ${new Date()}`);
  next(); // call the next middleware in the stack
})

app.get('/', (req, res) => {
  res.send('HELLO WROLD')
})

// GET api/user
app.get('/api/users', async (req, res) => {
  // fetch all the users from db
  const allUsers = await prisma.user.findMany({
    include: {
      posts: true,
      profile: true,
    },
  })
  // get the prisma

  // get the course from the prisma object

  // call the many method

  // send back to user as a json
  res.status(200);
  res.json(allUsers);

});



// Use the following JSON format to insert the data to 
// http client body
// HTTP Body - JSON Content 
//
//   "name": "create user",
//    "email": "alice@prisma.io",
//    "posts":
//   {
//     "create": 
//     [
//       { "title": "Post Hello World" }
//     ]
//   },
//   "profile":
//   {
//     "create":
//     [
//       { "bio": "Profile Hello World" }
//     ]
//   }
// } 
// 

app.use(express.json())

// POST api/user
app.post('/api/user', async (req, res) => {
  console.log('receiving data ...');
  console.log('body is ', JSON.stringify(req.body));
  try {
    const result = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        posts: req.body.email.posts,
        profile: req.body.email.profile,
      },
    })
    res.status(201).json(result);
  }
  catch (err) {
    res.status(400).send(err);
  }
});


// update POST by id
// PUT api/updatePostByID/:id
app.put('/api/updatePostByID/:id', async (req, res) => {
  const id = req.params.id;
  console.log('req.params.id: ' + id);
  console.log('req.body.published: ' + req.body.published);
  const updatedPost = await prisma.post.update({
    where: { id: parseInt(req.params.id) },
    data: { published: true },
  })
  console.log('updated POST: ' + JSON.stringify(updatedPost));
  res.status(200).json(updatedPost);
});

app.listen(3000, () => {
  console.log('Server is running at port 3000');
})
