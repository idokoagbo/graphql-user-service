# graphql-user-service
A simple graphQL user service 


Install nodejs globally: https://nodejs.org/en/download/

# Install local dependencies
$ npm install

# Copy .env.example to .env, then fill in with your info
$ cp .env.example .env

# Spin up development environment
$ npm start


Apollo Server 3 removes GraphQL Playground (and its associated constructor option) in favor of a landing page that links to Apollo Sandbox in non-production environments. In production, it serves a simplified landing page instead.

https://studio.apollographql.com/sandbox/explorer
