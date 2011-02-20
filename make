#!/bin/sh
coffee -b -p --compile src/utils.coffee > lib/canvas_library.js
coffee -b -p --compile src/display_container_mixin.coffee >> lib/canvas_library.js
coffee -b -p --compile src/display_container.coffee >> lib/canvas_library.js
coffee -b -p --compile src/stage.coffee >> lib/canvas_library.js
coffee -b -p --compile src/display_object.coffee >> lib/canvas_library.js
coffee -b -p --compile src/shape.coffee >> lib/canvas_library.js
coffee -b -p --compile src/sprite.coffee >> lib/canvas_library.js
coffee -b -p --compile src/bitmap.coffee >> lib/canvas_library.js
coffee -b -p --compile src/text_field.coffee >> lib/canvas_library.js
coffee -b -p --compile src/pixel_sprite.coffee >> lib/canvas_library.js
coffee -b -p --compile src/tween.coffee >> lib/canvas_library.js
coffee -b -p --compile src/tween_command.coffee >> lib/canvas_library.js
coffee -b -p --compile src/ease_default.coffee >> lib/canvas_library.js
coffee -b -p --compile src/stacked_loader.coffee >> lib/canvas_library.js
coffee -b -p --compile src/renderer.coffee >> lib/canvas_library.js