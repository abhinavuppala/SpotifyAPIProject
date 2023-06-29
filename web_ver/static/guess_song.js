console.log(artist_tracks_json);

// converts all numbers & letters to _
function replaceLettersNumbers(str, target)
{
    return str.replace(/[a-zA-Z0-9]/g, target);
}

// pick random song/album key/value pair from the object
const keys = Object.keys(artist_tracks_json);
const rand = Math.floor(Math.random() * keys.length);
const chosen_song = keys[rand];
const chosen_album = artist_tracks_json[keys[rand]]["name"];
const chosen_cover = artist_tracks_json[keys[rand]]["cover"]["url"];

// show album cover of the chosen song
function showAlbumCover(parent_div)
{
    var cover = document.createElement("img");
    cover.setAttribute("src", chosen_cover);
    cover.setAttribute("alt", chosen_album+" album cover");
    parent_div.appendChild(cover);
}

// console.log(artist_tracks_json);
// console.log(chosen_album, chosen_song, chosen_cover, strikes);

// initialize variables for game
var current_state = replaceLettersNumbers(chosen_song, '_');
var guesses = [];
var finished;
var strikes = 0;

if (current_state == chosen_song) // no English letters/numbers in the song
{
    finished = true;
    document.getElementById("song_name_hidden").innerHTML = chosen_song;
    document.getElementById("strikes").innerHTML = "Unfortunately, this does not support songs without English letters/numbers";
}
else
{
    finished = false;
    document.getElementById("song_name_hidden").innerHTML = current_state;
    document.getElementById("strikes").innerHTML = "Strikes: 0/"+max_strikes;
}

// every time the user submits a guess
function getGuessInput()
{
    if (finished) return; // game has already ended

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

    // if song names match
    if (current_state.toLowerCase() == chosen_song.toLowerCase()) finished = true;

    // user has won
    if (finished)
    {
        finished = true;
        document.getElementById("end_message").innerHTML = "You won!";
        showAlbumCover(document.getElementById("albumCoverDiv"));
    }

    console.log(guesses);

    //document.getElementById("song_name").innerHTML = chosen_song;
    document.getElementById("song_name_hidden").innerHTML = current_state;
    document.getElementById("strikes").innerHTML = "Strikes: "+strikes+"/"+max_strikes;
    document.getElementById("guesses").innerHTML = guesses.toString();

    if (strikes >= max_strikes && !finished) // lose if strike limit reached
    {
        finished = true;
        document.getElementById("end_message").innerHTML = "You lost! The answer was "+chosen_song;
        showAlbumCover(document.getElementById("albumCoverDiv"));
    }
}