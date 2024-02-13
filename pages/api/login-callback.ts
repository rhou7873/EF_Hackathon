import type { NextApiRequest, NextApiResponse } from "next";
import { REDIRECT_URI } from "./login";
import querystring from "query-string";
import { LocalStorage } from "node-localstorage"

const request = require("request")
export let localStorage = new LocalStorage("./scratch")

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let code = req.query.code;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code'
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + (Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'))
    },
    json: true
  };

  request.post(authOptions, function(error: any, response: any , body: any) {
    if (!error && response.statusCode === 200) {

      var access_token = body.access_token,
          refresh_token = body.refresh_token;

      var options = {
        url: 'https://api.spotify.com/v1/me',
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
      };

      localStorage.setItem('access_token', body.access_token);
      
    } else {
      res.redirect('/#' +
        querystring.stringify({
          error: 'invalid_token'
        }));
    }
  })

  res.redirect("/user_options")
}