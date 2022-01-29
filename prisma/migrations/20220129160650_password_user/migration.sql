-- CreateTable
CREATE TABLE "Password" (
    "id" SERIAL NOT NULL,
    "password" TEXT NOT NULL,
    "creatorId" INTEGER NOT NULL,

    CONSTRAINT "Password_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordsOnUsers" (
    "userId" INTEGER NOT NULL,
    "passwordId" INTEGER NOT NULL,

    CONSTRAINT "PasswordsOnUsers_pkey" PRIMARY KEY ("userId","passwordId")
);

-- AddForeignKey
ALTER TABLE "Password" ADD CONSTRAINT "Password_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordsOnUsers" ADD CONSTRAINT "PasswordsOnUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordsOnUsers" ADD CONSTRAINT "PasswordsOnUsers_passwordId_fkey" FOREIGN KEY ("passwordId") REFERENCES "Password"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
