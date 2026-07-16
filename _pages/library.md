---
layout: page
title: Library
permalink: /library/
description: Collected papers, notes, and documents
---

Collected papers, notes, and documents.

<div class="library-grid">
{% assign pdfs = site.static_files | where_exp: "file", "file.extname == '.pdf'" %}
{% for file in pdfs %}
<div class="library-item">
  <svg class="library-icon" width="30" height="38" viewBox="0 0 30 38" aria-hidden="true">
    <path d="M4,2 h15 l7,7 v27 h-22 z" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linejoin="round"/>
    <path d="M19,2 v7 h7" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linejoin="round"/>
    <path d="M9,16 h12 M9,21 h12 M9,26 h8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="3 2.4"/>
  </svg>
  <div class="library-info">
    <h3 class="library-title">
      <a href="{{ file.path | relative_url }}" target="_blank" rel="noopener">{{ file.basename | replace: '_', ' ' | replace: '-', ' ' }}</a>
    </h3>
    <div class="library-meta">PDF</div>
  </div>
</div>
{% endfor %}
{% if pdfs.size == 0 %}
<p class="library-empty">Nothing here yet.</p>
{% endif %}
</div>
