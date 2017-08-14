
$(function() {
    init();
});

function init() {
    var issuesSearchResults = [];
    var uri = 'https://api.github.com/search/issues?q=language:JavaScript+is:up-for-grabs+state:open';
    showStored();
    listenClickEvents(clickPR, clickDEL);
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
        if (!isStored(item)) {
            outHTML += addSearchResultItem(item, i);
        }
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
        let issue = getIssueFromSearchList(issueID);
        addIssueInWork(issue);
        $(this).parent().hide();
        listenClickEvents(clickPR, clickDEL);
    });
}

function clickPR() {
    $('.button-pr').on('click', function(e) {
        e.preventDefault();
        let issueHREF = $(this).parent().prev().find('a').attr('href');
        let issue = getIssueFromInWorkList(issueHREF);
        addIssueToPR(issue);
        $(this).parent().parent().parent().hide();
    });
}

function clickDEL() {
    $('.button-del').on('click', function(e) {
        e.preventDefault();
        let issueHREF = $(this).parent().prev().find('a').attr('href');
        let issue = getIssueFromInWorkList(issueHREF);
        deleteIssue(issue);
        $(this).parent().parent().parent().hide();
    });
}

function deleteIssue(issue) {
    updateManagerData('del', issue);
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

function getIssueFromSearchList(issueID) {
    let position = getNumberFromString(issueID);
    let items = issuesSearchResults;
    let issue = {
        url: items[position].html_url,
        title: items[position].title
    }
    return issue;
}

function addIssueInWork(issue) {
    updateManagerData('add in_work', issue);
    showIssuesInWork();
}

function showIssuesInWork() {
    let storage = getParsedStorage();
    let inWorkIssueList = '';
    for (let issue of storage.inWork) {
        let newIssue = '';
        let title = '<a href="' + issue.url + '">' + issue.title + '</a>';
        let prButton = '<button class="button-pr btn btn-success btn-sm">PR</button>';
        let delButton = '<button class="button-del btn btn-danger btn-sm">DEL</button>';
        let buttons = prButton + delButton;
        newIssue += '<div class="col-md-7">' + title + '</div>';
        newIssue += '<div class="col-md-5 btn-group pull-right">' + buttons + '</div>';
        inWorkIssueList += '<li><div class="row issue-in-columns">' + newIssue + '</div></li>';
    }
    $('#issue-in-work').find('ul').html(inWorkIssueList);
}

function getIssueFromInWorkList(issueID) {
    let storage = getParsedStorage();
    // let position = getNumberFromString(issueID);
    let position = storage.inWork.findIndex(x => x.url == issueID);
    let issue = {
        url: storage.inWork[position].url,
        title: storage.inWork[position].title
    }
    return issue;
}

function addIssueToPR(issue) {
    updateManagerData('add pr', issue);
    showIssuesInPR();
}

function showIssuesInPR() {
    let storage = getParsedStorage();
    let prIssueList = '';
    for (let issue of storage.pr) {
        let newIssue = '';
        let title = '<a href="' + issue.url + '">' + issue.title + '</a>';
        newIssue += '<li><div class="issue-in-columns">' + title + '</div></li>';
        prIssueList += newIssue;
    }
    $('#pr-issue').find('ul').html(prIssueList);
}

function updateManagerData(action, issue) {
    let storage = getParsedStorage();
    if (!storage) {
        setManagerData();
        storage = getParsedStorage();
    }
    switch (action) {
        case "add in_work":
            storage.inWork.push(issue);
            break;
        case "add pr":
            storage.pr.push(issue);
            storage.inWork = deleteObjFromArr(issue, storage.inWork, 'url');
            break;
        case "del":
            storage.inWork = deleteObjFromArr(issue, storage.inWork, 'url');
            break;
        default:
    }
    localStorage.setItem("BGSM_ManagerData", JSON.stringify(storage));
}

function getParsedStorage() {
    let storage = localStorage.getItem("BGSM_ManagerData");
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
    localStorage.setItem("BGSM_ManagerData", JSON.stringify(ManagerData));
}

function isInWork(issue) {
    let storage = getParsedStorage();
    if (!storage) {
        return false;
    }
    for (let item of storage.inWork) {
        if (item.url === issue.url) {
            return true;
        }
    }
    return false;
}

function isInPR(issue) {
    let storage = getParsedStorage();
    if (!storage) {
        return false;
    }
    for (let item of storage.pr) {
        if (item.url === issue.url) {
            return true;
        }
    }
    return false;
}

function isStored(item) {
    let issue = {
        url: item.html_url,
        title: item.title
    }
    if (isInPR(issue) || isInWork(issue)) {
        return true;
    } else {
        return false;
    }
}

function showStored() {
    let storage = getParsedStorage();
    if (storage) {
        showIssuesInWork();
        showIssuesInPR();
    }
}

function deleteObjFromArr(item, arr, id) {
    let toDelete = [];
    toDelete.push(item[id]);
    return arr.filter(function(obj) {
        return toDelete.indexOf(obj[id]) === -1;
    });
}
