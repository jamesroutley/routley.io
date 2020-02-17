---
title: "Home server and Pi-hole"
date: 2020-02-17T23:11:20Z
---

I recently bought a small (10 by 10cm), cheap (~£100) computer to use as a home
server. It's got 4GB of RAM and 60GB of disk, so not very powerful, but not
terrible either. I got it to get some experience with classical system
administration. At work everything is containerised and runs in Kubernetes, so I
don't actually have much experience managing linux servers the traditional way.

## Operating system

I installed Ubuntu Server 18.04 (the latest long term support version) by
booting from a USB stick then following the standard installation instructions.

## Network

I plugged an Ethernet cable into the computer, but couldn't connect to the
internet. It turns out Ubuntu Server doesn't have network connectivity set up by
default. We need to enable DHCP for our Ethernet interface to let our DHCP
server (managed by our router) automatically assign us an IP address.

Let's get our Ethernet interface ID:

```sh
$ ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
2: enp1s0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether 68:1d:ef:19:47:14 brd ff:ff:ff:ff:ff:ff
    inet 192.168.1.104/24 brd 192.168.1.255 scope global enp1s0
       valid_lft forever preferred_lft forever
    inet6 fe80::6a1d:efff:fe19:4714/64 scope link
       valid_lft forever preferred_lft forever
```

`enp1s0` is the interface we're interested in.

We can then enable DHCP for it by adding the following file:

```yaml
# /etc/netplan/99_config.yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    enp1s0: # ethernet interface ID we found above
      dhcp4: true
```

## Pi-hole

Pi-hole is an ad-blocking DNS server. DNS converts domain names to IP addresses.
Pi-hole does this conversion, but doesn't respond to requests for IP addresses
of known advertising domain names.

It's neat because most devices use a network-assigned DNS server by default. If
you set up Pi-hole on your network, all devices on it will get ad blocking for
free.

You can get more info and installation instructions about Pi-hole
[on their website](https://pi-hole.net/).

To set Pi-hole up, you install it on a server on your network. You then
configure your router's DHCP settings to use the Pi-hole server's IP address as
the DNS server it gives to clients.

## Router

The router I got from my ISP doesn't support configuring DHCP, so I bought a new
TP-Link router for ~£30. To set up Pi-hole:

1. Set up a DHCP address reservation, so our server running Pi-hole has a static
   IP address
2. Set DPCP client server to be the static IP address configured in step 1

Clients using your network should start using Pi-hole as their DNS server. DHCP
configuration is cached for a period of time, so you might need to renew your
DHCP lease before the changes are registered by clients. Your device might let
you explicitly renew the lease, or you can just disconnect and reconnect to the
network.
