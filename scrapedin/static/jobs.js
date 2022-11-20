$(document).ready(function () {
    displayJobs("/jobs", getURLSearchParams());
});

function getURLSearchParams() {
    let urlParams = new URLSearchParams(window.location.search);
    let extractedParams = {};

    for (const key of urlParams.keys()) {
        extractedParams[key] = urlParams.getAll(key).join(",");
    }

    return extractedParams;
}

function displayJobs(endpoint, params) {
    $("#spinner").show();

    $.getJSON(endpoint, params, function (data) {
        $("#spinner").hide();

        refreshJobs();

        $.each(data, function (index, job) {
            addJob(job, index);
        });
    });
}

function refreshJobs() {
    document.querySelectorAll("#job-list > .list-group-item").forEach(e => e.remove());
    document.querySelectorAll("#job-tabs > .tab-pane").forEach(e => e.remove());
}

function addJob(job, index) {
    let listItemId = `list-item-${index}`;
    let tabId = `tab-${index}`;

    let jobListItem = createJobListItem(index, job, listItemId, tabId);
    document.querySelector("#job-list").appendChild(jobListItem);

    let jobTab = createJobTab(index, job, listItemId, tabId);
    document.querySelector("#job-tabs").appendChild(jobTab);
}

function createJobListItem(index, job, listItemId, tabId) {
    const template = document.querySelector("#job-list-item");
    const clone = template.content.cloneNode(true);

    let a = clone.querySelector("a");
    a.setAttribute("id", listItemId);
    a.setAttribute("href", `#${tabId}`);
    a.setAttribute("aria-controls", tabId);

    if (index === 0) {
        a.classList.add("active");
    }

    clone.querySelector("h5").textContent = job.title;
    clone.querySelector("p").textContent = job.subtitle;

    let small = clone.querySelectorAll("small");
    small[0].textContent = job.list_date_text;
    small[1].textContent = job.location;

    return clone;
}

function createJobTab(index, job, listItemId, tabId) {
    const template = document.querySelector("#job-tab");
    const clone = template.content.cloneNode(true);

    let firstDiv = clone.querySelector("div");
    firstDiv.setAttribute("id", tabId);
    firstDiv.setAttribute("aria-labelledby", listItemId);

    if (index === 0) {
        firstDiv.classList.add("show");
        firstDiv.classList.add("active");
    }

    let h5Link = clone.querySelector("h5 > a");
    h5Link.setAttribute("href", job.url);
    h5Link.textContent = job.title;

    let p = clone.querySelectorAll("p");
    p[0].textContent = job.subtitle;
    p[1].innerHTML = job.description;

    clone.querySelector("img").setAttribute("src", job.icon_url);

    clone.querySelector("small").innerHTML = `${job.location} &bull; ${job.list_date}`;

    return clone;
}

function getCheckedSelector(inputName) {
    return `input[name=${inputName}]:checked`
}

function getCheckedValues(selector) {
    return $(selector).map((i, input) => input.value).get();
}

$(document).ready(function() {
    $("#filter-form").submit(function (e) {
        e.preventDefault();

        let checkedLangCodes = getCheckedValues(getCheckedSelector("lang_code"));
        let checkedYOE = getCheckedValues(getCheckedSelector("years_of_experience"));

        let params = {
            "lang_code": checkedLangCodes,
            "years_of_experience": checkedYOE,
        }

        displayJobs("/filter", params);
    });
});
