const { PrivateKey } = require('bsv');
const {HandCashCloudAccount, Environments} = require('@handcash/handcash-connect-beta');
const http = require('superagent');
const fs = require('fs');
const newTesters = 200;
const appId = '5ed6978e37379057af592f53';
const admin_token = "MIIEvAIBADANBgkqhkiG9w0BAQEFAAS";

(async () => {   
    let newTesters;
    try { 
        console.log(`${Environments.iae.apiEndpoint}/admin/tester`)
        const resp = await http
            .post(`${Environments.iae.apiEndpoint}/admin/tester`)
            .set('Authorization', `Admin ${admin_token}`)
            .send({
                numberOfTesters: 200,
                appId: '5ed6978e37379057af592f53',
            }) 
            newTesters = resp.body;
            console.log(newTesters)
        } catch(err){
            console.log('error', err.message);
        }

    let existingTesters; 
    try {
        const jsonString = fs.readFileSync(`./testers/${appId}.json`)
        existingTesters = JSON.parse(jsonString)
      } catch(err) {
        console.log(err.message)
      }

    let testers = {
        items: []
    }

    testers.items = existingTesters ? testers.items.concat(existingTesters.items): testers.items
    testers.items = newTesters ? testers.items.concat(newTesters.items): testers.items

    fs.writeFile(`./testers/${appId}.json`, JSON.stringify(testers), function(err) {
        if (err) {
            console.log(err);
        }
    });

})();