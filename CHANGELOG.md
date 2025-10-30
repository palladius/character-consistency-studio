# Changelog

All notable changes to this project will be documented in this file.

## [0.0.3] - 2024-08-01

### Added
- **Image Dimensions Display**: The detailed image view now shows the width and height of the generated image, helping users understand the output resolution.

## [0.0.2] - 2024-07-31

### Added
- **Enhanced Image Viewer**: Click on a generated image to open a detailed modal view.
- **Image Actions**: The new modal includes 'Download' and 'Copy to Clipboard' buttons for easier image management.
- **Intuitive UI**: A 'view' icon now appears on hover over generated images, and a 'Back' button is present in the modal for clear navigation.
- **Version Display**: The app version is now visible in the sidebar footer.

### Fixed
- Improved UI consistency and clickability of images in the grid.

## [0.0.1] - 2024-07-30

### Added
- **Character Management**: Create and delete character profiles.
- **Reference Image Uploads**: Add 3-10 reference images per character.
- **Consistent Character Generation**: Generate new images of a character based on reference photos using `gemini-2.5-flash-image`.
- **In-App Image Editing**: Edit generated images with text prompts.
- **Standalone Image Generation**: A "Quick Generate" feature using `imagen-4.0-generate-001`.
- **Robust API Handling**: Improved error handling to prevent crashes from blocked or empty API responses.
