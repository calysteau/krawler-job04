import _ from 'lodash'
import path from 'path'
import { fileURLToPath } from 'url'

console.log("job_04");

const __dirname = path.dirname(fileURLToPath(import.meta.url))
console.log(__dirname);

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/sentinel'

const platformname = 'Sentinel - 2'
const producttype = 'S2MSI2A'
const latitude = '43.604652'
const longitude = '1.444209'
const cloudcoverpercentagemin = '0'
const cloudcoverpercentagemax = '5'

// Register Open Access Hub account on https://scihub.copernicus.eu/userguide/SelfRegistration and set your login/password credentials
const username = 'login'
const userpassword = 'password'

export default {
    id: 'sentinel',
    store: 'fs',
    tasks: [{
        store: 'fs',
        id: 'productList.xml',
        type: 'http',
        options: {
            url: 'https://scihub.copernicus.eu/dhus/search?q=(platformname:' + platformname + '%20AND%20producttype:' + producttype + '%20AND%20footprint:%22Intersects(' + latitude + ',%20' + longitude + ')%22%20AND%20cloudcoverpercentage:%5B' + cloudcoverpercentagemin + '%20TO%20' + cloudcoverpercentagemax + '%5D)',
            auth: {
                user: username,
                password: userpassword
            }
        }
    }],
    taskTemplate: {
        id: 'images/<%= taskId %>',
        type: 'http'
    },
    hooks: {
        tasks: {
            before: {
                basicAuth: {}                
            },
            after: {
                readXML: { store: 'fs' },
                apply: {
                    function: (item) => {
                        let sentinelImages = []
                        _.forEach(item.data.feed.entry, (entry) => {
                            let sentinelImage = {}
                            _.set(sentinelImage, 'properties.title', entry.title[0])
                            _.set(sentinelImage, 'properties.id', entry.id[0])
                            _.set(sentinelImage, 'properties.date', entry.date[0]._)
                            _.set(sentinelImage, 'properties.producturl', entry.link[0].$.href)
                            _.set(sentinelImage, 'properties.quicklookurl', entry.link[2].$.href)
                            sentinelImages.push(sentinelImage)
                        })
                        if (sentinelImages.length > 0) {
                            console.log('Found ' + sentinelImages.length + ' Sentinel images')
                            item.data = sentinelImages
                        }
                    }
                },
                updateMongoCollection: {
                    collection: 'sentinel-images',
                    filter: { 'properties.id': '<%= properties.id %>' },
                    upsert: true,
                    chunkSize: 256
                },
                clearData: {}
            }
        },
        jobs: {
            before: {
                createStores: [
                    { id: 'fs', options: { path: __dirname } }
                ],
                connectMongo: {
                    url: dbUrl,
                    clientPath: 'taskTemplate.client'
                },
                createMongoCollection: {
                    clientPath: 'taskTemplate.client',
                    collection: 'sentinel-images'
                }
            },
            after: {
                disconnectMongo: {
                    clientPath: 'taskTemplate.client'
                },
                removeStores: ['fs']
            }
        }
    }
}
