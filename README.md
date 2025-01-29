# webRTC demo

Group chat / one-on-one video chat app.

## Using the app

This app takes two or more to tango. It displays messages sent to the public chat stream on the main page. To video chat with another user, click the camera icon by their name in the chat stream. If they accept your invitation, you will both be moved to a private room and a call will begin.

## Technologies

### PeerJS

WebRTC connections are facilitated with PeerJS, which abstracts most of the connection setup and allows conenctions with just an id and a few listeners. PeerJS is a long established open source product, a good solution for establishing WebRTC connections barring a need for more granular control over signaling.

The app is currently using their free signaling server. In production, their server would be swapped out for a private signaling server, which could be as easy as deploying their open source server code. PeerJS is in no way necessary, but the abstractions over the signaling portion of the process make are great to work with until something more robust is needed.

### Firestore

Firestore realtime is great for running a chat applciation and facilitating chat invitations. The NoSQL model is great for rapid development. This could easily be swapped with Supabase as the data models are refined, or any other database and a WebSocket connection. But simple setup and quick realtime updates Firestore is hard to beat.

## ICE servers

This app relies on whatever ICE servers the free PeerJS server uses. For an enterprise product, this is unnaceptable. It would be best to self-host STUN and TURN servers or rely on BaaS hosts who provide them, particularly with TURN servers where their geographic proiximity is vital to low-latency connections.

## Issues

- There's no authentication, which is a pretty big one. Auth would be straightforward to add through Firestore but I haven't gone down that road yet.

- The public PeerJS server is a pretty big issue. None of the actual WebRTC data is routed through their sever, but the data that is routed through their is unsecured and I have no control over that server's uptime or latency or anything else.

- There are many little bugs and unusual behaviors still, plus CSS problems. I decided to try Tailwind CSS for the first time on this project and it's been pretty cool but I'm still getting used to it.
