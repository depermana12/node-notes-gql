import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { users } from "../db/schema/user";
import db from "../db/db";
import { eq } from "drizzle-orm";

export const createUserToken = (userId: number) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET as string);
  return token;
};

export const verifyUserToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded;
  } catch (error) {
    // TODO: error handling
    return null;
  }
};

export const findUserFromToken = async (header?: string) => {
  if (!header || !header.startsWith("Bearer ")) {
    // TODO: error handling
    return null;
  }
  const [, token] = header.split(" ");

  if (!token) {
    // TODO: error handling
    return null;
  }

  let id: number;

  try {
    const user = verifyUserToken(token) as { id: number };
    id = user.id;
  } catch (error) {
    // TODO: error handling
    console.error("invalid jwt", error);
    return null;
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
    columns: {
      id: true,
      username: true,
      email: true,
      verified: true,
    },
  });

  return user;
};

interface SignInArgs {
  email: string;
  password: string;
}

export const signIn = async ({ email, password }: SignInArgs) => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    // TODO: error handling
    return null;
  }

  // i don't know this variable name just come in my mind, spiderman pointing meme
  const isPasswordSpidermanMeme = await comparePassword(
    password,
    user.password,
  );

  if (!isPasswordSpidermanMeme) {
    // TODO: error handling
    return null;
  }

  const token = createUserToken(user.id);
  const { password: pwgaskin, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

interface SignUpArgs {
  username: string;
  email: string;
  password: string;
}

export const signUp = async ({ username, email, password }: SignUpArgs) => {
  const hashedPassword = await hashPassword(password);

  const rows = await db
    .insert(users)
    .values({ username, email, password: hashedPassword })
    .returning({
      id: users.id,
      username: users.username,
      email: users.email,
      verified: users.verified,
    });

  const user = rows[0];
  const token = createUserToken(user.id);

  return { user, token };
};

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
) => {
  return await bcrypt.compare(password, hashedPassword);
};
