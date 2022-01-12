
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
            //const degreeWithHighlights = buildHighlights(recruit.university.degree);
            const gpa = Object.values(recruit.university.gpa);
            const job = recruit.job;
            const notes = recruit.notes;
            const score = Object.values(recruit.score).toString().slice(0, 5);
            const notesWithHighlights = buildHighlights(recruit.highlights);


            text += ` 
                    <div class="column">
                        <div class="RecruitCard">
                            <b><h3>${name}</h3></b>
                            <h5><span class="color-gray">Score:</span> ${score} </h5>
                            <h5><span class="color-gray">University:</span> ${university}</h5>
                            <h5><span class="color-gray">Degree:</span> ${degree}</h5>
                            <h5><span class="color-gray">GPA:</span> ${gpa}</h5>
                            <h5><span class="color-gray">Job:</span> ${job}</h5>
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


async function searchAutocomplete() {

    /*close any already open lists of autocompleted values*/
    closeAllLists();

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

function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    console.log("Closing List")
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
        console.log("elements: " + i);
        if (elmnt != x[i] && elmnt != search) {
            //x[i].parentNode.removeChild(x[i]);
        }
    }
}

function buildHighlights(highlights) {

    let highlightString = "";

    highlights.forEach(highlight => {

        let texts = highlight.texts;
        texts.forEach(text => {
            if (text.type === 'hit')
                highlightString += `<span style="color:red"> ${text.value} </span>`
            else highlightString += text.value
        });
    });

    return highlightString;
}
