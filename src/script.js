const properties = [
  {
    id: 1,
    title: "Sunlit modern apartment",
    city: "Bhopal",
    area: "Arera Colony",
    type: "Apartment",
    beds: "2 BHK",
    size: "980 sq.ft.",
    furnishing: "Semi-furnished",
    rent: 14000,
    tag: "GREAT VALUE",
    tagClass: "",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
    description:
      "A bright, comfortable apartment with a practical layout, generous natural light, and everyday essentials close by.",
  },
  {
    id: 2,
    title: "Warm & welcoming home",
    city: "Indore",
    area: "Vijay Nagar",
    type: "Apartment",
    beds: "2 BHK",
    size: "1,100 sq.ft.",
    furnishing: "Furnished",
    rent: 18500,
    tag: "MOVE-IN READY",
    tagClass: "tag-green",
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80",
    description:
      "A welcoming furnished home with a calm palette and room to relax after a busy day.",
  },
  {
    id: 3,
    title: "Minimal city sanctuary",
    city: "Pune",
    area: "Baner",
    type: "Apartment",
    beds: "1 BHK",
    size: "720 sq.ft.",
    furnishing: "Furnished",
    rent: 22000,
    tag: "NEW LISTING",
    tagClass: "tag-blue",
    image:
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=900&q=80",
    description:
      "A clean, minimal space for city living, close to cafes, shops, and everyday conveniences.",
  },
  {
    id: 4,
    title: "Room to grow townhouse",
    city: "Bengaluru",
    area: "Whitefield",
    type: "House",
    beds: "3 BHK",
    size: "1,450 sq.ft.",
    furnishing: "Semi-furnished",
    rent: 32000,
    tag: "BRIGHT & AIRY",
    tagClass: "tag-blue",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
    description:
      "A spacious home with an airy feel, suitable for people who want extra room to work, rest, and grow.",
  },
  {
    id: 5,
    title: "Compact city studio",
    city: "Delhi",
    area: "Laxmi Nagar",
    type: "Studio",
    beds: "Studio",
    size: "430 sq.ft.",
    furnishing: "Furnished",
    rent: 9500,
    tag: "COZY PICK",
    tagClass: "",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
    description:
      "A compact, furnished studio designed for simple city living while keeping monthly costs manageable.",
  },
  {
    id: 6,
    title: "Easy-living shared space",
    city: "Bhopal",
    area: "MP Nagar",
    type: "PG",
    beds: "PG",
    size: "Private room",
    furnishing: "Furnished",
    rent: 7500,
    tag: "BUDGET FRIENDLY",
    tagClass: "tag-green",
    image:
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=900&q=80",
    description:
      "A budget-friendly furnished private room in a shared-living setup. Confirm amenities and terms with the owner.",
  },
];

const $ = (selector) => document.querySelector(selector);
const grid = $("#propertyGrid");
let savedIds = JSON.parse(localStorage.getItem("rentmate-saved") || "[]");
let savedOnly = false;
let activeFilters = { location: "", type: "all", budget: "all" };

