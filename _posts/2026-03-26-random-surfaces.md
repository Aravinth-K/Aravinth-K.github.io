---
layout: post
title: "Random surfaces"
date: 2026-03-26
description: An interactive fluctuating surface visualisation
tags: [geometry, interactive]
interactive: true
series: "Random geometry"
series_order: 1
---

A fluctuating 2D surface driven by superposed sinusoidal modes. Drag to rotate.

<div id="random-surface" style="width: 100%; border-radius: 10px; overflow: hidden; border: 1px solid var(--line); margin: 2rem 0;"></div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  createSurface('random-surface', {
    gridSize: 60,
    speed: 0.006,
    amplitude: 1.0,
    wireframe: true,
    height: 450
  });
});
</script>

The surface above is generated from a superposition of sinusoidal modes at different frequencies and phases, creating a pseudo-random fluctuating geometry.

<div class="spool" data-title="Mathematical background">
<div class="spool-content" markdown="1">

In a proper random geometry context, one studies the space of Riemannian metrics on a surface modulo diffeomorphisms. The partition function

$$Z = \int \mathcal{D}[g] \, e^{-S[g]}$$

sums over all metrics $g$ on the surface, weighted by an action $S[g]$ (typically the Einstein--Hilbert action or Polyakov action in 2D).

<div class="spool" data-title="The Polyakov action">
<div class="spool-content" markdown="1">

The Polyakov action for a bosonic string in $D$-dimensional target space is

$$S[X, g] = \frac{1}{4\pi\alpha'} \int_\Sigma d^2\sigma \, \sqrt{g} \, g^{ab} \partial_a X^\mu \partial_b X_\mu$$

where $\Sigma$ is the worldsheet with metric $g_{ab}$, and $X^\mu(\sigma)$ are the embedding coordinates.

</div>
</div>

What you see above is a toy version: the height function $h(x, y, t)$ is a finite sum of modes rather than a genuine sample from a path integral. But it captures the visual flavour of a fluctuating random surface.

</div>
</div>

## Configuration

You can embed a surface in any post by adding `interactive: true` to the front matter and including:

```html
<div id="my-surface"></div>
<script>
document.addEventListener('DOMContentLoaded', function() {
  createSurface('my-surface', {
    gridSize: 60,     // mesh resolution
    speed: 0.006,     // fluctuation rate
    amplitude: 1.0,   // height scale
    wireframe: true,  // false for solid
    height: 450       // container height in px
  });
});
</script>
```
