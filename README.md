# imagemorpher-mobile
* Mobile app for ImageMorpher built on React Native

* This repo contains the UI for the mobile imagemorpher application.  It communicates with the ImageMorpher repo for the /morph REST API

# Development
* Run `npx expo start --tunnel`
* For web, we may have to use the IP address instead of localhost. i.e. `http://172.19.177.199:19006`

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

# TODO
- [ ] Rewrite the backend API to be async.  Currently, the backend API is synchronous.  This is causing the UI to stay in the loading state when the user clicks the morph button and then minimizes the app.  We need to make the backend API async so that user can click the morph button and then minimize the app.  The backend API should then continue to run in the background and send a notification to the user when the morph is complete.  The user can then click the notification to open the app and view the morphed image.  Once this is done, the isSequence flag should be set to true in the morph request and the user should be able to click the morph button again to generate the morph sequence.
