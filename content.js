﻿// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
function CSVToArray(strData, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
    );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[1];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
        ) {

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);

        }

        var strMatchedValue;

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[2]) {

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[2].replace(
                new RegExp("\"\"", "g"),
                "\""
            );

        } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[3];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData[arrData.length - 1].push(strMatchedValue);
    }

    // Return the parsed data.
    return (arrData);
}

let fileinput = document.getElementById('file');
$("#fileregist").on("click", () => {
    const reader = new FileReader;
    if (fileinput.files[0]) {
        const file = fileinput.files[0];
        reader.readAsText(file);
    };

    reader.onload = (e) => {
        const content = CSVToArray(e.target.result);
        let registerdContent = [];
        //chrome.storage.sync.get('data', data => {
        //    for (let v of data.data) {
        //        registerdContent.push(v);
        //    }
        //});
        registerdContent.push(content);
        chrome.storage.sync.set({ 'data': registerdContent }, () => { });
    };
});

//$(function () {
//    let contents = "";
//    chrome.storage.sync.get('data', (data) => {
//        contents = data.data;
//        if (contents) {
//            for (let content of contents) {
//                for (let i = 0; i < content.length; i++) {
//                    let row = document.createElement('tr');
//                    for (let j = 0; j < content[i].length; j++) {
//                        let data = document.createElement('td');
//                        data.innerHTML = content[i][j];
//                        row.appendChild(data);
//                    }
//                    let screenshotCell = document.createElement('td');
//                    $("<button>").css({
//                        "width": "30px",
//                        "height": "30px"
//                    }).on("click", () => {
//                        chrome.tabs.captureVisibleTab(function (data) {
//                            let link = document.createElement('a');
//                            link.download = content[i][0] + ".jpeg";
//                            link.href = data;
//                            link.click();
//                        })
//                    }).appendTo(screenshotCell)
//                    row.appendChild(screenshotCell);
//                    testList.appendChild(row);
//                }
//            }
//        }
//    });
//})

document.addEventListener('DOMContentLoaded', function () {
    let contents = "";
    chrome.storage.sync.get('data', (data) => {
        contents = data.data[0];
        if (contents) {
            let test_object = document.getElementById("testTemplate").content;
            let test_id = test_object.querySelector(".test-id");
            let test_content = test_object.querySelector(".test-content");
            let test_expected_result = test_object.querySelector(".test-expected-result");
            let screenshot = test_object.querySelector(".screenshot");
            let fragment = document.createDocumentFragment();
            for (let content of contents) {
                let clone;
                //for (let i = 0; i < content.length; i++) {
                //    test_id.innerHTML = content[i][0];
                //    test_content.innerHTML = content[i][1];
                //    test_expected_result.innerHTML = content[i][2];
                //}
                test_id.innerHTML = content[0];
                test_content.innerHTML = content[1];
                test_expected_result.innerHTML = content[2];
                screenshot.setAttribute("data-screenshot", content[0])
                //screenshot.addEventListener("click", () => {
                //    chrome.tabs.captureVisibleTab(function (data) {
                //        let link = document.createElement('a');
                //        link.download = content[i][0] + ".jpeg";
                //        link.href = data;
                //        link.click();
                //    })
                //});
                clone = document.importNode(test_object, true);
                fragment.appendChild(clone);
            }
            document.getElementById("sidebar").appendChild(fragment);
        }
    });
})

$("#sidebar").on("click", ".screenshot", function () {
    let filename = $(this).data("screenshot");
    chrome.tabs.captureVisibleTab(function (data) {
        let link = document.createElement('a');
        link.download = filename + ".jpeg";
        link.href = data;
        link.click();
    })
})

let sidebar_handle = $("#sidebarHandle");
let sidebar_up_cursor = $("#sidebarUpCursor");
let sidebar_down_cursor = $("#sidebarDownCursor");

sidebar_handle.on("click", () => {
    if (sidebar_handle.hasClass("active")) {
        window.parent.postMessage({ status: "none" }, "*");
        sidebar_handle.removeClass("active");
        sidebar_up_cursor.css("display", "flex")
        sidebar_down_cursor.css("display", "none")
    } else {
        window.parent.postMessage({ status: "active" }, "*");
        sidebar_handle.addClass("active");
        sidebar_up_cursor.css("display", "none")
        sidebar_down_cursor.css("display", "flex")
    }
})
