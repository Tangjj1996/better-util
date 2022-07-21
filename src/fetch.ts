const fetchWithTimeout = (input, init, timeout = 10_100) => {
    const controller = new AbortController();
    setTimeout(() => {
       controller.abort(); 
    }, timeout);

    return fetch(input, { signal: controller.signal, ...init });
}

const wait = (timeout) => {
    new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
}

const fetchWithRetry = async (input, init, timeout = 10_000, retries = 3) => {
    let increasingTimeout = 2;
    let count = retries;

    while (count > 0) {
        try {
            return await fetchWithTimeout(input, init, timeout);
        } catch(e) {
            if (e.name !== 'AbortError') throw e;
            count--;
            increasingTimeout = Math.pow(increasingTimeout, 2);
            console.warn(`
            fetch failed, retrying in ${increasingTimeout}/s, ${count} retries left
            `);
            await wait(increasingTimeout);
        }
    }
}