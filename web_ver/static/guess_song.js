console.log(artist_tracks_json);

function replaceLettersNumbers(str, target)
{
    return str.replace(/[a-zA-Z0-9]/g, target)
}

// pick random song/album key/value pair from the object
const keys = Object.keys(artist_tracks_json);
const rand = Math.floor(Math.random() * keys.length);
const chosen_song = keys[rand];
const chosen_album = artist_tracks_json[keys[rand]];

var current_state = replaceLettersNumbers(chosen_song, '_')

//document.getElementById("song_name").innerHTML = chosen_song;
document.getElementById("song_name_hidden").innerHTML = current_state;
document.getElementById("strikes").innerHTML = "Strikes: 0";

var guesses = [];
var strikes = 0;

var finished = false;

// every time the user submits a guess
function getGuessInput()
{
    if (finished) return;

    var inputElement = document.getElementById("guessInput");
    var guess = inputElement.value;
    inputElement.value = "";

    if (guess.length == 0) return; // empty guess
    else if (guess.length == 1) // single char guess
    {
        // not a number or letter guess, or repeat guess
        if ("abcdefghijklmnopqrstuvwxyz0123456789".indexOf(guess.toLowerCase()) == -1) return;
        if (guesses.includes(guess.toLowerCase())) return;
        guesses.push(guess.toLowerCase());

        changed = false;
        current_state = current_state.split("");
        for (let i = 0; i < current_state.length; i++) // find letters matching the guess
        {
            if (chosen_song[i].toLowerCase() == guess.toLowerCase())
            {
                current_state[i] = chosen_song[i];
                changed = true;
            }
        }
        current_state = current_state.join("");

        if (!changed) strikes++; // nothing was changed
    }
    else // full phrase guess
    {
        if (guesses.includes(guess.toLowerCase())) return; // avoid duplicate guesses
        guesses.push(guess.toLowerCase());

        if (guess.toLowerCase() == chosen_song.toLowerCase()) // correct guess
        {
            finished = true;
            current_state = chosen_song;
        }
        else strikes++;
    }

    if (current_state.toLowerCase() == chosen_song.toLowerCase()) finished = true;

    if (finished) document.getElementById("end_message").innerHTML = "You won!";

    console.log(guesses);

    //document.getElementById("song_name").innerHTML = chosen_song;
    document.getElementById("song_name_hidden").innerHTML = current_state;
    document.getElementById("strikes").innerHTML = "Strikes: "+strikes;
    document.getElementById("guesses").innerHTML = guesses.toString();

    if (strikes >= 6 && !finished) // lose if 6+ strikes
    {
        finished = true;
        document.getElementById("end_message").innerHTML = "You lost! The answer was "+chosen_song;
    }
}

/*
TO DO:
 - create how to play page
 - go back and forth between pages (navigation bar)
   - use inheritance?
 - restart button for same game
 - get album cover image
 - loading screen when loading game
 - CSS shit
*/