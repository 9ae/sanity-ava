# Project Notes

![Final screenshot](master/images/final.png)

## Goal
Architect a presence UI for a content editor, where you can see who else is on which fields. For fields not on the screen (above/below page fold), users presence is hinted at with a location marker.

## Assumptions

Before we proceed, some assumptions made to narrow scope are:
- Form fields doesn't change are looking (maybe it will change onload)
- We don't tons (>20) of users looking a field
- Users can: change their focus field, leave page, enter page
- Users who are not focused on any field are not visible

## Architecture

Our React app is structured with the following components:

[App](tree/master/src/App.js)
  [FoldPreview](tree/master/src/FoldPreview.js) (above) shows users above the fold
    list of [Avatar](tree/master/src/Avatar.js)
  list of [FieldRow](tree/master/src/FieldRow.js) each row has a label, avatars of users focused, and input field
    list of [Avatar](tree/master/src/Avatar.js)
  [FoldPreview](tree/master/src/FoldPreview.js) (below) shows users below the fold
    list of [Avatar](tree/master/src/Avatar.js)

Inside `FieldRow` there's a div that wraps all the avatars, and attached to it is an intersection observer to detect if the element is within viewport. Listener of the intersection observer is in App, which keeps track of the scroll direction and field rows below & above the fold. It also tries to figure out which avatars in `FoldPreview` are about to pop back into their home position when their field becomes visible.

The [Controller](tree/master/src/Controller.js) component, which is a wrapper around App, is there to mock server push messages. It naively shuffles users around the fields to simulate actual users moving around the page. In a real world environment, App will probably get its field props from a global state manager, which will be updated by the middlewear binding backend updates to global state.

## Approach

### 1. Implement on screen detection with Intersect Observer

![Detect off screen](master/images/proof.gif)

### 2. Mock users moving around

![Add images and UI clean up](master/images/style.gif)

### 3. Animate transitions

![Animate transitions](master/images/anim.gif)

### 4. Clean up & Componentize

## Decisions & Considerations
