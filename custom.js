// Time override (for development).
var timeOverride = false; var overrideHour = 0; var overrideMinute = 0; var overrideDOTW = 0;
function doOverride(hr, min, dotw) { timeOverride = true; overrideHour = hr; overrideMinute = min; overrideDOTW = dotw }
function undoOverride() { timeOverride = false }

// Initial setup.
if (localStorage.getItem("group") == null) { localStorage.setItem("group", "gold") }
var thenPeriod = -1;
var startupDelay = true;

// Load bell sound.
var bell = new Howl({
    src: [ "bell.ogg", "bell.mp3", "bell.wav"]
});

// Table updater.
function updateTable() {

    // Initialize current specifics.
    var group = localStorage.getItem("group");
    var now = new Date(); 
    var nowHour = now.getHours();
    var nowMinute = now.getMinutes();
    var nowDOTW = now.getDay();
    var nowBlock, nowDay, nowPeriod;

    // Check time override.
    if (timeOverride) {
        nowHour = overrideHour;
        nowMinute = overrideMinute;
        nowDOTW = overrideDOTW;
    }

    // Understand block.
    nowBlock = "break";
    switch (nowHour) {
        case 7: if (nowMinute >= 40) { nowBlock = "am" } break;
        case 8: case 9: nowBlock = "am"; break;
        case 10: if (nowMinute < 51) { nowBlock = "am" } break;
        case 11: if (nowMinute >= 58) { nowBlock = "pm" } break;
        case 12: case 13: nowBlock = "pm"; break;
        case 14: if (nowMinute < 59) { nowBlock = "pm" } break;
        default: nowBlock = "break"; break;
    }

    // Understand day.
    nowDay = "off";
    switch (nowDOTW) {
        case 1: nowDay = "mon"; break;
        case 2: nowDay = "tue"; break;
        case 3: nowDay = "wed"; break;
        case 4: nowDay = "thu"; break;
        case 5: nowDay = "fri"; break;
        default: nowDay = "off"; break;
    }

    // Understand period.
    nowPeriod = -1;
    switch (nowHour) {
        case 7: if (nowMinute >= 40) { nowPeriod = 1 } break;
        case 8: if (nowMinute < 37) { nowPeriod = 1 } if (nowMinute >= 42) { nowPeriod = 2 } break;
        case 9: if (nowMinute < 39) { nowPeriod = 2 } if (nowMinute >= 44) { nowPeriod = 3 } break;
        case 10: if (nowMinute < 51) { nowPeriod = 3 } break;
        case 11: if (nowMinute >= 58) { nowPeriod = 5 } break;
        case 12: if (nowMinute < 55) { nowPeriod = 5 } break;
        case 13: if (nowMinute >= 0) { nowPeriod = 6 } if (nowMinute >= 57) { nowPeriod = -1 } break;
        case 14: if (nowMinute >= 2) { nowPeriod = 7 } if (nowMinute >= 59) { nowPeriod = -1 } break;
        default: nowPeriod = -1; break;
    }

    $(".group-gold span").removeClass("selected-hour");
    $(".group-blue span").removeClass("selected-hour");

    // Update selections.
    if (group == "gold") {

        $(".group-gold.h3").addClass("selected-group");
        $(".group-blue").removeClass("selected-group selected-block selected-day");

        if (nowBlock == "break") {

            $(".group-gold").removeClass("selected-group selected-block selected-day");
            for (let i=1; i<8; i++) { $(`.group-gold hour-${i}`).removeClass("selected-hour") }

        } else if (nowBlock == "am") {

            $(".group-gold.time-am").addClass("selected-block");
            $(".group-gold.time-pm").removeClass("selected-block");

            if (nowDay != "off") {

                $(`.group-gold.time-am:not(day-${nowDay})`).removeClass("selected-day");
                $(`.group-gold.time-am.day-${nowDay}`).addClass("selected-day");

                $(`.group-gold.time-${nowBlock}.day-${nowDay} span.hour-${nowPeriod}`).addClass("selected-hour");

            }

        } else if (nowBlock == "pm") {

            $(".group-gold.time-am").removeClass("selected-block");
            $(".group-gold.time-pm").addClass("selected-block");

            if (nowDay != "off") {

                $(`.group-gold.time-pm:not(day-${nowDay})`).removeClass("selected-day");
                $(`.group-gold.time-pm.day-${nowDay}`).addClass("selected-day");

                $(`.group-gold.time-${nowBlock}.day-${nowDay} span.hour-${nowPeriod}`).addClass("selected-hour");

            }

        }

    } else if (group == "blue") {

        $(".group-blue.h3").addClass("selected-group");
        $(".group-gold").removeClass("selected-group selected-block selected-day");

        if (nowBlock == "break") {

            $(".group-blue").removeClass("selected-group selected-block selected-day");
            for (let i=1; i<8; i++) { $(`.group-blue hour-${i}`).removeClass("selected-hour") }

        } else if (nowBlock == "am") {

            $(".group-blue.time-am").addClass("selected-block");
            $(".group-blue.time-pm").removeClass("selected-block");

            if (nowDay != "off") {

                $(`.group-blue.time-am:not(day-${nowDay})`).removeClass("selected-day");
                $(`.group-blue.time-am.day-${nowDay}`).addClass("selected-day");

                $(`.group-blue.time-${nowBlock}.day-${nowDay} span.hour-${nowPeriod}`).addClass("selected-hour");

            }

        } else if (nowBlock == "pm") {

            $(".group-blue.time-am").removeClass("selected-block");
            $(".group-blue.time-pm").addClass("selected-block");

            if (nowDay != "off") {

                $(`.group-blue.time-pm:not(day-${nowDay})`).removeClass("selected-day");
                $(`.group-blue.time-pm.day-${nowDay}`).addClass("selected-day");

                $(`.group-blue.time-${nowBlock}.day-${nowDay} span.hour-${nowPeriod}`).addClass("selected-hour");

            }

        }

    }

    // Update title.
    document.title = "Eastern Hell (";
    switch (nowPeriod) {
        case 1: document.title += "1st Hour"; break;
        case 2: document.title += "2nd Hour"; break;
        case 3: document.title += "3rd Hour"; break;
        case 5: document.title += "5th Hour"; break;
        case 6: document.title += "6th Hour"; break;
        case 7: document.title += "7th Hour"; break;
        default: document.title += "Break"; break;
    }
    document.title += ")";

    // Play sounds.
    if (nowDay != "off" && thenPeriod != nowPeriod) {
        if (!startupDelay) { bell.play() }
        thenPeriod = nowPeriod;
    }

}
setInterval(updateTable, 2500);

// Dropdown updater.
function updateDropdown() {
    var group = localStorage.getItem("group");
    if (group == "gold") {
        $("#group-dropdown-gold").addClass("selected");
        $("#group-dropdown-blue").removeClass("selected");
    } else if (group == "blue") {
        $("#group-dropdown-gold").removeClass("selected");
        $("#group-dropdown-blue").addClass("selected");
    }
}

// Dropdown events.
$("#group-dropdown-gold").click(() => { localStorage.setItem("group", "gold"); updateDropdown(); updateTable(); });
$("#group-dropdown-blue").click(() => { localStorage.setItem("group", "blue"); updateDropdown(); updateTable(); });

// Onload setup.
setTimeout(function() {

    // Update dropdown.
    updateDropdown();

    // Update table.
    updateTable();

    // Startup delay.
    setTimeout(function() { startupDelay = false }, 2500);

}, 250);