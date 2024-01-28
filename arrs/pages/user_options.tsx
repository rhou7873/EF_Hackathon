import React, { useEffect, useState } from 'react'
import { Stack, Typography, Slider, Box, Button } from "@mui/material"
import { styled } from "@mui/material/styles"
import Paper from '@mui/material/Paper'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#1A2027',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: "white",
}));

function user_options() {
  const [percentage, setPercentage] = useState(100)
  const [tracks, setTracks] = useState([])

  useEffect(() => {
    console.log(percentage)
  }, [percentage])

  let getGenres = () => {
    fetch(`/api/user/recs?percentage=${percentage}`)
      .then(response => {
        response.json().then(json => {
          console.log(json)
          setTracks(json.tracks)
        })
      })
  }

  let createPlaylist = () => {
    console.log(tracks)
    let allTracks = { theTracks: tracks }
    fetch('/api/user/create-arrs-playlist', {
      method: 'POST',
      body: JSON.stringify(allTracks)
    })
  }

  return (
    <Box padding={8}>
        <Typography variant="h2">User Options</Typography>
        <Box paddingTop="3em" paddingX="5em">
            <Typography variant="h5">Percentage of Intervention</Typography>
            <Slider onChangeCommitted={(_, value: any) => setPercentage(value)} min={0} max={100} valueLabelDisplay="auto" />
            <Button onClick={getGenres} variant="outlined">Generate New Tracks</Button>
        </Box>
        <Box marginTop={10}>
          {tracks.length > 0 &&
            <>
              <Typography variant="h4">Your Anti-Recommended Recommended Playlist ({tracks.length}):</Typography>
              <Stack marginTop={3} spacing={1}>
                {tracks.map((track: any) => {
                  console.log(track)
                  return <Item key={track.name}>{track.name}: {track.artists[0].name}</Item>
                })}
              </Stack>
              <Button variant="outlined" color="error" onClick={createPlaylist}>Create Spotify Playlist</Button>
            </>
          }
        </Box>
    </Box>
  )
}

export default user_options