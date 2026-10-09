---
title: My Journey Into Network Packet Analysis
description: A concise overview of learning network packet analysis from the ground up using cli tools like tcpdump and tshark.
date: 2026-10-09
status: PUBLISH
tags:
  - linux
  - network
---

For a long time, the network stack felt like an opaque boundary. Applications sent requests, responses came back, and if something failed, it usually meant restarting a service or checking firewall rules until it worked. The underlying mechanics, how bytes moved across an interface, how state was maintained across the wire, and how protocols actually negotiated their terms, were abstract concepts found in textbook diagrams rather than observable realities.

That changed when I stopped relying entirely on application logs and started looking directly at the wire using `tcpdump`.


## Overcoming the Firehose

The first hurdle with `tcpdump` was sheer intimidation. Running the command without any flags results in an overwhelming wall of text scrolling past the terminal too fast to read. My initial attempts yielded pure noise: ARP requests, mDNS multicasts, DHCP renewals, and routine keep-alives drowning out the actual traffic I cared about.

The turning point was learning to constrain the scope. Instead of capturing everything, I needed to isolate specific interfaces and ports to make sense of the stream.

```bash
sudo tcpdump -i eth0 -nn -s0 -w capture.pcap port 443

```

Using `-nn` prevents `tcpdump` from wasting cycles on reverse DNS and port-name lookups, keeping the output strictly numeric and clean. Setting `-s0` ensures the full packet payload is captured rather than truncating at the default snapshot length.


## Watching the Handshake Live

Once I could capture clean traffic, the next step was observing connection mechanics in real time. Before diving into offline analysis, I wanted to see how protocols initiated communication right in the terminal.

Using basic expression filters, I watched a TCP connection establish itself packet by packet:

```bash
sudo tcpdump -i eth0 -nn 'tcp[tcpflags] & (tcp-syn) != 0'

```

Seeing the SYN, SYN-ACK, and ACK sequence explicitly confirmed the state machine described in documentation actually operating on my own machine. Watching sequence and acknowledgement numbers increment gave me a tangible sense of how reliable transport works over an unreliable medium, replacing theory with direct observation.


##  Inspecting Payloads and Flags

Beyond handshakes, `tcpdump` became my go-to tool for inspecting what was actually traveling inside those packets. When debugging application behavior or verifying whether traffic was encrypted, printing the contents directly to the screen was invaluable.

By enabling ASCII output and combining it with host filters, I could inspect raw headers:

```bash
sudo tcpdump -i eth0 -nn -A host 192.168.1.50 and port 80

```

This allowed me to see unencrypted HTTP traffic fly past, revealing user-agent strings, request paths, and response headers. It turned out that understanding protocol behavior becomes infinitely easier when you can read the literal bytes exchanged between client and server.


##  Leveling Up With tshark

While `tcpdump` is exceptional for raw capture and quick interactive inspection, filtering complex protocol fields or aggregating specific attributes across thousands of packets gets cumbersome. That is where `tshark`, the command-line counterpart to Wireshark, changed my workflow entirely.

`tshark` allows for deep dissection of packet fields using the same display filter syntax as Wireshark, but entirely headlessly. For instance, extracting HTTP host headers or tracking TLS SNI fields across an existing capture file became a straightforward one-liner:

```bash
tshark -r capture.pcap -Y "tls.handshake.extensions_server_name" -T fields -e ip.src -e tls.handshake.extensions_server_name

```

This command parses the capture offline, strips away the wrapper, and prints the source IP alongside the Server Name Indication from the TLS handshake. Suddenly, I could audit outbound connections from a newly installed utility without guessing what third-party endpoints it was phoning home to.


## What The Wire Taught Me

Working directly with packet captures shifted how I approach infrastructure and software engineering:

* **Assumptions are often wrong:** Applications do not always use the ports or protocols you expect. Inspecting the traffic proves what is actually happening.
* **Retransmissions tell a story:** Spotting duplicate ACKs, window full events, or out-of-order segments in capture output pinpoints latency or packet drop issues instantly.
* **State matters:** Stateful firewalls and connection tracking make much more sense once you watch connection teardowns (`FIN` and `RST` flags) traverse an interface.

If you want to move past guessing why a service is failing or how a protocol behaves under the hood, grab an interface, run a targeted capture, and read the packets.
