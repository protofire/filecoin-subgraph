import { readFile, readdir, writeFile } from 'node:fs/promises';

const main = async () => {
    
    const contracts = await readdir('./contracts')

    const solFolders = contracts.filter(folder => folder.indexOf('.sol') > -1)

    for(const folder of solFolders){
        const contractName = folder.split('.sol').shift();

        const fileContents = await readFile(`./contracts/${folder}/${contractName}.json`, 'utf8');
        const contractDetails = JSON.parse(fileContents);

        await writeFile(`./abis/${contractName}.json`, JSON.stringify(contractDetails.abi, null, 4));
    }
}

main();