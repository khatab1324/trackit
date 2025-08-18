import { eq, and, gt, lt } from "drizzle-orm";
import { db } from "../db/connection";
import { verificationTokens } from "../db/schema/verificationsTokenSchema";

export class VerificationTokenRepo {
  async createVerificationToken(email: string, verificationCode: number): Promise<void> {
    // Delete any existing tokens for this email
    await this.deleteVerificationTokenByEmail(email);
    
    // Create new token with 10 minutes expiration
    const expires = new Date(Date.now() + 10 * 60 * 1000);
    
    await db.insert(verificationTokens).values({
      email,
      verificationCode,
      expires,
    });
  }

  async getVerificationToken(email: string, verificationCode: number): Promise<any> {
    const [token] = await db
      .select()
      .from(verificationTokens)
      .where(
        and(
          eq(verificationTokens.email, email),
          eq(verificationTokens.verificationCode, verificationCode),
          gt(verificationTokens.expires, new Date()) // Token should not be expired
        )
      );
    
    return token;
  }

  async deleteVerificationTokenByEmail(email: string): Promise<void> {
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.email, email));
  }

  async deleteExpiredTokens(): Promise<void> {
    await db
      .delete(verificationTokens)
      .where(lt(verificationTokens.expires, new Date()));
  }
} 