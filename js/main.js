async function getApi() {
    try {
        const data = await fetch('https://ecommercebackend.fundamentos-29.repl.co');
        const res = await data.json();
        window.localStorage.setItem('section',JSON.stringify(res));
        return res;     
    } catch (error) {
        console.log(error);
    }
}
function events(){
    const nav_list = document.querySelector('.nav_list');
    const menu_open = document.querySelector('.menu_open');
    const menu_close = document.querySelector('.menu_close');
    const cart_button = document.querySelector('.cart_button');
    const menu_cart = document.querySelector('.menu_cart');
    const modal = document.querySelector('.modal');
    const x_modal = document.querySelector('.x_modal')
    menu_open.addEventListener("click", function() {
        nav_list.classList.add('active');
        menu_open.classList.add('active');
        menu_close.classList.add('active');
    });
    menu_close.addEventListener("click", function() {
        nav_list.classList.remove('active');
        menu_open.classList.remove('active');
        menu_close.classList.remove('active');
    });
    nav_list.addEventListener("click", function() {
        nav_list.classList.remove('active');
        menu_open.classList.remove('active');
        menu_close.classList.remove('active');
    });
    cart_button.addEventListener('click', function(){
        menu_cart.classList.toggle('active');
    })
    modal.addEventListener('click', function(){
        modal.classList.remove('active')
    })
}
async function printProducts() {
    const products = await getApi();
    const section = document.querySelector('.section');
    let html = '';
    for (const product of products) {
        html += `
        <div class="product">
            <div class="product_img">
                <img id="${product.id}"class="modal_img" src="${product.image}" alt="imagen de producto"/>
            </div>
                <div class="product_description">
                <span><b>Categoria:</b> ${product.category}</span><br>
                <span><b>Nombre:</b> ${product.name}</span><br>
                <span class="price"><b>Precio:</b> $${product.price}</span><br>
             </div>
             <button id="${product.id}" class="product_botton">añadir</button>
        </div>
        `        
    }
    section.innerHTML = html;
}
function addTocart(db) {
    const productHTML =document.querySelector('.section');
    productHTML.addEventListener('click', function(event){
        if(event.target.classList.contains('product_botton')){
            const id = Number(event.target.id);
            const productFind = db.products.find(function(product){
                return product.id == id;
            })
            if(db.cart[productFind.id]){
                db.cart[productFind.id].amount++;
            }else {
                productFind.amount = 1;
                db.cart[productFind.id] = productFind;
            }
            window.localStorage.setItem('cart', JSON.stringify(db.cart));
            printToCart(db);
            totalCart(db);
        }
    });
}
function printToCart(db){
    const cart_products =document.querySelector('.cart_products');
    let html = '';
    for (const product in db.cart) {
        const { quantity, price, name, image, id, amount } = db.cart[product];
        html += ` 
            <div class = "cart_product">
                <div class = "cart_product_image">
                    <img src = '${image}' alt = 'image product'/>
                </div>
                <div class="cart_product_container">
                    <div class = "cart_product_description">
                        <h3>${name}</h3>
                        <h4>Precio: $${price} </h4>
                        <p> Stock: ${quantity}</p>
                    </div>
                    <div id = ${id} class = "cart_counter">
                        <i class="fa-solid fa-minus"></i>
                        <span> ${amount}</span>
                        <i class="fa-solid fa-plus"></i>
                        <i class="fa-solid fa-trash"></i>
                    </div>
                </div>
            </div>
        `
    }
    cart_products.innerHTML = html;
}
function handleCart(db){
    const cart_products = document.querySelector('.cart_products');
    cart_products.addEventListener('click', function(event){
        if(event.target.classList.contains('fa-plus')){
            const id = Number(event.target.parentElement.id);
            const productfind = db.products.find(function(product){
                return product.id === id;
            });
            if(db.cart[productfind.id]){
                if(productfind.quantity === db.cart[productfind.id].amount){
                    return Swal.fire({
                        icon:'error',
                        iconColor: '#eb4a5a',
                        title:'No tenemos mas en la bodega',
                        confirmButtonText:'ok',
                        confirmButtonColor:'#eb4a5a', 
                      });
                };
                
            }
            db.cart[id].amount++;
        }
        if (event.target.classList.contains('fa-minus')){
            const id = Number(event.target.parentElement.id);
            if (db.cart[id].amount === 1){
                const response = Swal.fire({
                    icon:'success',
                    iconColor: '#eb4a5a',
                    title:'Se elimino',
                    confirmButtonText:'atras',
                    confirmButtonColor:'#eb4a5a', 
                  });
                if (!response){
                    return;
                }
                delete db.cart[id];
            }else {
                db.cart[id].amount--;
            }
        }
        if (event.target.classList.contains('fa-trash')){
            const id = Number(event.target.parentElement.id);
            const response = Swal.fire({
                icon:'success',
                iconColor: '#eb4a5a',
                title:'Se elimino',
                confirmButtonText:'atras',
                confirmButtonColor:'#eb4a5a', 
              });
            if (!response){
                return;
            }
            delete db.cart[id];   
        }
        window.localStorage.setItem('cart',JSON.stringify(db.cart));
        printToCart(db);
        totalCart(db);   
    })
}
function totalCart(db){
    const info_span = document.querySelector('.nav_cart span');
    const info_total = document.querySelector('.info_total');
    const info_amount = document.querySelector('.info_amount');
 
    let totalProducts = 0;
    let amountProducts = 0;
 
    for (const product in db.cart) {
        amountProducts += db.cart[product].amount;
        totalProducts += (db.cart[product].amount * db.cart[product].price);
    }
    info_total.textContent = 'Total: $'+totalProducts;
    info_amount.textContent = 'Cantidad: '+amountProducts;
    info_span.textContent = amountProducts;
}
function buyCart(db){
    const btnbuy = document.querySelector('.btn_buy');
    btnbuy.addEventListener('click',function(){
        if(!Object.keys(db.cart).length){
             return  Swal.fire({
                icon:'error',
                iconColor: '#eb4a5a',
                title:'Carrito vacio',
                confirmButtonText:'atras',
                confirmButtonColor:'#eb4a5a', 
              });
        }
        const response = Swal.fire({
            title: 'Su comprar fue exitosa?',
            confirmButtonText: 'comprar',
            confirmButtonColor:'green',
            icon:'success',
            iconColor:'green', 
          });
        if(!response){
            return;
        }
        for(const product of db.products) {
            const cartProduct = db.cart[product.id];
            if (product.id === cartProduct?.id){
                product.quantity -= cartProduct.amount;
            }
        }
        db.cart = {};
        window.localStorage.setItem('products', JSON.stringify(db.products));
        window.localStorage.setItem('cart', JSON.stringify(db.cart));
        printProducts(db);
        printToCart(db);
        totalCart(db);
    });
}
function handleList(db){
    const nav_list_item = document.querySelectorAll('.nav_list_item');
    nav_list_item[0].addEventListener('click', function(){
    printProducts(db);
});
    nav_list_item[1].addEventListener('click', function(){
    const productsHTML = document.querySelector('.section');
    let html = '';
    for (const product of db.products) {
        if (product.category === "shirt"){
            html += `
            <div class="product">
                <div class="product_img">
                    <img id="${product.id}"class="modal_img" src="${product.image}" alt="imagen de producto"/>
                </div>
                <div class="product_description">
                    <span><b>Categoria:</b> ${product.category}</span><br>
                    <span><b>Nombre:</b> ${product.name}</span><br>
                    <span class="price"><b>Precio:</b> $${product.price}</span><br>
                </div>
                <button id="${product.id}" class="product_botton">agregar</button>
            </div>
             `     
        }
    }
    productsHTML.innerHTML = html;
});

    nav_list_item[2].addEventListener('click', function(){
    const productsHTML = document.querySelector('.section');
    let html = '';
    for (const product of db.products) {
        if (product.category ==="hoddie"){
            html += `
            <div class="product">
                <div class="product_img">
                    <img id="${product.id}"class="modal_img" src="${product.image}" alt="imagen de producto"/>
                </div>
                    <div class="product_description">
                        <span><b>Categoria:</b> ${product.category}</span><br>
                        <span><b>Nombre:</b> ${product.name}</span><br>
                        <span class="price"><b>Precio:</b> $${product.price}</span><br>
                    </div>
                    <button id="${product.id}" class="product_botton">agregar</button>
            </div>
            ` 
        }
    }
    productsHTML.innerHTML = html;
});
    nav_list_item[3].addEventListener('click', function(){
    const productsHTML = document.querySelector('.section');
    let html = '';
    for (const product of db.products) {
        if (product.category ==='sweater'){
            html += `
            <div class="product">
                <div class="product_img">
                    <img id="${product.id}"class="modal_img" src="${product.image}" alt="imagen de producto"/>
                </div>
                    <div class="product_description">
                        <span><b>Categoria:</b> ${product.category}</span><br>
                        <span><b>Nombre:</b> ${product.name}</span><br>
                        <span class="price"><b>Precio:</b> $${product.price}</span><br>
                    </div>
                 <button id="${product.id}" class="product_botton">agregar</button>
            </div>
            ` 
        }
    }
    productsHTML.innerHTML = html;
});
}
function modal_product(db){
    const productsHTML = document.querySelector('.section');
    const modal = document.querySelector('.modal');
    const modal_product = document.querySelector('.modal_product');
    productsHTML.addEventListener('click', function(event){
        if (event.target.classList.contains('modal_img')){
            const id = Number(event.target.id);
            const productFind = db.products.find(function(product){
                return product.id === id;
            });
            modal_product.innerHTML = `
                <div class = 'modal_img_product'>
                    <img src='${productFind.image}' alt='image product'/>
                </div>
                <div class='modal_group'>
                    <h3><span>Nombre: </span>${productFind.name}</h3>
                    <h3><span>Descripcion: </span>${productFind.description}</h3><br>
                    <h3><span>Categoria: </span>${productFind.category}</h3>
                    <h3><span>Precio: </span>$${productFind.price} | <span>Stock: </span>${productFind.quantity}</h3>
                </div>    
            `
            modal.classList.add('active');
        }
    });
}
async function main (){
    const db = {
        products: JSON.parse(window.localStorage.getItem('section')) || await getApi(),
        cart: JSON.parse(window.localStorage.getItem('cart')) || {},
     }
     events();
     printProducts(db);
     addTocart(db);
     printToCart(db);
     handleCart(db);
     totalCart(db);
     buyCart(db);
     handleList(db);
     modal_product(db);
    
}
main()