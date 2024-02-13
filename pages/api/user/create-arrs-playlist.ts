import type { NextApiRequest, NextApiResponse } from "next";
import { localStorage } from "../login-callback";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    let accessToken= localStorage.getItem("access_token")

    let response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
          Authorization: 'Bearer ' + accessToken
      }
    })
    let json = await response.json();
    const userID = json.id;

    const data = {
      "name": "arrs Playlist",
      "description": "Antirecommendation recommended playlist",
    }
    response = await fetch('https://api.spotify.com/v1/users/' + userID + '/playlists', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken
      },
      body: JSON.stringify(data)
    })

    json = await response.json();
    const songURIs = []
    // console.log(JSON.parse(req.body));

    for (let i = 0; i < JSON.parse(req.body).theTracks.length; i++) {
      songURIs.push(JSON.parse(req.body).theTracks[i].uri)
    }

    let x = {
      "uris": songURIs
    }

    response = await fetch(`https://api.spotify.com/v1/playlists/${json.uri.split(":")[2]}/tracks`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(x),
    })
  }
