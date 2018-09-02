# Source element / target element POC

Dynamically placed elements can be tricky to use,
they might need a "render loop" based on requestAnimationFrame.

Re-parenting such an element is unwise since if it's an OpenGL
canvas or a VideoElement some browsers might fail that operation.
Furthermore React and other similar frameworks don't necessarily
support DOM re-parenting. 

This repo contains an example application that moves a "canvas"
around using the above mentioned "render loop" technique.

A better way could be native CSS support for "virtual reparenting",
or "same-as" positioning/sizing, that unfortunately does not exist.
