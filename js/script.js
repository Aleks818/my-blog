fetch('/alex-blog/articles/')
  .then(response => response.text())
  .then(data => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, 'text/html');
    const links = [...doc.querySelectorAll('a')]
      .map(a => a.href)
      .filter(href => href.endsWith('.md'))
      .map(href => {
        const filename = href.split('/').pop().replace('.md', '');
        const title = decodeURIComponent(filename)
          .replace(/-/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());
        return { filename, title };
      });

    const container = document.getElementById('articles-list');
    let articles = [];

    links.forEach(article => {
      const div = document.createElement('div');
      div.className = 'article';
      div.setAttribute('data-title', article.title);
      div.innerHTML = `
        <h2><a href="article.html?file=${article.filename}">${article.title}</a></h2>
        <p>Читать далее →</p>
      `;
      container.appendChild(div);
      articles.push(div);
    });

    // 🔍 Поиск
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        articles.forEach(articleEl => {
          const title = articleEl.getAttribute('data-title').toLowerCase();
          articleEl.style.display = title.includes(query) ? 'flex' : 'none';
        });
      });
    }
  })
  .catch(err => {
    console.error('Ошибка загрузки статей:', err);
    document.getElementById('articles-list').innerHTML = '<p>❌ Не удалось загрузить статьи.</p>';
  });
