# Changelog

## 2.0.0 (October 3, 2020)
- Enhancement: Changed `skipForward` to `seekForward` in `Sound` Module.
- Enhancement: Changed `skipBackward` to `seekBackward` in `Sound` Module.
- Enhancement: Removed `toggleMute` from `Sound` Module.
- Enhancement: Modified `useSpriteSheet` to accept by seconds instead of milliseconds.
- Enhancement: Modified `sleep` to accept by seconds instead of milliseconds.
- Enhancement: Modified createspritesheet init: can initialize without passing an objects param.
- Enhancement: Removed `_canHit` from Sprites or SpriteSheet creations. All `Graphics`, `Sprites` and `SpriteSheets` can be hit (it's fast now :]).
- Enhancement: Modified replaced `useLoader` function with `useLoader` option on engine init.
- Enhancement: Modified put `FPS` and `SPF` in `meta` instead of on main engine object.
- Feature: Added fullscreen support.
- Feature: Added pointer lock support.
- Enhancement: Modified assets no longer need to be asynchronously created.
- Enhancement: Modified `createLoop` and `createTimeout` now accepts arg params, similar to `setInterval` and `setTimeout`.
- Feature: Insert list of library flevaclips instead of one string name to inherit multiple from those clips when adding to scenes/stage.
- Enhancement: Removed support for asynchronous appearances. Any asynchronous calls should be handled in the flobtive's scripts or onloads.
- Enhancement: Changed `meta` misspelling to `Meta`.
- Enhancement: Merged `localToGlobal` and `localRelativeToGlobal` with second parameter for relative.
- Feature: Created DSL: `"FlevaScript"`.
- Enhancement: Modified `Sound` module API.
- Enhancement: Changed `createSpriteSheet` API.
- Fixed: Many bugs and errors.

## 1.3.1 (July 12, 2020)
- Enhancement: `globalToLocal` now modifies existing points, rather than returning new point.
- Feature: Merged `globalToLocal` and `globalToLocalRelative` with second parameter for relative.
- Enhancement: Changed `getPaused` to `isPaused`.
- Feature: Added `isMuted` to `Sound`.
- Feature: Added stage references and attach/remove flevaclips to `_root`.
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