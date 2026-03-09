const issuesContainer = document.getElementById("issuesContainer");
const issueCount = document.getElementById("issueCount");
const spinner = document.getElementById("spinner");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const allTabs = document.querySelectorAll("[data-tab]");
const issueModal = document.getElementById("issueModal");

let allIssues = [];
let activeTab = "all";

function showSpinner() {
  spinner.classList.remove("hidden");
}

function hideSpinner() {
  spinner.classList.add("hidden");
}

function getBorderClass(status) {
  const statusLower = (status || "").toString().toLowerCase().trim();
  
  if (statusLower === "closed") {
    return "border-t-4 border-[#A855F7]";
  } else {
    return "border-t-4 border-[#10B981]";
  }
}


function getStatusIcon(status) {
  const statusLower = (status || "").toString().toLowerCase().trim();
  
  if (statusLower === "closed") {
    return `
      <div class="w-7 h-7 rounded-full bg-[#EDE9FE] flex items-center justify-center flex-shrink-0">
        <img src="assets/closed.png" alt="closed" class="w-4 h-4 object-contain">
      </div>
    `;
  } else {
    return `
      <div class="w-7 h-7 rounded-full bg-[#D1FAE5] flex items-center justify-center flex-shrink-0">
        <img src="assets/open.png" alt="open" class="w-4 h-4 object-contain">
      </div>
    `;
  }
}

function getPriorityBadge(priority) {
  const priorityLower = (priority || "medium").toString().toLowerCase().trim();
  
  if (priorityLower === "high") {
    return `<span class="text-[11px] font-semibold uppercase px-3 py-1 rounded-full bg-[#FEE2E2] text-[#DC2626]">HIGH</span>`;
  } else if (priorityLower === "medium") {
    return `<span class="text-[11px] font-semibold uppercase px-3 py-1 rounded-full bg-[#FEF3C7] text-[#D97706]">MEDIUM</span>`;
  } else {
    return `<span class="text-[11px] font-semibold uppercase px-3 py-1 rounded-full bg-[#F3F4F6] text-[#6B7280]">LOW</span>`;
  }
}


function getLabels(issue) {
  const category = issue.category || "Bug";
  const label = issue.label || "Help Wanted";
  
  let labelsHtml = "";
  
  if (category.toString().toLowerCase() === "enhancement") {
    labelsHtml += `<span class="inline-flex items-center text-[11px] px-3 py-1 rounded-full bg-[#D1FAE5] text-[#059669] border border-[#6EE7B7]">${category}</span>`;
  } else {
    labelsHtml += `<span class="inline-flex items-center text-[11px] px-3 py-1 rounded-full bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5]">${category}</span>`;
  }
  
  labelsHtml += `<span class="inline-flex items-center text-[11px] px-3 py-1 rounded-full bg-[#FEF3C7] text-[#D97706] border border-[#FCD34D]">${label}</span>`;
  
  return labelsHtml;
}

function formatDate(dateText) {
  if (!dateText) return "No Date";
  const date = new Date(dateText);
  if (isNaN(date.getTime())) return dateText;
  return date.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
}

function renderIssues(issues) {
  issuesContainer.innerHTML = "";
  issueCount.innerText = issues.length;

  if (issues.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  } else {
    emptyState.classList.add("hidden");
  }

  for (let i = 0; i < issues.length; i++) {
    const issue = issues[i];
    
    const card = document.createElement("div");
    card.className = "bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow " + getBorderClass(issue.status);

    const statusIconHTML = getStatusIcon(issue.status);

    card.innerHTML = `
      <div class="p-5">
        <div class="flex items-start justify-between gap-3 mb-4">
          <div>
            ${statusIconHTML}
          </div>
          <div>
            ${getPriorityBadge(issue.priority)}
          </div>
        </div>

        <h3 class="font-semibold text-[#1E293B] text-[15px] leading-snug cursor-pointer hover:text-[#5B21B6] issue-title min-h-[44px]">
          ${issue.title || "No Title"}
        </h3>

        <p class="text-[13px] leading-relaxed text-slate-500 mt-3 min-h-[60px]">
          ${(issue.description || "No description available").slice(0, 90)}...
        </p>

        <div class="mt-4 flex flex-wrap gap-2">
          ${getLabels(issue)}
        </div>
      </div>

      <div class="border-t border-slate-200 bg-slate-50 px-5 py-3">
        <p class="text-[13px] text-slate-600">#${issue.id || i + 1} by ${issue.author || "john_doe"}</p>
        <p class="text-[13px] text-slate-500 mt-1">${formatDate(issue.createdAt)}</p>
      </div>
    `;

    const title = card.querySelector(".issue-title");
    title.addEventListener("click", function () {
      console.log("Opening issue:", issue);
      if (issue && issue.id) {
        openModal(issue);
      } else {
        console.error("Invalid issue data:", issue);
        alert("Error loading issue details. Please try again.");
      }
    });

    issuesContainer.appendChild(card);
  }
}

