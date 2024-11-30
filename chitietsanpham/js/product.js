import { products } from "../../data.js";
import { products as productsData } from "../../data.js";

function formatPrice(price) {
  const number = typeof price === "number" ? price : parseInt(price.toString().replace(/\s/g, ""), 10);
  return number.toLocaleString("vi-VN");
}
$(document).ready(function () {
  $(".product-links-wap a").click(function () {
    var this_src = $(this).children("img").attr("src");
    $("#current_product_img").attr("src", this_src);
    return false;
  });

  $("#btn_minus").click(function () {
    var val = $("#var_value").html();
    val = val == "1" ? val : val - 1;
    $("#var_value").html(val);
    $("product_quantity").val(val);
    return false;
  });
  $("#btn_plus").click(function () {
    var val = $("#var_value").html();
    val++;
    $("#var_value").html(val);
    $("#product_quantity").val(val);
    return false;
  });
  $(".img-button").click(function () {
    var this_img = $(this).parent("#cap_img").children("img").attr("src");
    $(".modal-img").attr("src", this_img);
    return false;
  });
  $(".slide_img").click(function () {
    $(".product-links-wap").find(".img-is-selected").removeClass("img-is-selected");
    $(this).addClass(".img-is-selected");
  });
  $("#tab-item").click(function () {
    $(".nav-tabs").find(".tab-is-selected").removeClass("tab-is-selected");
    $(this).addClass("tab-is-selected");
  });
});

$(document).ready(function () {
  let cart = [];
  function saveCartToLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function updateCartCount() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector(".icon-cart span").textContent = cartCount;
  }
  function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      cart = JSON.parse(storedCart);
    } else {
      cart = [];
    }
  }

  function getAllProducts() {
    const allProducts = Object.values(productsData).flat();

    for (let i = allProducts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allProducts[i], allProducts[j]] = [allProducts[j], allProducts[i]];
    }

    return allProducts;
  }

  function addToCart(productId) {
    const product = getAllProducts().find((item) => item.id === productId);
    const cartItem = cart.find((item) => item.id === productId);

    if (cartItem) {
      cartItem.quantity++;
    } else {
      cart.push({ ...product, quantity: parseInt($("#product_quantity").val()) });
    }

    saveCartToLocalStorage();
    updateCartCount();
    renderCart();
  }

  // document.addEventListener("DOMContentLoaded", function () {
  //   loadCartFromLocalStorage();
  //   updateCartCount(); // Cập nhật giỏ hàng ngay khi DOM được tải xong
  // });
  window.onload = function () {
    loadCartFromLocalStorage();
    updateCartCount();
    // renderCart();
  };
  const urlParams = new URLSearchParams(window.location.search);
  // Lấy giá trị tham số cụ thể (ví dụ: 'product_id')
  const productId = urlParams.get("id");
  const product = products[productId - 1] || "";
  console.log(product);
  if (!product) return;
  $("#current_product_img").attr("src", `../.${product.image1}`);

  $(".img-sub").each(function (index, element) {
    // Gán src mới cho từng phần tử
    if (!product[`image${index + 2}`]) {
      $(element).remove();
      return true;
    }
    $(element).attr("src", `../.${product[`image${index + 2}`]}`);
  });

  function getStars(rating) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars += '<span class="star fs-5" style="color: rgb(249, 183, 102)">&#9733;</span>'; // Sao vàng
      } else {
        stars += '<span class="star-inactive fs-5">&#9733;</span>'; // Sao xám
      }
    }
    return stars;
  }

  $("#number-review").text(`(${Math.floor(Math.random() * 5) + 1} reviews)`);
  $("#price-product").text(`$${formatPrice(product.price)}`);
  $("#name-product").text(`${product.name}`);
  $("#breadcrumb").text(`${product.name}`);
  $("#num-star-product").html(`${getStars(parseInt(product.rating))}`);
  $("#description-product").text(`${product.description}`);

  $("#add-btn").click(function (e) {
    e.preventDefault();
    addToCart(product.id);
  });
});
