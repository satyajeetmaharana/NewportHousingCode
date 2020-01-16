
// ==UserScript==
// @name         Newport Website
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.newportrentals.com/apartments-jersey-city-for-rent/
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/async@3.1.0/dist/async.js
// ==/UserScript==

(function() {

	

    // Your code here...

    var houses = [];

    var dates = []
    for(var i = 6; i<=30; i++) {dates.push(i);}

    console.log("dates");
    console.log(dates);

    async.mapSeries(dates, 
    	function(date, callback){
	        setTimeout(function() {
	            //click on the date dialog
	            var toggleCalender = document.querySelector(".toggle.calendar");
	            toggleCalender.click();
	            //wait for 100 ms

	            setTimeout(function(){
	                //click on the date
	                console.log("date");
	                console.log(date);
	                getDateSelector(date).click()
	                setTimeout(function(){
	                    //scrape all on page

	                    houses.push({
	                        date : date
	                    })

	                    callback();
	                }, 250);
	            }, 1000);

	        }, 3000)
    	},
    	function(err, callback) {
    		console.log("done")
    	}
    )
    




    console.log("houses");
    console.log(houses);

    function getDateSelector(date) {
        console.log("date");
        console.log(date);
        var target;
        document.querySelectorAll('.ui-datepicker-calendar td').forEach(function (element) {

            if(element.textContent.includes(date)) {
                console.log("found");
                console.log(date);
                console.log(element);
                target = element
            }
        })
        return target;
    }



})();
