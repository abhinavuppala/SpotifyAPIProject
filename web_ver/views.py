from flask import Blueprint, render_template, request, jsonify, redirect, url_for
import requests, json, base64

views = Blueprint(__name__, 'views')

# DELETE THESE LATER !!!!!!
CLIENT_ID = "093ad87f19ba4bf196af70d9a426eb90"
CLIENT_SECRET = "329b53b645d24216b78160b5ceeb656f"

# get access token from Spotify
def get_token():

  # Encode Client ID & Secret in Base 64
  auth_string = CLIENT_ID + ":" + CLIENT_SECRET
  auth_bytes = auth_string.encode("utf-8")
  auth_base64 = str(base64.b64encode(auth_bytes), "utf-8")

  url = "https://accounts.spotify.com/api/token"
  headers = {
    "Authorization": "Basic " + auth_base64,
    "Content-Type": "application/x-www-form-urlencoded"
  }
  data = {"grant_type": "client_credentials"}

  # returns JSON for access information, extract token
  result = requests.post(url, headers=headers, data=data)
  json_result = json.loads(result.content)
  token = json_result["access_token"]
  return token

# get access headers for requesting info using token
def get_auth_header(token):
  return {"Authorization": "Bearer " + token}

# search for artist given an artist_name (str)
def search_for_artist(token, artist_name):
  url = "https://api.spotify.com/v1/search"
  headers = get_auth_header(token)
  query = f"?q={artist_name}&type=artist&limit=1"
  # limit to top artist of that name only

  query_url = url + query
  result = requests.get(query_url, headers=headers)
  json_result = json.loads(result.content)['artists']['items']
  if len(json_result) == 0:
    print("No artist with this name exists")
    return None

  return json_result[0]

# using artist ID, get top tracks by the artist
def get_top_tracks_by_artist(token, artist_id):
  url = f"https://api.spotify.com/v1/artists/{artist_id}/top-tracks?country=US"
  headers = get_auth_header(token)
  result = requests.get(url, headers=headers)
  json_result = json.loads(result.content)['tracks']
  return json_result

# using artist ID, get albums by the artist
def get_albums_by_artist(token, artist_id):
  url = f"https://api.spotify.com/v1/artists/{artist_id}/albums?include_groups=single,album&market=US"
  headers = get_auth_header(token)
  result = requests.get(url, headers=headers)
  json_result = json.loads(result.content)['items']

  #print(json_result)
  return json_result


# given JSON of albums, get all tracks from them
def get_songs_from_album(token, artist_name, album_id):
  tracks = {}
  url = f"https://api.spotify.com/v1/albums/{album_id}/tracks"
  headers = get_auth_header(token)
  result = requests.get(url, headers=headers)
  json_result = json.loads(result.content)['items']

  for track in json_result:
    # get track info for each album
    artists = list(map(lambda a: a['name'], track['artists']))
    if artist_name != artists[0]: continue  # skips features
    if track['name'] in tracks: continue  # skips duplicates
    tracks[track['name']] = track
  return tracks

# ==============================================================================

@views.route('/')
def home():
    return render_template('index.html')

@views.route('/testing')
def base():
    return render_template('base.html')

# website.com/[name#diff]
# for example: ...com/kendrick%20lamar6easy
@views.route('/<info>')
def game(info):
    try:
       name, strikes, difficulty = info[:-5], info[-5], info[-4:]
    except: # link is not long enough, goes back to home page
       return render_template('index.html')
    try:
       strikes = int(strikes)
       if strikes < 1 or strikes > 9: print(int("lol"))
    except: # defaults to 6 strikes if its not an int
       strikes = 6
    # defaults to easy difficulty
    if difficulty.lower() not in ['easy', 'hard']: difficulty = 'easy'

    print(name, strikes, difficulty)
    if difficulty.lower() == "hard":
        artist_name, all_tracks = get_tracks_hard(name)
    else:
        artist_name, all_tracks = get_tracks_easy(name)

    return render_template('guess_song.html', artist_name=artist_name, artist_tracks_json=all_tracks, max_strikes=strikes)

def get_tracks_hard(name):
    token = get_token()
    artist_info = search_for_artist(token, name)
    artist_id, artist_name = artist_info['id'], artist_info['name']
    albums_json = get_albums_by_artist(token, artist_id)

    # make this better - certain albums to avoid
    album_ignore_list = ["Forest Hills Drive: Live from Fayetteville, NC"]

    # for each album, requests all tracks & saves them
    albums = {}
    all_tracks = {}
    for album in albums_json:
      if album['name'] in albums: continue  # remove dupes
      if album['name'] in album_ignore_list: continue  # certain ones to ignore
      else:
        albums[album['name']] = album['id']
        # print(album['name'], album['id'])
        album_tracks = get_songs_from_album(token, artist_name, album['id'])
        if len(album_tracks.keys()) == 0: continue
        for track in list(album_tracks.keys()):
          all_tracks[track] = {"name": album['name'], "cover": album['images'][0]}
    return artist_name,all_tracks

# # website.com/artist/[name]
# @views.route('/artist/<name>')
def get_tracks_easy(name):
    token = get_token()
    artist_info = search_for_artist(token, name)
    artist_id, artist_name = artist_info['id'], artist_info['name']
    tracks_json = get_top_tracks_by_artist(token, artist_id)
    top_tracks = {}
    # print(track['name'], track['album']['name'],
    #     track['album']['images'][0])  # album cover for easy
    for track in tracks_json:
      top_tracks[track['name']] = {"name": track['album']['name'], "cover": track['album']['images'][0]}
    return artist_name, top_tracks
      

# # website.com/profile/[username]
# @views.route('/profile/<username>')
# def profile(username):
#     return render_template('index.html', name=username)

# # website.com/profile?name=[username]
# @views.route('/profile2')
# def profile2():
#     args = request.args
#     name = args.get('name')
#     return render_template('index.html', name=name)

# @views.route("/json")
# def get_json():
#     return jsonify({'name': 'bozo'})

# @views.route("/go-to-home")
# def go_to_home():
#     return redirect(url_for("views.profile2"))