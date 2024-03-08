const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWViMjgzYzJkN2IxMTAwMTkwZTc4NzYiLCJpYXQiOjE3MDk5MTAwNzYsImV4cCI6MTcxMTExOTY3Nn0.HqcexqGNSl7i4qmZa0KoaCqgrH1usfWNQ8ZKO-8DIsQ';
const auth = "Bearer " + apiKey;

let currentUrl = window.location.pathname.split('?')[0];
console.log("La pagina corrente è:",currentUrl);

//CREAZIONE DELLA PAGINA CON LE CARD DEI PRODOTTI
if (currentUrl === "/index.html") {
    
    fetch("https://striveschool-api.herokuapp.com/api/product/", {
        headers: {
            'Content-type': 'application/json',
            'Authorization': auth
        }
    })
    .then(res => res.json())
    .then(phones => {
        displayCards(phones);
    })
    
    function displayCards(phones) {
        let shelf = document.getElementById('shelf');
        
        phones.forEach(product => {
            
            let card = generaClone();
            
            card.querySelector('.card-img-top').src = product.imageUrl;
            card.querySelector('.card-title').textContent = product.name;
            card.querySelector('.description').textContent = product.description;
            card.querySelector('.price').textContent = "Prezzo: " + product.price + "€";
            card.querySelector('.badge').textContent = product.brand;
            card.querySelector('.card-edit').href = `./edit_product.html?_id=${product._id}`
            shelf.appendChild(card);
        });
    }
    
    function generaClone(){
        let template = document.querySelector('#card-template')
        let clone = template.content.cloneNode(true)
        return clone;
    }
} else if (currentUrl === '/edit_product.html' || currentUrl === '/add_product.html') {
    
    
    
    //PAGINE DI AGGIUNTA E MODIFICA PRODOTTO
    
    
    let deleteBtn = document.querySelector('.delete-btn');
    let saveBtn = document.querySelector('.save-btn');
    
    let urlParams = new URLSearchParams(location.search)
    let productId = urlParams.get('_id');
    
    let fetchUrl = "https://striveschool-api.herokuapp.com/api/product/"
    let fetchMethod = 'POST'
    
    if (productId) {
        fetchUrl = "https://striveschool-api.herokuapp.com/api/product/" + productId
        fetchMethod = 'PUT'
    }
    
    
    
    
    console.log(fetchMethod);
    
    saveBtn.addEventListener('click',function(e){
        e.preventDefault()
        
        let name = document.querySelector('#product-name').value
        let price = document.querySelector('#product-price').value
        let brand = document.querySelector('#product-brand').value
        let imageUrl = document.querySelector('#product-image').value
        let description = document.querySelector('#product-description').value
        
        let smartphone = {
            name,
            price,
            brand,
            imageUrl,
            description
        }
        
        fetch(fetchUrl, {
            
            method: fetchMethod,
            headers:{
                'Content-type': 'application/json',
                'Authorization': auth
                
            },
            body:JSON.stringify(smartphone)
        })
        .then(res => res.json())
        .then(res => {
            console.log(res)
            window.location.href = "index.html"
            
        })
    })
    
    deleteBtn.addEventListener('click',function () {
        fetch(fetchUrl, {
            method: 'DELETE',
            headers:{
                'Content-type': 'application/json',
                'Authorization': auth
            }
        })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            window.location.href = "index.html"
        })
        
    })
}