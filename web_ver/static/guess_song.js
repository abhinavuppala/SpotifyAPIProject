console.log(artist_tracks_json);
assignKeyboardInputs();

// converts all numbers & letters to _
function replaceLettersNumbers(str, target)
{
    return str.replace(/[a-zA-Z0-9]/g, target);
}

function removeInputElements()
{
    const inputDiv = document.getElementById("guessElementsDiv");
    inputDiv.remove();
}

// add 1 point to score cookie, or initialize if hasnt been
function updateScoreCookie()
{
    var c = document.cookie;
    if (c == "")
    {
        document.cookie = "score=1";
    }
    else
    {
        var score;
        try { score = parseInt(c.split("=")[1]) + 1; }
        catch (e) { console.log(e); score = 1; }
        document.cookie = "score="+score;
    }
}

// creates/updates score on the page
function displayScore()
{
    var scoreDiv = document.getElementById("scoreDiv");
    var scoreText = document.getElementById("scoreText");
    if (scoreText == null)
    {
        scoreText = document.createElement("h3");
        scoreDiv.appendChild(scoreText);
    }
    c = document.cookie;
    if (c == "") { scoreText.innerHTML = "Score: 0"; }
    else { scoreText.innerHTML = "Score: "+c.split("=")[1]; }
}

// deletes score cookie, called upon returning to main menu
function deleteScoreCookie()
{
    document.cookie = "score=; expires=Thu, 01 Jan 1970 00:00:00 UTC"
}

// doesnt work on songs w/o features in parenthesis
// for example: WISH FEAT. KIDDO MARV
// wont implement until it has been improved
function removeFeatures(song_name)
{
    const types = ['feat.', 'with', 'ft.', 'featuring']
    const opening = "([{"
    const closing = ")]}"
    for (let i = 0; i < opening.length; i++)
    {
        for (let j = 0; j < types.length; j++)
        {
            if (song_name.toLowerCase().includes(opening[i]+types[j]))
            {
                start = song_name.toLowerCase().indexOf(opening[i]+types[j]);
                end = song_name.toLowerCase().indexOf(closing[i], start);
                var song_name_cut = song_name.substring(0, start) + song_name.substring(end+1);
                return song_name_cut;
            }
        }
    }
    return song_name;
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

function backButtonFunc() { window.location.href = ".."; deleteScoreCookie(); }
function reloadButtonFunc() { location.reload(); }

// load buttons to restart & go back
function loadButtons(parent_div)
{
    var backButton = document.createElement("button");
    var restartButton = document.createElement("button");
    backButton.setAttribute("onclick", "backButtonFunc()");
    restartButton.setAttribute("onclick", "reloadButtonFunc()");
    backButton.innerHTML = "Back";
    restartButton.innerHTML = "Restart";
    parent_div.appendChild(backButton);
    parent_div.appendChild(restartButton);
}

// console.log(artist_tracks_json);
// console.log(chosen_album, chosen_song, chosen_cover, strikes);

// initialize variables for game
var current_state = replaceLettersNumbers(chosen_song, '_');
var guesses = [];
var finished;
var strikes = 0;

var correct_letters = [];
var wrong_letters = [];

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
function getGuessInput(letter)
{   
    if (finished) return; // game has already ended

    var inputElement = document.getElementById("guessInput");
    
    if (letter === null) var guess = inputElement.value; // guess from input box
    else var guess = letter; // guess from the keyboard
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

        if (!changed) { strikes++; wrong_letters.push(guess.toLowerCase()); } // nothing was changed
        else { correct_letters.push(guess.toLowerCase()); } 
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
        win();
    }

    console.log(guesses);
    console.log("Correct: " + correct_letters);
    console.log("Wrong: " + wrong_letters);

    //document.getElementById("song_name").innerHTML = chosen_song;
    document.getElementById("song_name_hidden").innerHTML = current_state;
    document.getElementById("strikes").innerHTML = "Strikes: "+strikes+"/"+max_strikes;
    document.getElementById("guesses").innerHTML = guesses.toString();
    updateKeyboardShading();

    if (strikes >= max_strikes && !finished) // lose if strike limit reached
    {
        lose();
    }
}

// give all keys an onclick function to guess the respective letter
function assignKeyboardInputs()
{
    for (const key of document.getElementsByClassName("keyboard-button"))
    {
        key.setAttribute("onclick", "getGuessInput('"+key.innerHTML+"')");
    }
}

// update each of the keys to be the correct color
// green - correct, red - wrong, gray - not guessed
function updateKeyboardShading()
{
    for (const key of document.getElementsByClassName("keyboard-button"))
    {
        const letter = key.innerHTML;
        if (correct_letters.includes(letter.toLowerCase())) var color = 'green';
        else if (wrong_letters.includes(letter.toLowerCase())) var color = 'red';
        else var color = 'lightgray';

        key.style.backgroundColor = color;
    }
}

// removes keyboard, input buttons, and shows album cover & score when user loses
function lose() {
    finished = true;
    document.getElementById("end_message").innerHTML = "You lost! The answer was " + chosen_song;
    showAlbumCover(document.getElementById("albumCoverDiv"));
    loadButtons(document.getElementById("buttonsDiv"));
    removeInputElements();
    displayScore();
    document.getElementById("keyboard-cont").remove();
}

// removes keyboard, input buttons, and shows album cover & score when user loses. Also adds a point
function win() {
    finished = true;
    document.getElementById("end_message").innerHTML = "You won!";
    showAlbumCover(document.getElementById("albumCoverDiv"));
    loadButtons(document.getElementById("buttonsDiv"));
    updateScoreCookie();
    removeInputElements();
    displayScore();
    document.getElementById("keyboard-cont").remove();
}
