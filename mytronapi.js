var express = require('express');
const port = "9292";
const app = express();
const TronWeb = require('tronweb');
///// tronwallet details - TEjmHnYdovXXAYouvi97YVcKjD8P6aAEUY
///// PK - a2303f0a744dd601a9131fd13ff27b0c14b8440c335c2cabf950957c035ef745
// Contract Address 
var contractAddr = 'TFLtc1TmyQFtfX5wEzuFjaoMFmhkgr2Vtb'; 

const tronWeb = new TronWeb({
    //fullHost: 'https://api.trongrid.io',
    fullHost: 'https://api.shasta.trongrid.io',
    privateKey: 'a2303f0a744dd601a9131fd13ff27b0c14b8440c335c2cabf950957c035ef745'
});

async function triggercontract(toWallet, Amt){
   //console.log(">>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<");
   try{	   
	   let instance = await tronWeb.contract().at(contractAddr.toString());
	   let r = await instance.airdropACTIVE([toWallet.toString()], [Amt]).send({
	   	feeLimit:10000000,
	   	callValue:0	
	   });	   
	   console.log("RES >>>>>>>>>>>",r);	 
	   return r;
	}catch(e){
		console.log("EXCEPTION >>>>>>>>>",e);						
	}
}

app.get('/airdrop', (req,res)=>{	
    var to = req.query.to;
    var amt = req.query.amt;
    res.writeHead(200,{'Content-Type':'application/json'});
    if(to.length < 30){    		    	    
			res.end(JSON.stringify({"Error":"invalid ToWallet length"}));				
    }else if(amt <= 0){    	    
			res.end(JSON.stringify({"Error":"Amount missing"}));			
    }else if(req.hostname=="127.0.0.2"){
		var data = 	triggercontract(to, amt);		
		data.then((mydata)=>{				 			
			res.end(mydata);			
		}).catch((e)=>{
			console.log("....error occured...",e);
		});
	}else{			
			res.end(JSON.stringify({"Error":"Invalid Caller"}));			
	}
});

app.listen(port, function(){
    console.log("App listening on port:",port);
});



