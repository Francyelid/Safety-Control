import { PrismaClient } from "../node_modules/@prisma/client"// "@prisma/client";

declare global {
  var prisma: PrismaClient;
}

const prisma = global.prisma || new PrismaClient();

global.prisma = prisma;

export default prisma;