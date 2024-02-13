import type { NextApiRequest, NextApiResponse } from "next";
import { localStorage } from "../login-callback";

const allGenres = ["acoustic", "afrobeat", "alt-rock", "alternative", "ambient", "anime", "black-metal", "bluegrass", 
    "blues", "bossanova", "brazil", "breakbeat", "british", "cantopop", "chicago-house", "children", "chill", "classical", "club", 
    "comedy", "country", "dance", "dancehall", "death-metal", "deep-house", "detroit-techno", "disco", "disney", "drum-and-bass", "dub", 
    "dubstep", "edm", "electro", "electronic", "emo", "folk", "forro", "french", "funk", "garage", "german", "gospel", "goth", "grindcore", 
    "groove", "grunge", "guitar", "happy", "hard-rock", "hardcore", "hardstyle", "heavy-metal", "hip-hop", "holidays", "honky-tonk", 
    "house", "idm", "indian", "indie", "indie-pop", "industrial", "iranian", "j-dance", "j-idol", "j-pop", "j-rock", "jazz", "k-pop", 
    "kids", "latin", "latino", "malay", "mandopop", "metal", "metal-misc", "metalcore", "minimal-techno", "movies", "mpb", "new-age", 
    "new-release", "opera", "pagode", "party", "philippines-opm", "piano", "pop", "pop-film", "post-dubstep", "power-pop", 
    "progressive-house", "psych-rock", "punk", "punk-rock", "r-n-b", "rainy-day", "reggae", "reggaeton", "road-trip", "rock", "rock-n-roll", 
    "rockabilly", "romance", "sad", "salsa", "samba", "sertanejo", "show-tunes", "singer-songwriter", "ska", "sleep", "songwriter", "soul", 
    "soundtracks", "spanish", "study", "summer", "swedish", "synth-pop", "tango", "techno", "trance", "trip-hop", "turkish", "work-out", 
    "world-music"];


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
        let accessToken = localStorage.getItem('access_token');

        const response = await fetch('https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=50&offset=0', {
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
        })

        if (response.status !== 200) {
            res.status(400).send({ error: "Error with request" })
        } else {
            const json = await response.json()
            
            const list = json.items.map((artist: any) => artist.genres)
            const percentage: number = req.query.percentage ? parseInt(req.query.percentage as string) : 0 //100 -> uncurated 0 -> curated
            const numCurated = Math.round(5 - 5 * percentage / 100)
            

            const set = new Set();
            list.forEach((innerlist: any) => {
                innerlist.forEach((item: any) => {
                    set.add(item);
                })
            })
            
            const userTopGenres = Array.from(set)
            const seedGenres = new Set()
            
            for (let i = 0; i < allGenres.length; i++) {
                let flag = false;
                for (let j = 0; j < userTopGenres.length; j++) {
                    let word = String (userTopGenres[j]).split(" ");
                    for (let k = 0; k < word.length; k++) {
                        if (word[k] === allGenres[i]) {
                            flag = true;
                            break;
                        }
                    }
                    if (flag === true) {
                        break;
                    }
                    
                }
                if (flag === false) {
                    seedGenres.add(allGenres[i]);
                }
            }

            const seedList = Array.from(seedGenres);
            
            const seeds = new Set();
            while (seeds.size < numCurated) {
                seeds.add(userTopGenres[Math.floor(Math.random() * userTopGenres.length)])
            }
            while (seeds.size < 5) {
                seeds.add(seedList[Math.floor(Math.random() * seedGenres.size)]);
            }
            const finalSeeds = Array.from(seeds);
            
            let accessToken = localStorage.getItem('access_token');
            const songs = await fetch(('https://api.spotify.com/v1/recommendations?limit=50&seed_genres=' + finalSeeds[0] + '%2C'+ finalSeeds[1] + '%2C' + finalSeeds[2] + '%2C' + finalSeeds[3] + '%2C' + finalSeeds[4]), {
                headers: {
                    Authorization: 'Bearer ' + accessToken
                }
            });
            
            const preplaylist = await songs.json();
            const playlist = preplaylist.tracks
            res.status(200).json({ tracks: playlist })
        }
    }

  
