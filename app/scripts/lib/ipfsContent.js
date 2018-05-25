const extension = require('extensionizer')
const resolver = require('./resolver.js')

module.exports = function (provider) {
    extension.webRequest.onBeforeRequest.addListener(details => {
        const name = details.url.substring(7, details.url.length - 1)
        let clearTime = null
        extension.tabs.getSelected(null, tab => {
            extension.tabs.update(tab.id, { url: 'loading.html' })

            clearTime = setTimeout(() => {
                return extension.tabs.update(tab.id, { url: '404.html' })
            }, 60000)

            resolver.resolve(name, provider).then(ipfsHash => {
                clearTimeout(clearTime)
                let url = 'https://gateway.ipfs.io/ipfs/' + ipfsHash
                console.log('url=>',url);
                return fetch(url, { method: 'HEAD' }).then(response => response.status).then(statusCode => {
                    if (statusCode !== 200) return 'Local'
                    extension.tabs.update(tab.id, { url: url })
                })
                .catch(err => {
                    url = 'https://gateway.ipfs.io/ipfs/' + ipfsHash
                    extension.tabs.update(tab.id, {url: url})
                    return err
                })
            })
            .catch(err => {
                clearTimeout(clearTime)
                const url = err === 'unsupport' ? 'unsupport' : 'error'
                extension.tabs.update(tab.id, {url: `${url}.html?name=${name}`})
            })
        })
        return { cancel: true }
    }, {urls: ['*://*.eth/']})
}
