# imagemorpher-mobile
Mobile app for ImageMorpher built on React Native

This repo contains the UI for the mobile imagemorpher application.  It communicates with the ImageMorpher repo for the /morph REST API

MVP
- Opens app
- Two upload buttons, one morph button
- Clicking upload button allows user to choose image.
- Morph button will have 3 states
 * Default state
  - text set to "MORPH"
   - onPress runs getMorph function 
   - onPress set to open linked image.
 * Loading state
  - tet set to "LOADING"
  - onPress disabled
 * Success state 
  - text set to "GET MORPHED IMAGE"
  - onPress set to open linked image & resets to default state.
 * Failure state
  - text set to "MORPH FAILED"
  - after ~3s delay, reset to default state. 



- Clicking morph button will
 - If default state
  - run the getMorph function
  - set text to "OPEN MORPHED" or "MORPH FAILED"
  - change onClick to open linked image.
 - If loading state
  - disable onClick
  - set text to "LOADING"
 - If success state
  - set text to "MORPH"
  
- 

Before going live
 - Reenable cors and turn debug to false

Zuby TODO

Sammy TODO
 - update morpher to accept base 64 images
https://matthewdaly.co.uk/blog/2015/07/04/handling-images-as-base64-strings-with-django-rest-framework/

