import { PrismaClient } from '@prisma/client';
import express from 'express';

const app = express();
const prisma = new PrismaClient();

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

// delete USERT by id
// DELETE api/user/:id
app.delete('/api/user/:id', async (req, res) => {
  const id = req.params.id;
  console.log('req.params.id: ' + id);

  //Find USER record by ID in USER table | Validation
  const userById = await prisma.user.findUnique({
    where: { id: +req.params.id }
  });
  if (!userById) {
    return res.status(404).json({
      err: 'could not find USER Record in table by ID: ' + req.params.id
    });
  }

  //Find POST record by ID in POST table | Validation
  const postById = await prisma.post.findUnique({
    where: { id: +req.params.id }
  });
  // delete Foreign key | Post ID = USER ID | If found
  if (postById) {
    const deletedPost = await prisma.post.delete({
      where: {
        id: parseInt(req.params.id)
      }
    })
  }

  //Find Profile record by ID in PROFILE table | Validation
  const profileById = await prisma.profile.findUnique({
    where: { id: +req.params.id }
  });
  // delete Foreign key | Profile ID = USER ID | If found 
  if (profileById) {
    const deletedProfile = await prisma.profile.delete({
      where: {
        id: parseInt(req.params.id)
      }
    })
  }

  // delete User
  const deletedUser = await prisma.user.delete({
    where: {
      id: parseInt(req.params.id)
    }
  })
  res.status(200).json(deletedUser);
});

app.listen(3000, () => {
  console.log('Server is running at port 3000');
})
