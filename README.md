# SpamFilter

This is a simple Spam Filter application that adds all the emails senders inside a "Trash" mailbox to a blacklist. After that, the app scans other mailboxes and delete messages from the addresses found on the blacklist.

## Installation

1. Create a `EmailAccounts.js` file and setup with the Email accounts as in the example file `EmailAccountsTemplate.js`
1. If not installed, install Node.JS version 10 or superior
1. Install the package PM2 with the command `sudo npm install -g pm2`
1. Install the application dependencies with the command `npm install`

## Running the Application

In order to run this application, execute the command `pm2 start app.js` from the root of the project.