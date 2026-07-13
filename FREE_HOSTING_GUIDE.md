const demoUsers = {
  smhwh: {
    password: "howrah123",
    name: "SM Howrah",
    role: "station-manager",
    station: "HWH - HOWRAH",
    stations: [],
    department: "",
    phone: "9000000001",
  },
  tihwh: {
    password: "ti123",
    name: "TI Howrah Section",
    role: "supervisor",
    station: "",
    stations: ["HWH - HOWRAH", "BDC - BANDEL", "BWN - BARDHAMAN"],
    department: "Operating",
    phone: "9000000002",
  },
  enggcontrol: {
    password: "control123",
    name: "Engineering Control",
    role: "control",
    station: "",
    stations: [],
    department: "Engineering",
    phone: "9000000003",
  },
  boengg: {
    password: "bo123",
    name: "BO Engineering",
    role: "bo",
    station: "",
    stations: [],
    department: "Engineering",
    phone: "9000000004",
  },
  adminhwh: {
    password: "admin123",
    name: "Sr. DCM Howrah",
    role: "admin",
    station: "Howrah Division",
    stations: [],
    department: "Commercial",
    phone: "9000000005",
  },
  superhwh: {
    password: "super123",
    name: "Super User HWH",
    role: "super",
    station: "Howrah Division",
    stations: [],
    department: "All",
    phone: "9000000000",
  },
};

const departments = [
  "Commercial",
  "Engineering",
  "Electrical",
  "Mechanical",
  "Operating",
  "Signal & Telecom",
  "Security",
  "Medical",
  "Personnel",
];

const stationRecords = window.howrahStations || [];

const stations = stationRecords.map((station) => `${station.code} - ${station.name}`);
const categories = [
  "Cleanliness at Yard",
  "Cleanliness at Platform",
  "Cleanliness at Outside Area",
  "Platform Surface",
  "Dustbins",
  "Public Toilets",
  "Waiting Room Toilets",
  "Divyangjan Toilets",
  "Fans",
  "Water Cooler",
  "Air Conditioner",
  "Public announcement system",
  "Water Booths",
  "Water Supply",
  "RO Plant",
  "Lights",
  "Station Furniture",
  "Signages",
  "Clock",
  "Coach Indicators",
  "Information Boards",
  "UTS and PRS",
  "Lifts and Escalators",
  "Benches",
  "Wheelchairs",
  "Stretchers",
  "Waiting Rooms",
  "Waiting Hall",
  "Retiring Room",
  "Platform Surface (Duplicate)",
  "Parking",
  "Catering Stalls and Trolleys",
  "Not Listed",
];

const seedComplaints = [
  {
    id: "HWH-2026-0001",
    station: "HWH - HOWRAH",
    department: "Engineering",
    category: "Platform Surface",
    location: "Platform 8 near FOB stairs",
    priority: "High",
    subject: "Broken platform edge tile",
    description: "Damaged tiles near the foot over bridge need urgent attention before peak hours.",
    status: "In Progress",
    raisedBy: "SM Howrah",
    createdAt: "2026-07-02T09:15:00",
    dueAt: "2026-07-04",
    attachmentName: "platform-edge.jpg",
    history: [
      ["Raised", "SM Howrah", "Complaint registered and sent to Engineering."],
      ["Assigned", "Divisional Admin", "Marked to section engineer for inspection."],
      ["In Progress", "Engineering", "Material arranged; work planned in traffic block."],
    ],
  },
  {
    id: "HWH-2026-0002",
    station: "BDC - BANDEL",
    department: "Electrical",
    category: "Lighting",
    location: "Circulating area",
    priority: "Medium",
    subject: "Two high mast lights not working",
    description: "Lighting is inadequate near the auto stand after sunset.",
    status: "Pending",
    raisedBy: "SM Bandel",
    createdAt: "2026-07-02T18:40:00",
    dueAt: "2026-07-05",
    attachmentName: "",
    history: [["Raised", "SM Bandel", "Complaint registered and sent to Electrical."]],
  },
  {
    id: "HWH-2026-0003",
    station: "BWN - BARDHAMAN",
    department: "Commercial",
    category: "UTS and PRS",
    location: "Booking office",
    priority: "Low",
    subject: "Queue railing alignment required",
    description: "Passenger queue spills into the entrance corridor during morning rush.",
    status: "Resolved",
    raisedBy: "SM Barddhaman",
    createdAt: "2026-07-01T11:20:00",
    dueAt: "2026-07-06",
    attachmentName: "",
    history: [
      ["Raised", "SM Barddhaman", "Complaint registered and sent to Commercial."],
      ["Resolved", "Commercial", "Queue manager relocated and sign board placed."],
    ],
  },
];

let state = {
  user: null,
  users: {},
  complaints: [],
  currentView: "dashboard",
};

const storageKey = "stationMadadHowrahState";
const userKey = "stationMadadHowrahUser";
const usersKey = "stationMadadHowrahUsers";
const sheetsUrlKey = "stationMadadHowrahSheetsWebAppUrl";
const googleSheetId = "1y24ay-NDtFASf_JcVLf9HwSFcr2y0tavI8YMx57OzU4";

