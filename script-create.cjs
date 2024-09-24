const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

//*******************************************
// RUN: node script-create.cjs
//*******************************************

// package.json. add "type": "module"
// we need to rename the script-create.js to script-create.cjs
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
  console.log("allUsers: "+ JSON.stringify(allUsers))
  console.dir(allUsers, { depth: null })
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

