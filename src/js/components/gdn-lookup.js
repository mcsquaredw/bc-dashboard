import { changeGDNPostcode } from '../redux/actions';

const MAPS_URL = "https://google.com/maps/embed/v1/place?key=AIzaSyD55V3pJb2XQ02l44ecXJ5VgWWE8KRk-NM";
const suppliers = [{
    name: "ACE",
    areas: ["CH", "CW", "WA", "ST", "SK"],
    telephone: "01625 800122",
    address: "Unit 3 Georges Court, Macclesfield, Cheshire, SK11 6DP",
    postcode: "SK11 6DP",
    instructions: "Appointments 3-4 days in advance."
},
{
    name: "Doormatic Guildford",
    areas: ["CR", "GU", "KT", "RG", "RH", "SE", "SM", "SW", "TW"],
    telephone: "01483 237393",
    address: "9, Clasford Farm Stables, Aldershot Road, Guildford GU3 3HQ",
    postcode: "GU3 3HQ",
    instructions: "Appointments in Calendar hayleysmith@thegaragedoornetwork.com"
},
{
    name: "Doormatic Chalfont",
    areas: ["AL", "HA", "HP", "RG", "SL", "SM", "UB", "WD", "OX"],
    telephone: "01483 237393",
    address: "25 Market Pl, Chalfont St Peter, Gerrards Cross SL9 9DU",
    postcode: "SL9 9DU",
    instructions: "Appointments in Calendar hayleysmith@thegaragedoornetwork.com"
},
{
    name: "Don's Doors",
    areas: ["SO", "PO"],
    telephone: "02380 600027",
    address: "Unit 9/Vicarage Farm Business Park/Winchester Rd, Eastleigh SO50 7HD",
    postcode: "SO50 7HD",
    instructions: "Do not do PO18, PO19, PO20, PO21, PO22! Appointments 3-4 days in advance."
},
{
    name: "Eastern",
    areas: ["AL", "CB", "CM", "CO", "EN", "HP", "IG", "IP", "LE", "LU", "MK", "NN", "NR", "PE", "SG", "SL", "SS", "NG"],
    telephone: "01553 844566",
    address: "Nar Valley House, Wormegay, King's Lynn PE33 0SH",
    postcode: "PE33 0SH",
    instructions: "Appointments in diary."
},
{
    name: "Exclusive",
    areas: ["CF", "NP"],
    telephone: "02920 694111",
    address: "Unit B16, Whittle Rd, Cardiff CF11 8AT",
    postcode: "CF11 8AT",
    instructions: "Appointments 3-4 days in advance."
},
{
    name: "JB Doors",
    areas: ["DE", "NG", "S", "SK"],
    telephone: "Paul/Beth",
    address: "Rotherham Rd, Parkgate, Rotherham S62 6FP",
    postcode: "S62 6FP",
    instructions: "Appointments in Diary. NG32-34 is Eastern."
},
{
    name: "Powerdoors",
    areas: ["G", "KA"],
    telephone: "01505 842176",
    address: "Road Head, Beith Road, Lochwinnoch, Paisley PA12 4JG",
    postcode: "PA12 4JG",
    instructions: "Appointments 3-4 days in advance."
},
{
    name: "Regal",
    areas: ["SK"],
    telephone: "01625856822",
    address: "33 London Rd S, Poynton, Stockport SK12 1LA",
    postcode: "SK12 1LA",
    instructions: "Appointments 3-4 days in advance."
},
{
    name: "Up and Over",
    areas: ["GL", "HR", "SP", "SN"],
    telephone: "0117 9554594",
    address: "Up & Over Doors, 1-5 Glenfrome Rd, Bristol BS2 9UX",
    postcode: "BS2 9UX",
    instructions: "Don't need date or time."
},
{
    name: "Zap Doncaster",
    areas: ["DN", "LN"],
    telephone: "01302 817300",
    address: "1 Milethorn Ln, Doncaster DN1 2SU",
    postcode: "DN1 2SU",
    instructions: "Appointments in diary."
},
{
    name: "Zap Sheffield",
    areas: ["S", "DE"],
    telephone: "01142 424265",
    address: "137-143 Attercliffe Common, Sheffield S9 2FA",
    postcode: "S9 2FA",
    instructions: "Appointments in diary."
},
{
    name: "Zap Wakefield",
    areas: ["BD", "HD", "HG", "HX", "WF", "YO", "LS"],
    telephone: "01924 871777",
    address: "412 Bradford Rd, Carr Gate, Wakefield WF2 0QW",
    postcode: "WF2 0QW",
    instructions: "Appointments in diary."
}
];

export function renderGDNLookup(store) {
    const postcode = document.getElementById("gdn-contractors-postcode");
    const container = document.getElementById("gdn-contractors");

    postcode.onkeyup = (ev) => {
        store.dispatch(changeGDNPostcode(ev.target.value));
    };

    container.innerHTML = `
        ${suppliers.filter(supplier => {
            return supplier.areas.includes(store.getState().gdn.postcode.toUpperCase());
        }).map(supplier => {
            return `
                <div class="office">
                    <div class="map">
                        <iframe height="400px" width="400px" src="${MAPS_URL}&q=${supplier.postcode.replace(/ /g, "+")}&zoom=9"></iframe>
                    </div>
                    <div class="details">
                        <h1>${supplier.name}</h1>
                        Tel: ${supplier.telephone}
                        <br />
                        ${supplier.instructions}
                    </div>
                </div>
            `
        }).join('')}
    `;
}