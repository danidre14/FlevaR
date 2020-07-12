# Changelog

# V 1.3.0 (July 12, 2020)
- Enhancement: `globalToLocal` now modifies existing points, rather than returning new point.
- Enhancement: Merged `globalToLocal` and `globalToLocalRelative` with second parameter for relative.
- Enhancement: Changed `getPaused` to `isPaused`.
- Feature: Added `isMuted` to `Sound`.
- Feature: Added stage references and attach/remove flevaclips to `_root`.
- Enhancement: Modified engine init: can initialize without passing an objects param
- Enhancement: Modified createsprite init: can initialize without passing an objects param
- Patch: Removed `stage` property.

## 1.2.0 (July 7, 2020)
- Feature: Added `type` property to every flobtive
- Feature: Added `init` function to Engine
- Feature: Added `takeScreenShot` to `meta`
- Enhancement: Properly named `prefabs` and `textfields` as `flevaclips` instead of `instances`
- Enhancement: Small optimizations
- Enhancement: Changed `Native` to `meta`

## 1.0.0 (July 5, 2020)
- Feature: Released Engine