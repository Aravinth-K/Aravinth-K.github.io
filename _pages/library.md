---
layout: page
title: Library
permalink: /library/
description: PDFs and documents
---

A collection of papers, notes, and documents. Drop PDFs into `assets/pdf/` and they appear here automatically.

<div class="library-grid">
{% assign pdfs = site.static_files | where_exp: "file", "file.extname == '.pdf'" %}
{% for file in pdfs %}
<div class="library-item">
  <div class="library-icon">PDF</div>
  <div class="library-info">
    <div class="library-title">
      <a href="{{ file.path }}" target="_blank">{{ file.basename | replace: '_', ' ' | replace: '-', ' ' }}</a>
    </div>
  </div>
</div>
{% endfor %}
{% if pdfs.size == 0 %}
<p style="color: #8A8A8A;">No PDFs yet. Place PDF files in <code>assets/pdf/</code> and they will appear here.</p>
{% endif %}
</div>
