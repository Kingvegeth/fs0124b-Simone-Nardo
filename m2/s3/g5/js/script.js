const apiKey =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWViMjgzYzJkN2IxMTAwMTkwZTc4NzYiLCJpYXQiOjE3MDk5MTAwNzYsImV4cCI6MTcxMTExOTY3Nn0.HqcexqGNSl7i4qmZa0KoaCqgrH1usfWNQ8ZKO-8DIsQ";
const auth = "Bearer " + apiKey;

let currentUrl = window.location.pathname.split("?")[0];


let urlParams = new URLSearchParams(location.search);
let productId = urlParams.get("_id");

let alert = document.querySelector(".alert-danger");
let alertForm = document.querySelector(".alert-warning");

//CREAZIONE DELLA PAGINA CON LE CARD DEI PRODOTTI
if (currentUrl === "/index.html") {
  fetch("https://striveschool-api.herokuapp.com/api/product/", {
    headers: {
      "Content-type": "application/json",
      Authorization: auth,
    },
  })
    .then((res) => res.json())
    .then((phones) => {
      document.querySelector('.spinner-border').classList.add('d-none');
      displayCards(phones);
    })
    .catch((error) => {
      
      alert.classList.remove('d-none');
      index = String(error).indexOf(':');
      alert.innerText ="Errore nella fetch" + String(error).slice(index)

    });

  function displayCards(phones) {
    let shelf = document.getElementById("shelf");

    phones.forEach((product) => {
      let card = generaClone();

      card.querySelector(".card-img-top").src = product.imageUrl;
      card.querySelector(".card-title").textContent = product.name;
      card.querySelector(".description").textContent = product.description;
      card.querySelector(".price").textContent = "Prezzo: " + product.price + "€";
      card.querySelector(".badge").textContent = product.brand;
      card.querySelector(".card-edit").href = `./edit_product.html?_id=${product._id}`;
      card.querySelector(".card-more-info").href = `./view_product.html?_id=${product._id}`;
      shelf.appendChild(card);
    });
  }

  function generaClone() {
    let template = document.querySelector("#card-template");
    let clone = template.content.cloneNode(true);
    return clone;
  }
} else if (
  currentUrl === "/edit_product.html" ||
  currentUrl === "/add_product.html"
) {


  //PAGINE DI AGGIUNTA E MODIFICA PRODOTTO

  let modalId = currentUrl === "/edit_product.html" ? 'confirm-save' : 'confirm-add';
  let modal = new bootstrap.Modal(document.getElementById(modalId));


  
  let fetchUrl = "https://striveschool-api.herokuapp.com/api/product/";
  let fetchMethod = "POST";
  
  if (productId) {
    fetchUrl = "https://striveschool-api.herokuapp.com/api/product/" + productId;
    fetchMethod = "PUT";
  }

  let saveBtn = document.querySelector("[data-bs-target='#" + modalId + "']");

  saveBtn.addEventListener("click", function (e) {


    let nameInput = document.querySelector("#product-name");
    let priceInput = document.querySelector("#product-price");
    let brandInput = document.querySelector("#product-brand");
    let imageUrlInput = document.querySelector("#product-image");

    let name = nameInput.value;
    let price = priceInput.value;
    let brand = brandInput.value;
    let imageUrl = imageUrlInput.value;
  
    if (!name || !price || !brand || !imageUrl) {
      e.preventDefault();
      alertForm.classList.remove('d-none');
      if(!name) nameInput.classList.add('is-invalid')
      else nameInput.classList.add('is-valid')
      if(!price) priceInput.classList.add('is-invalid')
      else priceInput.classList.add('is-valid')
      if(!brand) brandInput.classList.add('is-invalid')
      else brandInput.classList.add('is-valid')
      if(!imageUrl) imageUrlInput.classList.add('is-invalid')
      else imageUrlInput.classList.add('is-valid')
    } else {

      alertForm.classList.add('d-none');
      nameInput.classList.remove('is-invalid')
      priceInput.classList.remove('is-invalid')
      brandInput.classList.remove('is-invalid')
      imageUrlInput.classList.remove('is-invalid')

      nameInput.classList.add('is-valid')
      priceInput.classList.add('is-valid')
      brandInput.classList.add('is-valid')
      imageUrlInput.classList.add('is-valid')

      modal.show();

    }
  });
  
  //gestione del pulsante di aggiunta prodotto
  
  let confirmSaveBtn = document.querySelector("#" + modalId + " .save-btn");

  confirmSaveBtn.addEventListener("click", function (e) {
    e.preventDefault();
  
    let name = document.querySelector("#product-name").value;
    let price = document.querySelector("#product-price").value;
    let brand = document.querySelector("#product-brand").value;
    let imageUrl = document.querySelector("#product-image").value;
    let description = document.querySelector("#product-description").value;

    if (description === "") {
      description = " ";
    }
  
    let smartphone = {
      name,
      price,
      brand,
      imageUrl,
      description,
    };
  
    fetch(fetchUrl, {
      method: fetchMethod,
      headers: {
        "Content-type": "application/json",
        Authorization: auth,
      },
      body: JSON.stringify(smartphone),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        window.location.href = "index.html";
      })
      .catch((error) => {
        
        alert.classList.remove('d-none');
        index = String(error).indexOf(':');
          modal.hide()
          alert.innerText ="Errore nella fetch" + String(error).slice(index)
      });
  });

      //gestione del pulsante reset
      let resetBtn = document.querySelector("[data-bs-target='#confirm-reset']");
      let modalReset = new bootstrap.Modal(document.getElementById('confirm-reset'));
      
  
      resetBtn.addEventListener("click", function (e) {
        modalReset.show();
      });
  
      let confirmResetBtn = document.querySelector("#confirm-reset .reset-btn");
  
      confirmResetBtn.addEventListener("click", function (e) {
        e.preventDefault();
        window.location.reload();
      });
  

  if (currentUrl === "/edit_product.html") {
    


    //Riempie automaticamente le value degli input all'apertura della pagina
      fetch(`https://striveschool-api.herokuapp.com/api/product/${productId}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: auth,
        },
      })
        .then((response) => response.json())
        .then((product) => {
          document.getElementById("product-name").value = product.name;
          document.getElementById("product-brand").value = product.brand;
          document.getElementById("product-price").value = product.price;
          document.getElementById("product-image").value = product.imageUrl;
          document.getElementById("product-description").value =
            product.description;
        })
        .catch((error) => {
          alert.classList.remove('d-none');

          console.log(error);
          index = String(error).indexOf(':');
          alert.innerText ="Errore nella fetch" + String(error).slice(index)
        });
    
    //gestione del pulsante delete

    let deleteBtn = document.querySelector("[data-bs-target='#confirm-delete']");
    let modalDelete = new bootstrap.Modal(document.getElementById('confirm-delete'));

    deleteBtn.addEventListener("click", function (e) {
    modalDelete.show();
  });
    
  let confirmDeleteBtn = document.querySelector("#confirm-delete .delete-btn");

  confirmDeleteBtn.addEventListener("click", function (e) {
  e.preventDefault();

  fetch(fetchUrl, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      Authorization: auth,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      window.location.href = "index.html";
    })
    .catch((error) => {
      alert.classList.remove('d-none');
      index = String(error).indexOf(':');
      alert.innerText ="Errore nella fetch" + String(error).slice(index)
    });
});
  }
} else if (currentUrl = '/view_product.html') {

    fetch(`https://striveschool-api.herokuapp.com/api/product/${productId}`, {
        headers: {
            'Content-type': 'application/json',
            'Authorization': auth
        }
    })
    .then(res => res.json())
    .then(phone => {
        
        displayProduct(phone);
    })
    .catch((error) => {
      alert.classList.remove('d-none');
      index = String(error).indexOf(':');
      alert.innerText ="Errore nella fetch" + String(error).slice(index)
    });
        
    

    function displayProduct(product) {

        let details = document.getElementById('product-details');
        let cardImage = details.querySelector('.card-img-top');
        let badge = details.querySelector('.badge');
        let cardTitle = details.querySelector('.card-title');
        let description = details.querySelector('.description');
        let price = details.querySelector('.price');

        cardImage.src = product.imageUrl;
        badge.textContent = product.brand;
        cardTitle.textContent = product.name;
        description.textContent = product.description;
        price.textContent = product.price + "€";
    }

}