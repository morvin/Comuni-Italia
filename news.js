document.addEventListener("DOMContentLoaded", () => {
  const newsList = document.getElementById("news-list");
  const sampleNews = [
    { title: "Salerno: eventi della settimana", link: "#" },
    { title: "Nuovi progetti per la mobilità urbana", link: "#" },
    { title: "Apertura del lungomare riqualificato", link: "#" },
  ];
  sampleNews.forEach(news => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${news.link}" class="text-blue-600 hover:underline">${news.title}</a>`;
    newsList.appendChild(li);
  });
});
