// Function to save data to chrome.storage.local
function saveData() {
    var input = document.getElementById('input').value;
    var output = document.getElementById('output').value;
    chrome.storage.local.set({ input: input, output: output }, function () {
        if (chrome.runtime.lastError) {
            console.error('Error saving data:', chrome.runtime.lastError);
        } else {
            console.log('Data saved');
        }
    });
}

function loadData() {
    chrome.storage.local.get(['input', 'output'], function (result) {
        if (chrome.runtime.lastError) {
            console.error('Error loading data:', chrome.runtime.lastError);
        } else {
            if (result.input) {
                document.getElementById('input').value = result.input;
            }
            if (result.output) {
                document.getElementById('output').value = result.output;
            }
        }
    });
}

// Load data when the popup is opened
document.addEventListener('DOMContentLoaded', function () {
    loadData();
});





document.getElementById('read').addEventListener('click', function () {
    var file = document.getElementById('file').files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('input').value = e.target.result;
            saveData(); // Save data after reading the file
        }
        reader.readAsText(file);
    } else {
        alert("Please select a file first.");
    }
});
// filepath: /home/hey/devdrive/chrome/convert.js
document.getElementById('convert').addEventListener('click', function () {
    var input = document.getElementById('input').value;
    var output = document.getElementById('output');

    // Extract URLs and titles using regex
    const regex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
    let match;
    const bookmarks = [];

    while ((match = regex.exec(input)) !== null) {
        bookmarks.push({ title: match[1], url: match[2] });
    }

    // Convert to CSV format
    const csvContent = 'title,url\n' + bookmarks.map(b => `${b.title} ␞ ${b.url}`).join('\n');

    // Output the CSV content
    output.value = csvContent;
});
document.getElementById('onetab').addEventListener('click', function () {
    var reader = document.getElementById('input').value.split('\n');
    var writer = document.getElementById('output');
    var allowanceforemptyline = 6;
    var linkname = "link";
    var titlename = "title";
    var notfoundcount = 0;
    var runcounter = 0;
    var output = `${linkname}\t${titlename}\n`;

    for (var i = 0; i < reader.length; i++) {
        var line = reader[i].replace(/"/g, '');
        var index = 0;
        var found = false;

        for (var j = 0; j < line.length; j++) {
            if (line[j] !== "|") {
                index++;
                notfoundcount = 0;
            } else {
                found = true;
                output += `${line.substring(0, index)} ␞ ${line.substring(index + 1)}\n`;
                break;
            }
        }

        if (!found) {
            if (notfoundcount < allowanceforemptyline) {
                output += "\n";
                notfoundcount++;
                console.log("blank");
            } else {
                break;
            }
        }
        runcounter++;
        console.log(runcounter);
    }

    writer.value = output;
    saveData(); // Save data after processing
});



 
document.getElementById('download').addEventListener('click', function() {
    const outputContent = document.getElementById('output').value;
    const blob = new Blob([outputContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `output_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    //     var blob = new Blob([output], { type: "text/plain" });
//     var url = URL.createObjectURL(blob);
//     chrome.downloads.download({
//         url: url,
//         filename: 'output.txt'
//     });
  });