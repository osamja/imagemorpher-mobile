# imagemorpher-mobile
Mobile app for ImageMorpher built on React Native

This repo contains the UI for the mobile imagemorpher application.  It communicates with the ImageMorpher repo for the /morph REST API

MVP
- Opens app
- Two upload buttons, one morph button
- Clicking upload button allows user to choose image.

- Morph button will have 3 states

**Default state**
- text set to "MORPH"
- onPress runs getMorph function 
- onPress set to open linked image.

**Loading state**
- text set to "LOADING"
- onPress disabled

**Success state**
- text set to "GET MORPHED IMAGE"
- onPress set to open linked image & resets to default state.

**Failure state**
- text set to "MORPH FAILED"
- after ~3s delay, reset to default state. 

Before going live
 - Reenable cors and turn debug to false

* Building the app
* https://github.com/osamja/imagemorpher-mobile/issues/25

