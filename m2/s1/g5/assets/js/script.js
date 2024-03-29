//Cambio colore della navbar a una certa soglia di scroll
window.addEventListener("scroll", function () {
  let scrollThreshold = 310;
  let scrollH = window.scrollY;
  let navBar = document.getElementById("nav-bar");
  let button = this.document.getElementsByClassName("btn");

  if (scrollH >= scrollThreshold) {
    navBar.style.backgroundColor = "#fff";
    button[0].style.backgroundColor = "#1a8917";
  } else if (scrollH < scrollThreshold) {
    navBar.style.backgroundColor = "#ffc017";
    button[0].style.backgroundColor = "#191919";
  }
});

//Creo dinamicamente i tooltip
let author =  document.getElementsByClassName("author");
let tooltip = document.getElementsByClassName("tooltip");

for (let i = 0; i < author.length; i++) {

  let followerNumber = (Math.ceil(Math.random() * 30)+1);
  let firstName = document.getElementsByClassName('first-name');
  let authorName = firstName[i].outerText;

  let imgTag = author[i].querySelector("img");
  let imgSrc = imgTag.getAttribute("src");

  let tooltipCode = `
<div class="author-tooltip">    
    <img src="${imgSrc}" alt="author thumb">
    <span>${authorName}</span>
</div>
<p>Author, many articles</p>
<p class="followers">${followerNumber}k Followers <button class="btn dyn-btn">Follow</button></p>`;


  tooltip[i].innerHTML = tooltipCode;
}


//Animo le m dell'svg
let letters = Array.from(document.querySelectorAll('g[opacity="1"]'));

letters.forEach(e => {
  e.style.transition = 'opacity 0.099s';
});

setInterval(() => {
    let rnd = Math.floor(Math.random() * letters.length);
    letters[rnd].style.opacity = 0;

    setTimeout(() => {
        letters[rnd].style.opacity = 1;
    }, 10000);
}, 100);
