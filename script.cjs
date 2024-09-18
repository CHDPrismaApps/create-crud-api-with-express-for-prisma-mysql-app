const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


// package.json. add "type": "module"
// we need to rename the script.js to script.cjs
// RUN --> node script.cjs 

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

  const allUsers = await prisma.user.findMany({
    include: {
      posts: true,
      profile: true,
    },
  })
  console.dir(allUsers, { depth: null })
}


async function mainFindMany() {
  // ... you will write your Prisma Client queries here
  const allUsers = await prisma.user.findMany()
  console.log(JSON.stringify(allUsers))
}

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
async function mainUpdateLastPostRecord() {
  //Find last inserted POST record by ID in POST table
  const postDesc = await prisma.post.findMany({
    orderBy: {
      id: 'desc',
    },
    take: 1,
  })
  console.log("postDesc: " + JSON.stringify(postDesc));
  console.log("postDesc[0].id: " + postDesc[0].id);
  const post = await prisma.post.update({
    where: { id: postDesc[0].id},
    data: { published: true },
  })
  console.log(post)
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

mainFindMany()
  .then(async () => {
    console.log("**********************************************************************");
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

mainUpdateLastPostRecord()
  .then(async () => {
    console.log("**********************************************************************");
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
