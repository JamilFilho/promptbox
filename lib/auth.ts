import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

/**
 * Criptografa uma senha usando bcrypt
 * @param password - Senha em texto plano
 * @returns Hash da senha criptografada
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compara uma senha em texto plano com um hash
 * @param password - Senha em texto plano
 * @param hash - Hash da senha armazenada no banco
 * @returns true se a senha corresponde ao hash, false caso contrário
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
