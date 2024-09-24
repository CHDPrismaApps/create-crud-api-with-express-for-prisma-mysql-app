const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

//*******************************************
// RUN: node script-update.cjs
//*******************************************

// package.json. add "type": "module"
// we need to rename the script-update.js to script-update.cjs


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
async function main() {
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

