
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

    var housesMap = new Map();
    var housesSameFloorMap = new Map();
    
    var dates = []
    for(var i = 6; i<=31; i++) {dates.push(i);}



    async.mapSeries(dates, 
    	function(date, callback){
	        setTimeout(function() {
	            //click on the date dialog
	            var toggleCalender = document.querySelector(".toggle.calendar");
	            toggleCalender.click();
	            //wait for 100 ms

	            setTimeout(function(){
	                //click on the date
	                getDateSelector(date).click()
	                setTimeout(function(){
	                    //scrape all on page
	                    document.querySelectorAll('.table_row').forEach(function(element){
	                    	var houseJSON = getHouseDetailsJSON(element);
                            if(houseJSON && houseJSON['unit']){
                                housesMap.set(houseJSON['unit'] + houseJSON['building'],houseJSON);
                            }
	                    })
	                    callback();
	                }, 500);
	            }, 250);

	        }, 2000)
    	},
    	function(err, callback) {
            var nextDates = []
            for(var i = 1; i<=30; i++) {nextDates.push(i);}
            async.mapSeries(nextDates, 
                function(date, callback){
                    setTimeout(function() {
                        //click on the date dialog
                        var toggleCalender = document.querySelector(".toggle.calendar");
                        toggleCalender.click();
                        //wait for 100 ms
                        if(date == 1){
                            document.querySelector('.ui-datepicker-next').click()    
                        }
                        

                        setTimeout(function(){
                            //click on the date
                            getDateSelector(date).click()
                            setTimeout(function(){
                                //scrape all on page
                                document.querySelectorAll('.table_row').forEach(function(element){
                                    var houseJSON = getHouseDetailsJSON(element);
                                    if(houseJSON && houseJSON['unit']){
                                        housesMap.set(houseJSON['unit'] + houseJSON['building'],houseJSON);
                                    }
                                })
                                callback();
                            }, 500);
                        }, 250);

                    }, 2000)
                },
                function(err, callback) {
                    var arr = Array.from(housesMap.values());
                    console.log('@@FINAL Houses bitches' + JSON.stringify(arr));

                    var get_entries = housesMap.entries(); 

                    for(var ele of get_entries){
                        if(ele.length > 1){
                            var unitJSON = ele[1];
                            var k = Math.floor(parseInt(unitJSON['unit'])/100) + unitJSON['building'];   
                            var entrylst = housesSameFloorMap.get(k);
                            if(!entrylst){
                                entrylst = []
                            }
                            entrylst.push(unitJSON);
                            housesSameFloorMap.set(k,entrylst);                         
                        }
                    }

                    
                    
                    var get_entries_sameFloor = housesSameFloorMap.entries(); 
                    for(var ele of get_entries_sameFloor){
                        if(ele.length > 1 && ele[1].length <= 1){
                            housesSameFloorMap.delete(ele[0]);
                        }
                    }

                    var sameFloorArr = Array.from(housesSameFloorMap.entries());
                    console.log('@@Same floor Houses bitches' + JSON.stringify(sameFloorArr));
                }
            )
    	}
    )
    

    

    function getHouseDetailsJSON(element){
    	var houseDetailsTxt = element.innerText;
    	var houseDetailsArr = houseDetailsTxt.split("\n");
        
        var houseJSON;
    	if(houseDetailsArr[0] && houseDetailsArr.length > 5){
            if(houseDetailsArr[4].includes('Net Effective Price')){
                houseJSON = {
                    'unit' : houseDetailsArr[0].replace('RESIDENCE ',''),
                    'building' : houseDetailsArr[1],
                    'rent' : houseDetailsArr[3],
                    'available' : houseDetailsArr[5].replace('Available ',''),
                    'beds' : houseDetailsArr[6].replace(' Bed',''),
                    'baths' : houseDetailsArr[7].replace(' Bath','')
                }       
            }
            else{
                houseJSON = {
                    'unit' : houseDetailsArr[0].replace('RESIDENCE ',''),
                    'building' : houseDetailsArr[1],
                    'rent' : houseDetailsArr[3],
                    'available' : houseDetailsArr[4].replace('Available ',''),
                    'beds' : houseDetailsArr[5].replace(' Bed',''),
                    'baths' : houseDetailsArr[6].replace(' Bath','')
                }       
            }
    		
	    	return houseJSON;
    	}
    	
    	return '';
    }


    function getDateSelector(date) {
        var target;
        document.querySelectorAll('.ui-datepicker-calendar td').forEach(function (element) {

            if(element.textContent.trim() == date) {
                target = element
            }
        })
        return target;
    }



})();
