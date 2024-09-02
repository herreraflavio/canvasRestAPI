# clone repo

## run: npm install

## create .env file

## create access token: https://catcourses.ucmerced.edu/profile/settings, should look like this: CANVAS_API_KEY=<access_token> add to .env

## base url: CANVAS_API_URL=https://ucmerced.instructure.com/api/v1/ add to .env

## run: node gravatar.js

## kinda cool patter with gravatar, yea i dont know why you would want to use it

# CD finalUpdatePFP run: node trigger.js

## just make sure you use the correct path when uploading the photo, i used chat gpt and i think i forgot to ask it to add error handling so ... yea, maybe ill add some on my own

## please refer to canvas rest api for any other questions: https://canvas.instructure.com/doc/api/

## what trigger.js does is that it uses node schedule so you can set any start and end date, you can also edit the polling interval which checks if self profile picture has been updated by the system in the file checkProfilePicture.js, onces the script detects the profile picture has changed based on the url it will call a function in updatePFP.js where it uploads an image from local. Effectively what this does is that it makes it so that your profile picture in canvas stays the same even if they change it

## if you are wondering why i would make such useless code, um yea i dont know either lmao
