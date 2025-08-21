# SnapSheet

SnapSheet is a React-based web application for composing, previewing, and exporting custom layouts as PDFs. Built with Vite for fast development and modern tooling, it features image uploading, layout toggling, paper settings, and PDF export functionality.

## Features
- **Image Uploader:** Upload and manage images for your layout.
- **Layout Mode Toggle:** Switch between different layout modes (e.g., portrait/landscape).
- **Layout Preview:** Preview your composition before exporting.
- **Paper Settings:** Adjust paper size and orientation for export.
- **Export to PDF:** Download your layout as a PDF file.

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm

### Installation
1. Clone the repository:
	```powershell
	git clone https://github.com/ChiragRathod25/SnapSheet.git
	cd SnapSheet
	```
2. Install dependencies:
	```powershell
	npm install
	```

### Running the App
Start the development server:
```powershell
npm run start
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the app.

### Building for Production
```powershell
npm run build
```
The production-ready files will be in the `dist` folder.

## Project Structure
```
src/
  App.jsx            # Main application component
  components/        # Reusable UI components
  utils/             # Utility functions
  assets/            # Static assets (images, etc.)
  App.css, index.css # Stylesheets
public/              # Static public files
```

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License.
