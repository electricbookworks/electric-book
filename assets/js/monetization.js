/*jslint browser */
/*globals window */

// Use tracking pixels in an AWS S3 bucket to track users with web monetization
function ebMonetizationCounter() {
    "use strict";

    // First determine whether this is the beginning of a new session
    let isContinuedSession = sessionStorage.getItem("isContinuedSession");

    // If it is the beginning of a new session, let's log it
    // so that we have a record of all new user sessions
    if (isContinuedSession !== "true") {
        sessionStorage.setItem("isContinuedSession", "true");

        // set up the tracking pixel information
        const awsS3 = "https://monetization-images.s3.us-east-2.amazonaws.com/";

        // log it by loading the new user session tracking pixel
        let visitImage = document.createElement("img");
        visitImage.src = awsS3 + "staging.png";
        document.body.append(visitImage);

        // now we track users with monetization
        if (document.monetization !== undefined) {
            // log it by loading the monetization tracking pixel
            let monetizationImage = document.createElement("img");
            monetizationImage.src = awsS3 + "staging2.png";
            document.body.append(monetizationImage);
        }
    }
}

setTimeout(ebMonetizationCounter, 10000);