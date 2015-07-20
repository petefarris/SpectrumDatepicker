var CALENDAR = function(){ 
  //init Global variables
  var wrap; 
  var label;  
  var months = ["Janurary", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; 
    //Init the calendar widget:: 
    function init(newWrap){ 
        // Give appropriate values to wrap and label, and provide fallback for wrap
        wrap    = $(newWrap || "#cal"); 
        label   = wrap.find("#label"); 
        wrap.find("#prev").bind("click.calendar", function () { switchMonth(false); }); 
        wrap.find("#next").bind("click.calendar", function () { switchMonth(true);  }); 
        label.bind("click", function () { switchMonth(null, new Date().getMonth(), new Date().getFullYear()); });        
        //Ensures that appropraite label is shown : simulates click event:: 
        label.click(); 
        
    } 
    //Switch calendar Months
    function switchMonth(next, month, year){ 
        var curr = label.text().trim().split(" "), calendar, tempYear =  parseInt(curr[1], 10); 
        
        //Change Months:: Expanded View
        if (!month) { 
            if (next) { 
                if (curr[0] === "December") { 
                    month = 0; 
                } else { 
                    month = months.indexOf(curr[0]) + 1; 
                } 
            } else { 
                if (curr[0] === "January") { 
                    month = 11; 
                } else { 
                    month = months.indexOf(curr[0]) - 1; 
                } 
            } 
        }
        //Change Years :: Expanded View 
        if (!year) { 
            if (next && month === 0) { 
                year = tempYear + 1; 
            } else if (!next && month === 11) { 
                year = tempYear - 1; 
            } else { 
                year = tempYear; 
            } 
        }
        
        //Create the calendar and set date:: 
        calendar = createCal(year, month); 
        $("#cal-frame", wrap)
            .find(".curr")
                .removeClass("curr")
                .addClass("temp")
            .end()
            .prepend(calendar.calendar()) 
            .find(".temp")
                .fadeOut("slow", function(){ $(this).remove(); }); 
        //set text for label 
        $('#label').text(calendar.label); 
        
    } 
    //create the calendar grid
    function createCal(year, month){ 
        var day = 1, i, j, haveDays = true,  
        startDay = new Date(year, month, day).getDay(), 
        daysInMonths = [31, (((year%4==0)&&(year%100!=0))||(year%400==0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], 
        calendar = [];
        
        //check cache object:: 
        if (createCal.cache[year]) { 
            if (createCal.cache[year][month]) { 
                return createCal.cache[year][month]; 
            } 
        } else { 
            createCal.cache[year] = {}; 
        }
        //start creating cal for the requested month:: 
        i = 0; //set first iterator to 0 
        while (haveDays) { 
            calendar[i] = []; 
            for (j = 0; j < 7; j++) { 
                if (i === 0) { 
                    if (j === startDay) { 
                        calendar[i][j] = day++; 
                        startDay++; 
                    } 
                } else if (day <= daysInMonths[month]) { 
                    calendar[i][j] = day++; 
                } else { 
                    calendar[i][j] = ""; 
                    haveDays = false; 
                } 
                if (day > daysInMonths[month]) { 
                    haveDays = false; 
                } 
            } 
            i++; 
        }; 
        
        //Set 7 Week Spillover Exception - Allows room for 30/31. 
        if (calendar[6]) { 
            for (i = 0; i < calendar[6].length; i++) { 
                if (calendar[6][i] !== "") { 
                    calendar[5][i] = "<span>" + calendar[5][i] + "</span><span>" + calendar[6][i] + "</span>"; 
                } 
            } 
            calendar = calendar.slice(0, 6); 
        }
            
        for (i = 0; i < calendar.length; i++) { 
            calendar[i] = "<tr><td>" + calendar[i].join("</td><td>") + "</td></tr>"; 
        } 
        calendar = $("<table>" + calendar.join("") + "</table>").addClass("curr"); 

        $("td:empty", calendar).addClass("nil"); 
        if (month === new Date().getMonth()) { 
            $('td', calendar).filter(function () { return $(this).text() === new Date().getDate().toString(); }).addClass("today"); 
        } 
        createCal.cache[year][month] = { calendar : function () { return calendar.clone() }, label : months[month] + " " + year }; 

        return createCal.cache[year][month];
    }; 
    
    createCal.cache = {}; 
    return { 
           init:init, 
           switchMonth: switchMonth, 
           createCal: createCal 
    }; 
    
};  