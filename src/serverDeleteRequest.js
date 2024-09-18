import { PrismaClient } from '@prisma/client';
import express from 'express';

const app = express();
const prisma = new PrismaClient();

// custom middleware
app.use((req, res, next) => {
  console.log(`${req.url} ${new Date()}`);
  next(); // call the next middleware in the stack
})

//----------------------------------------------------------
// RUN THIS SERVER: 
// nodemon --watch --exec node src/serverDeleteRequest.js
//----------------------------------------------------------


/* 
// SEE: prisma.schema.prisma
// TO DELETE A POST RECORED, WE NEED FIRST TO 
// 1. DELETE THE POST WITH FOREIGN-KEY: POST-authorId=USER-id  
// 2. DELETE THE PROFILE WITH FOREIGN-KEY: PROFILEID-userid=USER-id
// 3. DELETE THE USER WITH id (USER-id=POST-authorId=PROFILEID-userid)
// FOR EXAMPLE. TO DELETE A USER-id=18;
// CHECK:
// select * from post where authorId=18;
// select * from profile where userId=18;
// select * from user where Id=18;
// DELETE:
// delete from post where authorId=18;
// delete from profile where userId=18;
// delete from user where id =18;
// commit;  
*/

// delete USERT by id
// DELETE api/user/:id
app.delete('/api/user/:id', async (req, res) => {
  const paramsUserid = req.params.id;
  console.log('req.params.id: ' + paramsUserid);

  //Find USER record by ID in USER table | Validation
  try {
    const userById = await prisma.user.findUnique({
      where: { id: parseInt(paramsUserid) }
    });
    if (!userById) {
      return res.status(404).json({
        err: 'could not find USER Record in table by ID: ' + paramsUserid
      });
    }
    // //Find POST record by Author-ID in POST table | Validation
    try {
      const postByAuthorId = await prisma.post.findUnique({
        where: { authorId: parseInt(paramsUserid) }
      });
      console.log('postByAuthorId: ' + postByAuthorId);
      // delete Foreign key | POST-Author-ID = USER-ID | If found
      if (postByAuthorId) {
        const deletedPostByAuthorId = await prisma.post.delete({
          where: {
            authorId: parseInt(paramsUserid)
          }
        })
      }
    }
    catch (err) {
      console.log('Post record not found with authorId: ' + paramsUserid);
    }
    //Find Profile record by PROFILE-User-ID in PROFILE table | Validation
    try {
      const profileByUserId = await prisma.profile.findUnique({
        where: { userId: parseInt(paramsUserid) }
      });
      console.log('profileByUserId: ' + JSON.stringify(profileByUserId));
      // delete Foreign key | PROFILE-User-ID = USER-ID | If found 
      if (profileByUserId) {
        const deletedProfile = await prisma.profile.delete({
          where: {
            userId: parseInt(paramsUserid)
          }
        })
      }
    }
    catch (err) {
      console.log('Profile record not found with userId: ' + paramsUserid);
    }
    // delete User
    try {
      const deletedUser = await prisma.user.delete({
        include: {
          posts: true,
          profile: true,
        },
        where: {
          id: parseInt(paramsUserid)
        }
      })
      console.log('deletedUser: ' + JSON.stringify(deletedUser));
      return res.status(200).json(deletedUser);
    }
    catch (err) {
      console.log('Delete User record failed with Id: ' + paramsUserid);
      console.log('err: ' + JSON.stringify(err));
      return res.status(404).json(err);
    }
  }
  catch (err) {
    console.log('User record not found with id: ' + paramsUserid);
    return res.status(404).json(err);
  }


  // //Find POST record by Author-ID in POST table | Validation
  // try {
  //   const postByAuthorId = await prisma.post.findUnique({
  //     where: { authorId: parseInt(paramsUserid) }
  //   });
  //   console.log('postByAuthorId: ' + postByAuthorId);
  //   // delete Foreign key | POST-Author-ID = USER-ID | If found
  //   if (postByAuthorId) {
  //     const deletedPostByAuthorId = await prisma.post.delete({
  //       where: {
  //         authorId: parseInt(paramsUserid)
  //       }
  //     })
  //   }
  // }
  // catch (err) {
  //   console.log('Post record not found with authorId: ' + paramsUserid);
  // }


  //Find Profile record by PROFILE-User-ID in PROFILE table | Validation
  // try {
  //   const profileByUserId = await prisma.profile.findUnique({
  //     where: { userId: parseInt(paramsUserid) }
  //   });
  //   console.log('profileByUserId: ' + profileByUserId);
  //   // delete Foreign key | PROFILE-User-ID = USER-ID | If found 
  //   if (profileByUserId) {
  //     const deletedProfile = await prisma.profile.delete({
  //       where: {
  //         userId: parseInt(paramsUserid)
  //       }
  //     })
  //   }
  // }
  // catch (err) {
  //   console.log('Profile record not found with userId: ' + paramsUserid);
  // }

  // // delete User
  // const deletedUser = await prisma.user.delete({
  //   include: {
  //     posts: true,
  //     profile: true,
  //   },
  //   where: {
  //     id: parseInt(paramsUserid)
  //   }
  // })
  // console.log('deletedUser: ' + JSON.stringify(deletedUser));
  // res.status(200).json(deletedUser);
});

app.listen(3000, () => {
  console.log('Server is running at port 3000');
})
