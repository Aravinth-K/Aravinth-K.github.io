---
layout: post
title: "The spool system"
date: 2026-03-26
description: Collapsible detail panes for progressive disclosure
tags: [meta, tutorial]
---

This site has a system for progressive disclosure. Click on a spool to expand details in a sliding pane from the right. Nest them for deeper levels of detail.

## A simple example

Consider the statement: every continuous function on a closed interval is bounded.

<div class="spool" data-title="Proof (Boundedness theorem)">
<div class="spool-content" markdown="1">

Suppose $f: [a, b] \to \mathbb{R}$ is continuous. Assume for contradiction that $f$ is unbounded.

Then for each $n \in \mathbb{N}$, there exists $x_n \in [a, b]$ such that $|f(x_n)| > n$.

By Bolzano--Weierstrass, $(x_n)$ has a convergent subsequence $x_{n_k} \to c \in [a, b]$.

<div class="spool" data-title="Why Bolzano–Weierstrass applies">
<div class="spool-content" markdown="1">

The sequence $(x_n)$ is bounded since all terms lie in $[a, b]$. The Bolzano--Weierstrass theorem states that every bounded sequence in $\mathbb{R}^n$ has a convergent subsequence.

<div class="spool" data-title="Proof of Bolzano–Weierstrass">
<div class="spool-content" markdown="1">

By repeated bisection: given a bounded sequence in $[a, b]$, split the interval in half. At least one half contains infinitely many terms of the sequence. Choose that half and repeat.

The nested closed intervals $[a_1, b_1] \supset [a_2, b_2] \supset \cdots$ have lengths $\to 0$. By the nested interval theorem, they converge to a single point $c$. We can extract a subsequence converging to $c$.

</div>
</div>

</div>
</div>

Since $f$ is continuous at $c$, we have $f(x_{n_k}) \to f(c)$, so $(f(x_{n_k}))$ is bounded — contradicting $|f(x_{n_k})| > n_k \to \infty$. $\square$

</div>
</div>

## How to use spools in your posts

In your markdown, write:

```html
<div class="spool" data-title="Your title here">
<div class="spool-content" markdown="1">

Your detailed content here. **Markdown works** and so does $\LaTeX$.

You can nest another spool inside for deeper detail.

</div>
</div>
```

Each expansion slides a new pane in from the right. The depth colours subtly shift so you can sense how deep you are. Press Escape or click outside to close.
