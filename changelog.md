# Changelog

## 2.0.0 (October 3, 2020)
- Feature: Added fullscreen support.
- Feature: Added pointer lock support.
- Feature: Insert list of library flevaclips instead of one string name to inherit multiple from those clips when adding to scenes/stage.
- Feature: Created DSL: `"FlevaScript"`.
- Enhancement: Merged `localToGlobal` and `localRelativeToGlobal` with second parameter for relative.
- Enhancement: Changed `useLoader` function with `useLoader` option on engine init.
- Enhancement: Changed `skipForward` to `seekForward` in `Sound` Module.
- Enhancement: Changed `skipBackward` to `seekBackward` in `Sound` Module.
- Enhancement: Changed `meta` misspelling to `Meta`.
- Enhancement: Changed `createSpriteSheet` API.
- Enhancement: Modified `useSpriteSheet` to accept by seconds instead of milliseconds.
- Enhancement: Modified `sleep` to accept by seconds instead of milliseconds.
- Enhancement: Modified createspritesheet init: can initialize without passing an objects param.
- Enhancement: Modified API to put `FPS` and `SPF` in `meta` instead of on main engine object.
- Enhancement: Modified assets to no longer need to be asynchronously created.
- Enhancement: Modified `createLoop` and `createTimeout` now accepts arg params, similar to `setInterval` and `setTimeout`.
- Enhancement: Modified `Sound` module API.
- Enhancement: Removed `toggleMute` from `Sound` Module.
- Enhancement: Removed `_canHit` from Sprites or SpriteSheet creations. All `Graphics`, `Sprites` and `SpriteSheets` can be hit (it's fast now :]).
- Enhancement: Removed support for asynchronous appearances. Any asynchronous calls should be handled in the flobtive's scripts or onloads.
- Fixed: Many bugs and errors.

## 1.3.1 (July 12, 2020)
- Feature: Added `isMuted` to `Sound`.
- Feature: Added stage references and attach/remove flevaclips to `_root`.
- Enhancement: `globalToLocal` now modifies existing points, rather than returning new point.
- Enhancement: Merged `globalToLocal` and `globalToLocalRelative` with second parameter for relative.
- Enhancement: Changed `getPaused` to `isPaused`.
- Enhancement: Modified engine init: can initialize without passing an objects param
- Enhancement: Modified createsprite init: can initialize without passing an objects param
- Enhancement: Removed `stage` property.

## 1.2.0 (July 7, 2020)
- Feature: Added `type` property to every flobtive
- Feature: Added `init` function to Engine
- Feature: Added `takeScreenShot` to `meta`
- Enhancement: Properly named `prefabs` and `textfields` as `flevaclips` instead of `instances`
- Enhancement: Small optimizations
- Enhancement: Changed `Native` to `meta`

## 1.0.0 (July 5, 2020)
- Feature: Released Engine