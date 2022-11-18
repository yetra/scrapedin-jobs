$(document).ready(function () {
    displayJobs("/jobs");
});

function displayJobs(endpoint, params) {
    $.getJSON(endpoint, params, function (data) {
        $("#job-list").html("");
        $("#job-descriptions").html("");

        $.each(data, function (index, job) {
            addJob(job, index);
        });
    });
}

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
            <small class="col-auto">${job.list_date_text}</small>
          </div>
          <p class="mb-1">${job.subtitle}</p>
          <small>${job.location}</small>
        </a>
    `);

    $("#job-descriptions").append(`
        <div class="${tabClass}" id="${tabId}" role="tabpanel" aria-labelledby="${listItemId}">
            <div class="description card mb-3">
                <div class="card-body">
                  <div class="row">
                    <div class="col">
                      <h5 class="card-title">${job.title}</h5>
                      <p class="card-subtitle mb-2">${job.subtitle}</p>
                    </div>
                    <div class="col-auto text-end">
                      <img src="${job.icon_url}" alt="">
                    </div>
                  </div>
                  <small class="text-muted">${job.location} &bull; ${job.list_date}</small>
                  <p class="card-text">
                    ${job.description}
                  </p>
                </div>
              </div>
        </div>
    `);
}

function getCheckedSelector(inputName) {
    return `input[name=${inputName}]:checked`
}

function getCheckedValues(selector) {
    return $(selector).map((i, input) => input.value).get();
}

$(document).ready(function() {
    $("#filter-form").submit(function (e) {
        alert('intercept');
        e.preventDefault();

        let params = {
            'lang_code': getCheckedValues(getCheckedSelector('lang_code')),
            'years_of_experience': getCheckedValues(getCheckedSelector('years_of_experience'))
        }

        displayJobs("/filter", params);
    });
});
