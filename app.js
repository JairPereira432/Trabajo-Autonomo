let productos = [];
const busqueda = document.querySelector("#search");
const btnsearchContainer = document.querySelector("#categorias");
const contenedor = document.querySelector("#productos");
let categoriaSeleccionada = "all";

const cargarProductos = async () => {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) throw new Error("Error en la respuesta de la API");
    productos = await response.json();
    mostrarProductos(productos);
  } catch (error) {
    console.error("Error al cargar los productos:", error);
    contenedor.innerHTML = "<p>Error al cargar los productos</p>";
  }
};

const cargarCategorias = async () => {
  try {
    const response = await fetch("https://fakestoreapi.com/products/categories");
    if (!response.ok) throw new Error("Error en la respuesta de la API");
    const categorias = await response.json();
    mostrarCategorias(["all", ...categorias]);
  } catch (error) {
    console.error("Error al cargar las categorias:", error);
  }
};

const mostrarCategorias = (categorias) => {
  btnsearchContainer.innerHTML = "";
  categorias.forEach((categoria) => {
    const btn = document.createElement("button");
    btn.className = "text-white px-4 py-2 rounded mr-2 mb-2 hover:bg-blue-800 transition-colors duration-300 cursor-pointer bg-gradient-to-r from-blue-500 to-black";
    if (categoria === categoriaSeleccionada) {
      btn.classList.add("from-blue-800");
    }
    btn.textContent = categoria === "all" ? "Todos" : categoria.charAt(0).toUpperCase() + categoria.slice(1);
    btn.addEventListener("click", () => {
      categoriaSeleccionada = categoria;
      mostrarCategorias(categorias);
      filtrarProductos();
    });
    btnsearchContainer.append(btn);
  });
};

const filtrarProductos = () => {
  let filtrados = productos;
  if (categoriaSeleccionada !== "all") {
    filtrados = filtrados.filter((p) => p.category === categoriaSeleccionada);
  }
  const text = busqueda.value.toLowerCase();
  if (text.trim() !== "") {
    filtrados = filtrados.filter(
      (p) => p.title.toLowerCase().includes(text) || p.description.toLowerCase().includes(text)
    );
  }
  mostrarProductos(filtrados);
};

const mostrarProductos = (productos) => {
  contenedor.innerHTML = "";
  productos.forEach(({ image, title, price, description }) => {
    const div = document.createElement("div");
    div.className = "bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-between hover:shadow-lg transition-shadow duration-300 relative";
    div.innerHTML = `
      <div class="absolute top-2 right-2 z-20">
        <button class="text-xl font-bold px-2 py-1 rounded hover:bg-gray-200" onclick="this.nextElementSibling.classList.toggle('hidden')">&#8942;</button>
        <div class="info-box hidden absolute right-0 mt-2 bg-gray-100 text-sm text-gray-700 p-2 rounded shadow-md w-64 z-30">
          <strong>Información del producto:</strong>
          <p class="mt-1">${description}</p>
        </div>
      </div>
      <img src="${image}" alt="${title}" loading="lazy" class="w-32 h-32 object-contain mb-4 mt-6">
      <h2 class="text-center font-bold mb-2">${title}</h2>
      <p class="text-lg font-semibold text-black mb-4 mt-auto">Precio: $${price}</p>
      <button class="cursor-pointer bg-gradient-to-r from-blue-500 to-black text-white px-4 py-2 rounded hover:from-blue-600 hover:to-black transition-colors duration-300 self-stretch">Agregar al carrito</button>
    `;
    contenedor.append(div);
  });
};

busqueda?.addEventListener("input", filtrarProductos);

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("loginForm")) return; // Solo ejecuta si no es login
  cargarProductos();
  cargarCategorias();
  mostrarLogoutButton();
});

// LOGIN
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const mensaje = document.getElementById("mensaje");

      try {
        const response = await fetch("https://fakestoreapi.com/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });

        if (!response.ok) throw new Error("Error en la respuesta de la API");

        const data = await response.json();
        localStorage.setItem("token", data.token);
        mensaje.textContent = "Inicio de sesión exitoso";
        mensaje.classList.add("text-green-500");

        setTimeout(() => {
          window.location.href = "index.html";
        }, 1500);
      } catch (error) {
        console.error("Error al iniciar sesión:", error);
        mensaje.textContent = "Error al iniciar sesión. Inténtalo de nuevo.";
        mensaje.classList.add("text-red-500");
      }
    });
  }
});

// CIERRE DE SESIÓN
const mostrarLogoutButton = () => {
  const logoutButton = document.getElementById("logoutButton");
  if (localStorage.getItem("token")) {
    logoutButton.classList.remove("hidden");
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });
  }
};

// Mostrar/ocultar menú desplegable
document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.getElementById("menuButton");
  const menuDropdown = document.getElementById("menuDropdown");
  const logoutBtn = document.getElementById("logoutBtn");

  if (menuButton && menuDropdown) {
    menuButton.addEventListener("click", () => {
      menuDropdown.classList.toggle("hidden");
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });
  }
});
