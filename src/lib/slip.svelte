<script lang="ts">


    export let nameValue : string = "you name here";
    export let dateValue : string = "date of demerit";
    export let hrValue : string = "1234";
    export let dateModal : boolean = false; //Open the dateModal
    export let timeStuff : boolean = false; //Open the time option in the data modal
    export let timeValue : string = "(time)";
    export let mobileDisplay : boolean = false;
    export let windowWidth : number = 0;
    export let page : HTMLElement | null;
    export let pageHolder : HTMLElement | null;
    import {base} from "$app/paths";

    let tableContent : Array<Array<string>> = [["", "Recruit Signature", "HR #", "Date"], ["", "Academy Staff Signature", "HR #", "Date"]];

    //These are the default values in the page
    let defaultText : {[key: string]: string} = {};
    export let outputText : {[key: string]: string} = {};
    let temp : {[key:string]: string} = {"#": "(#)", "time": "(time)", "a/an": "(a/an infraction)", "who": "(Who assigned you the demerit, if Capt. Spell out Captain)", "elipsis": "...", "name": "your name here", "date": "date of demerit", "hr": "1234"}
    for(let k in temp) {
        defaultText[k] = temp[k];
    }

    let keyCombo : boolean = false; //This will essentailly check for control and command holds in typing areas.
    let wordCount : number = 0;
    export let lightDark : string = "bg-white text-black-200"; //This will be the classes for the light and dark mode of the page.
    let color : string = "black";
    export let cont : boolean = true; //This will allow the areas to be contentdible or not
    export let contSymbol : string = `rounded-sm border border-black px-[5px] outline-0` //This will be the border around the contentidble area

    const typeCheck = (e : any) => {
        if(wordCount != 100) {
            if(e.keyCode == 8) {
                console.log(e.target.innerText.split(/\s+/));
            }
            let example : string[] = e.target.innerText.split(/\s+/);
            example = example.filter(word => word != '');
            wordCount = example.length;
        } else {
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
            e.target.innerHTML = defaultText[e.target.getAttribute("data-name")];
            outputText[e.target.getAttribute("data-name")] = defaultText[e.target.getAttribute("data-name")];
            console.log(outputText);

            //So this will ensure that the 'reason' area will reset the count to 0 if it's empty
            if(e.target.getAttribute("data-name") == 'elipsis') {
                wordCount = 0;
            }
        } else {
            //Otherwise we'll save the value to the outputText.
            let attr : string = e.target.getAttribute("data-name");
            outputText[attr] = e.target.innerText;
            console.log(outputText);
        }
    }

    const clearText = (e : any) => {
        /*
        Param --> e : any (realistically this is an EventTarger | null)
        ---------
        This will clear the content in the contentidible areas so that they are empty when 
        the user clicks on them
        */

        e.target.innerHTML = "";


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
                //i don't remember what key this is
                e.preventDefault;
            }
        } else {
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

    $: {
        if(mobileDisplay) {
            console.log("From the smaller slip")
            console.log(outputText);
        }
    }

</script>

<div bind:this={pageHolder} style={mobileDisplay ? "transform:scale(" + windowWidth / 856 + ")" : ''} class="w-[856px] h-[1096px] mt-[500px] paper:mt-[0px] paper:h-auto flex items-center justify-center relative">
    <div bind:this={page} class="w-[816px] h-[1056px] {!mobileDisplay ? lightDark + " paper:w-[100vw] paper:h-[100vh]" : 'bg-white' }">

        <img src="{base}/demerit_logo.png" width={816 - (96*2)} class="ml-[105px] mt-[52px] {!mobileDisplay ? "paper:hidden" : ''}" alt="demerit_title"/>

        <div class="{!mobileDisplay ? "paper:w-auto paper:ml-[10%] paper:inline-block paper:mx-auto paper:mt-[5em]" : ''} w-100 h-auto py-[10px] mx-[96px] mb-4 mt-[1em] border-b-2 border-{color} flex flex-row justify-content no-wrap">

            {#each [["text-lg grow-[2]", "Name: ", nameValue, "name"], 
            ["text-lg grow-[1]", "Date: ", dateValue, "date"],
            ["text-lg grow-[1]", "Hr #: ", hrValue, "hr"]] as data, i}

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
                        }} on:focus={(e)=>{clearText(e)}} on:blur={(e)=>{
                            if(i != 1) {blurCheck(e);}}} data-name={data[3]} class="{contSymbol} {i == 0 ? "capitalize" : ""}" contenteditable={cont}>
                            {data[2]}
                    </span>
                </div>

            {/each}
        </div>

        <h3 class="ml-[96px] text-lg font-bold uppercase mb-1.5 {!mobileDisplay ? "paper:ml-[10%]" : ''}">Infraction: </h3>

        <p class="mx-[96px] {!mobileDisplay ? "paper:w-[80%] paper:mx-auto" : ''}">I earned 
            <span role="contentinfo" data-name="#" on:focus={(e)=>{clearText(e)}} on:blur={(e)=>{blurCheck(e);}} class={contSymbol} contenteditable={cont} on:keydown={(e)=>{
                numberFormat(e);
            }} on:keyup={(e)=>{
                keyCombo = false;
            }}>
            {#if !mobileDisplay}
            (#)
            {:else}
            {outputText["#"]}
            {/if}</span> 
            demerit&nbsp;points&nbsp;at&nbsp;approximately&nbsp; 
            <span data-name="time" on:focus={(e)=>{clearText(e)}} class={contSymbol} contenteditable={cont}>{timeValue}</span>
            for <span data-name="a/an" on:focus={(e)=>{clearText(e)}} on:blur={(e)=>{blurCheck(e);}} class={contSymbol} contenteditable={cont}>
                {#if !mobileDisplay}
                a/an (infraction)
                {:else}
                {outputText["a/an"]}
                {/if}
            </span>. 
            <span data-name="who" class={contSymbol} on:focus={(e)=>{clearText(e)}} on:blur={(e)=>{blurCheck(e);}} contenteditable={cont}>
                {#if !mobileDisplay}
                (Who assigned you the demerit, if Capt. Spell out Captain) 
                {:else}
                {outputText["who"]}
                {/if}
            </span> 
            assigned me this demerit report because 
            <span role="textbox" tabindex="-1" data-name="elipsis" class={contSymbol} contenteditable={cont} on:focus={(e)=>{clearText(e)}} on:blur={(e)=>{blurCheck(e);}} on:keydown={(e)=>{typeCheck(e)}} on:keyup={(e)=>{
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
            <span>{#if cont} {wordCount} / 100 {/if}</span>
        </p>

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
    
    </div>

</div>