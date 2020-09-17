#!/usr/bin/env node

const asyncFs = require('fs').promises;
const fs = require('fs');
const { COPYFILE_EXCL } = fs.constants;
const Path = require('path');

class Main {
    constructor() {
        let argument = process.argv.splice(2);

        if(!this.checkArguments(argument[0], argument[1])) return false;
        
        this.fileToCopy = argument[0];
        this.destination = argument[1];

        this.localFilesFolder = Path.join(__dirname, 'files')

        this.finalFileName = Path.join(this.localFilesFolder, this.fileToCopy);
        
        this.finalAdressToCopy = Path.join(process.cwd(), this.destination);



        ;(async () => {
            //Checks If Requested File Exists in Files Directory
            if(await this.localFileExists(this.fileToCopy)) {
                
                let fileName = Path.basename(this.destination);
                let directory = Path.dirname(this.finalAdressToCopy);

                if(!fs.existsSync(directory)) {
                    console.log(`${directory} Directory Doesn't Exist`);
                    return false;
                }

                //Check if File Name Already Exists in Chosen Directory
                if (await this.fileExists(fileName, directory)) {
                    console.log(`${fileName} Already Exists in ${directory}`);
                    return false;
                }
                
                else {
                    fs.copyFile(this.finalFileName, this.finalAdressToCopy, COPYFILE_EXCL, err => {
                        if(err) console.log('ERROR While Copying', err);
                        else console.log('Copied Succesfully');
                    });
                }   
                
            } else {
                console.log(`'${this.fileToCopy}' Doesn't Exist`);
                return false;
            }
        })()
    }

    async fileExists(file, path) {
        try {           
            file = Path.join(path, file);

            return fs.existsSync(file);
        } catch(e) {
            console.log("ERROR While Checking If File Exists", e);

            return false;
        }
    }

    async localFileExists(file) {
        try {
            let path = Path.join(__dirname, 'files', file);

            return fs.existsSync(path);
        } catch(e) {
            console.log("ERROR While Checking If Local File Exists", e)
        }
    }

    checkArguments(file, path) {
        if(!file) {
            console.log('Enter File To Copy');
            
            return false;
        } else if(!path) {
            console.log('Enter Output Name');
            
            return false;
        } else {
            return true;
        }
    }
}

new Main();