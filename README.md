# Chat Says: landing page demo

**Live page:** https://trommelochse.github.io/chat-says-demo/

A demo landing page for Chat Says, a planned web tool for live streamers. Viewers just talk in chat in their own words. Chat Says counts the votes, turns opinions into a score, catches real questions, and warns the streamer when several viewers say "no audio". It only reads chat and never touches the video.

Everything on this page is simulated in the browser: the chat, the AI, the login and OBS. Nothing connects to Twitch or anywhere else.

Not made by or affiliated with Twitch.

## Run locally

```
python3 -m http.server
```

Then open http://localhost:8000.
