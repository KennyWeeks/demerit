<script lang="ts">
    import  jsPDF  from "jspdf"; 
    import html2canvas from "html2canvas";
    export let previewText : string;
    //Open-close menu options
    let mlMenu : string = "ml-[40%]";
    export let button : boolean = false;
    export let page : HTMLElement | null;

    export let windowWidth : number = 100000;
    export let state : number = 1;
    export let previewOpen : boolean = false;
    export let mobileOptions : boolean = false;
    export let pageHolder : HTMLElement | null;


    console.log(mobileOptions);

    const preview = () => {
        if(windowWidth >= 856) {
            if(state == 0) {
                state = 1;
                previewText = "preview";
            } else {
                state = 0;
                previewText = "edit";
            }
        } else {
            console.log("---------[");
            console.log(previewOpen);
            console.log(previewText);
            console.log("---------[");
            if(!previewOpen) {
                previewOpen = true;
                button = false;
                previewText = "edit";
                console.log(previewText);
                console.log(mobileOptions);
                console.log("------");
            } else {
                previewOpen = false;
                button = false;
                previewText = "preview";
            }
        }
        
    }

    const pdf = ()=>{
        console.log(page);
        let doc = new jsPDF('p', 'px', [816, 1056]);
        let html : HTMLElement = page as HTMLElement;
        let target = html.childNodes[6] as HTMLElement;
        let canvas : HTMLCanvasElement = document.createElement("canvas");
        canvas.width = 816;
        canvas.setAttribute("style", "background-color:#ffffff; margin:auto; outline:none;");
        canvas.height = 1056;
        let ctx : any = canvas.getContext("2d");

        ctx.font = "17px Arial";

        let fitWidth : number = 816 - (96 * 2);

        let y : number = 96;

        /*
        const canvas = document.querySelector("canvas");
		const ctx = canvas.getContext("2d");
		let base_image = new Image();
		base_image.src = "demerit_logo.png";
		base_image.onload = ()=>{
			ctx.drawImage(base_image, 105, 52, 624, 100);
		}

        */

        

        //So paddin is 10, and the height of the menu seems to be a height of 28, so the initial starting y is 250 - (28 + 10)
        console.log(html.childNodes[0]);

        ctx.beginPath();
        ctx.lineHeight = 0;
        ctx.strokeStyle = "white";
        let image = new Image();
        image.src = html.childNodes[0].getAttribute("src");

        let introArea : HTMLElement = html.childNodes[2] as HTMLElement;
        ctx.lineHeight = 0;
        ctx.strokeStyle = "#fff";
;        let startingX = 96;
        [...introArea.children].forEach((e : any)=>{
            console.log(e.clientWidth);

            ctx.font = "bold 16px Arial";
            ctx.fillStyle = "#000";
            
            ctx.fillText(e.innerText, startingX, 212 + 20);
            startingX += e.clientWidth;
        });

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#000";
        ctx.moveTo(96, 250);
        ctx.lineTo(96 + 624, 250);
        ctx.stroke();

        ctx.fillText("INFRACTION: ", 96, 290);

        y = 330;
        ctx.font = "17px Arial";

        let emptyString : string = "";
        for(let i = 0; i < target.innerText.split(" ").length; i++) {
            emptyString += target.innerText.split(" ")[i] + " ";
            if(ctx.measureText(emptyString).width > fitWidth) {
                let lastWord : string = emptyString.split(" ")[emptyString.split(" ").length - 2];
                let line : string = emptyString.substring(0, emptyString.length - (1 + lastWord.length));
                console.log(emptyString);
                ctx.fillText(line, 96, y)
                emptyString = lastWord + " ";
                y += 24;
            }
        }

        ctx.fillText(emptyString, 96, y);

    
        ctx.beginPath();
        ctx.fillStyle = "#000";
        ctx.lineHeight = 0.5;
        let table : HTMLElement = html.childNodes[8] as HTMLElement;
        ctx.rect(96, 1056 - table.clientHeight - 96, 624, table.clientHeight);
        ctx.stroke();

        let topOfTable : number = 1056 - table.clientHeight - 96;
        ctx.beginPath();
        ctx.moveTo(96, topOfTable + table.clientHeight / 2);
        ctx.lineTo(96 + 624, topOfTable + table.clientHeight / 2);
        ctx.stroke();

        let positions : number[] = [96 + (0.02 * 624), 96 + (0.02 * 624), 96 + (0.02 * 624) + (0.5 * 624), 96 + (0.02 * 624) + (0.5 * 624) + (0.24 * 624)];
        let contents : string[][] = [["", ""], ["Recruit Signature", "Academy Staff  Signature"], ["HR #", "HR #"], ["Date", "Date"]]
        positions.forEach((e: number, index: number) => {
            ctx.beginPath();
            ctx.moveTo(e, 1056 - table.clientHeight - 96);
            ctx.lineTo(e, 1056 - 96);
            ctx.font = "italic 16px Arial";
            ctx.fillStyle = "#000";
            console.log(contents[index][0]);
            ctx.fillText(contents[index][0], e + 10, 1056 - table.clientHeight - 75);
            ctx.fillText(contents[index][1], e + 10, topOfTable + table.clientHeight / 2 + 18);
            ctx.stroke();
        });
        
        image.onload = ()=>{
            ctx.beginPath();
            ctx.fillStyle = "none";
            ctx.strokeStyle = "none";
            ctx.shadowColor = "#ffffff";
            ctx.shadowBlur = 0;
            ctx.lineHeight = 0;
            ctx.drawImage(image, 105, 62, 624, 117);
            let imgData = canvas.toDataURL("image.png");
            doc.addImage(imgData, "PNG", 0, 0, 816, 1056);
            doc.save("sample-file.pdf");
        };

        

        //document.body.appendChild(canvas);

        //document.body.appendChild(canvas);

        

        //document.body.querySelector("canvas")

        /*setTimeout(()=>{
            let imgDat = canvas.toDataURL("image/png");
            console.log(imgDat);
            doc.addImage(imgDat, "PNG", 0, 0, 816, 1056);
            doc.save("sample-file-idk.pdf");
        }, 1500);*/
       


        /*if(pageHolder != null) {
            let pH : HTMLElement = pageHolder as HTMLElement;
            pH.style.transform = "scale(1.0)"; //This will scale the page up
        }
        let html : HTMLElement = page as HTMLElement;
        setTimeout(()=>{
            html2canvas(html, {
                width: 816,
                height: 1056
            }).then((canvas)=>{
                let imgData = canvas.toDataURL("image.png");
                
                doc.addImage(imgData, 'PNG', 0, 0, 816, 1056);
                doc.save('sample-file.pdf');
            });*/
    }

