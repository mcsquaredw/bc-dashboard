const menu = [
  {
    icon: "build",
    href: "dashboard-engineers.html",
    label: "Engineer Jobs"
  },
  { 
    icon: "search",
    href: "dashboard-surveyors.html", 
    label: "Surveyor Jobs" 
  },
  { 
    icon: "queue",
    href: "order-status.html", 
    label: "Door Orders" 
  },
  { 
    icon: "payment",
    href: "sales.html", 
    label: "Sales Report" 
  },
  {
    icon: "business",
    href: "gdn-lookup.html",
    label: "GDN Contractors"
  }
];

document.addEventListener("DOMContentLoaded", function() {
  const container = document.getElementById("header");

  container.innerHTML += `
    <div id="menu">
      ${menu.map(item => 
          `<a class="menu-item ${window.location.pathname.includes(item.href) ? `selected` : ``}" href="${item.href}">
            <i class="material-icons">${item.icon}</i>
            ${item.label}
          </a>`
      ).join('')}
    </div>`
});