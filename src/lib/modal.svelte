<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import "../app.css";
    const previousFocused = typeof document !== 'undefined' && document.activeElement;
    export let classData : string = "w-auto h-auto inline-block bg-blue-1000 fixed top-[70px] p-2 right-4 text-white z-50 text-center rounded-md shadow-in";
    export let date : string = "";
    export let time : string = "";
    export let finalTime : string = "";
    const timeFormat = (time:string, amPm:string) => {
        let timeArray = time.split(" ");
        time = "";
        console.log(timeArray.length);
        for(let i = 0; i < timeArray.length; i++) {
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

    onMount(()=>{
        console.log(previousFocused);
    });

    if(previousFocused) {
        onDestroy(()=>{
            console.log(previousFocused);
            let pf = previousFocused as HTMLElement;
            if(date != "" && pf.getAttribute("data-name") == "date") {
                pf.innerText = date;
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
                    time = time.split(" ")[2];
                }
                pf.innerText = time;
                finalTime = time;
            }
        });
    }
</script>

<div class={classData}>
    <slot></slot>
</div>