function rupees(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
function saveFavorites() {
  localStorage.setItem("rentmate-saved", JSON.stringify(savedIds));
  $("#savedCount").textContent = savedIds.length;
}
function getFilteredProperties() {
  let list = properties.filter((property) => {
    const query = activeFilters.location.trim().toLowerCase();
    const locationMatch =
      !query ||
      `${property.city} ${property.area} ${property.title}`
        .toLowerCase()
        .includes(query);
    const typeMatch =
      activeFilters.type === "all" || property.type === activeFilters.type;
    const budgetMatch =
      activeFilters.budget === "all" ||
      property.rent <= Number(activeFilters.budget);
    const savedMatch = !savedOnly || savedIds.includes(property.id);
    return locationMatch && typeMatch && budgetMatch && savedMatch;
  });
  const sort = $("#sortSelect").value;
  if (sort === "low") list.sort((a, b) => a.rent - b.rent);
  if (sort === "high") list.sort((a, b) => b.rent - a.rent);
  return list;
}
function propertyCard(property) {
  const isSaved = savedIds.includes(property.id);
  return `<article class="property-card">
    <div class="property-image">
      <img src="${property.image}" alt="${property.title}" loading="lazy">
      <span class="property-tag ${property.tagClass}">${property.tag}</span>
      <button class="heart-button ${isSaved ? "saved" : ""}" data-save="${property.id}" aria-label="${isSaved ? "Remove from saved homes" : "Save property"}" aria-pressed="${isSaved}">${isSaved ? "♥" : "♡"}</button>
    </div>
    <div class="property-body">
      <div class="property-location">${property.city.toUpperCase()} · ${property.area.toUpperCase()}</div>
      <h3>${property.title}</h3>
      <div class="property-meta"><span>⌂ ${property.beds}</span><span>▱ ${property.size}</span><span>♧ ${property.furnishing}</span></div>
      <div class="property-bottom"><div class="rent"><strong>${rupees(property.rent)}</strong><span>/ month</span></div><button class="details-button" data-details="${property.id}">View details ↗</button></div>
    </div>
  </article>`;
}
function renderProperties() {
  const list = getFilteredProperties();
  grid.innerHTML = list.map(propertyCard).join("");
  $("#emptyState").hidden = list.length > 0;
  grid.hidden = list.length === 0;
  $("#resultsCount").textContent =
    `${list.length} ${list.length === 1 ? "home" : "homes"} ${savedOnly ? "saved" : "to explore"}`;
  $("#savedOnlyToggle").classList.toggle("active", savedOnly);
  $("#savedOnlyToggle").textContent = savedOnly
    ? "♥ Showing saved homes"
    : "♡ Show saved homes";
  $("#listingTitle").innerHTML = savedOnly
    ? "Your saved homes <span>♡</span>"
    : "Homes worth coming home to <span>✦</span>";
  $("#listingSubtitle").textContent = savedOnly
    ? "Your shortlist, all in one place."
    : "Explore places that make everyday living feel a little more special.";
}
function resetFilters() {
  activeFilters = { location: "", type: "all", budget: "all" };
  $("#locationInput").value = "";
  $("#typeSelect").value = "all";
  $("#budgetSelect").value = "all";
  savedOnly = false;
  document
    .querySelectorAll(".quick-filter")
    .forEach((button) => button.classList.remove("selected"));
  renderProperties();
}
function showPropertyDetails(id) {
  const property = properties.find((item) => item.id === Number(id));
  if (!property) return;
  $("#dialogContent").innerHTML = `
    <img class="dialog-property-image" src="${property.image}" alt="${property.title}">
    <div class="dialog-property-location">${property.city.toUpperCase()} · ${property.area.toUpperCase()}</div>
    <h2>${property.title}</h2>
    <div class="dialog-property-price">${rupees(property.rent)} <small>/ month</small></div>
    <div class="dialog-property-info"><span>⌂ ${property.beds}</span><span>▱ ${property.size}</span><span>♧ ${property.furnishing}</span><span>⌂ ${property.type}</span></div>
    <p class="dialog-description">${property.description}</p>
    <p class="dialog-note">Demo listing: details and rent are sample data. Verify property information and terms before making any rental decision.</p>
    <button class="search-button" id="dialogSaveButton">${savedIds.includes(property.id) ? "♥ Saved to favourites" : "♡ Save this home"}</button>`;
  $("#propertyDialog").showModal();
  $("#dialogSaveButton").addEventListener(
    "click",
    () => {
      toggleSaved(property.id);
      showPropertyDetails(property.id);
    },
    { once: true },
  );
}
function toggleSaved(id) {
  savedIds = savedIds.includes(id)
    ? savedIds.filter((savedId) => savedId !== id)
    : [...savedIds, id];
  saveFavorites();
  renderProperties();
}
$("#searchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  activeFilters.location = $("#locationInput").value;
  activeFilters.type = $("#typeSelect").value;
  activeFilters.budget = $("#budgetSelect").value;
  savedOnly = false;
  document
    .querySelectorAll(".quick-filter")
    .forEach((button) => button.classList.remove("selected"));
  renderProperties();
  $("#listingTitle").scrollIntoView({ behavior: "smooth", block: "center" });
});
document.querySelectorAll(".quick-filter").forEach((button) => {
  button.addEventListener("click", () => {
    $("#locationInput").value = button.dataset.location;
    activeFilters.location = button.dataset.location;
    activeFilters.type = $("#typeSelect").value;
    activeFilters.budget = $("#budgetSelect").value;
    savedOnly = false;
    document
      .querySelectorAll(".quick-filter")
      .forEach((item) => item.classList.toggle("selected", item === button));
    renderProperties();
  });
});
grid.addEventListener("click", (event) => {
  const saveButton = event.target.closest("[data-save]");
  const detailButton = event.target.closest("[data-details]");
  if (saveButton) toggleSaved(Number(saveButton.dataset.save));
  if (detailButton) showPropertyDetails(Number(detailButton.dataset.details));
});
$("#sortSelect").addEventListener("change", renderProperties);
$("#resetFilters").addEventListener("click", resetFilters);
$("#emptyReset").addEventListener("click", resetFilters);
$("#savedOnlyToggle").addEventListener("click", () => {
  savedOnly = !savedOnly;
  renderProperties();
});
$("#viewSaved").addEventListener("click", () => {
  savedOnly = true;
  renderProperties();
  $("#explore").scrollIntoView({ behavior: "smooth" });
});
$("#loadMore").addEventListener("click", () => {
  $("#loadMore").textContent = "You're all caught up ✦";
  $("#loadMore").disabled = true;
  $("#loadMore").style.opacity = ".65";
});
$("#dialogClose").addEventListener("click", () => $("#propertyDialog").close());
$("#propertyDialog").addEventListener("click", (event) => {
  if (event.target === $("#propertyDialog")) $("#propertyDialog").close();
});
$("#listProperty").addEventListener("click", () => {
  $("#listMessage").textContent = "";
  $("#listDialog").showModal();
});
$("#listDialogClose").addEventListener("click", () => $("#listDialog").close());
$("#listForm").addEventListener("submit", (event) => {
  event.preventDefault();
  $("#listMessage").textContent =
    `Preview ready: “${$("#newTitle").value}” in ${$("#newCity").value}, ${rupees(Number($("#newRent").value))}/month. This demo does not save or publish the listing.`;
});
$("#mobileMenu").addEventListener("click", () => {
  const nav = document.querySelector(".desktop-nav");
  nav.classList.toggle("open");
  $("#mobileMenu").textContent = nav.classList.contains("open") ? "×" : "☰";
});
document.querySelectorAll(".desktop-nav a").forEach((link) =>
  link.addEventListener("click", () => {
    document.querySelector(".desktop-nav").classList.remove("open");
    $("#mobileMenu").textContent = "☰";
  }),
);
$("#year").textContent = new Date().getFullYear();
saveFavorites();
renderProperties();
