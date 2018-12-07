import $ from 'jquery';

const menu = [
  {
    type: "link",
    href: "dashboard-engineers.html",
    label: "Today's Engineer Jobs"
  },
  { type: "link", href: "dashboard-surveyors.html", label: "Today's Surveyor Jobs" },
  { type: "divider" },
  { type: "link", href: "order-status.html", label: "Door Order Status" },
  { type: "divider" },
  { type: "link", href: "sales.html", label: "Sales Report" },
  { type: "divider" },
  {
    type: "link",
    href: "gdn-lookup.html",
    label: "GDN Contractor Lookup"
  },
  {
    type: "link",
    href: "gdn-call-log.html",
    label: "GDN Calls (In Development)"
  }
];

$(document).ready(() => {
  function renderMenu() {
    return menu.map(item => {
      if(item.type === "link") {
        return `
          <a class="dropdown-item" href="${item.href}">
            ${item.label}
          </a>
        `;
      } else if (item.type === "divider") {
        return `
          <div class="dropdown-divider"></div>
        `;
      }
    }).join('');
  }
  
  let container = document.getElementById("mainMenu");
  
  container.innerHTML = renderMenu();
});