ButtJS (A Discord ButtBot)
==========================
ButtJS is a homage to my favorite IRC bot in existence, the buttbot. It serves one simple purpose, comedy.

ButtJS currently pales in comparison to the original buttbots beautiful and intelligent architecture but still tends to create the same amount of laughs.

Thanks to the guys working hard on reverse engineering the discord API so I could develop this. ButtJS uses [Discord.js](https://github.com/discord-js/discord.js) to connect to [Discord](https://discordapp.com/).

I want to use this!
-------------------
Okay cool you can do that. Clone this repo and modify config.js to your liking.

Make sure to set environment variables for `DISCORD_USERNAME` and `DISCORD_PASSWORD` so we can actually connect to Discord.

You also need to now set a `DISCORD_USER_ID` if you wish to override auth for any reason.

You will need to have a Discord account that is already registered and in the channels you want the bot to work with. Right now it will buttify all channels it is in and has no real configuration but that's coming soon!

When you are ready: `node butt.js`

Contribution
------------
Look I mean this is just a side project with no real direction or effort so if you want to PR something that will make this even better I will not hesistate to accept it.

License
-------
The MIT License (MIT)

Copyright (c) <year> <copyright holders>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
