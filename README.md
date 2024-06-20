# multi-purpose-backend-demo

If you want to test it, click the button below:

[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://god.gw.postman.com/run-collection/20378446-3eb76992-573f-49d9-98e8-c5fdc06c56d7?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D20378446-3eb76992-573f-49d9-98e8-c5fdc06c56d7%26entityType%3Dcollection%26workspaceId%3Da9c8167b-3118-4dfa-9bad-8135cdc20147)


# Multi-purpose Backend DEMO

## Overview
**Name:** Kyrillos Maher Fekry  
**Project Name:** Multi-purpose Backend DEMO  
**Version:** 1.0  

This project is a versatile backend service designed for multiple projects. It includes functionalities such as authentication, authorization, CRUD operations, email sending, web sockets, user management, and more.

## Setup Instructions

### Prerequisites
- **Node.js**: Ensure you have Node.js installed. You can download it from [Node.js](https://nodejs.org/).
- **Yarn**: You can install Yarn globally using npm:
  ```bash
  npm install -g yarn
  ```
- **MongoDB**: Install MongoDB from [MongoDB Community Edition](https://www.mongodb.com/try/download/community-edition).

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies**:
   Using Yarn:
   ```bash
   yarn install
   ```
   Or using npm:
   ```bash
   npm install
   ```

3. **Create and configure `config.env` file**:
   In the root directory of the project, create a `config.env` file and add the following environment variables:

   ```env
   NODE_ENV=development 
   PORT=3000

   # MongoDB Atlas Cloud Database
   DATABASE=yourAtlasLinkHere 
   DATABASE_PASSWORD=yourAtlasPasswordHere

   # Local MongoDB Database
   DATABASE_LOCAL=yourLocalDBLinkHere

   JWT_COOKIE_EXPIRES_IN=90

   # Mail Service Configuration (using Mailtrap as an example)
   EMAIL_USERNAME=yourEmailUsernameHere
   EMAIL_PASSWORD=yourEmailPasswordHere
   EMAIL_HOST=sandbox.smtp.mailtrap.io
   EMAIL_PORT=587
   ```

4. **Run the project**:
   ```bash
   yarn dev
   ```

## Project Structure

```plaintext
├── bun.lockb
├── config.env
├── package-lock.json
├── package.json
├── public
│   └── socket.io.min.js
├── src
│   ├── app.ts
│   ├── core
│   │   ├── controllers
│   │   ├── types
│   │   └── utils
│   ├── dev
│   │   ├── bookings.json
│   │   ├── cabins.json
│   │   ├── guests.json
│   │   ├── import-dev-data.ts
│   │   ├── settings.json
│   │   └── users.json
│   ├── features
│   │   ├── authentication
│   │   ├── bookings
│   │   ├── cabins
│   │   ├── chat
│   │   ├── friends
│   │   ├── guests
│   │   ├── posts
│   │   ├── settings
│   │   └── users
│   ├── localhost-key.pem
│   ├── localhost.pem
│   └── server.ts
├── tsconfig.json
└── xss-clean.d.ts
```

## Features
- **Authentication and Authorization**
- **CRUD Operations**
- **Email Sending**
- **Web Sockets**
- **User Management**
- And more...

## Notes
- Make sure to replace placeholders in the `config.env` file with actual values.
- The project uses MongoDB for database management. Ensure MongoDB is running and properly configured.



