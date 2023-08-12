<script lang="ts">

    export let dateModal : boolean = false; //Open the dateModal
    export let dateValue : string = ""; //This is the value of the date input area at first
    export let timeStuff : boolean = false; //Open the time option in the data modal
    export let timeValue : string = "(time)"; //This will be the string that represents the time value
    export let mobileDisplay : boolean = false; //This will define the two different display patterns for the editting area, and the preview area.
    export let windowWidth : number = 0; //This will be for some reactive styles
    export let page : HTMLElement | null; //This will hold the page reference, so content can be pulled to make the canvas.
    export let editorVisible : boolean; //This will determine whether the editor will be visible to the user //I want the editor area visible, which should only be on one of the pages
    import {base} from "$app/paths";
    import {blackContBorder, contBorderNoPaper} from "./createPDF";

    //This is the table contents that will be displayed on the table
    let tableContent : Array<Array<string>> = [["", "Recruit Signature", "HR #", "Date"], ["", "Academy Staff Signature", "HR #", "Date"]]; 

    //These are the default values in the page, this will be used when the user clicks out of a blocked area.
    let defaultText : {[key: string]: string} = {};
    export let outputText : {[key: string]: string} = {}; //This is bound to the outputText variable on +page.svelte
    let temp : {[key:string]: string} = {"#": "(#)", "time": "(time)", "a/an": "(a/an infraction)", "who": "(Who assigned you the demerit, if Capt. Spell out Captain)", "elipsis": "...", "name": "your name here", "date": "date of demerit", "hr": "1234"}
    //Load all the default data here
    for(let k in temp) {
        defaultText[k] = temp[k];
    }

    let keyCombo : boolean = false; //This will essentailly check for control and command holds in typing areas.
    let wordCount : number = 0; //This variable will be used in the reason section, because users can not exceed 100 words.

    //These are the styles that go around the contendible area
    export let cont : boolean = true; //This will allow the areas to be contentdible or not
    export let contSymbol : string = blackContBorder; //This will be the border around the contentidble area
    let contSymbol2 : string = contBorderNoPaper;

    //These are the lighting features
    export let lightDark : string = "bg-white text-black-200"; //This will be the classes for the light and dark mode of the page.
    let color : string = "black";

    //THis function will be used to count how many characters are actually typed.
    const typeCheck = (e : any) => {
        /*
        Param --> e: any (realistically, this is an EventTarget | null)
        -----
        Count how many characters are typed in the reason contendible block.
        */
        if(wordCount != 100) {
            let example : string[] = e.target.innerText.split(/\s+/); //Split the text by 1 to n spaces, so the program won't count 5 spaces as a word
            example = example.filter(word => word != ''); //Filter everything that isn't a space
            wordCount = example.length; //The word count is now this.
        } else {
            //Once we've hit a length of 100, you are done.
            e.preventDefault();
        }
    }

    const blurCheck = (e : any) => {
        /*
        Param --> e : any (realistically, this is an EventTarget | null)
        ------
        This function will essentially check to see if the contentidble area has been changed, 
        and if it's empty, it will return the default value*/

        if(e.target.innerText.length == 0) {
            //This means that the contentible area is empty
            e.target.innerHTML = defaultText[e.target.getAttribute("data-name")]; //Return the original default value if the user left it empty
            outputText[e.target.getAttribute("data-name")] = defaultText[e.target.getAttribute("data-name")]; //Set the output text to the default

            //So this will ensure that the 'reason' area will reset the count to 0 if it's empty
            if(e.target.getAttribute("data-name") == 'elipsis') {
                wordCount = 0; //This is just to keep the number check correct
            }
        } else {
            //Otherwise we'll save the value to the outputText.
            let attr : string = e.target.getAttribute("data-name");
            outputText[attr] = e.target.innerText;
        }
    }

    const clearText = (e : any) => {
        /*
        Param --> e : any (realistically this is an EventTarger | null)
        ---------
        This will clear the content in the contentidible areas so that they are empty when 
        the user clicks on them
        */

        e.target.innerText = "";

        //This will clear the actual content being written in the contendible areas, and will move the cursor to the beginning, so we were never losing focus, just
        //we weren't really getting rid of any of the content.
        let selection : any = window.getSelection();
        let range : any = document.createRange();
        selection.removeAllRanges();
        range.selectNodeContents(e.target);
        range.collapse(false);
        selection.addRange(range);
        e.target.focus();


        if(e.target.getAttribute("data-name") == "date" || e.target.getAttribute("data-name") == "time") {
            //This will essentially open the date modal for the user, it will also open the time modal.
            //This is to ensure that there aren't incorrectly written dates on the output.
            dateModal = true;
            if(e.target.getAttribute("data-name") == "time") {
                timeStuff = true;
            } else {
                timeStuff = false;
            }
        }

    }

    //This will be some keypress formatting for the different parts of the contendible data
    const numberFormat = (e: any) => {
        if(e.keyCode == 224 || e.keyCode == 17) {
            //If this is cmd or ctrl, this is true
            keyCombo = true;
        }

        if(keyCombo) {
            if(e.keyCode != 65) {
                //You can only type the letter a, you can't user any other cmd/ctrl keyboard shortcuts
                e.preventDefault;
            }
        } else {
            //You can otherwise only type numbers, or the backspace.
            if((e.keyCode < 48 || e.keyCode > 57) && e.keyCode != 8) {
                //If it's isn't in between this range or a, then it doesn't matter
                e.preventDefault();
            }
        }
    }

    const checkBackSpace = (e:any) => {
        //This is for the 'reason' area, it will set the content to zero if the length is zero, and the key is up.
       if(e.innerText.length == 0) {
        wordCount = 0;
       }
    }

