# imagemorpher-mobile
* Mobile app for ImageMorpher built on React Native

* This repo contains the UI for the mobile imagemorpher application.  It communicates with the ImageMorpher repo for the /morph REST API

# Development
* Run `expo start --tunnel`

# User Workflow
- Upload first face
- Upload second face
- Morph to get halfway image
  - Upon success, provide option to generate the morph sequence

1. What do two buttons next to each other look like?
2. Can we squeeze both buttons into morph state button?
## Building the app
* https://github.com/osamja/imagemorpher-mobile/issues/25
* To build/deploy for web, run `expo build:web` then `cd web-build; vercel--prod`
