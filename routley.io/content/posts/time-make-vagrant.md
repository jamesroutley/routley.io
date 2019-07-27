---
aliases:
- /tech/2017/06/19/time-make-vagrant
date: '2017-06-19'
layout: post
title: A system time bug with Vagrant and Make
---

I've recently been writing a Forth interpreter in x86 assembly. As my laptop
runs masOS, I'm using an Ubuntu virtual machine to compile and run my code.
I'm using [Vagrant](https://www.vagrantup.com) to manage the VM.

I experienced an issue with `Make`:

```sh
$ make clean
make: Warning: File 'Makefile' has modification time 1153 s in the future
rm -f forth forth.o
make: warning:  Clock skew detected.  Your build may be incomplete.
```

This turned out to be an issue with clock drift on the VM. If the host 
machine sleeps and then wakes up, the VM's internal clock continues from where
it left off, making the time lag behind the host.

Vagrant synchronises a directory between the host and the VM, copying over host 
changes to files. These changes include an edit date, accessible by running
`ls -lat`. I was editing the Makefile on the host machine, giving an edit time
that was in the future on the host machine. Make determines which files to 
build based on edit time, and so is sensitive to edit time issues.

Luckily, this is easy to fix. Virtualbox (which Vagrant uses under the hood)
already synchronises the time every 20 minutes, so we can solve this by 
increasing the synchronisation rate.

Find out the VM name:

```sh
$ VBoxManage ls vms
"forth_default_xxxx" {<uuid>}
# ... other VMs you may have
```

Run time synchronisation every ten seconds:

```sh
$ VBoxManage guestproperty set forth_default_xxxx \
    "/VirtualBox/GuestAdd/VBoxService/--timesync-set-threshold" 10000
```

More information on this can be found [here](https://stackoverflow.com/questions/19490652/how-to-sync-time-on-host-wake-up-within-virtualbox).
