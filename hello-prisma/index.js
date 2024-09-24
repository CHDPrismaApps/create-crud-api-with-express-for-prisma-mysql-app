const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

//*******************************************
// RUN: node index.js
// 1. Create
// 2. FindMany
// 3. Update
//*******************************************


// To void: Unique constraint failed on the constraint: `User_email_key`
// add: timestampe after the 'alice'
// email: 'alice'+Math.floor(Date.now() / 1000)+'@prisma.io',
// SEE: prisma.schema.prisma:
// model User {
//   id      Int      @id @default(autoincrement())
// ...
//   email   String   @unique
// }
async function main() {
  // Create User 	
  await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice' + Math.floor(Date.now() / 1000) + '@prisma.io',
      posts: {
        create: { title: 'Hello World' },
      },
      profile: {
        create: { bio: 'I like turtles' },
      },
    },
  })

  // Find all Users
  const allUsers = await prisma.user.findMany({
    include: {
      posts: true,
      profile: true,
    },
  })
  console.dir(allUsers, { depth: null })


// SEE: prisma.schema.prisma:
// model Post {
// ....
//   id        Int      @id @default(autoincrement())
//   author    User     @relation(fields: [authorId], references: [id])
// }
//
// model Profile {
//...
//   id     Int     @id @default(autoincrement())
//   user   User    @relation(fields: [userId], references: [id])
// }
// model User {
//   id      Int      @id @default(autoincrement())
//   email   String   @unique
//   name    String?
//   posts   Post[]
//   profile Profile?
// }
  //Find last inserted POST record by ID in POST table
  const postDesc = await prisma.post.findMany({
    orderBy: {
      id: 'desc',
    },
    take: 1,
  })
  console.log("postDesc: " + JSON.stringify(postDesc));
  console.log("postDesc[0].id: " + postDesc[0].id);
  
  // Update First Decs POST record
  const updatedPost = await prisma.post.update({
    where: { id: postDesc[0].id},
    data: { published: true },
  })
  console.log("updatedPost: "+ JSON.stringify(updatedPost));
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

