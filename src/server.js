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

// GET api/course
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

app.use(express.json())

// Use the following JSON format to insert the data 
// /* Body - JSON Content 
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
// */
app.post('/api/user', async (req, res) => {
  console.log('receiving data ...');
  console.log('body is ', req.body);
  try {
    res.send(req.body);
  }
  catch (err) {
    res.status(400).send(err);
  }
});


// PUT api/userid/1 TODO
// app.put('/api/userid/1', async (req, res) => {
//   // update user by id
//   const updateUsers = await prisma.user.update({
//     where: { id: 1 },
//     data: { published: true },
//     posts: {
//       create:
//         [
//           { title: 'Update data' }
//         ]
//     }
//   })
//   console.log(updateUsers);
// });

app.listen(3000, () => {
  console.log('Server is running at port 3000');
})
