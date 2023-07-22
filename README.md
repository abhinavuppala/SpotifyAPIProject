# Song Hangman
by Abhinav Uppala

## Languages/Frameworks Used

- [Spotify API](https://developer.spotify.com/)
- Python: [Flask](https://flask.palletsprojects.com/en/2.3.x/)
- JavaScript
- HTML
- CSS: [Bootstrap](https://getbootstrap.com/docs/3.4/css/)

## How to play

You can play Song Hangman on any browser using this link: <http://songhangman.pythonanywhere.com/>
Alternatively, if you want to download & host the server on your local device, follow these steps:

1. Save the files from this repo to your local device
2. Make sure you have the 
3. Navigate to the web_ver directory and run app.py

## How it works

On the home screen, users choose any musical artist, plus their desired difficulty & strikes in game, allowing them to customize the difficulty of the game to their liking.
In game, users can guess either a single letter/number or the entire phrase, just like in hangman. They can either use the input box or the on-screen keyboard, which updates the key
colors as the user guesses a character to indicate a correct/incorrect guess. Once the game is over, a window appears, stating whether the user won and additional details about
that game, along with additional buttons to return to the main menu or to play again.

## Features

- Responsive UI, functions & looks good on both mobile & desktop
- Uses cookies to save track info, avoid unnecessary API calls & significantly lower loading time