</script>

<div style={mobileDisplay ? "transform:scale(" + windowWidth / 856 + ");" : ''} class="w-[856px] h-[1096px] mt-[50px] paper:mt-[0px] flex justify-center relative">
    <div bind:this={page} class="w-[816px] h-[1056px] {!mobileDisplay ? lightDark + " paper:w-[100vw] paper:h-auto" : 'bg-white' }">

        <!--This is the demerit logo area-->
        <img src="{base}/demerit_logo.png" width={816 - (96*2)} class="ml-[105px] mt-[52px] {!mobileDisplay ? "paper:hidden" : ''}" alt="demerit_title"/>

        <!--This will be the user input area for the name, date, and hr#-->
        <div class="{!mobileDisplay ? "paper:w-auto paper:ml-[10%] paper:inline-block paper:mx-auto paper:mt-[5em]" : ''} w-100 h-auto py-[10px] mx-[96px] mb-4 mt-[1em] border-b-2 border-{color} flex flex-row justify-content no-wrap">

            {#each [["text-lg grow-[2]", "Name: ", outputText["name"], "name"], 
            ["text-lg grow-[1]", "Date: ", dateValue, "date"],
            ["text-lg grow-[1]", "Hr #: ", outputText["hr"], "hr"]] as data, i}

                <div class={data[0]}>
                    <span class="font-bold">{data[1]}</span>
                    <span
                        role="contentinfo"
                        on:keydown={(e)=>{
                            if(i == 2) {
                                //If this is an HR number, we only want numbers
                                numberFormat(e);
                            }
                        }} on:keyup={(e)=>{
                            //This is the ensure that the cmd/or control isn't always set
                            keyCombo = false;
                        }} on:focus={(e)=>{clearText(e)}} 
                        on:blur={(e)=>{
                            if(i != 1) 
                            {
                                blurCheck(e);
                            }
                        }} 
                        data-name={data[3]} 
                        class="{contSymbol} {i == 0 ? "capitalize" : ""}" 
                        contenteditable={windowWidth > 856 ? cont : false}>
                            {data[2]}
                    </span>
                </div>

            {/each}
        </div>

        <h3 class="ml-[96px] text-lg font-bold uppercase mb-1.5 {!mobileDisplay ? "paper:ml-[10%]" : ''}">Infraction: </h3>

        <!--This is the actual editable content-->
        <p class="mx-[96px] {!mobileDisplay ? "paper:w-[80%] paper:mx-auto" : ''}">
            I earned
            
            <!--This is the fire contentdible area (#)-->
            <span 
            role="contentinfo" 
            data-name="#" 
            on:focus={(e)=>{clearText(e)}} 
            on:blur={(e)=>{blurCheck(e);}} 
            class={contSymbol} 
            contenteditable={windowWidth > 856 ? cont : false} 
            on:keydown={(e)=>{
                numberFormat(e);
            }} on:keyup={(e)=>{
                keyCombo = false;
            }}>
                <!--This will determine which content is visible. On anything where the entire page is viewable, you just need to see what has been written, as opposed to what has been saved.-->
                {#if !mobileDisplay && windowWidth > 856}
                    (#)
                {:else}
                    {outputText["#"]}
                {/if}
            </span> 

            demerit points at approximately 

            <!--THis is the second contendible area (time)-->
            <span 
            data-name="time" 
            on:focus={(e)=>{clearText(e)}} 
            class={contSymbol} 
            contenteditable={windowWidth > 856 ? cont : false}>
                {timeValue}
            </span>

            for 
            
            <!--This is the third contendible area (a/an infraction)-->
            <span 
            data-name="a/an" 
            on:focus={(e)=>{clearText(e)}} 
            on:blur={(e)=>{blurCheck(e);}} 
            class={contSymbol} 
            contenteditable={windowWidth > 856 ? cont : false}>
                {#if !mobileDisplay && windowWidth > 856}
                    a/an (infraction)
                {:else}
                    {outputText["a/an"]}
                {/if}
            </span>. 

            <!--This is the fourth contendible area (Who assigned this to you)-->
            <span 
            data-name="who" 
            class={contSymbol} 
            on:focus={(e)=>{clearText(e)}} 
            on:blur={(e)=>{blurCheck(e);}} 
            contenteditable={windowWidth > 856 ? cont : false}>
                {#if !mobileDisplay && windowWidth > 856}
                    (Who assigned you the demerit, if Capt. Spell out Captain) 
                {:else}
                    {outputText["who"]}
                {/if}
            </span>

            assigned me this demerit report because 
            
            <!--This is the fifth contendible area (...)-->
            <span 
            role="textbox" 
            tabindex="-1" 
            data-name="elipsis" 
            class={contSymbol}
            contenteditable={windowWidth > 856 ? cont : false} 
            on:focus={(e)=>{clearText(e)}} 
            on:blur={(e)=>{blurCheck(e);}} 
            on:keydown={(e)=>{typeCheck(e)}} 
            on:keyup={(e)=>{
                if(e.keyCode == 8) {
                    checkBackSpace(e.target);
                }
            }}>

                {#if !mobileDisplay && windowWidth > 856}
                    ...
                {:else}
                    {outputText["elipsis"]}
                {/if}
            </span> 
            
            <!--This will just count the words being written-->
            <span>
                {#if cont && windowWidth > 856} 
                    {wordCount} / 100 
                {/if}
            </span>
        </p>

        <!--This is the table, it will be present only the full paper viewable content-->
        <table class="w-margin h-[125px] absolute bottom-[96px] ml-[96px] border-collapse {!mobileDisplay ? "paper:hidden": ''}">
            <colgroup>
                <col span="1" style="width: 2%;">
                <col span="1" style="width: 50%;">
                <col span="1" style="width: 24%;">
                <col span="1" style="width: 24%;">
             </colgroup>
             {#each Array(2) as _, index}
             <tr>
                {#each Array(4) as _, index2}
                    <td class="border border-black h-[20px] relative">
                        <i class="absolute top-[2px] left-[10px]">{tableContent[index][index2]}</i>
                    </td>
                {/each}
             </tr>
             {/each}
        </table>

        <!--This is the editor area on screens that are much smaller then the paper size-->
        {#if editorVisible}
            <!--This will be the editor for the mobile platform-->
            <div class="paper:block hidden w-[80vw] py-[20px] border-t-2 border-black mx-auto mt-[20px]">
                
                <h1 class="text-xl font-bold">Editor Area</h1><br>

                <!--This will allow you to edit the name, date, and hr# on mobile or smaller screens-->
                {#each [["text-lg", "Enter you name here: ", outputText["name"], "name"], 
                    ["text-lg", "Enter the date here: ", dateValue, "date"],
                    ["text-lg", "Enter your Hr # here: ", outputText["hr"], "hr"]] as data, i}

                        <div class={data[0]}>
                            <span class="font-bold">{data[1]}</span>
                            <span
                                role="contentinfo"
                                on:keydown={(e)=>{
                                    if(i == 2) {
                                        numberFormat(e);
                                    }
                                }} on:keyup={(e)=>{
                                    keyCombo = false;
                                }} 
                                on:focus={(e)=>{clearText(e)}} 
                                on:blur={(e)=>{
                                    if(i != 1) {
                                        blurCheck(e);
                                    }
                                }} 
                                data-name={data[3]} 
                                class="font-normal {contSymbol2} {i == 0 ? "capitalize" : ""}" 
                                contenteditable={cont}>
                                    {data[2]}
                            </span>
                        </div><br>

                    {/each}

                <!--Edit you demerit points here on mobile-->
                <p class="font-bold"> Enter Demerit points here: 
                    <span 
                    class="font-normal {contSymbol2}" 
                    role="contentinfo" 
                    data-name="#" 
                    on:focus={(e)=>{clearText(e)}} 
                    on:blur={(e)=>{blurCheck(e);}} 
                    contenteditable={cont} 
                    on:keydown={(e)=>{
                        numberFormat(e);
                    }} 
                    on:keyup={(e)=>{
                        keyCombo = false;
                    }}>
                        {#if !mobileDisplay}
                            (#)
                        {:else}
                            {outputText["#"]}
                        {/if}
                    </span>
                </p><br>

                <!--Edit your time here on mobile-->
                <p class="font-bold"> Pick your time here: 
                    <span 
                    data-name="time" 
                    on:focus={(e)=>{clearText(e)}} 
                    class="font-normal {contSymbol2}" 
                    contenteditable={cont}>
                        {timeValue}
                    </span>
                </p><br>

                <!--Edit infractio here on mobile-->
                <p class="font-bold"> Write infraction here: 
                    <span 
                    data-name="a/an" 
                    on:focus={(e)=>{clearText(e)}} 
                    on:blur={(e)=>{blurCheck(e);}} 
                    class="font-normal {contSymbol2}" 
                    contenteditable={cont}>
                        {#if !mobileDisplay}
                            a/an (infraction)
                        {:else}
                            {outputText["a/an"]}
                        {/if}
                    </span>
                </p><br>

                <!--Edit who assigned the infraction here on mobile-->
                <p class="font-bold"> Write who assigned the infraction here: 
                    <span 
                    data-name="who" 
                    class="font-normal {contSymbol2}" 
                    on:focus={(e)=>{clearText(e)}} 
                    on:blur={(e)=>{blurCheck(e);}} 
                    contenteditable={cont}>
                        {#if !mobileDisplay}
                            (Who assigned you the demerit, if Capt. Spell out Captain) 
                        {:else}
                            {outputText["who"]}
                        {/if}
                    </span>
                </p><br>

                <!--Edit your reason here on mobile.-->
                <p class="font-bold"> Write your reason here: 
                    <span 
                    role="textbox" 
                    tabindex="-1" 
                    data-name="elipsis" 
                    class="font-normal {contSymbol2}" 
                    contenteditable={cont} 
                    on:focus={(e)=>{clearText(e)}} 
                    on:blur={(e)=>{blurCheck(e);}} 
                    on:keydown={(e)=>{typeCheck(e)}} 
                    on:keyup={(e)=>{
                        if(e.keyCode == 8) {
                            checkBackSpace(e.target);
                        }
                    }}>
                        {#if !mobileDisplay}
                            ...
                        {:else}
                            {outputText["elipsis"]}
                        {/if}
                    </span>
                    <!--This will just count the words being written-->
                <span>
                    {wordCount} / 100 
                </span>
                </p><br>

            </div>
        {/if}

    </div>

</div>