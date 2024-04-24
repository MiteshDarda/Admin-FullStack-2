import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersHelper {
  constructor(private readonly jwtService: JwtService) {}

  jwtTokenSignForSession(email, designation, expiri) {
    return this.jwtService.sign(
      {
        email: email,
        designation: designation,
      },
      { expiresIn: expiri },
    );
  }
}
