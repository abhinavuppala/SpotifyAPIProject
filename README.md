# Song Hangman
#### by Abhinav Uppala

## Languages/Frameworks Used

- [Spotify API](https://developer.spotify.com/)
- Python: [Flask](https://flask.palletsprojects.com/en/2.3.x/)
- JavaScript
- HTML
- CSS: [Bootstrap](https://getbootstrap.com/docs/3.4/css/)

## How to play

Make sure you have a Spotify developer account in order to make requests using your own client_id and client_secret.
1. Save the files from this repo to your local device.
2. Make sure you have the correct Python libraries, as outlined in requirements.txt.
3. In client_credentials.json in the web_ver directory, change the client_id and client_secret from the placeholders.
4. Navigate to the web_ver directory and run app.py using command prompt like so:
```cmd
python app.py
```
5. There should be a link to a development server in the command prompt, like shown below. Follow this link to run the project locally.
```cmd
* Serving Flask app 'app'
 * Debug mode: on
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
...
```

## How it works

On the home screen, users choose any musical artist, plus their desired difficulty & strikes in game, allowing them to customize the difficulty of the game to their liking.
In game, users can guess either a single letter/number or the entire phrase, just like in hangman. They can either use the input box or the on-screen keyboard, which updates the key
colors as the user guesses a character to indicate a correct/incorrect guess. Once the game is over, a window appears, stating whether the user won and additional details about
that game, along with additional buttons to return to the main menu or to play again.

## Features

- Responsive UI, functions & looks good on both mobile & desktop
- Uses cookies to save track info, avoid unnecessary API calls & significantly lower loading time
- Easily customizable difficulty through changing strikes & possible songs
- On-screen keyboard making mobile gameplay smoother & providing visual feedback

## Screenshots

![Home Page](https://github.com/abhinavuppala/SpotifyProject/assets/64037392/429e2c45-eb65-47fe-a987-3eee66cd0a45)
The user can pick any artist of their choice from Spotify, and change difficulty and amount of strikes to vary the overall difficulty of the game


![Game (No Guesses)](https://github.com/abhinavuppala/SpotifyProject/assets/64037392/35ca34bf-d292-4b0c-8251-07dbd3511c4c)
Players can submit full phrase guesses or guess individual letters at a time, either by clicking the on-screen keyboard or typing in the input box


![Game (Some Guesses)](https://github.com/abhinavuppala/SpotifyProject/assets/64037392/894db5fa-f15d-4157-878e-5d5316dd3772)
Correct and incorrect letters are shown through the keyboard's color changing, along with the hangman gradually approaching completion & the song name revealing


![Win Screen](https://github.com/abhinavuppala/SpotifyProject/assets/64037392/0eb7c8c7-6051-420d-9a1c-408e93421771)
![Lose Screen](https://github.com/abhinavuppala/SpotifyProject/assets/64037392/24623122-af52-4ca8-9317-58750c7faeeb)
Upon winning or losing the game, the full song name and album cover are shown, along with keeping track of the player's current winstreak using cookies. The user gets options to go back to the home screen or to restart the game with the same artist & difficulty settings.

Home Screen | Game Screen | Win/Lose Screen
:--- | :---: | ---:
![sh_responsive_1](https://github.com/abhinavuppala/SpotifyProject/assets/64037392/5d9f962c-94a6-4788-a5ae-8fec60657d64) | ![sh_responsive_2](https://github.com/abhinavuppala/SpotifyProject/assets/64037392/f38a7796-5de6-4459-8643-7170c306ca7d) | ![sh_responsive_3](https://github.com/abhinavuppala/SpotifyProject/assets/64037392/11166b36-f21b-49da-b51d-8f9d438856f4)
<img src="https://github.com/abhinavuppala/SpotifyProject/assets/64037392/5d9f962c-94a6-4788-a5ae-8fec60657d64" alt="drawing" width="200"/> | <img src="https://github.com/abhinavuppala/SpotifyProject/assets/64037392/f38a7796-5de6-4459-8643-7170c306ca7d" alt="drawing" width="200"/> | <img src="https://github.com/abhinavuppala/SpotifyProject/assets/64037392/11166b36-f21b-49da-b51d-8f9d438856f4" alt="drawing" width="200"/>
The website is fully responsive, working on screens of all sizes and dimensions, through utilization of Bootstrap CSS
