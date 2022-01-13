
// async function getJobs(searchTerm) {

//     const autocompleteURL = "https://data.mongodb-api.com/app/recruiting-cgnjx/endpoint/autocomplete";
//     var results = [];

//     try {
//         const results = await fetch(autocompleteURL + `?term=${searchTerm}`)

//     } catch (error) {
//         console.log("Whoopsie!", error);
//     }

//     return results;
// }



async function searchRecruits() {
    let text = "";

    let searchTerm = search.value;
    const webhook =
        "https://data.mongodb-api.com/app/recruiting-cgnjx/endpoint/search";

    const url = webhook + "?skill=" + searchTerm;

    try {
        const recruits = await fetch(url).then((res) => res.json());

        console.log(recruits);

        recruits.forEach((recruit) => {
            const name = recruit.name;
            const university = recruit.university.school_name;
            const degree = recruit.university.degree;
            const degreeWithHighlights = buildHighlights("university.degree", recruit.university.degree, recruit.highlights);
            const gpa = Object.values(recruit.university.gpa);
            const job = recruit.job;
            const notes = recruit.notes;
            const score = Object.values(recruit.score).toString().slice(0, 5);
            const jobWithHighlights = buildHighlights("job", recruit.job, recruit.highlights);
            const notesWithHighlights = buildHighlights("notes", recruit.notes, recruit.highlights);


            text += ` 
                    <div class="column">
                        <div class="RecruitCard">
                            <b><h3>${name}</h3></b>
                            <h5><span class="color-gray">Score:</span> ${score} </h5>
                            <h5><span class="color-gray">University:</span> ${university}</h5>
                            <h5><span class="color-gray">Degree:</span> ${degreeWithHighlights}</h5>
                            <h5><span class="color-gray">GPA:</span> ${gpa}</h5>
                            <h5><span class="color-gray">Job:</span> ${jobWithHighlights}</h5>
                            <h5><span class="color-gray">Notes:</span> ${notesWithHighlights}</h5>
                        </div>
                    </div>
                `;
        });

        resultDisplay.innerHTML = text;
    } catch (error) {
        console.log("Whoopsie!", error);
    }
}



function buildHighlights(field, value, highlights) {

    console.log(`highlighting field: ${field}`);
    console.log(`field value: ${value}`);
    console.log(`Number of highlights: ${highlights.length}`);

    let result = value;

    var highlightsExist = fieldHasHighlights(field, highlights);

    if (highlightsExist) {
        let highlight = getHighlight(field, highlights);

        result = highlightText(highlight);
    }

    return result;
}

function fieldHasHighlights(field, highlights) {

    let result = false;

    highlights.forEach(highlight => {

        if (highlight.path === field) {
            result = true;
        }
    });

    return result;
}

/*  
 * TODO: Support multiple highlights for a single field. 
 */
function getHighlight(field, highlights) {

    let result = {};

    highlights.forEach(highlight => {

        if (highlight.path === field) {
            result = highlight;            
        }
    });

    return result;
}

function highlightText(highlight) {

    let highlightString = "";

    let texts = highlight.texts;

    texts.forEach(text => {
        if (text.type === 'hit')
            highlightString += `<span style="color:red"> ${text.value} </span>`
        else highlightString += text.value
    });

    return highlightString;
}

async function searchAutocomplete() {

    /*close any already open lists of autocompleted values*/
    await closeAllLists();

    resultDisplay.innerHTML = '';
    autoDisplay.innerHTML = '';

    const searchTerm = search.value;
    const autocompleteURL = "https://data.mongodb-api.com/app/recruiting-cgnjx/endpoint/autocomplete";


    if (searchTerm.length < 3) {
        return;
    }

    try {
        const results = await fetch(autocompleteURL + `?term=${searchTerm}`)
            .then(res => res.json());

        if (results.length > 0) {

            results.map(result => {
                let div = document.createElement('div');
                div.innerHTML = `<h4>${result.job}</h4><hr>`;
                div.addEventListener("click", () => fillRecruit(result.job));
                autoDisplay.appendChild(div);
            });

        }

    } catch (error) {
        console.log("Whoopsie!", error);
    }

}

function fillRecruit(term) {

    search.value = term;    // fill the searchbar with selected title
    autoDisplay.innerHTML = '';
    searchRecruits();        // call the searchRecruits function
}

async function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    console.log("Closing List")
    var x = document.getElementsByClassName("autocomplete-items");
    var childNodes = x[0].childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        console.log("elements: " + i);
        if (elmnt != childNodes[i] && elmnt != search) {
            childNodes[i].parentNode.removeChild(childNodes[i]);
            //x.removeChild(x[i]);

        }
    }
}


