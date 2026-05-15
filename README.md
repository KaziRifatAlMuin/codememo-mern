# MERN Thinkboard

## Backend Setup

Use the following steps to initialize and install the backend dependencies:

```powershell
cd backend
npm init -y
npm install express@4.18.2
```

If you see vulnerability warnings after installation, you can review them with:

```powershell
npm audit
```

To attempt an automatic fix for issues that do not require breaking changes, run:

```powershell
npm audit fix
```

## Scripts

Add the following `scripts` block to the backend package file:

```json
"scripts": {
	"test": "echo \"Error: no test specified\" && exit 1",
	"dev": "node server.js"
}
```

After that, you can start the backend with:

```powershell
npm run dev
```

This starts the server with Node.js.

## Example Server Output

When the server runs successfully, you should see:

```powershell
Server is running on port 5001
```

## Notes

- Make sure Node.js and npm are installed before running the setup commands.
- You can add more scripts later in the backend package file as needed.
# mern-thinkboard
