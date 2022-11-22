const JOB_DISPLAY_INCREMENT = 25;
const NO_MORE_JOBS_TEXT = "You've reached the end of the line.";

let jobsDisplayed = 0;
let maxJobsDisplayed = 0;
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
    let listItemId = `list-item-${index + maxJobsDisplayed}`;
    let tabId = `tab-${index + maxJobsDisplayed}`;

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

function displayJobs(params) {
    let moreButton = $("#more-button");
    moreButton.prop("disabled", true);

    $.getJSON("/jobs", params, function (data) {
        $("#main-spinner").hide();

        moreButton.parent().removeClass("invisible");

        if (!data.length) {
            // data.length could be undefined if empty
            data.length = 0;
        }

        if (jobsDisplayed === data.length) {
            // no new jobs were scraped => end
            scrapeMoreJobs = false;

            moreButton.hide();
            $("#more-button ~ small").text(NO_MORE_JOBS_TEXT);

        } else {
            jobsDisplayed += data.length;
            
            removeAllJobs();
            $.each(data, function (index, job) {
                addJob(job, index);
            });
            filterJobs();

            moreButton.prop("disabled", false);
        }
    });
}

function getFilterParams() {
    let checkedLangCodes = getCheckedValues(getCheckedSelector("lang_code"));
    let checkedYOE = getCheckedValues(getCheckedSelector("years_of_experience"));

    return {
        "lang_code": checkedLangCodes,
        "years_of_experience": checkedYOE,
    };
}

function filterJobs() {
    let params = getFilterParams();

    let moreButton = $("#more-button");
    moreButton.prop("disabled", true);

    $.getJSON("/filter", params, function (data) {
        removeAllJobs();

        moreButton.prop("disabled", false);
        moreButton.parent().removeClass("invisible");

        if (!scrapeMoreJobs) {
            moreButton.hide();
            $("#more-button ~ small").text(NO_MORE_JOBS_TEXT);

        }
        if (data.length) {
            $.each(data, function (index, job) {
                addJob(job, index);
            });
            selectFirstJob();
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
    maxJobsDisplayed = 0;
    scrapeMoreJobs = true;
    removeAllJobs();

    $("#main-spinner").show();
    $("#more-button").parent().addClass("invisible");
    $("#more-button ~ small").text("");

    displayJobs(getURLSearchParams());
});

$(document).ready(function() {
    $("#filter-form").submit(function (e) {
        e.preventDefault();
        filterJobs();
    });
});

$(document).ready(function () {
   $("#more-button").click(function () {
       $(this).prop("disabled", true);

        if (scrapeMoreJobs) {
            let searchParams = getURLSearchParams();

            maxJobsDisplayed += JOB_DISPLAY_INCREMENT;
            searchParams["start"] = maxJobsDisplayed;

            displayJobs(searchParams);
        }
    });
});
