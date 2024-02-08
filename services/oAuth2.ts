import { Request, Response, NextFunction } from "express";
import { google } from "googleapis";
import { findUser, createUser } from "../repositories/auth";
import { randomUUID } from "crypto";

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI,
);

const scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
  include_granted_scopes: true,
});

const redirect = (req: Request, res: Response) => {
  res.redirect(authUrl);
};

const oAuthExist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });
    const { data } = await oauth2.userinfo.get();
    if (!data) {
      return res.status(400).send("Error");
    }
    res.locals.user = data;
    next();
  } catch (err) {
    res.status(500).send(err);
  }
};

const findAndCreateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, name } = res.locals.user;
    let user = await findUser(email);
    const id = randomUUID();
    if (!user) {
      user = await createUser(id, email, null, name, null, null, true);
    }
    res.locals.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
};

export { redirect, oAuthExist, findAndCreateUser };