</script>

    <div class="float-right clear-left inline-block {mobileOptions ? "" : "menu:hidden"}">
        {#each ["preview", "pdf", "print"] as button, i}
        <button  on:click={()=>{eval(button + "()")}} class="px-4 {i == 0 && !mobileOptions ? 'mr-1' : ""} {i == 3 && !mobileOptions ? "ml-1" : ""} {i != 0 && i != 3 && !mobileOptions ? 'mx-1' : ""} {mobileOptions ? "w-[100%] mb-[5px]" : ""} py-1 rounded-3xl {mobileOptions ? "block text-blue-1000 bg-blue-900" : "text-blue-900 hover:bg-blue-900 hover:text-blue-1000 "}">
            {#if i == 0}
                {previewText}
            {:else}
                {button}
            {/if}
        </button>
        {/each}
    </div>
    {#if !mobileOptions}
    <!--This is the mobile menu for hte site-->
    <div role="menu" tabindex="0" on:keydown={()=>{}} class="hidden menu:block menu:w-[42px] menu:h-[42px] overflow-y-hidden" on:click={()=>{
        if(!button) {
            mlMenu = "ml-[20%]"; 
            button = true;
        } else {
            mlMenu = "ml-[40%]";
            button = false;
        }
    }}>
        <!--Menu Tabs-->
        <div class="w-[60%] h-[6px] bg-blue-900 rounded-xl ml-[20%] mt-[12px]"></div>
        <div class="w-[40%] h-[6px] bg-blue-900 rounded-xl {mlMenu} mt-[5px]"></div>
    </div>
    {/if}

