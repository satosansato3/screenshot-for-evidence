// This will parse a delimited string into an array of
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
        chrome.storage.sync.get('data', data => {
            for (let v of data.data) {
                registerdContent.push(v);
            }
        });
        registerdContent.push(content);
        chrome.storage.sync.set({ 'data': registerdContent }, () => { });
    };
});

$(function () {
    let contents = "";
    chrome.storage.sync.get('data', (data) => {
        contents = data.data;
        if (contents) {
            for (let content of contents) {
                for (let i = 0; i < content.length; i++) {
                    let row = document.createElement('tr');
                    for (let j = 0; j < content[i].length; j++) {
                        let data = document.createElement('td');
                        data.innerHTML = content[i][j];
                        row.appendChild(data);
                    }
                    let screenshotCell = document.createElement('td');
                    $("<button>").css({
                        "width": "30px",
                        "height": "30px"
                    }).on("click", () => {
                        chrome.tabs.captureVisibleTab(function (data) {
                            let link = document.createElement('a');
                            link.download = content[i][0] + ".jpeg";
                            link.href = data;
                            link.click();
                        })
                    }).appendTo(screenshotCell)
                    row.appendChild(screenshotCell);
                    testList.appendChild(row);
                }
            }
        }
    });
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