const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => [...document.querySelectorAll(selector)];

function loadState() {
  const saved = localStorage.getItem(storageKey);
  state.complaints = saved ? JSON.parse(saved) : seedComplaints;
  const savedUsers = localStorage.getItem(usersKey);
  state.users = savedUsers ? { ...demoUsers, ...JSON.parse(savedUsers) } : demoUsers;
  const savedUser = localStorage.getItem(userKey);
  state.user = savedUser ? JSON.parse(savedUser) : null;
}

function saveComplaints() {
  localStorage.setItem(storageKey, JSON.stringify(state.complaints));
}

function saveUsers() {
  localStorage.setItem(usersKey, JSON.stringify(state.users));
}

function saveUser() {
  if (state.user) {
    localStorage.setItem(userKey, JSON.stringify(state.user));
  } else {
    localStorage.removeItem(userKey);
  }
}

function roleName(role) {
  return {
    "station-manager": "Station Manager",
    supervisor: "Traffic/Loco Inspector",
    department: "Department Officer",
    control: "Departmental Control Office",
    bo: "Branch Officer",
    admin: "Divisional Admin",
    super: "Super User",
  }[role];
}

function allowedComplaints() {
  if (!state.user) return [];
  if (["admin", "super"].includes(state.user.role)) return state.complaints;
  if (state.user.role === "supervisor") {
    const supervised = state.user.stations || [];
    return state.complaints.filter((item) => supervised.includes(item.station));
  }
  if (["department", "control", "bo"].includes(state.user.role)) {
    return state.complaints.filter((item) => item.department === state.user.department);
  }
  return state.complaints.filter((item) => item.station === state.user.station);
}

function setView(view) {
  state.currentView = view;
  qsa(".view").forEach((item) => item.classList.remove("active-view"));
  qs(`#${view}`).classList.add("active-view");
  qsa(".nav-list button").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });
  const titles = {
    dashboard: "Dashboard",
    newComplaint: "Raise Complaint",
    complaints: "Complaints",
    departmentDesk: "Department Desk",
    reports: "Reports",
    settings: "Masters",
    userManagement: "User Control",
  };
  qs("#pageTitle").textContent = titles[view];
  render();
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2600);
}

function login(username, password) {
  const user = state.users[username.toLowerCase()];
  if (!user || user.password !== password) {
    qs("#loginError").textContent = "Please enter a valid username and password.";
    return;
  }
  state.user = { username: username.toLowerCase(), ...user };
  saveUser();
  qs("#loginPage").classList.add("hidden");
  qs("#appShell").classList.remove("hidden");
  hydrateShell();
  setView("dashboard");
}

function logout() {
  state.user = null;
  saveUser();
  qs("#appShell").classList.add("hidden");
  qs("#loginPage").classList.remove("hidden");
}

function hydrateShell() {
  qs("#roleLabel").textContent = roleName(state.user.role);
  qs("#userBadge").textContent = state.user.station || state.user.department || state.user.name;
  const deptButton = qs('[data-view="departmentDesk"]');
  const raiseButton = qs('[data-view="newComplaint"]');
  const userButton = qs('[data-view="userManagement"]');
  deptButton.style.display = ["department", "control", "bo", "admin", "super"].includes(state.user.role) ? "" : "none";
  raiseButton.style.display = ["station-manager", "super"].includes(state.user.role) ? "" : "none";
  qs('[data-view="settings"]').style.display = ["admin", "super"].includes(state.user.role) ? "" : "none";
  userButton.style.display = state.user.role === "super" ? "" : "none";
}

function statCounts(list) {
  return {
    total: list.length,
    pending: list.filter((item) => item.status === "Pending").length,
    progress: list.filter((item) => item.status === "In Progress").length,
    resolved: list.filter((item) => item.status === "Resolved" || item.status === "Closed").length,
  };
}

function renderDashboard() {
  const list = allowedComplaints();
  const counts = statCounts(list);
  qs("#dashboard").innerHTML = `
    <div class="grid four">
      <article class="stat-card"><h3>Total complaints</h3><p>${counts.total}</p></article>
      <article class="stat-card"><h3>Pending</h3><p>${counts.pending}</p></article>
      <article class="stat-card"><h3>In progress</h3><p>${counts.progress}</p></article>
      <article class="stat-card"><h3>Resolved</h3><p>${counts.resolved}</p></article>
    </div>
    <div class="grid two" style="margin-top:18px">
      <section class="panel">
        <div class="section-title">
          <h3>Recent station issues</h3>
          <button class="chip-btn" data-jump="complaints">View all</button>
        </div>
        <div class="complaint-list">
          ${list.slice(0, 4).map(complaintCard).join("") || emptyState("No complaints visible for this role.")}
        </div>
      </section>
      <section class="panel">
        <h3>Department workload</h3>
        <div class="table-wrap" style="margin-top:14px">
          <table>
            <thead><tr><th>Department</th><th>Open</th><th>Resolved</th></tr></thead>
            <tbody>${departmentRows(list)}</tbody>
          </table>
        </div>
      </section>
    </div>
  `;
}

