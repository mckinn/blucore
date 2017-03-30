
exports.populateInterpersonalEmail = function (emailAddress, friendly, bodyText) {

    console.log ("the arguments",emailAddress, friendly, bodyText);
    let emailToEmbed = '<a href="mailto:' + emailAddress + '" target="_top" class="">' + friendly + ' at ' + emailAddress + '</a>';
    console.log( "email link:",emailToEmbed);
    let body = `
        <!DOCTYPE html>
        <html><head>
        <meta charset="utf-8">
        <title>Hello</title>
        <meta name="generator" content="Google Web Designer 1.7.1.0130">
        <style type="text/css" id="gwd-text-style">p {
            margin: 0px;
        }
        h1 {
            margin: 0px;
        }
        h2 {
            margin: 0px;
        }
        h3 {
            margin: 0px;
        }</style>
        <style type="text/css">html,
        body {
            width: 100%;
            height: 100%;
            margin: 0px;
        }
        body {
            transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
            -webkit-transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
            -moz-transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
            perspective: 1400px;
            -webkit-perspective: 1400px;
            -moz-perspective: 1400px;
            transform-style: preserve-3d;
            -webkit-transform-style: preserve-3d;
            -moz-transform-style: preserve-3d;
            background-color: transparent;
        }
        .gwd-p-rzrb {
            position: absolute;
            border-style: solid;
            border-width: 0px;
            color: rgb(42, 42, 42);
            font-family: Verdana;
            font-size: 14px;
            transform-origin: 320px 237.5px 0px;
            margin: 0px;
            padding: 15px;
            left: 41px;
            top: 63px;
            width: 610px;
            height: 160px;
            background-image: -webkit-radial-gradient(center center, circle cover, rgb(255, 255, 255) 0%, rgb(234, 234, 243) 100%);
            background-color: transparent;
        }
        .gwd-p-h5lt {
            position: absolute;
            width: 640px;
            left: 42px;
            top: 263px;
            height: 130px;
            transform-origin: 320px 35.5px 0px;
            -webkit-transform-origin: 320px 35.5px 0px;
            -moz-transform-origin: 320px 35.5px 0px;
            font-size: 12px;
            color: rgb(42, 42, 42);
            font-family: Arial;
        }
        .gwd-p-1s0s {
            position: absolute;
            width: 640px;
            left: 42px;
            top: 26px;
            font-size: 12px;
            font-family: Arial;
            height: 35px;
            transform-origin: 320px 272.5px 0px;
            -webkit-transform-origin: 320px 272.5px 0px;
            -moz-transform-origin: 320px 272.5px 0px;
        }</style>
        </head>
    `;
    body = body + `
    <body class="htmlNoPages">

        <p class="gwd-p-1s0s">Hi! &nbsp;I'm your bluCore email bot. &nbsp;I've got a message from 
    `;
    body = body + emailToEmbed + `
        , which I have carefully copied for you below.</p>
        <p class="gwd-p-rzrb">`;
        
    body = body + bodyText +
        `</p>
        <p class="gwd-p-h5lt">Please don't reply to me directly, 'cause I won't know what to do! &nbsp;I'm merely a dumb bot!<br>
            <br>
            If you want to reply to the real person that sent this email, please click on
    `;
    body = body + emailToEmbed + `
        , or, even better, copy it and paste it into the 'to:' field of a reply.<br>
            <br>
            Many thanks:<br>
            <br>
            &nbsp; &nbsp; <em>&nbsp;your friendly neighborhood bluCore email bot.</em>
        </p>
        </body></html>
        `;
    return body;
}