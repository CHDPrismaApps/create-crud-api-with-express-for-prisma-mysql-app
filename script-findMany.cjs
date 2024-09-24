const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

//*******************************************
// RUN: node script-findMany.cjs
//*******************************************

// package.json. add "type": "module"
// we need to rename the script-findMany.js to script-findMany.cjs

async function main() {
  // ... you will write your Prisma Client queries here
  const allUsers = await prisma.user.findMany()
  console.log(JSON.stringify(allUsers))
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

