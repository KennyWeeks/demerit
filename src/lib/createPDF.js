export const createPDF = (canvas, ctx, page, doc) => {
    //Type cast the page variable to an HTMLElement to no longer get errors
    let html = page;

    console.log(html);

    //Get the body content and type cast it
    let target = html.childNodes[6];

    ctx.font = "17px Arial";

    let fitWidth = 816 - (96 * 2);

    let y = 96;


    //Draw the image of the logo first
    ctx.beginPath();
    ctx.lineHeight = 0;
    ctx.strokeStyle = "white";
    let image = new Image();
    let imageAttr = html.childNodes[0];
    image.src = imageAttr.getAttribute("src"); //This is needed to convert null to string

    //Next make the intro area, the name, date, and hr # area
    let introArea = html.childNodes[2];
    ctx.lineHeight = 0;
    ctx.strokeStyle = "#fff";
    let startingX = 96; //This is the furthest left you want the image to go.

    //Draw the dividing line next
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000";
    ctx.moveTo(96, 250);
    ctx.lineTo(96 + 624, 250);
    ctx.stroke();

    let moveLeft = 278;
    let moveLeftSecond = 216;

    let clientWidth = [...introArea.children];

    //Next you type cast the HTMLCollection to an array, and draw boxes that represent the unique size of each box.
    [...introArea.children].forEach((e, index)=>{

        ctx.font = "bold 16px Arial";
        ctx.fillStyle = "#000";
        
        console.log(clientWidth[index].clientWidth);
        console.log(clientWidth[index].offsetWidth);

        //Fill the text, and move to the next starting point
        ctx.fillText(e.innerText, startingX, 212 + 20);
        startingX += clientWidth[index].offsetWidth;
    });

    //Create the INFRACTION text here
    ctx.fillText("INFRACTION: ", 96, 290);

    //Starting to draw the content now
    y = 330;
    ctx.font = "17px Arial";

    let emptyString = "";
    for(let i = 0; i < target.innerText.split(" ").length; i++) {

        //Since canvas will only draw content, it won't actually format it, this will format the length of strings
        //as needed
        emptyString += target.innerText.split(" ")[i] + " ";
        if(ctx.measureText(emptyString).width > fitWidth) {
            let lastWord = emptyString.split(" ")[emptyString.split(" ").length - 2];
            let line = emptyString.substring(0, emptyString.length - (1 + lastWord.length));
            console.log(emptyString);
            ctx.fillText(line, 96, y)
            emptyString = lastWord + " ";
            y += 24;
        }
    }

    //Fill the last line
    ctx.fillText(emptyString, 96, y);


    //Draw the bottom table
    ctx.beginPath();
    ctx.fillStyle = "#000";
    ctx.lineHeight = 0.5;
    let table = html.childNodes[8];
    ctx.rect(96, 1056 - 125 - 96, 624, 125);
    ctx.stroke();

    //Draw the middle line
    let topOfTable = 1056 - 125 - 96;
    ctx.beginPath();
    ctx.moveTo(96, topOfTable + 125 / 2);
    ctx.lineTo(96 + 624, topOfTable + 125 / 2);
    ctx.stroke();

    //Draw the vertical lines of the table, and add the content as needed;
    let positions = [96 + (0.02 * 624), 96 + (0.02 * 624) + (0.5 * 624), 96 + (0.02 * 624) + (0.5 * 624) + (0.24 * 624)];
    let contents= [["Recruit Signature", "Academy Staff  Signature"], ["HR #", "HR #"], ["Date", "Date"]]
    positions.forEach((e, index) => {
        ctx.beginPath();
        ctx.moveTo(e, 1056 - 125 - 96);
        ctx.lineTo(e, 1056 - 96);
        ctx.font = "italic 16px Arial";
        ctx.fillStyle = "#000";
        console.log(contents[index][0]);
        ctx.fillText(contents[index][0], e + 10, 1056 - 125 - 75);
        ctx.fillText(contents[index][1], e + 10, topOfTable + 125 / 2 + 18);
        ctx.stroke();
    });

    image.onload = ()=>{
        //Since the image is the worst part of this cycle, if dont' include this function here, the Image object will not load, and the final PDF will have everythng but the image
        //This also ensures there are not unwanted paths around the image once it is rendered.
        console.log("WHAT IS GOING ON")
        ctx.beginPath();
        ctx.fillStyle = "none";
        ctx.strokeStyle = "none";
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 0;
        ctx.lineHeight = 0;
        ctx.drawImage(image, 105, 62, 624, 117);
        let imgData = canvas.toDataURL("image.png");
        doc.addImage(imgData, "PNG", 0, 0, 816, 1056);
        let fileName = "Bitch.pdf";
        doc.save(fileName);
    };

}

export const blackContBorder = "paper:border-none paper:px-[0px] rounded-sm border border-black px-[5px] outline-0";
export const whiteContBorder = "paper:border-none paper:px-[0px] rounded-sm border border-white px-[5px] outline-0";
export const contBorderNoPaper = "rounded-sm border border-black px-[5px] outline-0";
export const monthObject = {"01": "January", "02": "February", "03": "March", "04": "April", "05": "May", "06": "June",
"07": "July", "08": "August", "09": "September", "10": "October", "11": "November", "12": "December"};

export const lightDarkFunc = (lightModeTrigger, lightDark, contSymbol, color) => {
    if(lightModeTrigger == "right-[2.5px]") {
        lightModeTrigger = "left-[2.5px]";
        lightDark = "bg-black-200 text-white";
        contSymbol = whiteContBorder;
        color = "white";
    } else {
        lightModeTrigger = "right-[2.5px]";
        lightDark = "bg-white text-black";
        contSymbol = blackContBorder
        color = "black";
    }
    return [lightModeTrigger, lightDark, contSymbol, color];
}