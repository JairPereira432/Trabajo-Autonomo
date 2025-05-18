let productos = [];
const busqueda = document.querySelector("#search");
const btnsearchContainer = document.querySelector("#categorias");
const contenedor = document.querySelector("#productos");
let categoriaSeleccionada = "all";

// Cargar productos desde archivo local
const cargarProductos = async () => {
  try {
    const response = await fetch("productos.json");
    if (!response.ok) throw new Error("No se pudo cargar el archivo productos.json");
    productos = await response.json();
    mostrarProductos(productos);
  } catch (error) {
    console.error("Error al cargar los productos:", error);
    contenedor.innerHTML = "<p class='text-white'>Error al cargar los productos</p>";
  }
};

// Mostrar botones de categorías (simulados)
const cargarCategorias = () => {
  const categorias = ["all", "categoría de prueba"];
  mostrarCategorias(categorias);
};

const mostrarCategorias = (categorias) => {
  if (!btnsearchContainer) return;
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

// Filtrar productos por categoría y búsqueda
const filtrarProductos = () => {
  let filtrados = productos;
  if (categoriaSeleccionada !== "all") {
    filtrados = filtrados.filter((p) => p.category === categoriaSeleccionada);
  }
  const text = busqueda?.value.toLowerCase() || "";
  if (text.trim() !== "") {
    filtrados = filtrados.filter(
      (p) => p.title.toLowerCase().includes(text) || p.description.toLowerCase().includes(text)
    );
  }
  mostrarProductos(filtrados);
};

// Mostrar productos en el DOM
const mostrarProductos = (productos) => {
  if (!contenedor) return;
  contenedor.innerHTML = "";
  productos.forEach(({ image, title, price, description }) => {
    const div = document.createElement("div");
    div.className = "bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-between hover:shadow-lg transition-shadow duration-300 relative";
    div.innerHTML = `
      <img src="${image}" alt="${title}" loading="lazy" class="w-32 h-32 object-contain mb-4 mt-6">
      <h2 class="text-center font-bold mb-2">${title}</h2>
      <p class="text-lg font-semibold text-black mb-4 mt-auto">Precio: $${price}</p>
      <button class="detalles-btn cursor-pointer bg-gradient-to-r from-blue-500 to-black text-white px-4 py-2 rounded hover:from-blue-600 hover:to-black transition-colors duration-300 self-stretch">Detalles</button>
      <div class="detalles-info hidden mt-4 text-sm text-gray-700 bg-gray-100 p-3 rounded shadow-inner">${description}</div>
    `;
    contenedor.append(div);
  });

  document.querySelectorAll(".detalles-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const info = btn.nextElementSibling;
      info.classList.toggle("hidden");
    });
  });
};

// Buscar productos en tiempo real
busqueda?.addEventListener("input", filtrarProductos);

// Inicializar al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("loginForm")) {
    cargarProductos();
    cargarCategorias();
  }
});

// Login
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

// Cierre de sesión
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  const logoutBtnMobile = document.getElementById("logoutBtnMobile");

  [logoutBtn, logoutBtnMobile].forEach(btn => {
    if (btn) {
      btn.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "login.html";
      });
    }
  });
});
