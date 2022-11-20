const JOB_DISPLAY_INCREMENT = 25;

let jobsDisplayed = 0;
let scrapeMoreJobs = true;


function getURLSearchParams() {
    let urlParams = new URLSearchParams(window.location.search);
    let extractedParams = {};

    for (const key of urlParams.keys()) {
        extractedParams[key] = urlParams.getAll(key).join(",");
    }

    return extractedParams;
}

function removeAllJobs() {
    document.querySelectorAll("#job-list > div > .list-group-item").forEach(e => e.remove());
    document.querySelectorAll("#job-tabs .tab-pane").forEach(e => e.remove());
}

function createJobListItem(index, job, listItemId, tabId) {
    const template = document.querySelector("#job-list-item");
    const clone = template.content.cloneNode(true);

    let a = clone.querySelector("a");
    a.setAttribute("id", listItemId);
    a.setAttribute("href", `#${tabId}`);
    a.setAttribute("aria-controls", tabId);

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

function addJob(job, index) {
    let listItemId = `list-item-${index + jobsDisplayed}`;
    let tabId = `tab-${index + jobsDisplayed}`;

    let jobListItem = createJobListItem(index, job, listItemId, tabId);
    document.querySelector("#job-list > div").appendChild(jobListItem);

    let jobTab = createJobTab(index, job, listItemId, tabId);
    document.querySelector("#job-tabs").appendChild(jobTab);
}

function selectFirstJob() {
    let firstJobItem = document.querySelector("#job-list .list-group-item");
    firstJobItem.classList.add("active");

    let firstJobTab = document.querySelector("#job-tabs .tab-pane");
    firstJobTab.classList.add("show");
    firstJobTab.classList.add("active");
}

function displayJobs(endpoint, params) {
    let moreButton = $("#more-button");
    moreButton.prop("disabled", true);

    $.getJSON(endpoint, params, function (data) {
        $("#main-spinner").hide();

        $.each(data, function (index, job) {
            addJob(job, index);
        });

        if (!data.length) {
            // disable more scraping if response was empty
            scrapeMoreJobs = false;
        } else {
            selectFirstJob();
            moreButton.prop("disabled", false);
            moreButton.parent().removeClass("invisible");
        }
    });
}

function getCheckedSelector(inputName) {
    return `input[name=${inputName}]:checked`
}

function getCheckedValues(selector) {
    return $(selector).map((i, input) => input.value).get();
}


$(document).ready(function () {
    jobsDisplayed = 0;
    scrapeMoreJobs = true;
    removeAllJobs();

    $("#main-spinner").show();
    $("#more-button").parent().addClass("invisible");

    displayJobs("/jobs", getURLSearchParams());
});

$(document).ready(function() {
    $("#filter-form").submit(function (e) {
        e.preventDefault();

        let checkedLangCodes = getCheckedValues(getCheckedSelector("lang_code"));
        let checkedYOE = getCheckedValues(getCheckedSelector("years_of_experience"));

        let params = {
            "lang_code": checkedLangCodes,
            "years_of_experience": checkedYOE,
        }

        removeAllJobs();
        displayJobs("/filter", params);
    });
});

$(document).ready(function () {
   $("#more-button").click(function () {
       $(this).prop("disabled", true);

        if (scrapeMoreJobs) {
            let searchParams = getURLSearchParams();

            jobsDisplayed += JOB_DISPLAY_INCREMENT;
            searchParams["start"] = jobsDisplayed;

            displayJobs("/jobs", searchParams);
        }
    });
});
