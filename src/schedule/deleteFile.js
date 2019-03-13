const fs = require('fs-extra');
const path = require('path');
const Picture = require('../model/picture');
const {projectPath, pictureZipPath} = require('../config');
const {dateFormat} = require('../utils/javascript');

async function deleteFile() {
    // 删除文件
    let data = await Picture.find({
        updateTime: {
            $lt: Date.now() - 6 * 30 * 24 * 3600000
        }
    });

    for (let item of data) {
        fs.remove(path.join(projectPath, item.path)).catch(err => {
            console.error(err)
        });
    }

    await Picture.remove({
        updateTime: {
            $lt: Date.now() - 6 * 30 * 24 * 3600000
        }
    });

    //删除ZIP
    let zip = await fs.readdir(path.join(projectPath, pictureZipPath));
    let deleteTime = dateFormat(new Date(Date.now() - 6 * 30 * 24 * 3600000), 'yyyyMMdd') + '.zip';
    for (let item of zip) {
        if (item < deleteTime) {
            fs.remove(path.join(projectPath, pictureZipPath, item)).catch(err => {
                console.error(err)
            });
        }
    }

    setTimeout(async () => {
        try {
            await deleteFile();
        } catch (err) {
            console.log(err)
        }
    }, 24 * 3600000);
}

deleteFile().catch((err) => {
    console.log(err)
});