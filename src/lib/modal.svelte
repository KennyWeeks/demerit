<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import "../app.css";
    const previousFocused = typeof document !== 'undefined' && document.activeElement;
    export let classData : string = "w-auto h-auto inline-block bg-blue-1000 fixed top-[70px] p-2 right-4 text-white z-50 text-center rounded-md shadow-in";
    export let date : string = "";
    export let time : string = "";
    export let finalTime : string = "";
    export let formatDate : string = "";
    export let formatDateTime : string = ""
    import {monthObject} from "./createPDF.js";
    const timeFormat = (time:string, amPm:string) => {
        console.log(time);
        let timeArray = time.split(" ");
        time = "";
        console.log(timeArray.length);
        for(let i = 0; i < timeArray.length; i++) {
            if(i == 2) {
                time += formatDateString(formatDateTime, timeArray[2]);
                break;
            }
            time += timeArray[i];
            if(i == 0) {
                time += " " + amPm;
            }
            if(timeArray[2] == '' || timeArray[2] == ' ') {
                break;
            }
            time += " ";
        }
        return time;
    };

    const formatDateString = (format: string, dateString : string) => {
        if(dateString == "date of demerit" || dateString == "(time)") {
            return dateString;
        }
        let mm : string = dateString.split("-")[1];
        let yyyy : string = dateString.split("-")[0];
        let dd : string = dateString.split("-")[2];
        if(format == "#yyyy-mm-dd") {
            return dateString;
        } else if(format == "#yyyy.mm.dd") {
            return yyyy + "." + mm + "." + dd;
        } else if(format == "#yyyy/mm/dd") {
            return yyyy + "/" + mm + "/" + dd;
        } else if(format == "#mm dd, yyyy") {
            return mm + " " + dd + ", " + yyyy;
        } else if(format == "yyyy/mm/dd") {
            return yyyy + "/" + monthObject[mm] + "/" + dd;
        } else if(format == "yyyy.mm.dd") {
            return yyyy + "." + monthObject[mm] + "." + dd;
        } else if(format == "yyyy-mm-dd") {
            return yyyy + "-" + monthObject[mm] + "-" + dd;
        } else {
            return monthObject[mm] + " " + dd + ", " + yyyy;
        }
    }

    onMount(()=>{
        console.log(previousFocused);
    });

    if(previousFocused) {
        onDestroy(()=>{
            console.log(previousFocused);
            let pf = previousFocused as HTMLElement;
            if(date != "" && pf.getAttribute("data-name") == "date") {
                console.log(date);
                console.log(date.split("-"));
                pf.innerText = formatDateString(formatDate, date);
                console.log(date);
                date = formatDateString(formatDate, date);
            }

            if(time != "" && pf.getAttribute("data-name") == "time") {
                if(time == "(time)") {
                    pf.innerText = "(time)";
                    return 
                }
                console.log("This is before the formatting " + time);
                if(time.indexOf(":") != -1) {
                    if(time.indexOf(":") == 2 && parseInt(time.substring(0, time.indexOf(":"))) >= 12) {
                        let hours : string | number = time.substring(0, time.indexOf(":"));
                        hours = parseInt(hours) > 12 ? parseInt(hours) - 12 : hours; //This will subract 12 from the military time;
                        time = hours.toString() + time.slice(time.indexOf(":"));
                        time = timeFormat(time, "PM");
                    } else {
                        time = timeFormat(time, "AM");  
                    }
                } else {
                    time = formatDateString(formatDateTime, time.split(" ")[2]);
                }
                pf.innerText = time;
                finalTime = time;
                console.log(finalTime);
            }
        });
    }
</script>

<div class={classData}>
    <slot></slot>
</div>
