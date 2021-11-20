<a href="https://hypertube.aidandlim.com" title="header" alt="header">
  <img src="https://www.freeiconspng.com/uploads/youtube-icon-block-png-17.png" width="200" height="200" title="header" alt="header">
</a>

# HyperTube

> A responsive Single Page Application(SPA) using React, Node & Java

> Responsive Web Application for Streaming Video with Torrent

> A web brunch project of bootcamp named <a href="https://www.42.us.org" target="_blank">`42 Silicon Valley`</a>

## Preview

<img src="https://github.com/aidandlim/portfolio_hypertube/blob/master/PREVIEW.png?raw=true" width="100%" title="preview" alt="preview">

---

## Deployment

<br>

Hello guys, Do you want to try this project yourself on your computer? Follow the few instructions below!

<br>

**Mac Environment like 42 Silicon Valley cluster**

<br>

You can just use Makefile for installation & initialization of the project easily on the Mac environment like 42 Silicon Valley clusters.

<br>

**[1] Clone repository**

The first step is cloning git repository from GitHub using `git clone` command.

```shell
git clone https://github.com/dyobi/WEBPJT_HYPERTUBE.git && cd WEBPJT_HYPERTUBE
```

<br>

**[2] Check available make options**

You can use `make` command to check the available commands.

```shell
make
```

<br>

**[3] Initialize dependencies checking shell**

Before you run this project, you have to check if Node and Java have installed on your computer first. If you are using 42 Silicon Valley cluster's Mac, you probably can install Node using `brew` and Java using `Managed Software Center`.

```shell
node --version | java --version
```

<br>

**[4] Check environment with shell**

You can check whether Node and Java have installed or not with a `make check` command as well. This command also provides checking other environment variables such as api.js, url.js and FFMPEG.

```shell
make check
```

<br>

**[5] Set environment variables & dependency**

If `make check` command says "Something doesn't exist", you can use other make command like `make apijs` to set environment variables. In addition, `make ffmpeg` command offers automatic installation of ffmpeg for transcoding videos.

```shell
make apijs | urljs | package | ffmpeg
```

<br>

**[6] Initialize project**

You can run this project using `make start` command easily. Moreover, log files that include standard out and error are going to be stored in directory named `logs`.

```shell
make start
```

<br>

**[7] Terminate project**

When you're done, it can be terminated easily with `make end` command. It makes all servers stop automatically.

```shell
make end
```

---

## Language

> Front-end Side

- Javascript
- React
- Redux

> Back-end Side

- Java
- Spring-boot
- Node
- Express

> Database

- MySQL
- JPA

---

## Features

> Feed

- Look around movies sorted by genre or filters
- Discover movies by trends & now and upcoming
- Infinite scroll

> Search & Detail

- Search movies by movie's title
- Search movies by casts, crews, and production companies
- Provide movie's information that includes rating, production years, casting, producers, and also torrent files
- Share comments about movies with other users

> Streaming

- Stream movie by torrent before downloading is done
- Provide transcoding from mp4 to mkv
- Chat with other people watching the same movie

> User

- Sign in & Sign up with email address or a social account(oAuth) 
- Find password by email
- Change user profile & information
- Access User detail page includes user information, recent watching, and comments

---

## Live Demo

I can't serve live demo of this project online because of intellectual property rights. <br><br>
Please check the preview or download it on your computer.

---

## Luke Kim (@kilkim in 42 Silicon Valley)

- A Web developer who likes trying new things.

- Studies computer science at 42 Silicon Valley.

- Majored in mechanical Engineering.

- Contact: dyobi.92@gmail.com

---

## Aidan Lim (@dlim in 42 Silicon Valley)

- A Web & App developer who love traveling.

- Worked as a full-stack developer for 3 and a half years.

- Studies computer science at De Anza College & 42 Silicon Valley.

- Contact: aidandlim@gmail.com

---

## License

- <a href="https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html" target="_blank">`GNU General Public License v2.0`</a>
- Copyright 2020. Aidan Lim, Luke Kim. All rights reserved.
