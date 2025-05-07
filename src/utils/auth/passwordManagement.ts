import bcrypt from 'bcrypt';

const saltRounds = 13;
const hashPassword = async (password: string): Promise<string> => {
  const hashedPassword: string = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

const comparePassword = async (
  hashPassword: string,
  password: string
): Promise<boolean> => {
  const pass = await bcrypt.compare(password, hashPassword);
  return pass;
};

export { hashPassword, comparePassword };
