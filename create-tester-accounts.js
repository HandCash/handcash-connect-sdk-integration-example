require('dotenv').config();
const http = require('superagent');
const fs = require('fs');
const { Environments } = require('@handcash/handcash-connect-beta');
const numberOfTesters = Math.min(process.argv[2],100) || 100 
const army = process.argv[3] || 1;
const appId = process.env.appId;
const admin_token = process.env.admin_token;


(async () => {   
    try { 
        const resp = await http
            .post(`${Environments.iae.apiEndpoint}/admin/tester`)
            .set('Authorization', `Admin ${admin_token}`)
            .send({
                numberOfTesters,
                appId: appId,
            }) 
        const newTesters = resp.body;
      
        let existingTesters;
        try{
            const jsonString = fs.readFileSync(`./testers/${army}.json`)
            existingTesters = JSON.parse(jsonString)
        }catch(err){
        }

        let testers = {
            items: []
        }

        testers.items = existingTesters ? testers.items.concat(existingTesters.items): testers.items
        testers.items = newTesters ? testers.items.concat(newTesters.items): testers.items

        fs.writeFile(`./testers/${army}.json`, JSON.stringify(testers), function(err) {
            if (err) {
                console.log(err);
            }
        });
        console.log(`${numberOfTesters} testers saved to /testers/${army}.json`)
    } catch(err){
        console.log('error', err.message);
    }

})();
