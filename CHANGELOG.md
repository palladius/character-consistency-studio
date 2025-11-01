# Changelog

All notable changes to this project will be documented in this file.

## [0.0.15] - 2024-08-01

### Added
- Added an explanatory note in the image details view for "Quick Generate" images to clarify that token usage data is not provided by the Imagen 4 model API.

## [0.0.14] - 2024-08-01

### Added
- Implemented a global statistics footer displaying total images generated, total tokens used, and an estimated session cost in USD.
- Created a `config.ts` file to manage cost-per-token constants for easy updates.

### Changed
- Relocated the token usage information in the image details view to the very bottom and made it smaller to de-emphasize it.

## [0.0.13] - 2024-08-01

### Added
- Displayed token usage (prompt, output, total) for generated images in the image details view.

### Fixed
- Corrected the alignment and spacing of icons and text within the action buttons in the image viewer for a cleaner look.

## [0.0.12] - 2024-08-01

### Added
- Added a "Delete" button to the image detail viewer for easier management of generated images.

### Fixed
- Corrected a bug where keyboard shortcuts (Space, Arrow Keys) in the image viewer would trigger while typing in the "Edit Image" textarea.

## [0.0.11] - 2024-08-01

### Added
- Added two new creative suggestion prompts: one for a Japanese ink wash style and one to transform the character into a collectible action figure.

## [0.0.10] - 2024-08-01

### Changed
- Thoroughly updated the `USER_MANUAL.md` to document all recent features, including aspect ratio/cardinality selectors, regeneration, and the Quick Generate workflow.

## [0.0.9] - 2024-08-01

### Added
- Expanded the list of suggestion prompts with 8 new creative options, including fantasy, historical, and various cartoon styles to inspire more diverse image generations.

## [0.e.g.8] - 2024-08-01

### Changed
- Replaced the primary purple accent color with a vibrant yellow throughout the application for a fresh, new look and feel.

## [0.0.7] - 2024-08-01

### Changed
- Moved the "Quick Generate" button to the bottom-right of the screen to avoid overlapping with workspace UI elements.
- The "Quick Generate" modal now pre-fills the prompt with a random suggestion, making it truly "quick" to use.

## [0.0.6] - 2024-08-01

### Added
- Added a "Download" icon to generated image thumbnails for quick one-click saving.
- Implemented a "Download All" feature to export all of a character's generated images as a single `.zip` file.

## [0.0.5] - 2024-07-31

### Added
- Created a `docs/USER_MANUAL.md` to help users understand the application's features, including a detailed explanation of the "Enhance Quality" button.

### Fixed
- Stabilized the width of the left sidebar, preventing it from being squeezed into an unusable size on certain screen layouts.

## [0.0.4] - 2024-07-31

### Changed
- Replaced the non-functional "Upscale" feature with "Enhance Quality". This new feature focuses on improving image details, sharpness, and lighting at the original resolution, providing a more reliable enhancement.

## [0.0.3] - 2024-07-31

### Added
- Implemented a full-screen image viewer for a more immersive experience when inspecting generated images.
- Added image dimension (width x height) display to the image details view.
- Re-introduced version display in the sidebar footer.

## [0.0.2] - 2024-07-31

### Added
- Enhanced image modal with a professional gallery-style "canvas" border.
- Added "View", "Download", and "Copy to Clipboard" buttons for generated images.
- Added a "Back" button for easier navigation in the image modal.

## [0.0.1] - 2024-07-31

### Added
- Initial release of the Character Consistency Studio.
- Core functionality for creating characters, uploading reference images, and generating new images.
- Image editing capabilities using text prompts.
- Standalone image generation using Imagen 4.