
# PixelBox

## Overview
Toolbox.js is a versatile Electron application integrated with Vue.js, designed to provide a range of utilities for image processing and search functionalities. It leverages modern web technologies to offer a desktop application experience.

## Features

### Image Processing (NCNN Management)
- **Path Selection**: Users can specify input and output paths for image processing.
- **GPU Selection**: Offers an option to select the GPU for processing (currently set to auto-select).
- **Noise Reduction**: Users can choose the level of noise reduction for the images.
- **Image Upscaling**: Supports multiple levels of image upscaling, allowing users to enhance image resolution.

### Image Search Management
- **Image Upload**: Users can upload images to perform search operations.
- **Search Engine Selection**: The application supports multiple search engines, including BaiduBCE, Trace.moe, and SauceNAO.
- **Progress Tracking**: Displays the progress of the search operation.
- **Search Results**: Presents search results with data like source, confidence level, author, and URL.

## Installation and Setup

### Prerequisites
- Node.js
- Electron

### Installing Dependencies
```bash
npm install
```

### Running the Application
```bash
npm run dev
```

### Building the Application
For different platforms:
- **Windows**: `npm run build:win`
- **macOS**: `npm run build:mac`
- **Linux**: `npm run build:linux`

## Project Structure
- **Main Process**: `src/main/index.js` - Initializes the Electron application and manages system-level interactions.
- **Preload Scripts**: `src/preload/index.js` - Safely exposes Node.js features to the renderer process.
- **Renderer Process**: `src/renderer/src/main.js` - Entry point for the Vue.js components that make up the user interface.
- **Views**:
  - NCNN Management: `src/renderer/src/views/ncnnManage/Ncnn.vue`
  - Image Search: `src/renderer/src/views/searchManage/ImgSearch.vue`

## Contributing
Contributions are welcome. Please fork the repository and submit a pull request with your changes.

## License
This project is licensed under the MIT License.
