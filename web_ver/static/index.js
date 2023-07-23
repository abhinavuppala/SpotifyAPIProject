// reset cookie in case they didn't use back button
clearAllCookies();

function clearAllCookies()
{
    const c = document.cookie.split(";")
    for(let i = 0; i < c.length; i++) // get all tracks parts
    {
        let cookiePair = c[i].split("=");
        document.cookie = cookiePair[0].trim()+"=;expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }
}