function departmentRows(list) {
  return departments
    .map((dept) => {
      const deptItems = list.filter((item) => item.department === dept);
      const open = deptItems.filter((item) => item.status !== "Resolved" && item.status !== "Closed").length;
      const resolved = deptItems.length - open;
      return `<tr><td>${dept}</td><td>${open}</td><td>${resolved}</td></tr>`;
    })
    .join("");
}

function renderNewComplaint() {
  const now = new Date();
  const defaultDate = now.toISOString().slice(0, 10);
  const defaultTime = now.toTimeString().slice(0, 5);
  const stationOptions = stations
    .map((station) => `<option ${station === state.user.station ? "selected" : ""}>${station}</option>`)
    .join("");
  qs("#newComplaint").innerHTML = `
    <form id="complaintForm" class="panel grid">
      <div class="section-title">
        <div>
          <h3>Raise complaint to department</h3>
          <p class="muted">Complaint number, date, routing, and history are generated automatically.</p>
        </div>
      </div>
      <div class="grid three">
        <label>Station<select name="station" required>${stationOptions}</select></label>
        <label>Department<select name="department" required>${departments.map((item) => `<option>${item}</option>`).join("")}</select></label>
        <label>Priority<select name="priority"><option>Medium</option><option>High</option><option>Critical</option><option>Low</option></select></label>
      </div>
      <div class="grid two">
        <label>Date of complaint<input name="complaintDate" type="date" value="${defaultDate}" required /></label>
        <label>Time of complaint<input name="complaintTime" type="time" value="${defaultTime}" required /></label>
      </div>
      <div class="grid three">
        <label>Category<select name="category">${categories.map((item) => `<option>${item}</option>`).join("")}</select></label>
        <label>Location<input name="location" placeholder="Platform / concourse / office" required /></label>
        <label>Attachment<input name="attachment" type="file" /></label>
      </div>
      <label>Subject<input name="subject" maxlength="90" placeholder="Short issue title" required /></label>
      <label>Description<textarea name="description" placeholder="Describe the issue, urgency, and requested action" required></textarea></label>
      <button class="primary-btn" type="submit">Submit complaint</button>
    </form>
  `;
  qs("#complaintForm").addEventListener("submit", submitComplaint);
}

function submitComplaint(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  const next = state.complaints.length + 1;
  const created = new Date();
  const complaintDateTime = new Date(`${data.complaintDate}T${data.complaintTime || "00:00"}`);
  const due = new Date(created);
  due.setDate(created.getDate() + (data.priority === "Critical" ? 1 : data.priority === "High" ? 2 : 5));
  const complaint = {
    id: `HWH-2026-${String(next).padStart(4, "0")}`,
    station: data.station,
    department: data.department,
    category: data.category,
    location: data.location,
    priority: data.priority,
    subject: data.subject,
    description: data.description,
    status: "Pending",
    raisedBy: state.user.name,
    createdAt: complaintDateTime.toISOString(),
    complaintDate: data.complaintDate,
    complaintTime: data.complaintTime,
    submittedAt: created.toISOString(),
    dueAt: due.toISOString().slice(0, 10),
    attachmentName: data.attachment?.name || "",
    history: [["Raised", state.user.name, `Complaint registered and sent to ${data.department}.`]],
  };
  state.complaints.unshift(complaint);
  saveComplaints();
  syncComplaintToGoogleSheet(complaint, "created");
  showToast(`Complaint ${complaint.id} submitted`);
  setView("complaints");
}

function renderComplaints() {
  qs("#complaints").innerHTML = `
    <div class="toolbar">
      <input id="searchBox" placeholder="Search station, subject, id" />
      <select id="statusFilter">
        <option value="">All status</option>
        <option>Pending</option>
        <option>In Progress</option>
        <option>Resolved</option>
        <option>Closed</option>
      </select>
      <select id="deptFilter">
        <option value="">All departments</option>
        ${departments.map((item) => `<option>${item}</option>`).join("")}
      </select>
    </div>
    <div id="complaintList" class="complaint-list"></div>
  `;
  ["searchBox", "statusFilter", "deptFilter"].forEach((id) => qs(`#${id}`).addEventListener("input", filterComplaints));
  filterComplaints();
}

function filterComplaints() {
  const search = qs("#searchBox")?.value.toLowerCase() || "";
  const status = qs("#statusFilter")?.value || "";
  const dept = qs("#deptFilter")?.value || "";
  const list = allowedComplaints().filter((item) => {
    const haystack = `${item.id} ${item.station} ${item.subject} ${item.category}`.toLowerCase();
    return (!search || haystack.includes(search)) && (!status || item.status === status) && (!dept || item.department === dept);
  });
  qs("#complaintList").innerHTML = list.map(complaintCard).join("") || emptyState("No complaint matches the selected filters.");
}