function openModal(issue) {
  if (!issue) {
    console.error("No issue data provided");
    return;
  }

  const modalTitle = document.getElementById("modalTitle");
  const modalStatus = document.getElementById("modalStatus");
  const modalDescription = document.getElementById("modalDescription");
  const modalAuthor = document.getElementById("modalAuthor");
  const modalCreatedAt = document.getElementById("modalCreatedAt");
  const modalLabels = document.getElementById("modalLabels");
  const modalPriority = document.getElementById("modalPriority");
  const modalAssignee = document.getElementById("modalAssignee");

  modalTitle.innerText = issue.title || "No Title";

  const statusLower = (issue.status || "open").toString().toLowerCase().trim();
  if (statusLower === "closed") {
    modalStatus.className = "badge bg-[#EDE9FE] text-[#7C3AED] border-0";
    modalStatus.innerText = "Closed";
  } else {
    modalStatus.className = "badge bg-[#D1FAE5] text-[#059669] border-0";
    modalStatus.innerText = "Open";
  }

  modalAuthor.innerText = issue.author || "Unknown";
  modalCreatedAt.innerText = formatDate(issue.createdAt) || "No date";

  const category = issue.category || "Bug";
  const label = issue.label || "Help Wanted";
  
  let categoryClass = category.toString().toLowerCase() === "enhancement"
    ? "bg-[#D1FAE5] text-[#059669] border border-[#6EE7B7]"
    : "bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5]";
  
  modalLabels.innerHTML = `
    <span class="inline-flex items-center text-xs px-3 py-1 rounded-full ${categoryClass}">${category}</span>
    <span class="inline-flex items-center text-xs px-3 py-1 rounded-full bg-[#FEF3C7] text-[#D97706] border border-[#FCD34D]">${label}</span>
  `;

  modalDescription.innerText = issue.description || "No description available";
  modalAssignee.innerText = issue.assignee || issue.author || "Unassigned";

  const priorityLower = (issue.priority || "medium").toString().toLowerCase().trim();
  if (priorityLower === "high") {
    modalPriority.className = "inline-block px-3 py-1 rounded-full text-sm font-medium bg-[#FEE2E2] text-[#DC2626]";
    modalPriority.innerText = "HIGH";
  } else if (priorityLower === "medium") {
    modalPriority.className = "inline-block px-3 py-1 rounded-full text-sm font-medium bg-[#FEF3C7] text-[#D97706]";
    modalPriority.innerText = "MEDIUM";
  } else {
    modalPriority.className = "inline-block px-3 py-1 rounded-full text-sm font-medium bg-[#F3F4F6] text-[#6B7280]";
    modalPriority.innerText = "LOW";
  }

  issueModal.showModal();
}

async function loadAllIssues() {
  showSpinner();
  
  try {
    const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
    const data = await res.json();
    
    console.log("API Response:", data);
    allIssues = data.data || data;
    
    if (!Array.isArray(allIssues)) {
      console.error("Issues data is not an array:", allIssues);
      allIssues = [];
    }
    
    console.log("Total Issues loaded:", allIssues.length);
    filterByTab(activeTab);
  } catch (error) {
    console.error("Error loading issues:", error);
    alert("Failed to load issues. Please refresh the page.");
  } finally {
    hideSpinner();
  }
}

function filterByTab(tabName) {
  activeTab = tabName;
  
  allTabs.forEach(tab => {
    if (tab.getAttribute("data-tab") === tabName) {
      tab.classList.add("tab-active", "bg-[#5B21B6]", "text-white");
    } else {
      tab.classList.remove("tab-active", "bg-[#5B21B6]", "text-white");
    }
  });

  let filteredIssues = [];
  
  if (tabName === "all") {
    filteredIssues = allIssues;
  } else if (tabName === "open") {
    filteredIssues = allIssues.filter(issue => {
      const status = (issue.status || "").toString().toLowerCase().trim();
      return status === "open" || status === "" || status === "undefined" || !issue.status;
    });
  } else if (tabName === "closed") {
    filteredIssues = allIssues.filter(issue => {
      const status = (issue.status || "").toString().toLowerCase().trim();
      return status === "closed";
    });
  }

  renderIssues(filteredIssues);
}


allTabs.forEach(tab => {
  tab.addEventListener("click", function () {
    const tabName = this.getAttribute("data-tab");
    filterByTab(tabName);
  });
});


async function searchIssues() {
  const searchText = searchInput.value.trim();

  if (searchText === "") {
    filterByTab(activeTab);
    return;
  }

  showSpinner();

  try {
    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${encodeURIComponent(searchText)}`);
    const data = await res.json();
    
    const searchedIssues = data.data || data;
    renderIssues(searchedIssues);
  } catch (error) {
    console.error("Error searching issues:", error);
  } finally {
    hideSpinner();
  }
}

searchBtn.addEventListener("click", searchIssues);

searchInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    searchIssues();
  }
});

loadAllIssues();