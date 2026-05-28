# Spotify Project

## Project Description

This project is a React + Vite frontend with an Express and Firebase backend for displaying data from the Spotify API. Users can view their top artists and songs, create a profile that other users can view, post in message boards, and message other users.

## Table of Contents

- [Project Description](#project-description)
- [Installation](#installation)
- [External Setup](#external-setup)
- [How to Use Project](#how-to-use-project)
- [Major Components and Features](#major-components-and-features)
- [Status of Those Features](#status-of-those-features)
- [Credits](#credits)

## Installation

1. Clone the repository.
2. Install the backend dependencies and start the server:

	```bash
	cd backend
	npm install
    npm start
	```

3. In another terminal, install the frontend dependencies and start the server:

	```bash
	cd frontend
	npm install
    npm run dev
	```

## External Setup

We are using some external services such as the Spotify API and Firebase which require their own configuration.

- Spotify Developer App credentials: [placeholder]
- Redirect URI / OAuth setup: [placeholder]
- Firebase configuration: [placeholder]
- Production API base URL: [placeholder]

## How to Use Project
.

## Major Components and Features

- Liked Songs Page: Displays user’s liked songs with album picture
- User’s Top Artists Page
- User’s Top Songs Page
- Profile page: users can choose to display artists and songs from their Top/Liked pages
  - Users can make their profile private or public to help users with similar tastes find them
- Discover page: displays all public users, so users can click and view others profiles and send messages
- Chat page: message other users 1:1
- Forum page: discussion boards where anyone can post, comment, or like

## Status of Those Features


## Credits

- Built with React, Vite, Express, Axios, Tailwind CSS, and React Router.
- Spotify Web API documentation: [placeholder]
- Project author(s): [placeholder]
