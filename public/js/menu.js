const menu = [
  {
    type: "link",
    href: "jobs-engineers.html",
    label: "Today's Engineer Jobs"
  },
  { type: "link", href: "jobs-surveyors.html", label: "Today's Surveyor Jobs" },
  { type: "divider" },
  { type: "link", href: "doors-alert.html", label: "Door Orders - Alerts" },
  {
    type: "link",
    href: "doors-to-order.html",
    label: "Door Orders - To Order"
  },
  {
    type: "link",
    href: "doors-to-be-acknowledged.html",
    label: "Door Orders - To Be Acknowledged"
  },
  {
    type: "link",
    href: "doors-to-be-delivered.html",
    label: "Door Orders - To Be Delivered"
  },
  {
    type: "link",
    href: "doors-in-stock.html",
    label: "Door Orders - Doors In Stock"
  },
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

function renderMenu(containerId) {
  let container = document.getElementById(containerId);

  menu.map(item => {
    if (item.type === "link") {
      let a = document.createElement("a");
      a.classList.add("dropdown-item");
      a.setAttribute("href", item.href);
      a.appendChild(document.createTextNode(item.label));
      container.appendChild(a);
    } else if (item.type === "divider") {
      let divider = document.createElement("div");
      divider.classList.add("dropdown-divider");
      container.appendChild(divider);
    }
  });
}
