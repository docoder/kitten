const href = window.location.href;
export function fetch2(url: string, options?: any, loginUrl: string = 'https://docoder.com') {
    let realUrl = url;
    let opt = options || {}
    opt.credentials = opt.credentials || 'include'
    return fetch(realUrl, opt)
        .then(response => response.json())
        .then((json) => {
            if (json.code === 40003 || json.code === 201 || json.code=== 401) {
                const return_login = loginUrl + '?returnUrl=' + encodeURIComponent(href)
                window.location.replace(return_login)
                throw new Error('Please Login First!')
            } else {
                return json;
            }
        })
}
export async function GET (url: string, loginUrl?: string) {
    try {
        return await REQ('get', url, loginUrl)
    } catch (error) {
        throw error;
    }
    
}
export async function POST(url: string, loginUrl?: string, body?: Json) {
    try {
        return await REQ('post', url,loginUrl, body)
    } catch (error) {
        throw error;
    }
    
}
async function REQ(method:string, url:string, loginUrl?:string, body?: Json) {
    try {
        const data = await fetch2(url, method === 'post' ? {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        } : null, loginUrl)
        return data
    } catch (error) {
        throw error
    }
}