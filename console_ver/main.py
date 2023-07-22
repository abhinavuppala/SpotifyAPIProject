import sys
import os
import base64
import json
import random
try:
  import requests  # not included in std library
except:
  sys.exit("Python error - Requests must be installed with pip")

CLIENT_ID = os.environ['CLIENT_ID']
CLIENT_SECRET = os.environ['CLIENT_SECRET']


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


artist_name = input("Artist Name: ")

token = get_token()  # get access token
res = search_for_artist(token, artist_name)
print(res)

artist_official_name = res["name"]
artist_id = res["id"]

print(f"Top songs by {artist_official_name}:")
for track in get_top_tracks_by_artist(token, artist_id):
  print(track)
  print()

# albums_json = get_albums_by_artist(token, artist_id)

# albums = {}
# for album in albums_json:
#   if album['name'] in albums: continue  # remove dupes
#   else:
#     albums[album['name']] = album['id']
#     print(album['name'], album['id'])

# print()
# print(get_songs_from_album(token, artist_official_name, albums['Born Sinner']))
"""
TO DO:
Backend functionality:
 - get all albums (no duplicates)
 - pick 10 albums (duplicates)
 - pick random song from each of these albums (no duplicates)
 - make JSON to store filters (like avoiding live 2014 FHD album)
 - add singles to random song selection (no duplicates w/prev)
 - clean up song name, easier to guess
 - get this shit off replit
Frontend:
 - find good tool for creating website
 - link Python backend to website
 - host website on domain
"""
