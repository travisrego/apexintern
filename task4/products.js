const products = [
  { name: "Laptop Alpha", category: "laptop", price: 900 },
  { name: "Phone Beta", category: "phone", price: 450 },
  { name: "Laptop Gamma", category: "laptop", price: 1200 },
  { name: "Phone Delta", category: "phone", price: 700 },
];

const list = document.getElementById("productList");
const filter = document.getElementById("categoryFilter");
const sort = document.getElementById("priceSort");

function render(productsToShow) {
  list.innerHTML = "";
  productsToShow.forEach((p) => {
    const div = document.createElement("div");
    div.className = "product";
    div.textContent = `${p.name} - ₹${p.price}`;
    list.appendChild(div);
  });
}

function updateDisplay() {
  let filtered = [...products];

  if (filter.value !== "all") {
    filtered = filtered.filter((p) => p.category === filter.value);
  }

  if (sort.value === "low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort.value === "high") {
    filtered.sort((a, b) => b.price - a.price);
  }

  render(filtered);
}

filter.onchange = updateDisplay;
sort.onchange = updateDisplay;

render(products);
