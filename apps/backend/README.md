# FCT-Backend

Backend API for FIFA Career Top. Built with Node.js, Express.js.

## Dependencies:

- [Node.js](https://nodejs.org/en/download/package-manager) (Recommended
  version: 18.20.3)
- npm or [pnpm](https://pnpm.io/installation#using-other-package-managers)
- [MySQL Server](https://dev.mysql.com/downloads/installer/)

## Installation:

1. Clone the repository.
2. Run `npm install` or `pnpm install` to install the dependencies. (pnpm is
   recommended)
3. Install MySQL Server and create the table. SQL file is provided in the
   `sql/init.sql`. Or use the cloud service like AWS RDS if you prefer.
4. Copy the `.env.text` file to `.env` and fill in the required
   information.
    - If you are using local MySQL Server, you just need change the
      `MYSQL_PASSWORD` to your MySQL password.
5. Run `npm start` or `pnpm start` to start the application. (pnpm is
   recommended)

Then you can see like this:

```
info: [lib:ws/websocket-server] [ws.on_connection] WebSocket server started
info: [app] 
info: [app] App is ready on http://localhost:8888/api
info: [app] To shut it down, press <CTRL> + C at any time.
info: [app] 
info: [app] -------------------------------------------------------
info: [app] Environment  : development
info: [app] Version      : 1.0.0
info: [app] 
info: [app] API Info     : http://localhost:8888/api
info: [app] Monitor      : http://localhost:8888/monitor
info: [app] -------------------------------------------------------
info: [app] 
info: [app] Server started

```