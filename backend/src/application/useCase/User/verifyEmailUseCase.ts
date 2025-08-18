import { UserRepoDB } from "../../../infrastructure/repositories/UserRepo";
import { VerificationTokenRepo } from "../../../infrastructure/repositories/verificationTokenRepo";
import { generateToken } from "../../services/jwtService";

export class VerifyEmailUseCase {
  constructor(private userRepo: UserRepoDB) {}
  
  async execute(email: string, verificationCode: number) {
    const verificationTokenRepo = new VerificationTokenRepo();
    
    // Verify the code
    const token = await verificationTokenRepo.getVerificationToken(email, verificationCode);
    if (!token) {
      throw new Error("Invalid or expired verification code");
    }
    
    // Update user to verified
    await this.userRepo.updateEmailVerified(email, true);
    
    // Delete the verification token
    await verificationTokenRepo.deleteVerificationTokenByEmail(email);
    
    // Get the verified user
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    
    // Generate token for the verified user
    const jwtToken = generateToken(user.id);
    
    const { password, ...publicUser } = user;
    
    return { 
      user: publicUser, 
      token: jwtToken,
      message: "Email verified successfully"
    };
  }
} 