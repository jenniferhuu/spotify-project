# Soundcheck

## Project Description

This project is a React + Vite frontend with an Express and Firebase backend for displaying data from the Spotify API. Users can view their top artists and songs, curate their own profile that other users can see, post in forums, and message other users.

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

4. You can then visit the website (typically http://localhost:5173/) in your browser.


## External Setup

We are using some external services such as the Spotify API and Firebase which require their own keys.

- [Spotify Developer API](https://developer.spotify.com/documentation/web-api)
- [Firebase](https://console.firebase.google.com/)

## How to Use Project
- The website will take you to an OAuth page where you can login with your Spotify account
- From there, explore all the features our website offers!

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
- All major features have been fully implemented.
- We have ideas for future additional features and would like to hear your thoughts on what we can implement next:
  - Letting users listen to songs together in chat
  - Making polls in the forum page
  - Group chat functionality
  - Creating a listening match algorithm when users view other public profiles

## Credits

- Built with React, Vite, Express, Axios, Tailwind CSS, and React Router.
- [Spotify Web API documentation](https://developer.spotify.com/documentation/web-api)
- Project author(s): 
  - [Jennifer Hu](https://github.com/jenniferhuu)
  - [Kien Huynh](https://github.com/kienthuynh)
  - [Kaitlyn Wei](https://github.com/Kaitlyn23254)
  - [Sajid Islam](https://github.com/sajid-m-islam)
  - [Danny Zhang](https://github.com/zhang-dny)