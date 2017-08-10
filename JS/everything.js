const ISSUES_IN_WORK = [];
const ISSUES_PR = [];

$(function() {
    init();
});

function init() {
    var issuesSearchResults = [];
    var uri = 'https://api.github.com/search/issues?q=language:JavaScript+is:up-for-grabs+state:open';
    listenSEARCH(uri);
}

function listenSEARCH(uri) {
    $('#main-search').on('click', function(e) {
        e.preventDefault();
        $.getJSON(uri, function(json) {
            if (json.message == 'Not found') {
                // $('#search-results').html("Nothing matches the request");
                console.log("Some error. No search results");
            } else {
                showSearchResults(json);
                listenClickEvents(clickINWORK);
            }
        });
    });
}

function showSearchResults(json) {
    issuesSearchResults = json.items;
    let resultsNumber = json.total_count;
    let outHTML = '<h2>' + resultsNumber + ' issues</h2>';
    let items = issuesSearchResults;
    items.forEach(function(item, i, items) {
        outHTML += addSearchResultItem(item, i);
    });
    $('#search-results').html(outHTML);
}

function listenClickEvents(...callbacks) {
    for (let callback of callbacks) {
        callback();
    }
}

function clickINWORK() {
    $('.in-work').on('click', function(e) {
        e.preventDefault();
        let issueID = getNumberFromString($(this).parent().attr('id'));
        addIssueInWork(issueID);
        $(this).parent().hide();
        let issue = ISSUES_IN_WORK.pop();
        ISSUES_IN_WORK.push(issue);
        updateManagerData('add in_work', issue);
        listenClickEvents(clickPR, clickDEL);
    });
}

function clickPR() {
    $('.button-pr').on('click', function(e) {
        e.preventDefault();
        let issueID = getNumberFromString($(this).parent().parent().parent().attr('id'));
        addIssueToPR(issueID);
        $(this).parent().parent().parent().hide();
        let issue = ISSUES_PR.pop();
        ISSUES_PR.push(issue);
        updateManagerData('add pr', issue);
    });
}

function clickDEL() {
    $('.button-del').on('click', function(e) {
        e.preventDefault();
        let issueID = getNumberFromString($(this).parent().parent().parent().attr('id'));
        delIssue(issueID);
        $(this).parent().parent().parent().hide();
        updateManagerData('del');
    });
}

function addSearchResultItem(item, position) {
    let outHTML = '';
    let title = '<div class="item-title"><h4><a href="' + item.html_url + '">' + item.title + '</a></h4></div>';
    let descr = '<div class="item-descr">' + item.body + '</div>';
    let number = '<div class="item-number">#' + item.number + '</div>';
    let inWorkButton = '<button type="button" class="in-work btn btn-primary">In Work</button>'
    outHTML = number + title + descr + inWorkButton;
    outHTML = '<li id="item-' + position + '">' + outHTML + '</li>';
    return outHTML;
}

function getNumberFromString(str) {
    return str.match(/\d+/g)[0];
}

function addIssueInWork(issueID) {
    let position = getNumberFromString(issueID);
    let inWorkIssueList = $('#issue-in-work').find('ul').html();
    let newIssue = '';
    let items = issuesSearchResults;
    let issue = {
        url: items[position].html_url,
        title: items[position].title
    }
    let newIssueID = 'issue-in-work-' + ISSUES_IN_WORK.length;
    let title = '<a href="' + issue.url + '">' + issue.title + '</a>';
    let prButton = '<button class="button-pr btn btn-success btn-sm">PR</button>';
    let delButton = '<button class="button-del btn btn-danger btn-sm">DEL</button>';
    let buttons = prButton + delButton;
    newIssue += '<div class="col-md-7">' + title + '</div>';
    newIssue += '<div class="col-md-5 btn-group pull-right">' + buttons + '</div>';
    inWorkIssueList += '<li id="' + newIssueID + '"><div class="row issue-in-columns">' + newIssue + '</div></li>';
    $('#issue-in-work').find('ul').html(inWorkIssueList);
    ISSUES_IN_WORK.push(issue);
}

function addIssueToPR(issueID) {
    let position = getNumberFromString(issueID);
    let prIssueList= $('#pr-issue').find('ul').html();
    let newIssue = '';
    let issue = {
        url: ISSUES_IN_WORK[position].url,
        title: ISSUES_IN_WORK[position].title
    }
    let title = '<a href="' + issue.url + '">' + issue.title + '</a>';
    newIssue += '<li><div class="issue-in-columns">' + title + '</div></li>';
    prIssueList += newIssue;
    $('#pr-issue').find('ul').html(prIssueList);
    ISSUES_PR.push(issue);
    ISSUES_IN_WORK.pop();
}

function delIssue(id) {
    ISSUES_IN_WORK.pop();
}

function updateManagerData(action, issue) {
    let storage = getParsedStorage();
    if (storage) {
        switch (action) {
            case "add in_work":
                storage.inWork.push(issue);
                break;
            case "add pr":
                storage.pr.push(issue);
                storage.inWork.pop();
                break;
            case "del":
                storage.inWork.pop();
                break;
            default:
        }
        window.sessionStorage.setItem("ManagerData", JSON.stringify(storage));
    } else {
        setManagerData();
    }
}

function getParsedStorage() {
    let storage = window.sessionStorage.getItem("ManagerData");
    if (storage) {
        storage = JSON.parse(storage);
    }
    return storage;
}

function setManagerData() {
    let ManagerData = {
        inWork: [],
        pr: []
    };
    window.sessionStorage.setItem("ManagerData", JSON.stringify(ManagerData));
}
