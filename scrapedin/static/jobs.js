$(document).ready(function () {
    $.getJSON("/jobs", function (data) {
        $.each(data, function (index, job) {
            addJob(job, index);
        });
    });
});

function addJob(job, index) {
    let listItemId = `list-item-${index}`;
    let tabId = `tab-${index}`;

    let listItemClass = "list-group-item list-group-item-action";
    let tabClass = "tab-pane fade";

    if (index === 0) {
        listItemClass += " active";
        tabClass += " show active";
    }

    $("#job-list").append(`
        <a href="#${tabId}" class="${listItemClass}" id="${listItemId}" data-bs-toggle="list" role="tab" aria-controls="${tabId}">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${job.title}</h5>
            <small>${job.listdate}</small>
          </div>
          <p class="mb-1">${job.subtitle}</p>
          <small>${job.location}</small>
        </a>
    `);

    $("#job-descriptions").append(`
        <div class="${tabClass}" id="${tabId}" role="tabpanel" aria-labelledby="${listItemId}">
            <div class="description card mb-3">
                <div class="card-body">
                  <h5 class="card-title">${job.title}</h5>
                  <p class="card-subtitle mb-2">${job.subtitle}</p>
                  <small class="text-muted">${job.location} &bull; ${job.listdate}</small>
                  <p class="card-text">
                    ${job.description}
                  </p>
                </div>
              </div>
        </div>
    `);
}

