# Toddler Learning App

![React](https://img.shields.io/badge/React-19.2.8-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-8.2.0-646CFF?logo=vite)
![Node](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?logo=mysql)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Images-3448C5)

This project is a React-based educational app built for children to learn through visual categories such as fruits, vegetables, animals, birds, letters, body parts, and shapes. The app includes a dashboard, a learning view, and an edit section for managing content.

## Project Preview

Add a screenshot or GIF of the app here to show the dashboard, learning page, or edit page.

```md
![Toddler Learning App Preview](./assets/preview.png)
```

## Features

- Home dashboard navigation
- Learning page with category-based browsing
- Image-based learning cards for visual recognition
- Protected edit section for content management
- Simple admin login flow
- Toast notifications for user feedback
- Backend API integration for data access

## Tech Stack

- React
- Vite
- React Router
- Axios
- React Hot Toast
- React Icons
- Express + MySQL backend

## Project Structure

```bash
toddler_react/
├── Frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Edit.jsx
│   │   ├── Learn.jsx
│   │   ├── Login.jsx
│   │   ├── api.js
│   │   ├── css/
│   │   └── assets/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── README.md
│
├── Backend/
│   ├── server.js
│   ├── package.json
│   └── .env
└── README.md (optional root-level overview)
```

## Prerequisites

Make sure the following are installed:

- Node.js 18+
- npm
- MySQL database
- Cloudinary account for image uploads (used by the backend)

## Environment Setup

Create a `.env` file inside the `Backend` folder with the following values:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=toddler_app
PORT=8081
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

The backend expects a MySQL table named `items` with columns such as:

```sql
CREATE TABLE items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  img TEXT,
  no_t VARCHAR(255),
  color TEXT,
  place TEXT,
  nut_sc TEXT,
  gt TEXT,
  category VARCHAR(255)
);
```

## Installation

### Frontend

```bash
cd Frontend
npm install
```

### Backend

```bash
cd Backend
npm install
```

## Run the Application

Start the backend first:

```bash
cd Backend
npm start
```

Then start the frontend in another terminal:

```bash
cd Frontend
npm run dev
```

The frontend uses `http://localhost:8081` by default as the API base URL. If needed, it can also read a custom value from a frontend environment variable:

```env
VITE_API_URL=http://localhost:8081
```

## Login Details

The app contains a simple login screen for editing content.

- Username: `bala`
- Password: `guru`

## Build for Production

### Frontend

```bash
cd Frontend
npm run build
```

This creates a production build in the `dist` folder.

### Preview Production Build

```bash
cd Frontend
npm run preview
```

## Notes

- The learning and edit screens depend on the backend running successfully.
- The app loads data from the backend via `src/api.js`.
- The edit page is protected with a session flag (`sessionStorage`), so it only works after login.
- Images are uploaded to Cloudinary through the backend.

## Contribution Guidelines

Contributions are welcome. To contribute:

1. Fork the project.
2. Create a feature branch.
3. Make your changes.
4. Test the frontend and backend locally.
5. Submit a pull request with a clear summary.

Keep changes focused and document any new environment variables or database setup requirements.

## Troubleshooting

If the app does not load data:

- confirm the backend is running
- check the MySQL database connection
- verify the `.env` values in `Backend/.env`
- confirm `items` table exists in MySQL
- check the browser console and backend terminal logs

## License

This project is intended for educational use and does not currently include a formal production license.
