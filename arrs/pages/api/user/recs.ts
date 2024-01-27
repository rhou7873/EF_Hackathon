import type { NextApiRequest, NextApiResponse } from "next";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {

    let accessToken = localStorage.getItem('access_token');

    const recRes = await fetch('https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=50&offset=0', {
        headers: {
            Authorization: 'Bearer ' + accessToken
        }
    })

    const data = await recRes.json();
    const list = data.map((item: { genres: any; }) => 
        item.genres,
    )
    
    console.log(list);
    res.status(200).json(list);
    }
