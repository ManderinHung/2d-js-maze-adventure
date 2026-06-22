# 2D Browser-Based Maze Game

An interactive, grid-based arcade game written in vanilla JavaScript. The player must navigate a maze to collect hidden keys while evading an autonomous enemy entity that uses real-time pathfinding logic.

## Key Technical Features

* **State Management & Game Loops:** Implemented an asynchronous 50ms game loop handling concurrent calculations for player inputs, enemy movement, and real-time object tracking.
* **Algorithmic Collision Detection:** Designed a custom Axis-Aligned Bounding Box (AABB) collision algorithm (`isTouchingWall`) with padding parameters to prevent characters from penetrating maze borders.
* **Cached Data Structures:** Optimized rendering performance by mapping static UI elements to a cached local array (`wallData`), eliminating the overhead of redundant UI property queries during the runtime loop.
* **Autonomous Enemy Logic:** Programmed real-time tracking behavior for the enemy asset using conditional coordinate updates to constantly shrink the distance vectors between the enemy and the player.
* **Robust Event Handling:** Implemented full keyboard event listeners (`keydown` and `keyup`) via a dynamic map to ensure fluid, multi-directional player navigation.

## How to Play

1. Use **WASD** or the **Arrow Keys** to navigate through the maze.
2. Locate and collect all three colored keys (Red, Green, and Blue) to achieve a winning score of 1500 points.
3. Evade the tracking enemy. If caught, you lose one of your three lives and receive temporary invincibility frames to regroup.
