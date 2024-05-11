
// js phần giao diện....
var header = document.getElementById('header');
var mobileMenu = document.getElementById('mobile-menu');
var headerHeight = header.clientHeight;
// Đóng / mở mobile menu
mobileMenu.onclick =function(){
  var isClosed = header.clientHeight === headerHeight ;
  if(isClosed){
     header.style.height='auto';

  }else{
    header.style.height= null;
  }

}

// tự động đóng menu

var menuItems = document.querySelectorAll('#nav li a[href*="#"]')
for(var i = 0 ; i < menuItems.length ;i++){
  var menuItem = menuItems[i];
  menuItem.onclick = function(event){
    var isParentMenu = this.nextElementSibling  && this.nextElementSibling.classList.contains('subnav');
     if(isParentMenu){
      event.preventDefault();            
    } else{
      header.style.height= null;
    }
  }
}

// from mua vé

const buyBtns =document.querySelectorAll('.js-buy-ticket');
const modal = document.querySelector('.js-modal');
const modalClose = document.querySelector('.js-modal-close');
const modalContainer =document.querySelector('.js-modal-container');
  
// Hàm hiển thị modal mua vé 
function showBuyTickets() {
modal.classList.add('open');

}
// Hàm ẩn modal mua vé 
function hideBuyTickets() {
modal.classList.remove('open');  
}

// lặp qua từng thẻ btn và nghe hành vi click
for( const buyBtn of buyBtns){
  buyBtn.addEventListener('click', showBuyTickets);
}
// Nghe hành vi click vào btn close
modalClose.addEventListener('click', hideBuyTickets);

modal.addEventListener('click',hideBuyTickets);
modalContainer.addEventListener('click', function(event){
event.stopPropagation();
})

// viết thông báo khi buy-tickets thành công

var buytickets = document.querySelector('.buy-tickets');
buytickets.addEventListener('click',function(){
  alert("Thank you for purchasing the tickets successfully. Please check your email.")
})

