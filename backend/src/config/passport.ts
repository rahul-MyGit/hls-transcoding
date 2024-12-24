import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import prisma from '../db';

export const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: '/auth/google/callback'
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0].value;
          if (!email) {
            return done(new Error('No email found'));
          }

          let user = await prisma.user.findFirst({
            where: { OR: [{ email }, { googleId: profile.id }] }
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                email,
                username: profile.displayName || email.split('@')[0],
                googleId: profile.id
              }
            });
          } else if (!user.googleId) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: { googleId: profile.id }
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );

  return passport;
};