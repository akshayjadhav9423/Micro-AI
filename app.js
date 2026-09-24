let knowledgeBase = [];


// ========================================
// LOAD CSV
// ========================================

fetch("questions.csv")

    .then(response => response.text())

    .then(data => {

        knowledgeBase = parseCSV(data);

        console.log(
            "Knowledge Base Loaded:",
            knowledgeBase
        );

    })

    .catch(error => {

        console.error(
            "Error loading CSV:",
            error
        );

    });


// ========================================
// PARSE CSV
// ========================================

function parseCSV(data) {

    const lines = data.trim().split("\n");

    const result = [];

    for (let i = 1; i < lines.length; i++) {

        const line = lines[i];

        const parts =
            line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);

        if (!parts || parts.length < 2) {

            continue;

        }

        const question =
            parts[0].replace(/^"|"$/g, "");

        const answer =
            parts[1].replace(/^"|"$/g, "");

        result.push({

            question: question,

            answer: answer

        });

    }

    return result;
}


// ========================================
// BUTTON
// ========================================

document
    .getElementById("askButton")
    .addEventListener(
        "click",
        askQuestion
    );


// ========================================
// ASK QUESTION
// ========================================

function askQuestion() {

    const input =
        document
            .getElementById("questionInput")
            .value
            .trim();

    const result =
        document.getElementById("result");


    if (input === "") {

        result.innerHTML =
            "Please enter a question.";

        return;

    }


    if (knowledgeBase.length === 0) {

        result.innerHTML =
            "Knowledge base is loading...";

        return;

    }


    const best =
        findBestMatch(input);


    console.log(
        "Best Match:",
        best
    );


    if (best.item && best.score >= 0.5) {

        result.innerHTML = `

            <div class="question-found">

                Matched question:
                <strong>
                    ${best.item.question}
                </strong>

            </div>

            <div class="answer">

                ${best.item.answer}

            </div>

        `;

    }

    else {

        result.innerHTML = `

            <div class="answer">

                Sorry, I don't know the answer
                to that question.

            </div>

        `;

    }

}


// ========================================
// FIND BEST MATCH
// ========================================

function findBestMatch(userQuestion) {

    let bestMatch = null;

    let highestScore = 0;


    for (const item of knowledgeBase) {

        const score =
            calculateSimilarity(
                userQuestion,
                item.question
            );


        if (score > highestScore) {

            highestScore = score;

            bestMatch = item;

        }

    }


    return {

        item: bestMatch,

        score: highestScore

    };

}


// ========================================
// SIMILARITY
// ========================================

function calculateSimilarity(
    userQuestion,
    storedQuestion
) {

    const userWords =
        normalize(userQuestion);

    const storedWords =
        normalize(storedQuestion);


    let matches = 0;


    for (const word of userWords) {

        if (storedWords.includes(word)) {

            matches++;

        }

    }


    if (userWords.length === 0) {

        return 0;

    }


    return matches / userWords.length;

}


// ========================================
// NORMALIZE
// ========================================

function normalize(text) {

    return text

        .toLowerCase()

        .replace(/[^\w\s]/g, "")

        .split(/\s+/)

        .filter(
            word => word.length > 2
        );

}