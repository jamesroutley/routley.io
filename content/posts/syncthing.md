---
title: "Setting up Syncthing to synchronise files between computers"
date: 2020-02-21T08:48:14Z
---

I've just set up [Syncthing](https://syncthing.net/) on my home computers. It's
a program which keeps directories on different computers synchronised. It's like
Dropbox, but your data isn't shared with any third parties.

## What's it for?

I'm currently using it to synchronise documents from my laptop to my home
server, which gives a bit of redundancy if my laptop breaks or gets lost. We
should note that Syncthing isn't suitable as a proper backup application,
because changes (including deletions) are propagated to all machines. If you
accidentally delete or corrupt a file, it'll be deleted or corrupted elsewhere
too.

## MacOS setup

Setting Syncthing up on macOS is super simple:

```sh
# Install syncthing
$ brew install syncthing

# Get launchd to start syncthing now, and restart it at login
$ brew services start syncthing
```

I'd not seen `brew services` before, but it's pretty neat - it wraps Launchd to
let you easily automatically start services.

## Ubuntu setup

I installed the stable version of Syncthing. You can also install the release
channel. N.B: these installation instructions are correct as of Feb 2020, but
you should check for up-to-date instructions on their website.

```sh
# Add the release PGP keys:
$ curl -s https://syncthing.net/release-key.txt \
    | sudo apt-key add -

# Add the "stable" channel to your APT sources:
$ echo "deb https://apt.syncthing.net/ syncthing stable" \
    | sudo tee /etc/apt/sources.list.d/syncthing.list

# Update and install syncthing:
$ sudo apt-get update
$ sudo apt-get install syncthing
```

There are a couple of ways to get
[Syncthing to start automatically on Linux](https://docs.syncthing.net/users/autostart.html#linux).
I chose to do this with `systemd`, using a system service. This looks like the
most involved method, but it didn't require me to install any other applications
on Ubuntu Server 18.04, and learning how administrate servers using low-level
tools like `systemd` is part of [why I got the server](/posts/pi-hole/).

The docs linked above have more detail, but I ran:

```sh
# This is the unit file load path for system units installed by the
# administrator
$ mkdir -p /usr/local/lib/systemd/system

$ cat << 'EOF' > syncthing@.service
[Unit]
Description=Syncthing - Open Source Continuous File Synchronization for %I
Documentation=man:syncthing(1)
After=network.target

[Service]
User=%i
ExecStart=/usr/bin/syncthing -no-browser -no-restart -logflags=0
Restart=on-failure
SuccessExitStatus=3 4
RestartForceExitStatus=3 4

# Hardening
ProtectSystem=full
PrivateTmp=true
SystemCallArchitectures=native
MemoryDenyWriteExecute=true
NoNewPrivileges=true

[Install]
WantedBy=multi-user.target
EOF

$ systemctl enable syncthing@jamesroutley.service
$ systemctl start syncthing@jamesroutley.service
```

I chose to run the service as my user - I'm not really sure if that's a good
idea or not.

## Admin GUI

After you start it, the admin server will be started, which you can access at
`localhost:8384`.

![Syncthing admin page](/img/posts/syncthing/admin-ui.png)

The admin UI lets you set up folders to synchronise and check the status of
things. In the image above, I've got a single folder set up to synchronise
between this computer, and my server, which you can see under `Remote Devices`.

When you set up a folder, you specify its:

- Name
- ID
- Path

To synchronise a folder between two computers, you set up a folder on each
computer with a matching ID. You also need to pair the computers. Each one is
assigned an ID by Syncthing, and on each computer you need to mark the other as
trusted.

## Folder setup

I'm currently syncing a single folder, stored at `~/sync` on all my machines.
I'm planning on just syncing this, and using symlinks to show synchronised
subdirectories elsewhere on my filesystem. Again, I think this is how Dropbox
works (or at least is how it used to work?) - you get a single special
synchronised directory, and then hack around it with standard filesystem tools
if you need.

## Networking

My server is on my home network, and doesn't have a public IP address, so this
set up only works when my laptop is also connected to my home network. I'll be
looking into setting up Wireguard or similar to let me connect back when I'm on
different networks.
