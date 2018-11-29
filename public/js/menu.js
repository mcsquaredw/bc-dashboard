const menu = [
  {
    type: "link",
    href: "jobs-engineers.html",
    label: "Today's Engineer Jobs"
  },
  { type: "link", href: "jobs-surveyors.html", label: "Today's Surveyor Jobs" },
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
