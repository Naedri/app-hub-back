export class Config {
  public static expiresIn = process.env.JWT_EXPIRES_IN || '1h';
  public static secret = process.env.JWT_SECRET || 'secret';
  public static dbUser = process.env.SEED_USER || 'superUser'; // admin email
  public static dbPassword = process.env.SEED_PASSWORD || 'superPwd'; // admin password
  public static dbPasswordAlt = process.env.SEED_PASSWORD_ALT || 'user'; // non admin password
}
