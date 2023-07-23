console.log(artist_tracks_json);
assignKeyboardInputs();

if (artist_tracks_json == "cookie")
{
    artist_tracks_json = getTracksFromCookie();
}
console.log(artist_tracks_json);

// combine cookies together to get all artist track info
function getTracksFromCookie()
{
    let c = document.cookie.split(";");
    let parts = {};
    for(var i = 0; i < c.length; i++) // get all tracks parts
    {
        let cookiePair = c[i].split("=");
        if (cookiePair[0].trim().substring(0, 6) == "tracks")
        {
            // console.log(cookiePair[0]);
            parts[cookiePair[0].trim()] = cookiePair[1]; // ex: tracks5
        }
    }
    // console.log(parts);
    let k = 0;
    let s = ""
    while ("tracks"+k in parts) // combine string parts
    {
        s += parts["tracks"+k];
        k++;
    }
    // console.log(s);
    return JSON.parse(decodeURIComponent(s));
}

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

function createStreakCookie(val)
{
    document.cookie = "streak="+val;
}

function resetStreakCookie()
{
    let c = document.cookie.split(";");
    let updated = false;
    for(var i = 0; i < c.length; i++)
    {
        let cookiePair = c[i].split("=");
        if (cookiePair[0].trim() == "streak")
        {
            document.cookie = "streak=0";
            updated = true;
            console.log("reset streak cookie");
        }
    }
    if (!updated) createStreakCookie(0); console.log("created Cookie w/0");
}

function increaseStreakCookie()
{
    let c = document.cookie.split(";");
    let updated = false;
    for(var i = 0; i < c.length; i++)
    {
        let cookiePair = c[i].split("=");
        if (cookiePair[0].trim() == "streak")
        {
            document.cookie = "streak="+(parseInt(cookiePair[1].trim())+1);
            updated = true;
            console.log("increased cookie by 1");
        }
    }
    if (!updated) createStreakCookie(1); console.log("created Cookie w/1");
}

function displayStreak()
{
    var scoreDiv = document.getElementById("scoreDiv");
    var scoreText = document.getElementById("scoreText");
    if (scoreText == null)
    {
        scoreText = document.createElement("h3");
        scoreDiv.appendChild(scoreText);
    }
    scoreText.innerHTML = "Streak: "+getStreak();
}

function getStreak()
{
    let c = document.cookie.split(";");
    for(let i = 0; i < c.length; i++)
    {
        let cookiePair = c[i].split("=");
        if (cookiePair[0].trim() == "streak")
        {
            return cookiePair[1].trim();
        }
    }
    return "-1";
}


// // add 1 point to score cookie, or initialize if hasnt been
// function updateScoreCookie()
// {
//     var c = document.cookie;
//     if (c == "")
//     {
//         document.cookie = "score=1";
//     }
//     else
//     {
//         var score;
//         try { score = parseInt(c.split("=")[1]) + 1; }
//         catch (e) { console.log(e); score = 1; }
//         document.cookie = "score="+score;
//     }
// }

// // deletes score cookie, called upon returning to main menu
// function deleteScoreCookie()
// {
//     document.cookie = "score=; expires=Thu, 01 Jan 1970 00:00:00 UTC"
// }

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
    cover.setAttribute("width", "80%");
    cover.setAttribute("height", "auto");
    parent_div.appendChild(cover);
}

function backButtonFunc() { window.location.href = "..";}
function reloadButtonFunc() // reloads page, and also updates repeat parameter
{
    let jsonStr = encodeURIComponent(JSON.stringify(artist_tracks_json));
    let numCookies = Math.ceil(new Blob([jsonStr]).size / 4000);
    let test = "";
    for (let i = 0; i < numCookies-1; i++)
    {
        console.log(i * 4000, (i+1) * 4000 - 1);
        document.cookie = "tracks"+i+"="+jsonStr.substring(i * 4000, (i+1) * 4000);
        test += jsonStr.substring(i * 4000, (i+1) * 4000);
    }
    console.log((numCookies - 1) * 4000, jsonStr.length);
    document.cookie = "tracks"+(numCookies-1)+"="+jsonStr.substring((numCookies - 1) * 4000, jsonStr.length);
    test += jsonStr.substring((numCookies - 1) * 4000, jsonStr.length)

    console.log(test == jsonStr);

    let current = window.location.href;
    if (current.substring(current.length - 5) == "false") current = current.substring(0, current.length - 5) + "true";
    window.location.assign(current);
}

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

    let phrase_guesses = [];
    for (const guess of guesses)
    {
        if (guess.length > 1) phrase_guesses.push(guess);
    }

    document.getElementById("guesses").innerHTML = phrase_guesses.toString();
    updateHangmanImage();
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

function updateHangmanImage()
{
    img = document.getElementById("hangman_img");
    img.src = hangman_paths[images_for_each_strike[max_strikes][strikes]];
}

// removes keyboard, input buttons, and shows album cover & score when user loses
function lose() {
    finished = true;
    document.getElementById("end_message").innerHTML = "You lost!";
    showAlbumCover(document.getElementById("albumCoverDiv"));
    loadButtons(document.getElementById("buttonsDiv"));
    removeInputElements();
    resetStreakCookie();
    displayStreak();
    document.getElementById("keyboard-cont").remove();
    showOverlay();
    document.getElementById("song_name").innerHTML = chosen_song;
}

// removes keyboard, input buttons, and shows album cover & score when user loses. Also adds a point
function win() {
    finished = true;
    document.getElementById("end_message").innerHTML = "You won!";
    showAlbumCover(document.getElementById("albumCoverDiv"));
    loadButtons(document.getElementById("buttonsDiv"));
    increaseStreakCookie();
    //updateScoreCookie();
    removeInputElements();
    displayStreak();
    document.getElementById("keyboard-cont").remove();
    showOverlay();
    document.getElementById("song_name").innerHTML = chosen_song;
}
