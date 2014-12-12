//chrome.storage.sync.clear();
chrome.storage.sync.get('exchange', function(res){
	var exchange = res;
	console.log("El Exchange len", exchange);

	if (Object.keys(exchange).length == 0){
		$.getJSON('https://openexchangerates.org/api/latest.json?app_id=ef1e2b5a40ab4b7894e2f9d501940325', function(text){
  	
		    exchange = text['rates']['UYU'];		    
		    now = new Date();
		    var nows = now.toString();
		    chrome.storage.sync.set({'exchange': exchange, 'timestamp': nows}, function() {
                console.log('cotización guardada con éxito');
	        });
		});
	}
	else {
		chrome.storage.sync.get('timestamp', function(result){
			var stored_timestamp = new Date(result['timestamp']);
			var now = new Date();
			
			var hours = Math.abs(now - stored_timestamp) / 36e5;
			console.log("La cotización se cambió hace " + hours.toFixed(2) + " horas");

			if (hours >= 12){
				$.getJSON('https://openexchangerates.org/api/latest.json?app_id=ef1e2b5a40ab4b7894e2f9d501940325', function(text){
		  	
				    exchange = text['rates']['UYU'];		    
				    now = new Date();
				    var nows = now.toString();
				    chrome.storage.sync.set({'exchange': exchange, 'timestamp': nows}, function() {
		                console.log('cotización guardada con éxito');
			        });
				});
			}


		});
	}

});


chrome.storage.sync.get('exchange', function(res){
	console.log(res['exchange']);
	var exchange = res['exchange'];

	if (document.URL.indexOf("articulo") > -1){
		var Pricelist = $(".ch-price strong:nth-child(2)");
	}
	else{
		var Pricelist = $(".ch-price");	
	}
	
	var uss = "U$S";
	Pricelist.each(function (){					
		item = $( this )[0]['innerHTML'].trim();				
		if (item.indexOf(uss) > -1) {		
			number = item.substring(4);
			number = number.replace('.','');
			number = number.replace('nbsp;','');			
			priceInPesos = parseInt(number) * exchange;	
			priceArray = priceInPesos.toFixed(2).split('.');		
			$(this).text("$ " + priceArray[0]);
			$(this).append("<sup>"+priceArray[1]+"</sup>");
			$(this).css("color", "#DF6727");
		}
	});

});