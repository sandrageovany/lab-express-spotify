require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const path= require('path');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(path.join(__dirname, 'views/partials'))
// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', async (req,res)=>{
    res.render('home');
});

app.get('/artist-search', async (req, res) => {
  //Query param
  try{
  
  let result = await spotifyApi.searchArtists(req.query.theArtistName);     
  //console.log('The received data from the API: ', result.body);
  let artists= result.body.artists.items;
  // artists.forEach((artist)=>{
  //   console.log(artist);
  // })
  res.render('search-result',{artists});
  

  }
  catch(error){
console.log(error);
  }
});

app.get('/albums/:artistId', async (req, res) => {
  try{
    let result= await spotifyApi.getArtistAlbums(req.params.artistId);
    
    let albums=result.body.items;

    res.render('albums',{albums});

  }
  catch(error){
    console.log(error);
  }
  
});
app.get('/tracks/:albumId', async (req, res) => {
  try{
    let result= await spotifyApi.getAlbumTracks(req.params.albumId);
 
    let tracks=result.body.items;

    res.render('tracks',{tracks});

  }
  catch(error){
    console.log(error);
  }
  
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
