let productos = [];
const busqueda = document.querySelector("#search");
const btnsearchContainer = document.querySelector("#categorias");
const contenedor = document.querySelector("#productos");
let categoriaSeleccionada = "all";

const cargarProductos = async () => {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) {
      throw new Error("Error en la respuesta de la API");
    }
    productos = await response.json();
    if (productos.length === 0) {
      console.warn("no hay productos");
      throw new Error("No se encontraron productos");
    } else {
      mostrarProductos(productos);
    }
  } catch (error) {
    console.error("Error al cargar los productos:", error);
    contenedor.innerHTML = "<p>Error al cargar los productos</p>";
  }
};

const cargarCategorias = async () => {
  try {
    const response = await fetch("https://fakestoreapi.com/products/categories");
    if (!response.ok) {
      throw new Error("Error en la respuesta de la API");
    }
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
    btn.classList.add(
      "text-white",
      "px-4",
      "py-2",
      "rounded",
      "mr-2",
      "mb-2",
      "hover:bg-blue-800",
      "transition-colors",
      "duration-300",
      "cursor-pointer",
      "bg-gradient-to-r",
      "from-blue-500",
      "to-black"
    );

    if (categoria === categoriaSeleccionada) {
      btn.classList.add("bg-gradient-to-r", "from-blue-800", "to-black");
    } else {
      btn.classList.add("bg-gradient-to-r", "from-blue-500", "to-black");
    }

    btn.textContent =
      categoria === "all"
        ? "Todos"
        : categoria.charAt(0).toUpperCase() + categoria.slice(1);
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
      (p) =>
        p.title.toLowerCase().includes(text) ||
        p.description.toLowerCase().includes(text)
    );
  }
  mostrarProductos(filtrados);
};

const mostrarProductos = (productos) => {
  contenedor.innerHTML = "";
  productos.forEach(({ image, title, price, description }) => {
    const div = document.createElement("div");
    div.classList.add(
      "bg-white",
      "rounded-lg",
      "shadow-md",
      "p-4",
      "flex",
      "flex-col",
      "items-center",
      "justify-between",
      "hover:shadow-lg",
      "transition-shadow",
      "duration-300"
    );
    div.innerHTML = `
        <img src="${image}" alt="${title}" loading="lazy" class="w-32 h-32 object-contain mb-4">
        <h2 class="text-center font-bold mb-2">${title}</h2>
        <p class="text-sm sm:text-[14px] md:text-[10px] xl:text-[14px] text-gray-600 text-center mb-4 break-words">${description}</p> 
        <p class="text-lg font-semibold text-black mb-4 mt-auto">Precio: $${price}</p>
        <button class="cursor-pointer bg-gradient-to-r from-blue-500 to-black text-white px-4 py-2 rounded hover:bg-gradient-to-r hover:from-blue-600 hover:to-black transition-colors duration-300 self-stretch">Agregar al carrito</button>
      `;
    contenedor.append(div);
  });
};

busqueda.addEventListener("input", filtrarProductos);
document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();
  cargarCategorias();
});