function complaintCard(item) {
  return `
    <article class="complaint-card">
      <div>
        <h3>${item.subject}</h3>
        <p class="muted">${item.id} Â· ${item.station} Â· ${item.location}</p>
        <div class="complaint-meta">
          <span class="pill ${statusClass(item.status)}">${item.status}</span>
          <span class="pill">${item.department}</span>
          <span class="pill ${item.priority === "Critical" ? "critical" : ""}">${item.priority}</span>
          <span class="pill">${formatDateTime(item.submittedAt || item.createdAt)}</span>
          <span class="pill">Due ${formatDate(item.dueAt)}</span>
        </div>
      </div>
      <button class="secondary-btn" data-open="${item.id}">Open</button>
    </article>
  `;
}

function statusClass(status) {
  if (status === "Pending") return "pending";
  if (status === "In Progress") return "progress";
  if (status === "Resolved" || status === "Closed") return "resolved";
  return "";
}

function emptyState(text) {
  return `<div class="panel"><p class="muted">${text}</p></div>`;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function formatDateTime(value) {
  if (!value) return "Not recorded";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function googleSheetPayload(item, action) {
  const images = item.rectificationImages || [];
  const latestImage = images.length ? images[images.length - 1] : null;
  return {
    action,
    sheetId: googleSheetId,
    id: item.id,
    station: item.station,
    department: item.department,
    category: item.category,
    location: item.location,
    priority: item.priority,
    subject: item.subject,
    description: item.description,
    status: item.status,
    raisedBy: item.raisedBy,
    complaintDate: item.complaintDate || (item.createdAt || "").slice(0, 10),
    complaintTime: item.complaintTime || "",
    submittedAt: item.submittedAt || item.createdAt,
    dueAt: item.dueAt,
    attachmentName: item.attachmentName || "",
    lastUpdatedAt: item.lastUpdatedAt || "",
    lastUpdatedBy: item.lastUpdatedBy || "",
    rectificationImageName: latestImage?.name || "",
    rectificationImageDataUrl: latestImage?.dataUrl || "",
    rectificationImageType: latestImage?.type || "",
  };
}

async function syncComplaintToGoogleSheet(item, action) {
  const webAppUrl = localStorage.getItem(sheetsUrlKey);
  if (!webAppUrl) return;
  try {
    await fetch(webAppUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(googleSheetPayload(item, action)),
    });
  } catch (error) {
    console.warn("Google Sheet sync failed", error);
  }
}

function openComplaint(id) {
  const item = state.complaints.find((complaint) => complaint.id === id);
  if (!item) return;
  qs("#dialogTitle").textContent = item.id;
  qs("#dialogBody").innerHTML = `
    <div class="grid two">
      <div><strong>Station</strong><p>${item.station}</p></div>
      <div><strong>Department</strong><p>${item.department}</p></div>
      <div><strong>Category</strong><p>${item.category}</p></div>
      <div><strong>Priority</strong><p>${item.priority}</p></div>
      <div><strong>Location</strong><p>${item.location}</p></div>
      <div><strong>Complaint date/time</strong><p>${formatDateTime(item.createdAt)}</p></div>
      <div><strong>Submitted timestamp</strong><p>${formatDateTime(item.submittedAt || item.createdAt)}</p></div>
      <div><strong>Due date</strong><p>${formatDate(item.dueAt)}</p></div>
    </div>
    <hr style="border:0;border-top:1px solid var(--line);margin:14px 0">
    <h4>${item.subject}</h4>
    <p>${item.description}</p>
    <p class="muted">Attachment: ${item.attachmentName || "None"}</p>
    ${(item.rectificationImages || []).map((image) => `<p class="muted">Rectification image: ${escapeHtml(image.name)} uploaded ${formatDateTime(image.uploadedAt)}</p>`).join("")}
    <div class="timeline">
      ${item.history.map(([status, actor, note]) => `<div class="timeline-item"><strong>${status} by ${actor}</strong><span>${note}</span></div>`).join("")}
    </div>
    ${statusControls(item)}
  `;
  qs("#complaintDialog").showModal();
}

function statusControls(item) {
  if (!["control", "bo"].includes(state.user.role)) return "";
  const options = ["Pending", "In Progress", "Resolved", "Closed"];
  return `
    <div class="grid" style="margin-top:14px">
      <select id="newStatus">${options.map((status) => `<option ${status === item.status ? "selected" : ""}>${status}</option>`).join("")}</select>
      <input id="statusRemark" placeholder="Action taken / remarks" />
      <label>Rectification image<input id="rectificationImage" type="file" accept="image/*" /></label>
      <button class="primary-btn" data-update-status="${item.id}">Update status</button>
    </div>
  `;
}

async function updateStatus(id) {
  if (!["control", "bo"].includes(state.user.role)) {
    showToast("Only Control and BO users can resolve complaints.");
    return;
  }
  const item = state.complaints.find((complaint) => complaint.id === id);
  const newStatus = qs("#newStatus").value;
  const remark = qs("#statusRemark").value || `Marked as ${newStatus}.`;
  const imageFile = qs("#rectificationImage")?.files?.[0];
  let imageInfo = null;
  if (imageFile) {
    imageInfo = {
      name: imageFile.name,
      type: imageFile.type,
      size: imageFile.size,
      uploadedAt: new Date().toISOString(),
      dataUrl: await fileToDataUrl(imageFile),
      uploadedBy: state.user.name,
    };
  }
  item.status = newStatus;
  item.lastUpdatedAt = new Date().toISOString();
  item.lastUpdatedBy = state.user.name;
  if (imageInfo) item.rectificationImages = [...(item.rectificationImages || []), imageInfo];
  item.history.push([newStatus, state.user.name, remark]);
  saveComplaints();
  syncComplaintToGoogleSheet(item, "updated");
  qs("#complaintDialog").close();
  showToast(`${item.id} updated`);
  render();
}

function renderDepartmentDesk() {
  const list = ["admin", "super"].includes(state.user.role) ? state.complaints : allowedComplaints();
  qs("#departmentDesk").innerHTML = `
    <section class="panel">
      <div class="section-title">
        <div>
          <h3>Department action desk</h3>
          <p class="muted">Open a complaint to record inspection, action taken, resolution, or closure.</p>
        </div>
      </div>
      <div class="complaint-list">
        ${list.filter((item) => item.status !== "Closed").map(complaintCard).join("") || emptyState("No active complaints for this desk.")}
      </div>
    </section>
  `;
}

function renderReports() {
  const list = allowedComplaints();
  qs("#reports").innerHTML = `
    <section class="panel">
      <div class="section-title">
        <div>
          <h3>Complaint register</h3>
          <p class="muted">Export the visible register for review meetings and department follow-up.</p>
        </div>
        <div class="action-row">
          <button class="secondary-btn" id="exportCsv">Export CSV</button>
          <button class="secondary-btn" id="printReport">Print</button>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>ID</th><th>Station</th><th>Department</th><th>Subject</th><th>Priority</th><th>Status</th><th>Complaint time</th><th>Submitted</th><th>Due</th></tr></thead>
          <tbody>${list.map((item) => `<tr><td>${item.id}</td><td>${item.station}</td><td>${item.department}</td><td>${item.subject}</td><td>${item.priority}</td><td>${item.status}</td><td>${formatDateTime(item.createdAt)}</td><td>${formatDateTime(item.submittedAt || item.createdAt)}</td><td>${formatDate(item.dueAt)}</td></tr>`).join("")}</tbody>
        </table>
      </div>
    </section>
  `;
  qs("#exportCsv").addEventListener("click", exportCsv);
  qs("#printReport").addEventListener("click", () => window.print());
}

function exportCsv() {
  const rows = [
    ["ID", "Station", "Department", "Category", "Subject", "Priority", "Status", "Complaint Date", "Complaint Time", "Submitted At", "Due Date", "Last Updated At", "Last Updated By", "Rectification Image"],
    ...allowedComplaints().map((item) => {
      const images = item.rectificationImages || [];
      const latestImage = images.length ? images[images.length - 1] : null;
      return [item.id, item.station, item.department, item.category, item.subject, item.priority, item.status, item.complaintDate || "", item.complaintTime || "", item.submittedAt || item.createdAt, item.dueAt, item.lastUpdatedAt || "", item.lastUpdatedBy || "", latestImage?.name || ""];
    }),
  ];
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "stationmadad-howrah-register.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function normalizeRole(value) {
  const role = String(value || "").trim().toLowerCase();
  if (["station", "station master", "station manager", "sm"].includes(role)) return "station-manager";
  if (["supervisor", "traffic inspector", "loco inspector", "ti", "li"].includes(role)) return "supervisor";
  if (["control", "control office", "departmental control", "departmental control office"].includes(role)) return "control";
  if (["bo", "branch officer"].includes(role)) return "bo";
  if (["super", "super user", "superuser"].includes(role)) return "super";
  if (["admin", "divisional admin"].includes(role)) return "admin";
  if (["department", "department officer"].includes(role)) return "department";
  return role || "station-manager";
}

function splitStations(value) {
  return String(value || "")
    .split(/[|;]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function userRows() {
  return Object.entries(state.users)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([username, user]) => `
      <tr>
        <td><strong>${escapeHtml(username)}</strong></td>
        <td><input data-user-edit="${escapeHtml(username)}" data-field="name" value="${escapeHtml(user.name)}" /></td>
        <td>
          <select data-user-edit="${escapeHtml(username)}" data-field="role">
            ${["station-manager", "supervisor", "control", "bo", "department", "admin", "super"].map((role) => `<option value="${role}" ${user.role === role ? "selected" : ""}>${roleName(role)}</option>`).join("")}
          </select>
        </td>
        <td><input data-user-edit="${escapeHtml(username)}" data-field="station" value="${escapeHtml(user.station)}" /></td>
        <td><input data-user-edit="${escapeHtml(username)}" data-field="stations" value="${escapeHtml((user.stations || []).join("; "))}" /></td>
        <td>
          <select data-user-edit="${escapeHtml(username)}" data-field="department">
            <option value="">None</option>
            <option value="All" ${user.department === "All" ? "selected" : ""}>All</option>
            ${departments.map((dept) => `<option ${user.department === dept ? "selected" : ""}>${dept}</option>`).join("")}
          </select>
        </td>
        <td><input data-user-edit="${escapeHtml(username)}" data-field="phone" value="${escapeHtml(user.phone)}" /></td>
        <td><input data-user-edit="${escapeHtml(username)}" data-field="password" value="${escapeHtml(user.password)}" /></td>
        <td class="action-row">
          <button class="secondary-btn" data-save-user="${escapeHtml(username)}">Save</button>
          <button class="secondary-btn" data-delete-user="${escapeHtml(username)}">Delete</button>
        </td>
      </tr>
    `)
    .join("");
}

function parseDelimited(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  const delimiter = text.includes("\t") && !text.includes(",") ? "\t" : ",";
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"' && quoted && next === '"') {
      cell += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === delimiter && !quoted) {
      row.push(cell.trim());
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

function parseHtmlTable(text) {
  const doc = new DOMParser().parseFromString(text, "text/html");
  return [...doc.querySelectorAll("tr")].map((tr) => [...tr.children].map((cell) => cell.textContent.trim())).filter((row) => row.length);
}

function rowsToUsers(rows) {
  if (rows.length < 2) return {};
  const headers = rows[0].map((item) => item.toLowerCase().replace(/[^a-z]/g, ""));
  const find = (...names) => names.map((name) => headers.indexOf(name)).find((index) => index >= 0);
  const idx = {
    username: find("username", "userid", "user", "id", "usmid"),
    password: find("password", "pass"),
    name: find("name", "displayname", "username"),
    role: find("role", "level", "usertype"),
    station: find("station", "stationcode", "stationname"),
    stations: find("stations", "assignedstations", "sectionstations", "section"),
    department: find("department", "dept"),
    phone: find("phone", "mobile", "mobilenumber", "phonenumber"),
  };
  const imported = {};
  rows.slice(1).forEach((row) => {
    const username = (row[idx.username] || "").trim().toLowerCase();
    const password = (row[idx.password] || "").trim();
    if (!username || !password) return;
    imported[username] = {
      password,
      name: (row[idx.name] || username).trim(),
      role: normalizeRole(row[idx.role]),
      station: (row[idx.station] || "").trim(),
      stations: splitStations(row[idx.stations]),
      department: (row[idx.department] || "").trim(),
      phone: (row[idx.phone] || "").trim(),
    };
  });
  return imported;
}

function renderUserManagement() {
  if (state.user.role !== "super") {
    qs("#userManagement").innerHTML = emptyState("Only the super user can manage IDs and passwords.");
    return;
  }
  qs("#userManagement").innerHTML = `
    <section class="panel">
      <div class="section-title">
        <div>
          <h3>Google Sheet database</h3>
          <p class="muted">Sheet ID: ${googleSheetId}</p>
        </div>
      </div>
      <div class="grid">
        <label>Apps Script Web App URL
          <input id="sheetsWebAppUrl" value="${escapeHtml(localStorage.getItem(sheetsUrlKey) || "")}" placeholder="Paste deployed Apps Script Web App URL here" />
        </label>
        <div class="action-row">
          <button class="primary-btn" data-save-sheets-url="1">Save Google Sheet sync URL</button>
          <button class="secondary-btn" data-test-sheets-sync="1">Test sync latest complaint</button>
        </div>
      </div>
    </section>
    <section class="panel">
      <div class="section-title">
        <div>
          <h3>Create new user</h3>
          <p class="muted">Create one ID manually and save it into the system.</p>
        </div>
      </div>
      <div class="grid three new-user-form">
        <label>User ID / USMID
          <input id="newUserId" placeholder="e.g. smabc" />
        </label>
        <label>Password
          <input id="newUserPassword" placeholder="Temporary password" />
        </label>
        <label>Name
          <input id="newUserName" placeholder="Officer / station user name" />
        </label>
      </div>
      <div class="grid three new-user-form" style="margin-top:12px">
        <label>Role
          <select id="newUserRole">
            <option value="station-manager">Station Master / Station Manager</option>
            <option value="supervisor">Traffic Inspector / Loco Inspector</option>
            <option value="control">Departmental Control Office</option>
            <option value="bo">Branch Officer</option>
            <option value="department">Department Officer</option>
            <option value="admin">Divisional Admin</option>
            <option value="super">Super User</option>
          </select>
        </label>
        <label>Station
          <select id="newUserStation">
            <option value="">None / Not applicable</option>
            ${stations.map((station) => `<option>${station}</option>`).join("")}
          </select>
        </label>
        <label>Department
          <select id="newUserDepartment">
            <option value="">None / Not applicable</option>
            <option value="All">All</option>
            ${departments.map((dept) => `<option>${dept}</option>`).join("")}
          </select>
        </label>
      </div>
      <div class="grid two new-user-form" style="margin-top:12px">
        <label>Assigned stations for Supervisor
          <input id="newUserStations" placeholder="HWH - HOWRAH; BDC - BANDEL" />
        </label>
        <label>Phone number
          <input id="newUserPhone" placeholder="Mobile number" />
        </label>
      </div>
      <div class="action-row">
        <button class="primary-btn" data-create-user="1">Save new user</button>
        <button class="secondary-btn" data-clear-new-user="1">Clear form</button>
      </div>
    </section>
    <section class="panel">
      <div class="section-title">
        <div>
          <h3>Super user - ID and password control</h3>
          <p class="muted">Upload users from Excel-exported CSV/TSV, edit records, and control access for every role.</p>
        </div>
        <button class="secondary-btn" data-download-template="users">Download template</button>
      </div>
      <div class="grid two">
        <label>Upload user file
          <input id="userUpload" type="file" accept=".csv,.tsv,.txt,.xls,.html,.xlsx" />
        </label>
        <label>Import mode
          <select id="importMode">
            <option value="merge">Merge/update existing IDs</option>
            <option value="replace">Replace all IDs except current super user</option>
          </select>
        </label>
      </div>
      <div class="demo-box" style="margin-top:12px">
        <strong>Required columns</strong>
        <span class="muted">username, password, name, role, station, stations, department, phone</span>
        <span class="muted">For supervisor users, put multiple stations in the stations column separated by semicolon. Example: HWH - HOWRAH; BDC - BANDEL</span>
        <span class="muted">For offline portability, use CSV/TSV from Excel. Simple Excel .xls HTML tables are also accepted. Native .xlsx needs conversion to CSV first.</span>
      </div>
    </section>
    <section class="panel">
      <div class="section-title">
        <h3>Current users (${Object.keys(state.users).length})</h3>
      </div>
      <div class="table-wrap user-table">
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>Role</th><th>Station</th><th>Assigned stations</th><th>Department</th><th>Phone</th><th>Password</th><th>Action</th></tr></thead>
          <tbody>${userRows()}</tbody>
        </table>
      </div>
    </section>
  `;
  qs("#userUpload").addEventListener("change", importUsersFromFile);
}

async function importUsersFromFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.name.toLowerCase().endsWith(".xlsx")) {
    showToast("Please save the Excel file as CSV, then upload it here.");
    event.target.value = "";
    return;
  }
  const text = await file.text();
  const rows = /<table|<tr/i.test(text) ? parseHtmlTable(text) : parseDelimited(text);
  const imported = rowsToUsers(rows);
  const count = Object.keys(imported).length;
  if (!count) {
    showToast("No users imported. Check columns: username, password, role.");
    return;
  }
  const mode = qs("#importMode").value;
  if (mode === "replace") {
    delete imported[state.user.username];
    state.users = { ...imported, [state.user.username]: state.users[state.user.username] };
  } else {
    state.users = { ...state.users, ...imported };
  }
  saveUsers();
  showToast(`${count} user IDs imported`);
  renderUserManagement();
}

function saveEditedUser(username) {
  const user = { ...state.users[username] };
  qsa(`[data-user-edit="${CSS.escape(username)}"]`).forEach((input) => {
    const field = input.dataset.field;
    user[field] = field === "stations" ? splitStations(input.value) : input.value.trim();
  });
  state.users[username] = user;
  if (state.user.username === username) state.user = { ...state.user, ...user };
  saveUsers();
  saveUser();
  showToast(`${username} saved`);
  renderUserManagement();
}

function createNewUser() {
  const username = qs("#newUserId")?.value.trim().toLowerCase();
  const password = qs("#newUserPassword")?.value.trim();
  const name = qs("#newUserName")?.value.trim();
  const role = qs("#newUserRole")?.value;
  const station = qs("#newUserStation")?.value.trim();
  const stationsText = qs("#newUserStations")?.value.trim();
  const department = qs("#newUserDepartment")?.value.trim();
  const phone = qs("#newUserPhone")?.value.trim();

  if (!username || !password || !name || !role) {
    showToast("User ID, password, name, and role are required.");
    return;
  }
  if (state.users[username]) {
    showToast("This user ID already exists. Edit it in Current users.");
    return;
  }
  if (role === "station-manager" && !station) {
    showToast("Station is required for Station Manager users.");
    return;
  }
  if (["control", "bo", "department"].includes(role) && !department) {
    showToast("Department is required for this role.");
    return;
  }
  if (role === "supervisor" && !stationsText) {
    showToast("Assigned stations are required for Supervisor users.");
    return;
  }

  state.users[username] = {
    password,
    name,
    role,
    station,
    stations: splitStations(stationsText),
    department,
    phone,
  };
  saveUsers();
  showToast(`${username} created and saved`);
  renderUserManagement();
}

function clearNewUserForm() {
  ["newUserId", "newUserPassword", "newUserName", "newUserStations", "newUserPhone"].forEach((id) => {
    const input = qs(`#${id}`);
    if (input) input.value = "";
  });
  const role = qs("#newUserRole");
  const station = qs("#newUserStation");
  const department = qs("#newUserDepartment");
  if (role) role.value = "station-manager";
  if (station) station.value = "";
  if (department) department.value = "";
}

function deleteUser(username) {
  if (username === state.user.username) {
    showToast("Current super user cannot delete itself.");
    return;
  }
  delete state.users[username];
  saveUsers();
  showToast(`${username} deleted`);
  renderUserManagement();
}

function downloadUserTemplate() {
  const rows = [
    ["username", "password", "name", "role", "station", "stations", "department", "phone"],
    ["smabc", "pass123", "SM ABC", "station-manager", "HWH - HOWRAH", "", "", "9000000001"],
    ["tisection1", "pass123", "TI Section 1", "supervisor", "", "HWH - HOWRAH; BDC - BANDEL", "Operating", "9000000002"],
    ["enggcontrol", "pass123", "Engineering Control", "control", "", "", "Engineering", "9000000003"],
    ["boengg", "pass123", "BO Engineering", "bo", "", "", "Engineering", "9000000004"],
  ];
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "stationmadad-user-upload-template.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function saveSheetsUrl() {
  const url = qs("#sheetsWebAppUrl")?.value.trim();
  if (!url) {
    localStorage.removeItem(sheetsUrlKey);
    showToast("Google Sheet sync URL cleared");
    return;
  }
  localStorage.setItem(sheetsUrlKey, url);
  showToast("Google Sheet sync URL saved");
}

function testSheetsSync() {
  saveSheetsUrl();
  const latest = state.complaints[0];
  if (!latest) {
    showToast("No complaint available to test sync.");
    return;
  }
  syncComplaintToGoogleSheet(latest, "test");
  showToast("Test sync sent to Google Sheet bridge");
}

function renderSettings() {
  qs("#settings").innerHTML = `
    <div class="grid two">
      <section class="panel">
        <h3>Station master</h3>
        <div class="table-wrap" style="margin-top:14px">
          <table><thead><tr><th>Station</th><th>Division</th></tr></thead><tbody>${stations.map((station) => `<tr><td>${station}</td><td>Howrah</td></tr>`).join("")}</tbody></table>
        </div>
      </section>
      <section class="panel">
        <h3>Department master</h3>
        <div class="table-wrap" style="margin-top:14px">
          <table><thead><tr><th>Department</th><th>Routing</th></tr></thead><tbody>${departments.map((dept) => `<tr><td>${dept}</td><td>${dept} Officer, HWH</td></tr>`).join("")}</tbody></table>
        </div>
      </section>
    </div>
  `;
}

function render() {
  if (!state.user) return;
  hydrateShell();
  if (state.currentView === "dashboard") renderDashboard();
  if (state.currentView === "newComplaint") renderNewComplaint();
  if (state.currentView === "complaints") renderComplaints();
  if (state.currentView === "departmentDesk") renderDepartmentDesk();
  if (state.currentView === "reports") renderReports();
  if (state.currentView === "settings") renderSettings();
  if (state.currentView === "userManagement") renderUserManagement();
}

document.addEventListener("click", (event) => {
  const openId = event.target.closest("[data-open]")?.dataset.open;
  const updateId = event.target.closest("[data-update-status]")?.dataset.updateStatus;
  const jump = event.target.closest("[data-jump]")?.dataset.jump;
  const saveUserId = event.target.closest("[data-save-user]")?.dataset.saveUser;
  const deleteUserId = event.target.closest("[data-delete-user]")?.dataset.deleteUser;
  const downloadTemplate = event.target.closest("[data-download-template]")?.dataset.downloadTemplate;
  const saveSheets = event.target.closest("[data-save-sheets-url]")?.dataset.saveSheetsUrl;
  const testSheets = event.target.closest("[data-test-sheets-sync]")?.dataset.testSheetsSync;
  const createUser = event.target.closest("[data-create-user]")?.dataset.createUser;
  const clearNewUser = event.target.closest("[data-clear-new-user]")?.dataset.clearNewUser;
  if (openId) openComplaint(openId);
  if (updateId) updateStatus(updateId);
  if (jump) setView(jump);
  if (saveUserId) saveEditedUser(saveUserId);
  if (deleteUserId) deleteUser(deleteUserId);
  if (downloadTemplate) downloadUserTemplate();
  if (saveSheets) saveSheetsUrl();
  if (testSheets) testSheetsSync();
  if (createUser) createNewUser();
  if (clearNewUser) clearNewUserForm();
});

qs("#loginForm").addEventListener("submit", (event) => {
  event.preventDefault();
  login(qs("#username").value.trim(), qs("#password").value);
});

qsa(".demo-login").forEach((button) => {
  button.addEventListener("click", () => {
    const username = button.dataset.user;
    qs("#username").value = username;
    qs("#password").value = demoUsers[username].password;
    login(username, demoUsers[username].password);
  });
});

qsa(".nav-list button").forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
qs("#logoutBtn").addEventListener("click", logout);
qs("#closeDialog").addEventListener("click", () => qs("#complaintDialog").close());
qs("#menuBtn").addEventListener("click", () => qs(".sidebar").classList.toggle("open"));
qs("#togglePassword").addEventListener("click", () => {
  const password = qs("#password");
  password.type = password.type === "password" ? "text" : "password";
});

loadState();
if (state.user) {
  qs("#loginPage").classList.add("hidden");
  qs("#appShell").classList.remove("hidden");
  hydrateShell();
  setView("dashboard");
}


