// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import querystring from "query-string";

export const REDIRECT_URI = "https://arrs.vercel.app/api/login-callback"
export const SCOPE = "user-top-read playlist-modify-public playlist-modify-private"

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const RESPONSE_TYPE = "code"

  const redirect = res.redirect("https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: RESPONSE_TYPE,
      client_id: process.env.CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: SCOPE
    }))
}



