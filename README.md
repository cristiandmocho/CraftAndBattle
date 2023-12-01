# Craft & Battle and ECMA Game Engine

I started this project with the intention of building a 2D tile-based, top-down view game in Javascript. To write the game, though, I decided I needed a 2D Game Engine, but I didn't want to use the ones on the market... Sooooo, I decided to create my own. Challenging myself to build a 2D game engine, from scratch, entirely in Javascript, just out of curiosity, to learn how game engines work on the inside.

I'm not sure if it will ever be a GOOD 2D game engine, if it will have all the necessary tools and methods to build any 2D game your mind can think of, but it will be, in itself, an interesting project, with lots to learn from!

### The game

The game, called **Craft & Battle**, is a rogue-like, survival, tile-based top-down kind of game, retro, 16-bit pixel art style. You're just 18 and fresh out of you parents' house, and decided to live by yourself in the woods. The year is 3434 of the Second Age (yes, it is a reference...) and all you have with you are the clothes on your body and some gold from selling your horse. No weapons, no food, no resources.

Your first goal is to settle, find shelter, gather resources and build your first house, very much in the style of a survival game. The forest will offer plenty of resources to start with, but also some danger - wild animals or bandits could appear out of nowhere and kill you. If you die, you die. 

Yes. It's over. You have to create a new character and start over. So try not to die... 👌

This is as far as I went about the game, the rest will come in time. While I build the engine and discover what is possible to do, obviously the features that can be implemented in the game will also change. Animations, different input systems, I/O systems, scripting (to support smooth fighting system, crafting system, inventory, different biomes, scenes or maps loading etc.), all depends on what is possible to do with the Engine. So let's talk a bit about it.

### The Engine

The engine will have most of the classes and libraries a regular 2D Game Engine should:

- **Engine Core**: containing functions, constants and information about the engine itself and the game entities;
- **Input system**: to allow for user interaction via keyboard, mouse and other devices;
- **Scenes**: class that defines the "stage" of the games, with methods to allow the assembly of a visual representation of your entities;
- **Camera**: to allow for different points of view of you Scenes;
- **Entities**: anything that needs to be represented in the game, like players, enemies, music tracks, sound effects, backgrounds etc.

Obviously there's also quite a bit of Math involved. Functions to work with 2D Vectors (add, subtract, normalize, magnitude...) and to do Linear Interpolation (or Lerp) are already in, but of course they will get a major revamp at some point, either to make them better and/or more performant, or to move them into a proper class. For now, they're part of the `Engine` class.

I'll try to keep this document up to date as much as I can with what is already working and implemented in the engine while I develop stuff.

### Map Editor

I was trying to build the map for this game strictly on code and quickly realised it was a huge mistake... I mean, it was useful to test the `Input` system, but ultimately building a tile-map requires a tile-map editor. It's easier to place the entities, create the sprites and animations, decide where to put enemies, the event triggers etc.

To write a consistent story for the game while building a map, while writting code felt a bit too much...

So I took a step back to build this GORGEOUS map editor!

![Map Editor Screenshot](https://private-user-images.githubusercontent.com/72891272/287126053-ba00c754-f1b0-4a3d-abed-83fe67d44aaa.png)

> Map Editor Screenshot

It's far from ready, but it should end up having pretty much anything I need (at this moment) to build my tile-based maps. It allows for different map sizes and resolutions, you can (currently) save and load any map, toggle the tile grid and importing new assets (it actually uploads the selected assets to the proper folder), following the structure created on the server side when you save a new map:

![Folder structure](https://private-user-images.githubusercontent.com/72891272/287126060-a0c0a80a-532d-4f95-a8f4-1239f3c40652.png)

This is the part that I'll change once it's done:

The Inspector will show the list of assets imported for the current loaded map. From texture assets you'll be able to create sprites, and from sprites you can create animations - so the path from texture (the "raw" asset) to sprite (now a "proper" game entity that can be placed on the map and interacted with), to animation (a sequence of sprites controlled by the engine) is very simple and clear to understand. The assets can be viewed by selecting the asset type on the dropdown (top toolbar on the Inspector).

It will also have a mini-map view of you map (bottom section of the Inspector).

And yes, "Inspector" can be changed to something else, I just couldn't come up with a better name yet... and since I'm a Unity user, I just called it Inspector...

### UI Editor (and other "editors")

At some point I'll start developing the UI Editor as well, which will allow me to create the UI layer for my game. Or... at least, that's the idea, although it might be easier to just use HTML/CSS/Javascript for the UI stuff.

Of course, I want my UI to be controlled by the Engine at the end of the day, so everything is consitent. If the game is half-baked using the Engine and Javascript, I might run into some problems later when I update either project.

One solution is to use Web Components. I can implement the pieces in plain HTML/CSS/JS but give them specific properties and events, and ultimately use them simply as Entities in the engine, of type "UI Component". I'm not sure yet, but the idea are flowing!

Equally, if I need other types of entities for my game, I might use the same process and just organize them as different entities that the engine can recognize. This will also allow for `mods` for the games, as anything can be easily created as Web Components with specific "hooks" to talk to the engine. It could also allow for easier updates for the games.
